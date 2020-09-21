<template>
  <div class="base-component" >
    <div class="logo-item"><img src="@/assets/images/20200918164943.png" style="height: 34px"></div>
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
    width: 20%;
    height: 800px;
  }

  .speace-view-item{
    width: 79%;
    height: 800px;
  }
  .logo-item{
    width: 100%;
    height: 40px;
  }
</style>
