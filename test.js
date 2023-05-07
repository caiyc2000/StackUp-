import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

var container, stats;
var camera, scene, world, raycaster, renderer;

// 初始化视图
initView();
// 初始化场景
initScene();
// 初始化灯光
initLight();
// 初始化渲染器
initRenderer();
// 初始化相机
initCamera();
// 初始化物体
initObject();
//intialize physics world
initPhysWorld();
// 渲染循环
render();

function initView() {
    container = document.createElement("div");
    document.body.appendChild(container);
}

function initScene() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
}

function initLight() {
    // 平行光
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // Sets orbit control to move the camera around
    const orbit = new OrbitControls(camera, renderer.domElement);

    // Camera positioning
    camera.position.set(0, 20, -30);
    orbit.update();
}

// 初始化物体
function initObject() {
    // 盒子
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // 创建材质，材质颜色是随机的
    var material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff,
    });

    var object = new THREE.Mesh(geometry, material);
    // 随机位置
    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;
    // 随机旋转
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    // 随机大小
    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;

    scene.add(object);
}

function initPhysWorld(){
    world = new CANNON.World
    ({
        gravity: new CANNON.Vec3(0, -9.81, 0)
    });
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xFEFEFE);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function render()
{
    renderer.setAnimationLoop(animate);
}

//animate
function animate() {
    const timeStep = 1 / 60;
    world.step(timeStep);

    renderer.render(scene, camera);
}

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})