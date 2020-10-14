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
        <el-button @click="saveModel">保存</el-button>
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
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
    import { TransformControls } from "three/examples/jsm/controls/TransformControls"
    import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
    import { DragControls } from "three/examples/jsm/controls/DragControls"

    import { MTLLoader } from  'three/examples/jsm/loaders/MTLLoader.js'
    import { OBJLoader } from  'three/examples/jsm/loaders/OBJLoader.js'
    import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
    import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

    import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";

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


                //拖动控件
                transformControls: '',

                container: '',
                //objects是指场景中的实体集合
                objects: [],

                group: '',
                //projector是可能指屏幕和场景转换工具 renderer是指场景渲染，能把场景呈现到浏览器里
                projector: '',
                selectObject: '',

                dragTarget: null, //拖拽对象

                isFullScreen: false,
                originalWidth: '',
                originalHeight: '',

                sceneBg: require('@/assets/bgimg/cbbfeec3a27a7eee9a7b442a1b39686f.jpg'),

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

                // 在场景中添加雾的效果；样式上使用和背景一样的颜色
                // this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 800);

                //给场景添加天空盒子纹理
                // var cubeTextureLoader = new THREE.CubeTextureLoader();
                // cubeTextureLoader.setPath( 'images/' );
                // //六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx）。
                // var cubeTexture = cubeTextureLoader.load( [
                //     'right.js', 'left.jpg',
                //     'top.jpg', 'bottom.jpg',
                //     'frent.jpg', 'back.jpg'
                // ] );
                //
                // this.scene.background = cubeTexture;

                //给场景添加天空盒子背景
                const loader = new THREE.TextureLoader();
                const bgTexture = loader.load(this.sceneBg);

                this.scene.background = bgTexture;



                this.group = new THREE.Group();
                this.scene.add(this.group);
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
                this.camera = new THREE.PerspectiveCamera(450, aspect, 0.1, 10000);
                this.camera.position.set(0, 500, 500);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 让相机指向原点
                this.scene.add(this.camera);

            },
            /** 渲染器**/
            initRenderer() {

                // 创建渲染器
                this.renderer = new THREE.WebGLRenderer({
                    // 在 css 中设置背景色透明显示渐变色
                    alpha: true,
                    // 开启抗锯齿，但这样会降低性能。
                    // 不过，由于我们的项目基于低多边形的，那还好 :)
                    antialias: true
                });
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
                // const pointLight = new THREE.PointLight(0xffffff, 0.4); //创建一个点灯光
                // this.camera.add(pointLight);
                //
                // this.light = new THREE.SpotLight(0xffffff,0.4);
                // this.light.position.set(-300, 600, -400);
                // this.light.castShadow = true;
                //
                // this.scene.add(this.light);
                // this.scene.add(new THREE.AmbientLight(0xcccccc, 0.4));



                // 半球光就是渐变的光；
                // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
                var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

                // 方向光是从一个特定的方向的照射
                // 类似太阳，即所有光源是平行的
                // 第一个参数是关系颜色，第二个参数是光源强度
               var shadowLight = new THREE.DirectionalLight(0xffffff, .9);

                // 设置光源的方向。
                // 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
                shadowLight.position.set(150, 350, 350);

                // 开启光源投影
                shadowLight.castShadow = true;

                // 定义可见域的投射阴影
                shadowLight.shadow.camera.left = -400;
                shadowLight.shadow.camera.right = 400;
                shadowLight.shadow.camera.top = 400;
                shadowLight.shadow.camera.bottom = -400;
                shadowLight.shadow.camera.near = 1;
                shadowLight.shadow.camera.far = 1000;

                // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
                shadowLight.shadow.mapSize.width = 2048;
                shadowLight.shadow.mapSize.height = 2048;

                // 为了使这些光源呈现效果，只需要将它们添加到场景中
                this.scene.add(hemisphereLight);
                this.scene.add(shadowLight);
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
                var gridHelper = new THREE.GridHelper(10000, 100, 0xCD3700, 0x4A4A4A);
                gridHelper.position.y = -1000;
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
                    this.transformControls = '';

                });

                // 指定某个对象绑定到transformControls上，比如点击物体时可将物体绑定
                // const object: Object3D = ...
                transformControls.attach(obj);
                this.transformControls = transformControls;

                // let that = this;
                //
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
                //     that.controls.enabled = false;
                // });
                // // 拖拽结束
                // dragControls.addEventListener('dragend', function (event) {
                //     that.controls.enabled = true;
                // });

            },


            /** 更新控件**/
            updateData() {
                // this.stats.update();
                // this.controls.update();
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

                // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
                var intersects = raycaster.intersectObjects(this.objects,true);

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

                    // this.changeMaterial(selectObj)
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

                    if ( this.selectObject.parent.type == 'Object3D'){
                        this.initDragControls(this.selectObject.parent)
                        return ;
                    }
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
            /** 导入外部资源**/
            loadModel(name,optionsValue, modelUrl, mtlUrl){

                let objLoader2 = new OBJLoader2()
                let mtlLoader = new MTLLoader()
                let _this = this

                var onError = function (xhr) { console.log("An error happened"); };
                var onProgress = function(xhr){ console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); };

                mtlLoader.load(mtlUrl, function (mtlParseResult) {
                    objLoader2.setLogging(true, true)
                    objLoader2.addMaterials(MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult))
                    objLoader2.load(modelUrl, function (calldata) {
                        _this.oldChildren = _this.dealMeshMaterial(calldata.children)

                        calldata.position.set(optionsValue.clientX, -1,optionsValue.clientY );//模型摆放的位置
                        calldata.scale.set(optionsValue.x, optionsValue.y, optionsValue.z);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。

                        calldata.name = name; //添加名称

                        _this.addToObjects(calldata)
                    }, onProgress, onError, null)
                })
            },

            /**
             * 留住每个模型的 原材质
             */
            dealMeshMaterial (arrs) {
                let result = []
                for (let i = 0; i < arrs.length; i++) {
                    let obj = {
                        'name': arrs[i].name,
                        'material': arrs[i].material
                    }
                    result.push(obj)
                }
                return result
            },

            loadchangfangti(options) {

                //轮廓大小
                var rollOverGeo = new THREE.BoxGeometry(2, 2, 5);
                //材质
                var rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xFFFF00, opacity: 1, transparent: true});
                //加载 轮廓 材质
                var rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

                rollOverMesh.position.set(options.clientX, 0, options.clientY);//模型摆放的位置
                rollOverMesh.scale.set(options.x, options.y, options.z);  //模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                rollOverMesh.name = '长方体' // 使用name属性标记内部模型的名称

                this.addToObjects(rollOverMesh)
            },

            loadyuanzhu(options){
                var geometry = new THREE.CylinderGeometry(20,20,100,40);
                var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.set(options.clientX, 0, options.clientY);//模型摆放的位置
                mesh.scale.set(options.x, options.y, options.z);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = true;
                mesh.name = '圆柱体' // 使用name属性标记内部模型的名称

                this.addToObjects(mesh)
            },

            loadqiuti(options){
                var radius = 50, segemnt = 16, rings = 16;

                var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff });

                var sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(radius,segemnt,rings),
                    sphereMaterial
                );
                sphere.position.set(options.clientX, 0, options.clientY);//模型摆放的位置
                sphere.scale.set(options.x, options.y, options.z);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                sphere.name = '球体' // 使用name属性标记内部模型的名称
                sphere.castShadow = true;

                this.addToObjects(sphere)
            },

            /** 拖放事件**/
            handleDrag(e) {
                var dataValue = e.dataTransfer.getData('widget-type');
                var materialUrl = e.dataTransfer.getData('material-url');
                var modelUrl = e.dataTransfer.getData('model-url');
                let optionValue = e.dataTransfer.getData('option-value');

                e.preventDefault();
                let x = parseFloat(e.x.toFixed(2));
                let y = parseFloat(e.y.toFixed(2));

                var optiosData = optionValue.split('|');

                e.preventDefault();

                var mouse3D = this.getMousePosition(e);
                console.log(mouse3D.x + ' ' + mouse3D.y + ' ' + mouse3D.z);

                let options = {
                    clientX: mouse3D.x,
                    clientY: mouse3D.y,
                    x: optiosData[2],
                    y: optiosData[3],
                    z: optiosData[4],
                };

                switch (dataValue) {
                    case 'changfangti': //长方体
                        options.x = 10;
                        options.y = 10;
                        options.z = 10;
                        this.loadchangfangti(options);
                        break;
                    case 'yuanzhu': //圆柱体
                        options.x = 0.4;
                        options.y = 0.4;
                        options.z = 0.4;
                        this.loadyuanzhu(options);
                        break;
                    case 'qiuti': //球体
                        options.x = 0.4;
                        options.y = 0.4;
                        options.z = 0.4;
                        this.loadqiuti(options);
                        break;
                    default: this.loadModel(dataValue,options,modelUrl,materialUrl);
                        break;
                }
            },


            /** 屏幕坐标转世界坐标**/
            getMousePosition(event) {

                var mouse3D = new THREE.Vector3();
                const mouseX = event.clientX;//鼠标单击坐标X
                const mouseY = event.clientY;//鼠标单击坐标Y

                // 屏幕坐标转标准设备坐标
                const x = ( mouseX / window.innerWidth ) * 2 - 1;
                const y = -( mouseY / window.innerHeight ) * 2 + 1;
                //标准设备坐标(z=0.5这个值并没有一个具体的说法)
                const stdVector = new THREE.Vector3(x, y, 0.5);

                // 通过unproject方法，可以将标准设备坐标转世界坐标
                const worldVector = stdVector.unproject(this.camera);
                // 进行剩下操作，比如判断鼠标是否选中某个物体
                worldVector.sub( this.camera.position ).normalize();
                var distance = -this.camera.position.z / worldVector.z;
                mouse3D.copy( this.camera.position ).add( worldVector.multiplyScalar( distance ) );

                console.log(mouse3D);

                return mouse3D;
            },

            /** 添加模型**/
            addToObjects(mush){

                let params = {
                    scene_id: 1,
                    model_url: '',
                    mtl_url: '',
                    name: mush.name,
                    structure_data: JSON.stringify(mush),
                    desc: '',
                }

                this.$api.restfulApi.create('/createmodel',params).then((res)=>{
                    //添加控制
                    this.initDragControls(mush)

                    //加入到场景
                    this.scene.add(mush);
                    this.objects.push(mush);
                })
            },

            /** 移除模型**/
            removeModel(){
                let obj = '';

                //按模型名称查找并移除
                if (this.selectObject.parent.name){
                    obj = this.scene.getObjectByName(this.selectObject.parent.name)
                }else{
                    obj = this.scene.getObjectByName(this.selectObject.name)
                }

                this.scene.remove(obj) //移除模型
                this.transformControls.detach() //控制器清空
                this.selectObject = ''; //清空选择模型
                this.scene.children.pop(); //过滤遗留控制器
            },

            //保存模型
            saveModel(){

                let params = {
                    structData: JSON.stringify(this.objects)
                }

                this.$api.restfulApi.create('/savemodel',params).then((res)=>{
                    console.log(res);
                })
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
