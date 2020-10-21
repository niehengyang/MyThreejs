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
    position: relative;
  }
  .base-component-main{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }
  .left-bar-item{
    left: 10px;
    top: 20px;
    position: absolute;
    width: 240px;
    max-height: 800px;
  }

  .speace-view-item{
    width: 100%;
    height: 100%;
  }
  .logo-item{
    width: 100%;
    height: 40px;
  }
</style>
