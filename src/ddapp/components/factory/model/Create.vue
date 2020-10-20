<template>
  <el-row>
    <div class="dialog-form">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="form.name" class="form-input" placeholder="请输入模型名称"></el-input>
        </el-form-item>
        <el-form-item label="模型种类" prop="model_type">
          <el-select class="form-input" v-model="form.model_type" placeholder="请选择模型种类">
            <el-option label="基础模型" value="001"></el-option>
            <el-option label="OBJ" value="002"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型分组" prop="group_id">
          <el-select class="form-input" v-model="form.group_id" placeholder="请选择模型分组">
            <el-option label="测试模型" :value= 1></el-option>
            <el-option label="电力工程" :value= 2></el-option>
            <el-option label="仓库" :value= 3></el-option>
            <el-option label="厂房" :value= 4></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型类型" prop="model_classification" v-if="form.model_type == '001'">
          <el-select class="form-input" v-model="form.model_classification" placeholder="请选择模型类型">
            <el-option label="长方体" value="cuboid"></el-option>
            <el-option label="正方体" value="cube"></el-option>
            <el-option label="圆柱体" value="cylinder"></el-option>
            <el-option label="球体" value="sphere"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示图片" prop="picture_url">
          <el-input v-model="form.picture_url" class="form-input" placeholder="请输入展示图片地址"></el-input>
        </el-form-item>

        <el-form-item label="模型文件" prop="model_url" v-if="form.model_type == '002'">
          <el-input v-model="form.model_url" class="form-input" placeholder="请输入模型文件地址"></el-input>
        </el-form-item>
        <el-form-item label="材质文件" prop="mtl_url" v-if="form.model_type == '002'">
          <el-input v-model="form.mtl_url" class="form-input" placeholder="请输入材质文件地址"></el-input>
        </el-form-item>

        <el-form-item label="表皮色" prop="model_url" v-if="form.model_type == '001'">
          <el-color-picker v-model="form.epidermis_color" show-alpha></el-color-picker>
        </el-form-item>

        <el-form-item label="比例" prop="structure_data">
          <el-input v-model="form.structure_data.scaleX" class="form-input-mini" placeholder="长比例"></el-input>
          <el-input v-model="form.structure_data.scaleY" class="form-input-mini" placeholder="宽比例"></el-input>
          <el-input v-model="form.structure_data.scaleZ" class="form-input-mini" placeholder="高比例"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-row class="dialog-footer">
      <span style="float: right">
        <el-button @click="handleCloseForm('form')">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm('form')" :loading="addLoading">提 交</el-button>
      </span>
    </el-row>
  </el-row>
</template>

<script>

    export default {
        name: "create",
        data() {
            return {
                addLoading: false,
                form: {
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
                rules: {
                    name: [
                        { required: true, message: "名称不能为空", trigger: "blur" },
                        { max: 20, message: "名称长度最多20个字符", trigger: "blur" },
                        {
                            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                            message: "不允许输入空格等特殊符号",
                            trigger: "blur"
                        }
                    ],
                    desc: [
                        { max: 200, message: "描述信息不能超过200个字符", trigger: "blur" }
                    ],
                },
            };
        },
        methods: {
            //提交创建
            handleSubmitForm(formName){
                this.addLoading = true;
                let object = JSON.parse(JSON.stringify(this.form))
                object.structure_data = JSON.stringify(this.form.structure_data)
                this.$api.restfulApi.create('/createmodel',object).then((res)=>{
                    this.addLoading = false;
                    this.handleCloseForm(formName);
                    this.$message.success({
                        showClose: true,
                        message: res.msg,
                        duration: 2000
                    });
                    this.$emit("submitCreate", true);
                })
            },

            //关闭表单
            handleCloseForm(formName){
                this.addLoading = false;
                this.$refs[formName].resetFields();
                this.form.structure_data = {
                    clientX: 0,
                    clientY: 0,
                    clientZ: 0,
                    scaleX: '',
                    scaleY: '',
                    scaleZ: '',
                }
                this.$emit("closeAdd", formName);
            },
        }
    };
</script>

<style scoped>
  .dialog-form{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .form-input{
    width: 260px;
  }
  .form-input-mini{
    width: 80px;
    margin-right: 10px;
  }
</style>
