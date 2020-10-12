<template>
  <div class="test-page">
    <div id="container"></div>
    <el-button @click="copyData">复制</el-button>
  </div>
</template>

<script>
    import * as THREE from "three"
    import { MTLLoader } from  'three/examples/jsm/loaders/MTLLoader.js'
    import { OBJLoader } from  'three/examples/jsm/loaders/OBJLoader.js'

    const OrbitControls = require('three-orbit-controls')(THREE);
    export default {
        name: "ForePage",

        data(){
            return{
                /**场景 */
                scene: '',
                /**光线 */
                light: '',
                /**相机 */
                camera: '',
                /**控制器 */
                controls: '',
                /**渲染 */
                renderer: '',
            }
        },
        created() {
        },
        mounted() {
            this.init();
            this.loadObj();
            this.animate();
        },
        methods:{
            //初始化three.js相关内容

            init() {
                //创建一个场景
                this.scene = new THREE.Scene();
                this.scene.add(new THREE.AmbientLight(0xcccccc, 0.4));//环境光
                this.light = new THREE.DirectionalLight(0xffffff, 0.4);//从正上方（不是位置）照射过来的平行光，0.45的强度
                this.light.position.set(100, 100, 500);
                this.light.position.multiplyScalar(0.3);
                this.scene.add(this.light);


                //初始化相机
                const aspect = window.innerWidth / 1080; //宽高可根据实际项目要求更改 如果是窗口高度改为innerHeight
                this.camera = new THREE.PerspectiveCamera(75, aspect, 1, 4000);
                this.camera.position.set(50, 0, 0);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 让相机指向原点

                const pointLight = new THREE.PointLight(0xffffff, 0.8); //创建一个点灯光
                this.camera.add(pointLight);
                this.scene.add(this.camera);


                //渲染
                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setClearColor(new THREE.Color('black'));
                this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.domElement.setAttribute("style"," height:100%;width: 100%;")

                //初始化控制器
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.rotateSpeed = 1  // 转速
                this.controls.autoRotate = false  // 是否自动旋转
                this.controls.autoRotateSpeed = 2  //自动旋转速度
                this.controls.enableZoom = true;  //是否可以缩放
                this.controls.enablePan = true; //是否开启右键拖拽

                this.controls.target.set(0, 0, 0);
                this.controls.minDistance = 50; // 视角最小距离
                this.controls.maxDistance = 100;   // 视角最远距离
                this.controls.maxPolarAngle = Math.PI / 3;  // 最大角度
                this.controls.update();

                const container = document.getElementById('container');
                container.appendChild(this.renderer.domElement);
                window.addEventListener('resize', this.onWindowResize,  { passive: false });//添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）

            },

            //窗口监听函数
            onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },


            animate() {


                //更新控制器
                this.controls.update();


                this.render();


                requestAnimationFrame(this.animate);
            },

            render() {
                this.renderer.render(this.scene, this.camera);
            },

            //外部模型加载函数
            loadObj() {
                let that = this;
                let objLoader = new OBJLoader();
                let mtlLoader = new MTLLoader();

                //导入资源
                mtlLoader.load('', function(materials) {
                    objLoader.setMaterials(materials);  //@params object 传入的模型，只能是单个模型，也可能是一个group,视构建的model而定
                    objLoader.load('/models/diamond/diamond-brilliantcut.obj', function(obj) { //obj模型所在url
                            obj.position.set(0, 0, 0);//模型摆放的位置
                            obj.scale.set(0.1, 0.1, 0.1);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                            that.scene.add(obj);//将模型加入场景中
                        },
                        // called while loading is progressing
                        function(xhr) {
                            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                        },
                        // called when loading has errors
                        function(error) {
                            console.log("An error happened");
                        })

                })
            },
        }
    }
</script>

<style scoped>
  * {
    touch-action: none;
  }
  .test-page{
    width: 100%;
    height: 100%;
  }
  #container{
    width: 1200px;
    margin: 0 auto;
    height: 800px;
    overflow: hidden;
  }
</style>
