<template>
  <div>
    <img class="left-bar-img" :src="pictureUrl" alt="图片" :widget-type="name" :material-url="materialUrl"
         :model-url="modelUrl" :option-value="optionsTypeValue" draggable="true">
  </div>
</template>

<script>
    export default {
        name: "IronManModel",
        data(){
            return{
                pictureUrl: require("@/assets/images/01381e554bef42000001bf7293ecdc.jpg"),

                //横坐标缩小倍数clientX|纵坐标缩小倍数clientY|整体大小比列(x,y,z)
                optionsTypeValue: '10|10|1|1|1',
                modelUrl: '/models/robot/IronMan.obj',  //模型地址
                materialUrl: '/models/robot/IronMan.mtl', //模型材质地址
                name: 'ironMan', //模型名称
            }
        },

        created() {
        },
        methods:{

        }
    }
</script>

<style scoped>
  .left-bar-img{
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
</style>
