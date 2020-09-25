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
                pictureUrl: require('@/assets/images/7394f63115744d8888a5fea9a631a4d5.jpg'),

                //[横坐标缩小倍数clientX|纵坐标缩小倍数clientY|整体大小比列(x,y,z)]
                optionsTypeValue: '10|10|0.01|0.01|0.01',
                modelUrl: '/models/computer/file.obj',  //模型地址
                materialUrl: '/models/computer/file.mtl', //模型材质地址
                name: 'computer', //模型名称
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
