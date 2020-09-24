<template>
  <div class="speace-view-box" id="speace-view-box">
    <div id="myCanvasContainer" @drop="handleDrag($event)"></div>
    <div id="label"></div>
    <div>
      <div class="tool-bar-box">
        <div id="WebGL-output"></div>
        <div id="Stats-output"></div>
        <el-button>上传模型</el-button>
        <el-button @click="removeModel" :disabled="selectObject? false: true">移除模型</el-button>

        <el-button>预览</el-button>
        <el-button>保存</el-button>
      </div>

      <!--      <div class="tabke-bar-box">-->
      <!--        <el-button type="text" @click="handleFullScreen()">-->
      <!--          <img src="@/assets/images/toNormalScreen.png" v-if="isFullScreen">-->
      <!--          <img src="@/assets/images/toFullscreen.png" v-else>-->
      <!--        </el-button>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
    import * as THREE from "three"
    import { requestFullScreen ,exitFullscreen } from '../../utils/FullScreen.js'
    import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader';

    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
    import { TransformControls } from "three/examples/jsm/controls/TransformControls"
    import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
    import { DragControls } from "three/examples/jsm/controls/DragControls"

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

                isFullScreen: false,
                originalWidth: '',
                originalHeight: '',

            }
        },
        created() {

        },

        methods: {
            /*****-------------------------------场景搭建-------------------------------****/
            /** 场景**/
            initScene() {
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x050505);
            },

            /** 相机**/
            initCamera() {
                /***** 正交相机*****/
                // var width = window.innerWidth; //浏览器窗口宽度
                // var height = window.innerHeight; //浏览器窗口高度
                //   // 相机参数设置
                // var k = width / height;
                // var s = 150;
                // //正投影相机设置
                // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 5000);
                // this.camera.position.set(0, 300, 600);
                // this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 让相机指向原点

                /***** 透视相机*****/
                const aspect = window.innerWidth / window.innerHeight; //宽高可根据实际项目要求更改 如果是窗口高度改为innerHeight
                this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 10000);
                this.camera.position.set(0, 300, 600);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 让相机指向原点
                this.scene.add(this.camera);

            },
            /** 渲染器**/
            initRenderer() {

                this.renderer = new THREE.WebGLRenderer({antialias: true});
                //设置渲染区域尺寸
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setClearColor(0x050505);
                // body元素中插入Threejs渲染结果：canvas对象
                document.body.appendChild(this.renderer.domElement);
                this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
                this.renderer.domElement.setAttribute("style", " height:100%;width: 100%;")
            },


            /** 初始化灯光**/
            initLight() {
                // this.scene.add(new THREE.AmbientLight(0xcccccc, 0.4));//环境光
                // this.light = new THREE.DirectionalLight(0xffffff, 0.4);//从正上方（不是位置）照射过来的平行光，0.45的强度
                // this.light.position.set(100, 100, 500);
                // this.light.position.multiplyScalar(0.3);
                // this.scene.add(this.light);

                // const pointLight = new THREE.PointLight(0xffffff, 0.8); //创建一个点灯光
                // this.camera.add(pointLight);

                this.light = new THREE.SpotLight(0xffffff);
                this.light.position.set(-300, 600, -400);
                this.light.castShadow = true;

                this.scene.add(this.light);
                this.scene.add(new THREE.AmbientLight(0xcccccc, 0.4));
            },


            /** 辅助网格线**/
            initGridHelper(){
                /**
                 * 添加地面网格GirdHelper
                 * size 网格总边长
                 * step 网格个数
                 * colorCenterLine  网格中心线颜色
                 * colorGrid    网格其他线颜色
                 */
                var gridHelper = new THREE.GridHelper(1000, 50, 0xCD3700, 0x4A4A4A);
                gridHelper.position.y = -200;
                gridHelper.position.x = 0;
                this.scene.add(gridHelper);

            },


            /** 初始化控制器**/
            initControls() {
                this.container = document.getElementById('myCanvasContainer');
                this.container.append(this.renderer.domElement);

                //初始化相机控制器
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.rotateSpeed = 1  // 转速
                this.controls.autoRotate = false  // 是否自动旋转
                this.controls.autoRotateSpeed = 1  //自动旋转速度
                this.controls.enableZoom = true;  //是否可以缩放
                this.controls.enablePan = true; //是否开启右键拖拽

                this.controls.target.set(0, 0, 0);
                this.controls.minDistance = 100; // 视角最小距离
                this.controls.maxDistance = 5000;   // 视角最远距离
                this.controls.maxPolarAngle = Math.PI / 2;  // 最大角度
                this.controls.update();

                //初始化轨迹球控件
                // this.controls = new TrackballControls(this.camera, this.renderer.domElement);
                // this.controls.noRotate = false;
                // this.controls.noPan = false;
                // this.controls.enableZoom = true;  //是否可以缩放
                // this.controls.enablePan = true; //是否开启右键拖拽
                // this.controls.staticMoving = false;// 静止移动，为 true 则没有惯性
                // this.controls.dynamicDampingFactor = 0.2;// 阻尼系数 越小 则滑动越大
                //
                // this.controls.target.set(0, 0, 0);
                // this.controls.rotateSpeed = 4;// 旋转速度
                // this.controls.zoomSpeed = 0.8;// 缩放速度
                // this.controls.panSpeed = 0.5;// 平controls
                //
                //
                // this.controls.minDistance = 100;  // 视角最小距离
                // this.controls.maxDistance = 5000; // 视角最远距离
                // this.controls.maxPolarAngle = Math.PI / 2;  // 最大角度
            },


            /** 添加拖拽控件**/
            initDragControls(obj) {

                var transformControls = new TransformControls(this.camera, this.renderer.domElement);
                this.scene.add( transformControls);
                transformControls.addEventListener('mouseDown', (evt) => {
                    // 平移开始时禁用相机控件
                    this.controls.enabled = false;
                });
                transformControls.addEventListener('mouseUp', (evt) => {
                    // 平移结束时启用相机控件
                    this.controls.enabled = true;
                    this.selectObject = '';
                    transformControls.detach();
                });

                // 指定某个对象绑定到transformControls上，比如点击物体时可将物体绑定
                // const object: Object3D = ...
                transformControls.attach(obj);



                // // 初始化拖拽控件
                // var dragControls = new DragControls(obj, this.camera, this.renderer.domElement);
                //
                // // 鼠标略过事件
                // dragControls.addEventListener('mouseOn', function (event) {
                //     // 让变换控件对象和选中的对象绑定
                //     transformControls.attach(obj);
                //
                // });
                // // 开始拖拽
                // dragControls.addEventListener('dragstart', function (event) {
                //     this.controls.enabled = false;
                // });
                // // 拖拽结束
                // dragControls.addEventListener('dragend', function (event) {
                //     this.controls.enabled = true;
                // });


            },


            /** 更新控件**/
            updateData() {
                // this.stats.update();
                this.controls.update();
                // this.controls.handleResize();  //控制器重置（球形控件有效）
            },

            /** 初始化**/
            init() {
                this.initScene();
                this.initCamera();
                this.initLight();
                this.initRenderer();
                this.initGridHelper();
                this.initControls();

                addEventListener('click', this.onMouseClick, false);
                addEventListener('resize', this.onWindowResize, false);
                addEventListener('dblclick', this.onMouseDblclick, false);
                addEventListener('keydown', this.onKeyDown, false);

            },

            animate() {
                if (this.selectObject != undefined && this.selectObject != null && this.selectObject != '') {
                    this.renderDiv(this.selectObject);
                }

                requestAnimationFrame(this.animate);
                this.renderer.render(this.scene, this.camera);
                this.updateData();
            },


            /*****-------------------------------方法，样式, 事件-------------------------------****/

            /** 获取与射线相交的对象数组**/
            getIntersects(event) {
                event.preventDefault();
                // console.log("event.clientX:" + event.clientX)
                // console.log("event.clientY:" + event.clientY)

                var mouse = new THREE.Vector2();

                // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                //新建一个三维单位向量 假设z方向就是0.5
                //根据照相机，把这个向量转换到视点坐标系
                var vector = new THREE.Vector3(mouse.x, mouse.y,0.5).unproject(this.camera);

                //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
                var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

                //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
                raycaster.setFromCamera(mouse, this.camera);

               var intersects = '';

                // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
                intersects = raycaster.intersectObjects(this.scene.children,false);

                //返回选中的对象
                return intersects;
            },

            /** 改变对象材质属性**/
            changeMaterial(object) {

                var material = new THREE.MeshLambertMaterial({
                    color: 0xffffff * Math.random(),
                    transparent: object.material.transparent ? false : true,
                    opacity: 0.8
                });
                object.material = material;
            },

            /** 提供信息展示位**/
            renderDiv(object) {
                if (object){
                    // 获取窗口的一半高度和宽度
                    var halfWidth = window.innerWidth / 2;
                    var halfHeight = window.innerHeight / 2;

                    // 逆转相机求出二维坐标
                    var vector = object.position.clone().project(this.camera);

                    // 修改 div 的位置
                    $("#label").css({
                        left: vector.x * halfWidth + halfWidth,
                        top: -vector.y * halfHeight + halfHeight - object.position.y,
                        opacity: 0.8
                    });
                    // 显示模型信息
                    $("#label").text("name:" + object.name);
                }else{
                    // 隐藏div
                    $("#label").css({
                        opacity: 0
                    });
                }
            },


            /** 鼠标左键点击**/
            onMouseClick(event){
                // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
                var intersects = this.getIntersects(event);
                // 获取选中最近的 Mesh 对象
                if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
                    let selectObj = intersects[0].object;
                    this.changeMaterial(selectObj)
                    this.renderDiv(selectObj)
                }else{
                    this.renderDiv()
                }
            },

            /** 鼠标左键双击**/
            onMouseDblclick(event) {

                // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
                var intersects = this.getIntersects(event);

                // 获取选中最近的 Mesh 对象
                if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
                    this.selectObject = intersects[0].object;
                    this.initDragControls(this.selectObject)
                } else {
                    alert("未选中 Mesh!");
                }
            },

            /** 窗口变动触发的方法**/
            onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight); //设置画布大小
            },

            /** 键盘按下触发的方法**/
            onKeyDown(event) {
                switch (event.keyCode) {
                    case 13:
                        this.initCamera();
                        this.initControls();
                        break;
                }
            },

            /*****-------------------------------加入模型-------------------------------****/

            loadModel(name,optionsValue, modelUrl, mtlUrl){
                let objLoader = new OBJLoader();
                let mtlLoader = new MTLLoader();

                //导入资源
                mtlLoader.setCrossOrigin('');
                mtlLoader.setPath(modelUrl);
                mtlLoader.load(mtlUrl, (materials) =>{
                    materials.preload();

                    objLoader.setMaterials(materials);  //@params object 传入的模型，只能是单个模型，也可能是一个group,视构建的model而定
                    objLoader.load(modelUrl, (obj)=> { //obj模型所在url

                            obj.position.set(optionsValue.clientX, 0, optionsValue.clientY);//模型摆放的位置
                            obj.scale.set(optionsValue.x, optionsValue.y, optionsValue.z);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                            obj.name = name; //添加名称
                            obj.castShadow = true;
                            obj.receiveShadow = true;

                            this.addToObjects(obj)
                        },
                        // called while loading is progressing
                        function (xhr) {
                            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                        },
                        // called when loading has errors
                        function (error) {
                            console.log("An error happened");
                        })
                })
            },


            loadchangfangti(width, height) {

                //轮廓大小
                var rollOverGeo = new THREE.BoxGeometry(2, 2, 5);
                //材质
                var rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xFFFF00, opacity: 1, transparent: true});
                //加载 轮廓 材质
                var rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

                rollOverMesh.position.set(height / 10, 0, width / 10);//模型摆放的位置
                rollOverMesh.scale.set(20, 20, 20);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                rollOverMesh.name = 'changfangti' // 使用name属性标记内部模型的名称
                this.addToObjects(rollOverMesh)
            },

            loadyuanzhu(width, height){
                var geometry = new THREE.CylinderGeometry(20,20,100,40);
                var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.set(height / 10, 0, width / 10);//模型摆放的位置
                mesh.scale.set(1, 1, 1);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = true;
                mesh.name = 'yuanzhu' // 使用name属性标记内部模型的名称

                this.addToObjects(mesh)
            },

            loadqiuti(width, height){
                var radius = 50, segemnt = 16, rings = 16;

                var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff });

                var sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(radius,segemnt,rings),
                    sphereMaterial
                );
                sphere.position.set(height / 10, 0, width / 10);//模型摆放的位置
                sphere.scale.set(1, 1, 1);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。

                sphere.name = 'qiuti' // 使用name属性标记内部模型的名称
                sphere.castShadow=true;
                this.addToObjects(sphere)
            },

            /** 拖放事件**/
            handleDrag(e) {
                var dataValue = e.dataTransfer.getData('widget-type')
                let x = parseFloat(e.x.toFixed(2));
                let y = parseFloat(e.y.toFixed(2));

                let options = {
                    clientX: x/10,
                    clientY: y/10,
                    x: 0.2,
                    y: 0.2,
                    z: 0.2,
                };

                switch (dataValue) {
                    case 'zhuanshi': //钻石
                        this.loadModel( dataValue,options,'/models/diamond/diamond-brilliantcut.obj');
                        break;
                    case 'changfangti': //长方体
                        this.loadchangfangti(x, y);
                        break;
                    case 'yuanzhu': //圆柱体
                        this.loadyuanzhu(x, y);
                        break;
                    case 'qiuti': //球体
                        this.loadqiuti(x, y);
                        break;
                    case 'jingzi': //镜子
                        this.loadModel(dataValue,options,'/models/other/tabletop-mirror.obj')
                        break;
                    case 'zhuozi': //桌子
                        options.x =  1
                        options.y =  1
                        options.z =  1
                        this.loadModel(dataValue,options,'/models/Tabel/table.obj','/models/Tabel/table.mtl')
                        break;
                }
            },

            /** 添加模型**/
            addToObjects(mush){
                //添加控制
                this.initDragControls(mush)


                //加入到场景
                this.scene.add(mush);
                this.objects.push(mush)
            },

            /** 移除模型**/
            removeModel(){
                // const allChildren = this.scene.children
                // console.log(allChildren);

                //按模型名称查找并移除
                // const obj = this.scene.getObjectByName('zhuanshi')
                // this.scene.remove(obj)


                this.scene.remove(this.selectObject)
                this.selectObject = '';
                this.scene.children.pop()
            },

            /** 全屏展示**/
            handleFullScreen(){

                let dom = document.getElementById('speace-view-box');
                if (this.isFullScreen){
                    this.renderer.setSize(this.originalWidth, this.originalHeight); //设置画布大小
                    dom.setAttribute("style", "padding: 10px")
                    exitFullscreen();
                    this.isFullScreen = false;
                }else{
                    this.originalWidth = dom.clientWidth;
                    this.originalHeight = dom.clientHeight;
                    this.renderer.setSize(window.outerWidth, window.outerHeight); //设置画布大小
                    requestFullScreen(dom);
                    this.isFullScreen = true;
                }
            }
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
  }

  #container{
    max-height: 800px;
  }

  .tool-bar-box{
    position: absolute;
    top: 20px;
    left: 30%;
    opacity: 0.5;
  }

  .tabke-bar-box{
    position: absolute;
    top: 10px;
    right: 20px;
    opacity: 0.5;
  }

  #label {
    position: absolute;
    padding: 10px;
    background: rgba(255, 255, 255, 0.6);
    line-height: 1;
    border-radius: 5px;
  }
</style>
