<template>
  <div class="speace-view-box" >
    <div id="container" @drop="handleDrag($event)"></div>
    <div class="tool-bar-box">
      <div id="WebGL-output"></div>
      <div id="Stats-output"></div>
      <div id="label"></div>
      <el-button>上传模型</el-button>
      <el-button @click="removeModel">移除模型</el-button>

      <el-button>预览</el-button>
      <el-button>保存</el-button>
    </div>
  </div>
</template>

<script>
    import * as THREE from "three"
    import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader';

    // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
    import { TransformControls } from "three/examples/jsm/controls/TransformControls"
    import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
    import { DatGui } from "three/examples/js/libs/dat.gui.min.js"
    import { StatsJs } from "three/examples/js/libs/stats.min.js"
    // import { DragControls } from "three/examples/jsm/controls/DragControls"

    export default {
        name: "SpaceView",

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

                guiControls : '',

                //container是指页面放置这个webGL的一个层
                container: '',
                //objects是指场景中的实体集合
                objects: [],

                //projector是可能指屏幕和场景转换工具 renderer是指场景渲染，能把场景呈现到浏览器里
                projector: '',
                selectObject: '',

                dragTarget: null, //拖拽对象

                raycaster: new THREE.Raycaster(), //射线
                mouse: new THREE.Vector2(), //鼠标位置
                hit: new THREE.Vector3(), //射线在参考面上的拾取点
                plane: new THREE.Plane(), //拖拽参考面
            }
        },
        created() {

        },

        methods: {
            /*****-------------------------------场景搭建-------------------------------****/
            // 场景
            initScene() {
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x050505);
            },

            // 相机
            initCamera() {
                const aspect = window.innerWidth / 1080; //宽高可根据实际项目要求更改 如果是窗口高度改为innerHeight
                this.camera = new THREE.PerspectiveCamera(100, aspect, 1, 1000);
                this.camera.position.set(100, 50, 0);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 让相机指向原点

                const pointLight = new THREE.PointLight(0xffffff, 0.8); //创建一个点灯光
                this.camera.add(pointLight);
                this.scene.add(this.camera);

            },
            // 渲染器
            initRenderer() {
                this.renderer = new THREE.WebGLRenderer({antialias: true});
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setClearColor(0x050505);
                document.body.appendChild(this.renderer.domElement);
                this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
                this.renderer.domElement.setAttribute("style", " height:100%;width: 100%;")
            },


            // 初始化灯光
            initLight() {
                this.scene.add(new THREE.AmbientLight(0xcccccc, 0.4));//环境光
                this.light = new THREE.DirectionalLight(0xffffff, 0.4);//从正上方（不是位置）照射过来的平行光，0.45的强度
                this.light.position.set(100, 100, 500);
                this.light.position.multiplyScalar(0.3);
                this.scene.add(this.light);
            },


            //辅助网格线
            initGridHelper(){
                /**
                 * 添加地面网格GirdHelper
                 * size 网格总边长
                 * step 网格个数
                 * colorCenterLine  网格中心线颜色
                 * colorGrid    网格其他线颜色
                 */
                var gridHelper = new THREE.GridHelper(1200, 50, 0xCD3700, 0x4A4A4A);
                gridHelper.position.y = -100;
                gridHelper.position.x = 0;
                this.scene.add(gridHelper);

            },


            //初始化控制器
            initControls() {
                this.container = document.getElementById('container');
                this.container.appendChild(this.renderer.domElement);

                // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                // this.controls.rotateSpeed = 1  // 转速
                // this.controls.autoRotate = false  // 是否自动旋转
                // this.controls.autoRotateSpeed = 1  //自动旋转速度
                // this.controls.enableZoom = true;  //是否可以缩放
                // this.controls.enablePan = true; //是否开启右键拖拽
                //
                // this.controls.target.set(0, 0, 0);
                // this.controls.minDistance = 50; // 视角最小距离
                // this.controls.maxDistance = 1000;   // 视角最远距离
                // this.controls.maxPolarAngle = Math.PI / 3;  // 最大角度
                // this.controls.update();

                // 初始化轨迹球控件
                this.controls = new TrackballControls(this.camera, this.renderer.domElement);
                this.controls.noRotate = false;
                this.controls.noPan = false;
                this.controls.enableZoom = true;  //是否可以缩放
                this.controls.enablePan = true; //是否开启右键拖拽
                this.controls.staticMoving = true;// 静止移动，为 true 则没有惯性
                this.controls.dynamicDampingFactor = 0.2;// 阻尼系数 越小 则滑动越大

                this.controls.target.set(0, 0, 0);
                this.controls.rotateSpeed = 2;// 旋转速度
                this.controls.zoomSpeed = 0.2;// 缩放速度
                this.controls.panSpeed = 0.5;// 平controls


                this.controls.minDistance = 50;  // 视角最小距离
                this.controls.maxDistance = 500; // 视角最远距离
                this.controls.maxPolarAngle = Math.PI / 2;  // 最大角度
            },


            // 添加拖拽控件
            initDragControls(obj) {

                var transformControls = new TransformControls(this.camera, this.renderer.domElement);
                this.scene.add(transformControls);
                transformControls.addEventListener('mouseDown', (evt) => {
                    // 平移开始时禁用相机控件
                    this.controls.enabled = false;

                });
                transformControls.addEventListener('mouseUp', (evt) => {
                    // 平移结束时启用相机控件
                    this.controls.enabled = true;

                });
                // 指定某个对象绑定到transformControls上，比如点击物体时可将物体绑定
                // const object: Object3D = ...
                transformControls.attach(obj);


                // // 初始化拖拽控件
                // var dragControls = new DragControls(obj, this.camera, this.renderer.domElement);
                //
                // // 鼠标略过事件
                // dragControls.addEventListener('hoveron', function (event) {
                //     // 让变换控件对象和选中的对象绑定
                //     transformControls.attach(obj);
                //
                // });
                // // 开始拖拽
                // dragControls.addEventListener('dragstart', function (event) {
                //     this.controls.enabled = false;
                //     // transformControls.enabled = false;
                // });
                // // 拖拽结束
                // dragControls.addEventListener('dragend', function (event) {
                //     this.controls.enabled = true;
                //     // transformControls.enabled = true;
                // });


            },


            // 更新控件
            updateData() {
                // this.stats.update();
                this.controls.update();
                this.controls.handleResize();
            },

            // 初始化
            init() {
                this.initScene();
                this.initCamera();
                this.initLight();
                this.initRenderer();
                this.initGridHelper();
                this.initControls();

                addEventListener('resize', this.onWindowResize, false);
                addEventListener('keydown', this.onKeyDown, false);
            },

            animate() {
                requestAnimationFrame(this.animate);
                this.renderer.render(this.scene, this.camera);
                this.updateData();
            },


            /*****-------------------------------方法，样式-------------------------------****/

            // 获取与射线相交的对象数组
            getIntersects(event) {
                event.preventDefault();
                console.log("event.clientX:" + event.clientX)
                console.log("event.clientY:" + event.clientY)

                // 声明 raycaster 和 mouse 变量
                // var raycaster = new THREE.Raycaster();
                // var mouse = new THREE.Vector2();

                // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
                this.raycaster.setFromCamera(this.mouse, this.camera);

                // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
                var intersects = this.raycaster.intersectObjects(this.scene.children);

                //返回选中的对象
                return intersects;
            },

            // 窗口变动触发的方法
            onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },

            // 键盘按下触发的方法
            onKeyDown(event) {
                switch (event.keyCode) {
                    case 13:
                        this.initCamera();
                        this.initControls();
                        break;
                }
            },

            // 初始化 dat.GUI
            initGui() {
                // 保存需要修改相关数据的对象
                this.gui = new function () {

                }
                // 属性添加到控件
                var guiControls = new DatGui();
            },

            // 初始化性能插件
            initStats() {
                var stats = new StatsJs();

                stats.domElement.style.position = 'absolute';
                stats.domElement.style.left = '0px';
                stats.domElement.style.top = '0px';

                document.body.appendChild(stats.domElement);
                return stats;
            },

            /*****-------------------------------加入模型-------------------------------****/
            //钻石
            loadzhuanshi(width, height) {
                let objLoader = new OBJLoader();
                // let mtlLoader = new MTLLoader();

                //导入资源
                // mtlLoader.load('', function (materials) {
                    // objLoader.setMaterials(materials);  //@params object 传入的模型，只能是单个模型，也可能是一个group,视构建的model而定
                    objLoader.load('@/assets/models/diamond/diamond-brilliantcut.obj', (obj)=> { //obj模型所在url
                            obj.position.set(height / 50, 0, width / 50);//模型摆放的位置
                            obj.scale.set(0.1, 0.1, 0.1);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                            obj.name='zhuanshi'; //添加名称
                            this.initDragControls(obj)
                            this.scene.add(obj);//将模型加入场景中
                            this.objects.push(obj)
                        },
                        // called while loading is progressing
                        function (xhr) {
                            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                        },
                        // called when loading has errors
                        function (error) {
                            console.log("An error happened");
                        })
                // })
            },

            //
            loadmogu(width, height) {

                //轮廓大小
                var rollOverGeo = new THREE.BoxGeometry(2, 2, 5);
                //材质
                var rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
                //加载 轮廓 材质
                var rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

                rollOverMesh.position.set(height / 50, 0, width / 50);//模型摆放的位置
                rollOverMesh.scale.set(10, 10, 5);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                rollOverMesh.name = 'myModelGroup' // 使用name属性标记内部模型的名称

                //添加控制
                this.initDragControls(rollOverMesh)

                //加入到场景
                this.scene.add(rollOverMesh);
                this.objects.push(rollOverMesh)
            },

            loadyuanzhu(){
                // world 圆柱体
                var geometry = new THREE.CylinderGeometry(20,20,100,40);
                /*              var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
                */
                var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.x = 0;
                mesh.position.y = 0;
                mesh.position.z = 0;
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = false;
                this.scene.add( mesh );

                //添加控制
                this.initDragControls(mesh)

                //加入到场景
                this.scene.add(mesh);
                this.objects.push(mesh)
            },

            handleDrag(e) {
                var dataValue = e.dataTransfer.getData('widget-type')
                let x = parseFloat(e.x.toFixed(2));
                let y = parseFloat(e.y.toFixed(2));

                switch (dataValue) {
                    case 'zhuanshi':
                        this.loadzhuanshi(x, y);
                        break;
                    case 'changfangti':
                        this.loadmogu(x, y);
                        break;
                    case 'yuanzhu':
                        this.loadyuanzhu(x, y);
                        break;
                }
            },

            //移除模型
            removeModel(){
                const allChildren = this.scene.children
                console.log(allChildren);

                //按模型名称查找并移除
                // const obj = this.scene.getObjectByName('zhuanshi')
                // this.scene.remove(obj)

                this.scene.children.pop()
            },
        },

        mounted() {
            this.init()
            this.animate()
        }
    }
</script>

<style scoped>
  .speace-view-box{
    width: 100%;
    height: 100%;
    background: #2e2e2e;
  }

  #container{
    width: 100%;
    height: 100%;
  }

  .tool-bar-box{
    position: absolute;
    top: 10px;
    left: 10px;
    opacity: 0.5;
  }

</style>
