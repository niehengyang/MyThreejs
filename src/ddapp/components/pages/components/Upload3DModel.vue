<template>
    <el-row>
        <div class="dialog-form">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="模型名称" prop="name">
                    <el-input v-model="form.name" class="form-input" placeholder="请输入模型名称"></el-input>
                </el-form-item>

                <el-form-item label="模型分组" prop="group_id">
                    <el-select class="form-input" v-model="form.group_id" placeholder="请选择模型分组">
                        <el-option label="测试模型" :value= 1></el-option>
                        <el-option label="电力工程" :value= 2></el-option>
                        <el-option label="仓库" :value= 3></el-option>
                        <el-option label="厂房" :value= 4></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="展示图片" prop="picture_url">
<!--                    <el-input v-model="form.picture_url" class="form-input" placeholder="请输入展示图片地址"></el-input>-->

                    <el-upload
                            class="upload-demo"
                            ref="uploadFirmware"
                            :action="uploadUrl"
                            :with-credentials="true"
                            :on-success="handleAvatarSuccess"
                            :on-change="beforeAvatarUpload"
                            :before-remove="beforeAvatarRemove"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed"
                            :data= "form"
                            :auto-upload="false"
                            multiple
                            :limit="1"
                            :file-list="fileList">
                        <el-button class="form-input"><i class="el-icon-upload"></i>  上传图片</el-button>
                        <span class="red-asterisk">✳</span>
                    </el-upload>
                </el-form-item>

                <el-form-item label="模型文件" prop="model_url">
                    <el-input v-model="form.model_url" class="form-input" placeholder="请输入模型文件地址"></el-input>
                </el-form-item>
                <el-form-item label="材质文件" prop="mtl_url">
                    <el-input v-model="form.mtl_url" class="form-input" placeholder="请输入材质文件地址"></el-input>
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
                    model_type: '002',
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
                fileList: [],
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
                // this.addLoading = true;
                // let object = JSON.parse(JSON.stringify(this.form))
                // object.structure_data = JSON.stringify(this.form.structure_data)
                // this.$api.restfulApi.create('/createmodel',object).then((res)=>{
                //     this.addLoading = false;
                //     this.handleCloseForm(formName);
                //     this.$message.success({
                //         showClose: true,
                //         message: res.msg,
                //         duration: 2000
                //     });
                //     this.$emit("submitCreate", true);
                // })

                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.addLoading = true;
                        // 表单验证通过后使用组件自带的方法触发上传事件
                        this.$refs.uploadFirmware.submit();
                    }
                });
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


            /**-------------------展示图片上传---------------------**/
            handleAvatarSuccess(response,res, file) {
                this.addLoading = false;

                if (res.status == 'success' && response.code == 0) {
                    this.$message.success(response.message);
                    this.$refs['form'].resetFields();
                    this.$refs.uploadFirmware.clearFiles();
                    this.$emit("submitCreate", true);
                } else {
                    this.$message.warning(response.message);
                }
            },

            //确认删除
            handleRemove(file,fileList){
                this.fileList = [];
                this.form.filePage = '';
                this.$refs.uploadFirmware.clearFiles();
            },

            //移除
            beforeAvatarRemove(file,fileList){
                return this.$confirm(`确定移除 ${ file.name }？`);
            },

            beforeAvatarUpload(file, fileList){
                const isLt2M = file.size / 1024 / 1024 /1024 < 1;
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 1G!',
                        type: 'warning'
                    });
                }
                this.form.filePage = 'ok';
                return isLt2M;
            },

            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
