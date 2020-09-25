<template>
  <div>
    <img class="left-bar-img" :src="pictureUrl" alt="图片" :widget-type="name" :material-url="materialUrl"
         :model-url="modelUrl" :option-value="optionsTypeValue" draggable="true">
  </div>
</template>

<script>
    export default {
        name: "ChairModel",
        data(){
            return{
                pictureUrl: require("@/assets/images/5d859e93020d448db0bcc4a98857ab46.jpg"),

                //横坐标缩小倍数clientX|纵坐标缩小倍数clientY|整体大小比列(x,y,z)
                optionsTypeValue: '10|10|0.2|0.2|0.2',
                modelUrl: '/models/yizi/file.obj',  //模型地址
                materialUrl: '/models/yizi/file.mtl', //模型材质地址
                name: 'chair', //模型名称
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
