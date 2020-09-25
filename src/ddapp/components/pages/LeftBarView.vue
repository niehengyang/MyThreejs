<template>
  <div class="left-bar-component">
    <div class="left-bar-main">
      组件栏
      <el-collapse v-model="activeNames"  @change="handleChange">
        <el-collapse-item title="测试模型" name="1" >
          <div class="left-bar-img-box">
            <base-graphics-model/>
            <ul>
              <li>
               <diamond-model/>
              </li>
              <li>
                <mirror-model/>
              </li>
              <li>
                <table-model/>
              </li>
              <li>
               <chair-model/>
              </li>
              <li>
               <old-computer-model/>
              </li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item title="电力工程" name="2">

        </el-collapse-item>
        <el-collapse-item title="仓库" name="3">
          <ul>
            <li>
              <gun-ksr-model/>
            </li>
            <li>
              <hand-gun-model/>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="厂房" name="4">
          <ul>
            <li>
             <iron-man-model/>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
    import utils from '../../utils/utils'
    import HandGunModel from "../models/HandGunModel";
    import GunKsrModel from "../models/GunKsrModel";
    import OldComputerModel from "../models/OldComputerModel";
    import ChairModel from "../models/ChairModel";
    import TableModel from "../models/TableModel";
    import MirrorModel from "../models/MirrorModel";
    import DiamondModel from "../models/DiamondModel";
    import BaseGraphicsModel from "../models/BaseGraphicsModel";
    import IronManModel from "../models/IronManModel";
    export default {
        name: "LeftBarView",
        data(){
            return{
                activeNames: ['1']
            }
        },
        components:{
            IronManModel,
            BaseGraphicsModel,
            DiamondModel, MirrorModel, TableModel, ChairModel, HandGunModel ,GunKsrModel, OldComputerModel},
        methods:{
            addCompoment(type){
                this.$emit('addCompoment',type)
            },

            handleChange(val) {
                // console.log(val);
            },
        },
        mounted() {
            utils.addCompoment();
        }
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

</style>
