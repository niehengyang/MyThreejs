<template>
  <div class="base-component" >
    <el-row class="base-component-main">
      <left-bar-view class="left-bar-item" @optionChange="handleSelectChange"></left-bar-view>
      <space-view class="speace-view-item" :model-name="modelName"></space-view>
    </el-row>
  </div>
</template>

<script>

    import LeftBarView from "./components/pages/LeftBarView";
    import SpaceView from "./components/pages/SpaceView";
    export default {
        name: "BaseView",
        components: {SpaceView, LeftBarView},
        data(){
            return{
                modelName: '',
            }
        },
        methods:{
            //数据流选择变更
            handleSelectChange:function (data) {
                this.modelName = data.name;
            },
        }
    }
</script>

<style scoped>
  .base-component{
    width: 100%;
    height: 100%;
  }
  .base-component-main{
    width: 100%;
    height: 100%;
  }
  .left-bar-item{
    width: 20%;
    height: 800px;
    left: 0;
    top: 50px;
    position: absolute;
    z-index: 99;
  }

  .speace-view-item{
    width: 79%;
    height: 800px;
    right: 0;
    top: 50px;
    position: absolute;
    z-index: 99;
  }
</style>
