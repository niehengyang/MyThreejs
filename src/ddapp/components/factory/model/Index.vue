<template>
  <div class="page">
    <div class="tool-bar">
      <el-button class="tool-button" @click="handleAdd" type="primary">创建</el-button>
    </div>
    <div class="table-box">
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="ID"
            label="ID"
            width="88">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称">
        </el-table-column>
        <el-table-column
            prop="model_type"
            label="名称">
          <template slot-scope="scope">
            <span v-if="scope.row.model_type == '001'">原生模型</span>
            <span v-if="scope.row.model_type == '002'">外部引入模型</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="model_url"
            label="模型地址">
          <template slot-scope="scope">
            <span v-if="scope.row.model_url == ''">--</span>
            <span v-else>{{scope.row.model_url}}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="mtl_url"
            label="材质地址">
          <template slot-scope="scope">
            <span v-if="scope.row.mtl_url == ''">--</span>
            <span v-else>{{scope.row.mtl_url}}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="picture_url"
            label="展示图片">
          <template slot-scope="scope">
            <img class="table-img" :src="scope.row.picture_url"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="CreatedAt"
            label="生成时间">
        </el-table-column>

        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <!--            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
            <el-button @click="handleEditClick(scope.row.ID)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDeleteClick(scope.row.ID)" type="text" size="small" style="color: #880000">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="dialog-box">
      <el-dialog
          title="添加模型"
          :visible.sync="addDialogVisible"
          width="40%"
          destroy-on-close
          :modal-append-to-body="false"
          :before-close="handleFormClose">
        <create-component v-on:closeAdd="handleCloseAdd" v-on:submitCreate="submitCreate"></create-component>
      </el-dialog>

      <el-dialog
          title="编辑模型"
          destroy-on-close
          :visible.sync="editDialogVisible"
          width="40%"
          :modal-append-to-body="false"
          :before-close="handleFormClose"
      >
        <edit-component
            v-on:closeEdit="handleCloseEdit"
            :init-loading="editFormLoading"
            :edit-data="editForm"
            v-on:submitEdit="submitEdit"
        ></edit-component>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import CreateComponent from "./Create.vue";
    import EditComponent from "./Edit.vue";
    export default {
        name: "CreateModel",
        data(){
            return{
                addDialogVisible: false,
                editDialogVisible: false,
                editFormLoading: false,
                tableData: [],
                editForm: {
                    name: '',
                    group_id: null,
                    model_type: '',
                    model_classification: '',
                    picture_url: '',
                    model_url: '',
                    mtl_url: '',
                    epidermis_color: '',
                    structure_data: {
                        clientX: 0,
                        clientY: 0,
                        clientZ: 0,
                        scaleX: '',
                        scaleY: '',
                        scaleZ: '',
                    }
                },
            }
        },
        components: {
            "create-component": CreateComponent,
            "edit-component": EditComponent,
        },
        created() {
            this.initData()
        },
        methods:{
            initData(){
                this.$api.restfulApi.list('/getmodellist').then((res)=>{
                    this.tableData = res.data;
                })
            },

            //关闭表单
            handleFormClose(down){
                down()
            },

            /**** -----------------------添加----------------------****/
            handleAdd(){
                this.addDialogVisible = true
            },


            //关闭添加
            handleCloseAdd() {
                this.addDialogVisible = false;
            },

            //提交成功
            submitCreate() {
                this.addDialogVisible = false;
                this.initData();
            },

            /**** -----------------------编辑----------------------****/
            handleEditClick(id){
                this.editDialogVisible = true;
                this.editFormLoading = true;
                this.$api.restfulApi.item("/getmodelitem", id).then(res => {
                    res.data.structure_data = JSON.parse(res.data.structure_data)
                    this.editForm = JSON.parse(JSON.stringify(res.data));
                    this.editFormLoading = false;
                });
            },

            //关闭编辑
            handleCloseEdit() {
                this.editDialogVisible = false;
            },

            //编辑提交
            submitEdit() {
                this.editDialogVisible = false;
                this.initData();
            },

          /**** -----------------------删除----------------------****/
          handleDeleteClick(id){

            this.$confirm("确认删除？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              this.$api.restfulApi.delete('/deletemodel',id).then(res =>{
                this.$message.success({
                  showClose: true,
                  message: res.msg,
                  duration: 2000
                });
              })
            })
            .catch(() => {
              console.log("取消删除");
            });
          }
        }
    }
</script>

<style scoped>
  .page{
    padding: 20px;
  }
  .tool-bar{
    margin-bottom: 20px;
  }
  .table-img{
    width: 30px;
    height: 30px;
  }
</style>
