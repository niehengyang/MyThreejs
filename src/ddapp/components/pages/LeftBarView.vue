<template>
  <div class="left-bar-component">
    <div class="left-bar-main">
      组件栏
      <el-collapse v-model="activeNames"  @change="handleChange" accordion>
        <el-collapse-item title="测试模型" :name="1" >
          <div class="left-bar-img-box">
            <ul>
              <li v-for="item in tableData" :key="item.ID">
                <img class="left-bar-img" :src="item.picture_url" alt="图片"
                     :model_id="item.ID" draggable="true">
              </li>
            </ul>
          </div>
        </el-collapse-item>


        <el-collapse-item title="电力工程" :name="2">
          <div class="left-bar-img-box">
            <ul>
              <li v-for="item in tableData" :key="item.ID">
                <img class="left-bar-img" :src="item.picture_url" alt="图片"
                     :model_id="item.ID" draggable="true">
              </li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item title="仓库" :name="3">
          <div class="left-bar-img-box">
            <ul>
              <li v-for="item in tableData" :key="item.ID">
                <img class="left-bar-img" :src="item.picture_url" alt="图片"
                     :model_id="item.ID" draggable="true">
              </li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item title="厂房" :name="4">
          <div class="left-bar-img-box">
            <ul>
              <li v-for="item in tableData" :key="item.ID">
                <img class="left-bar-img" :src="item.picture_url" alt="图片"
                     :model_id="item.ID" draggable="true">
              </li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
    import utils from '../../utils/utils'
    export default {
        name: "LeftBarView",
        data(){
            return{
                activeNames: 1,
                tableData: [],
            }
        },
        created() {
            this.initModel();
        },
        methods:{
            addCompoment(type){
                this.$emit('addCompoment',type)
            },
            initModel(){
                let params = {
                    groupId: this.activeNames,
                }
                this.$api.restfulApi.list('/getmodellist',params).then((res)=>{
                    res.data.forEach(value =>{
                        value.structure_data = JSON.parse(value.structure_data)
                        this.tableData.push(value)
                    })
                })
            },
            handleChange(val) {
                this.tableData = [];
                this.initModel();
            },
        },
        mounted() {
            utils.addCompoment();
        },
    }
</script>

<style scoped>
  .left-bar-component{
    opacity: 0.8;
  }

  .left-bar-main{
    background-color: #FFFFFF;
    padding: 8px;
  }
  .left-bar-img-box{
    display: flex;
    flex-direction: column;
  }
  .left-bar-img{
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  * {
    margin: 0;
    padding: 0;
    color: #303133;
    font-family: PingFangSC-Regular;
    list-style: none;
  }

  ul,
  li{
    margin-right: 10px;
    display: inline-table;
  }
  * {
    margin: 0;
    padding: 0;
    color: #303133;
    font-family: PingFangSC-Regular;
    list-style: none;
  }

</style>
