<template>
  <div class="left-bar-img" >
    <img class="left-bar-img" :src="pictureUrl" alt="图片" :widget-type="name" :material-url="materialUrl"
         :model-url="modelUrl" :option-value="optionsTypeValue" draggable="true">
  </div>
</template>

<script>
    export default {
        name: "GunKsrModel",
        data(){
            return{
                pictureUrl: require('@/assets/images/l76324-sniper-rifle-ksr-29-new-34178.png'),

                //[横坐标缩小倍数clientX|纵坐标缩小倍数clientY|整体大小比列(x,y,z)]
                optionsTypeValue: '10|10|10|10|10',
                modelUrl: '/models/obj/KSR-29 sniper rifle new_obj.obj',  //模型地址
                materialUrl: '/models/obj/KSR-29 sniper rifle new_obj.mtl', //模型材质地址
                name: 'ksr29', //模型名称
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
