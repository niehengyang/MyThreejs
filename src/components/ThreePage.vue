<template>
  <div class="conts">
    <div id="container"></div>
  </div>
</template>

<script>
    import * as THREE from "three"
    export default {
        name: "ThreePage",
        data(){
            return{
                scene: '',
                camera: '',
                renderer: '',
                geometry: '',
                container: '',
                material: '',
                mesh: '',
                controls: {
                    rotationSpeed:0.02,
                    bouncingSpeed:0.03
                },
                sphere: '',
                cube: '',
                step: 0,
            }
        },
        methods: {
            init: function () {
                let container = document.getElementById('container')
                //创建场景
                this.scene = new THREE.Scene();
                //创建相机
                this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
                let axis = new THREE.AxisHelper(0);
                this.scene.add(axis);

                this.camera.position.set(0,30,40);
                this.camera.lookAt(this.scene.position);

                /*生成一个平面的地图*/
                let textureGrass = THREE.ImageUtils.loadTexture('/images/OIP.jpg');
                textureGrass.wrapS = THREE.RepeatWrapping;
                textureGrass.wrapT = THREE.RepeatWrapping;
                textureGrass.repeat.set(1,1);

                //创建平面的骨架
                this.geometry = new THREE.PlaneBufferGeometry(60,30,1,1);
                //创建平面的材料
                // this.material = new THREE.MeshLambertMaterial({color: '#aaaaaa'});
                //创建平面的材料（图片）
                this.material = new THREE.MeshLambertMaterial({map: textureGrass});

                this.mesh = new THREE.Mesh(this.geometry,this.material);
                this.mesh.rotation.x = -0.5*Math.PI;
                this.mesh.position.set(0,0,0);

                //平面接收阴影
                this.mesh.receiveShadow = true;
                this.scene.add(this.mesh);

                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                this.renderer.setClearColor(0x000000, 1.0);
                this.renderer.shadowMapEnabled = true;
                container.appendChild(this.renderer.domElement);
            },

            cubes(){
                // 创建立方体骨架
                var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
                // 创建立方体(注：这里是用了纹理的，如不想使用纹理，将下方2行代码注释，并将第3行代码放开注释)
                let textureGrass = THREE.ImageUtils.loadTexture('/images/9f510fb30f2442a76801fe7bd043ad4bd01302e4.jpg');
                var cubeMaterial = new THREE.MeshLambertMaterial({map: textureGrass,side: THREE.DoubleSide});
                // var cubeMaterial = new THREE.MeshLambertMaterial({color: 'yellow', wireframe: true});
                // 合成立方体
                this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                //投射阴影
                this.cube.castShadow = true;
                //设置方块位置
                this.cube.position.set(-20,4,0);
                //将方块添加到场景中
                this.scene.add(this.cube);


                // 创建球体骨架
                var sphereGeometry = new THREE.SphereGeometry(4, 20, 10);
                // 创建球体(注：这里是用了纹理的，如不想使用纹理，将下方2行代码注释，并将第3行代码放开注释)
                let textureGrasss = THREE.ImageUtils.loadTexture('/images/b5312620d8a6.jpg');
                var sphereMaterial = new THREE.MeshLambertMaterial({map: textureGrasss,side: THREE.DoubleSide});
                // var sphereMaterial = new THREE.MeshLambertMaterial({color: 'red', wireframe: true});
                this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                //投射阴影
                this.sphere.castShadow = true;
                //设置球体位置
                this.sphere.position.set(20,10,0);
                //将球体添加到场景中
                this.scene.add(this.sphere);
            },

            light(){
                //添加聚光灯光源
                let light = new THREE.SpotLight(0xffffff);
                light.position.set(-40,60,-10);
                light.castShadow = true;
                light.shadow.mapSize.width = 2048;
                light.shadow.mapSize.height = 2048;
                this.scene.add(light);
                //添加环境光
                let ambientLight = new THREE.AmbientLight('#ffffff');
                this.scene.add(ambientLight);
            },

            animate: function () {
                this.cube.rotation.x += this.controls.rotationSpeed;
                this.cube.rotation.y += this.controls.rotationSpeed;
                this.cube.rotation.z += this.controls.rotationSpeed;
                this.step += this.controls.bouncingSpeed;
                this.sphere.position.x = 20 + (10 * Math.cos(this.step));
                this.sphere.position.y = 5 + (10 * Math.abs(Math.sin(this.step)));
                requestAnimationFrame(this.animate);
                this.renderer.render(this.scene,this.camera);
            }
        },
        mounted () {
            this.init()
            this.cubes()
            this.light()
            this.animate()
        }
    }
</script>

<style scoped>
  .conts{
    position: relative;
    width: 100%;
    height: 100%;
  }
  #container{
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
