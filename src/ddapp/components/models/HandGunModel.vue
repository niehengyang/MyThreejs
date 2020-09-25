<template>
  <div class="left-bar-img" >
    <img class="left-bar-img" :src="pictureUrl" alt="图片" :widget-type="name" :material-url="materialUrl"
         :model-url="modelUrl" :option-value="optionsTypeValue" draggable="true">
  </div>
</template>

<script>
    export default {
        name: "HandGunModel",
        data(){
            return{
                pictureUrl: require('@/assets/images/l82393-45-acp-smith-and-wesson-13999.png'),

                //[横坐标缩小倍数clientX|纵坐标缩小倍数clientY|整体大小比列(x,y,z)]
                optionsTypeValue: '10|10|10|10|10',
                modelUrl: '/models/shoutGunObj/Handgun_obj.obj',  //模型地址
                materialUrl: '/models/shoutGunObj/Handgun_obj.mtl', //模型材质地址
                name: 'handgun', //模型名称
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
