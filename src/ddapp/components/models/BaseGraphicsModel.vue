<template>
  <div>
    <ul>
      <li>
        <img class="left-bar-img" src="@/assets/images/OIP (4).jpg" alt="图片"
             widget-type="changfangti" :material-url="materialUrl" :model-url="modelUrl" :option-value="optionsTypeValue" draggable="true">
      </li>
      <li>
        <img class="left-bar-img" src="@/assets/images/OIP (5).jpg" alt="图片"
             widget-type="yuanzhu" :material-url="materialUrl" :model-url="modelUrl" :option-value="optionsTypeValue" draggable="true">
      </li>
      <li>
        <img class="left-bar-img" src="@/assets/images/OIP (6).jpg" alt="图片"
             widget-type="qiuti" :material-url="materialUrl" :model-url="modelUrl" :option-value="optionsTypeValue" draggable="true">
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "BaseGraphicsModel",
        data(){
            return{
                //横坐标缩小倍数clientX|纵坐标缩小倍数clientY|整体大小比列(x,y,z)
                optionsTypeValue: '10|10|1|1|1',
                modelUrl: '',  //模型地址
                materialUrl: '', //模型材质地址
                name: '', //模型名称
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
