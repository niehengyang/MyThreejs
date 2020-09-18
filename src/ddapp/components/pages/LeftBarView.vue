<template>
  <div class="left-bar-component">组件栏
    <div class="left-bar-main">
      <el-collapse v-model="activeNames"  @change="handleChange">
        <el-collapse-item title="测试模型" name="1" >
          <ul>
            <li>
              <img class="left-bar-img" @click="handleOption2" src="@/assets/images/OIP (4).jpg" alt="图片"
                   widget-type="changfangti" draggable="true">
<!--              <p>文本</p>-->
            </li>
            <li>
              <img class="left-bar-img" @click="handleOption" src="@/assets/images/fsdfs(2).jpg"
                   alt="图片" widget-type="zhuanshi" draggable="true">
<!--              <p>图片</p>-->
            </li>
            <!--分割线-->
<!--            <li class="separate"></li>-->
<!--            <li draggable="true" widget-type="time">-->
<!--              <img src="../../icon/时间.svg" alt="时间" draggable="false">-->
<!--              <p>时间</p>-->
<!--            </li>-->
<!--            <li draggable="true" widget-type="link">-->
<!--              <img src="../../icon/链接.svg" alt="链接" draggable="false">-->
<!--              <p>链接</p>-->
<!--            </li>-->
<!--            &lt;!&ndash;分割线&ndash;&gt;-->
<!--            <li class="separate"></li>-->
<!--            <li draggable="true" widget-type="video">-->
<!--              <img src="../../icon/视频.svg" alt="视频" draggable="false">-->
<!--              <p>视频</p>-->
<!--            </li>-->
<!--            <li draggable="true" widget-type="table">-->
<!--              <img src="../../icon/表格.svg" alt="表格" draggable="false">-->
<!--              <p>表格</p>-->
<!--            </li>-->
          </ul>

          <div class="left-bar-img-box" >

          </div>
        </el-collapse-item>
        <el-collapse-item title="电力工程" name="2">

        </el-collapse-item>
        <el-collapse-item title="仓库" name="3">
        </el-collapse-item>
        <el-collapse-item title="厂房" name="4">
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
                activeNames: ['1']
            }
        },
        methods:{
            addCompoment(type){
                this.$emit('addCompoment',type)
            },

            handleChange(val) {
                console.log(val);
            },

            handleOption(){
                this.$emit('optionChange',{
                    name : 'zhuanshi',
                });
            },
            handleOption2(){
                this.$emit('optionChange',{
                    name : 'mogu',
                });
            }
        },
        mounted() {
            utils.addCompoment();
        }
    }
</script>

<style scoped>
  .left-bar-component{
  }

  .left-bar-img-box{
    display: flex;
  }
  .left-bar-img{
    width: 50px;
    height: 50px;
  }

  * {
    margin: 0;
    padding: 0;
    color: #303133;
    font-family: PingFangSC-Regular;
    list-style: none;
  }

  body,
  html {
    height: 100%;
  }

  img:hover {
    cursor: pointer;
  }

  .clickTable {
    background-color: white;
    border-radius: 10px 10px 0 0;
  }

  .components-list {
    width: 100%;
  }

  .components-list div {
    margin: 20px 0;
  }

  .components-list div h3 {
    font-size: 14px;
    color: #1d2341;
    border-bottom: 1px #f5f7fd solid;
    margin: 10px;
  }

  .components-list div ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .components-list div ul li {
    margin: 8px;
  }

  .components-list div ul li img {
    display: block;
    margin: 0 auto;
    width: 25px;
    height: 25px;
  }

  .components-list div ul li p {
    margin-top: 5px;
    font-size: 14px;
  }

  .component-form {
    position: fixed;
    top: 125px;
    right: 0px;
    width: 260px;
    height: calc(100vh - 110px);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  .component-form .form-box {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 50%;
    border-bottom: 1px #f5f7fd solid;
    margin-top: 20px;
  }

  .component-form .form-box h4 {
    font-size: 12px;
    color: #666666;
  }

  .component-form .form-box .form-content {
    height: calc(100% - 20px);
    overflow: auto;
  }

  .isFocusd {
    border: 1px blue solid;
  }

  .defaultHover:hover {
    cursor: default;
  }

  .separate {
    width: 100%;
    height: 2px;
    background-color: #f5f7fd;
  }



</style>
