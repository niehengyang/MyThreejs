<template>
  <div class="left-bar-component">
    <div class="left-bar-main">
      组件栏
      <el-collapse v-model="activeNames"  @change="handleChange">
        <el-collapse-item title="测试模型" name="1" >
          <ul>
            <li>
              <img class="left-bar-img" @click="handleOption('changfangti')" src="@/assets/images/OIP (4).jpg" alt="图片"
                   widget-type="changfangti" draggable="true">
            </li>
            <li>
              <img class="left-bar-img" @click="handleOption('yuanzhu')" src="@/assets/images/OIP (5).jpg"
                   alt="图片" widget-type="yuanzhu" draggable="true">
            </li>
          </ul>

          <div class="left-bar-img-box">
            <ul>
              <li>
                <img class="left-bar-img" @click="handleOption('zhuanshi')" src="@/assets/images/fsdfs(2).jpg"
                     alt="图片" widget-type="zhuanshi" draggable="true">
              </li>
            </ul>
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

            handleOption(name){
                this.$emit('optionChange',{
                    name : name,
                });
            },
        },
        mounted() {
            utils.addCompoment();
        }
    }
</script>

<style scoped>
  .left-bar-component{
  }

  .left-bar-main{
    padding: 8px;
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


.left-bar-img{
  cursor: pointer;
}

  ul,
  li{
    margin-right: 10px;
    display: inline-table;
  }

</style>
