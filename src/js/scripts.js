import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';
import waterTexture from '../../static/images/waternormals.jpg';

var renderer, scene, camera, orbit, physWorld;
var sphereMesh, groundMesh;
var water;
var meshList = new Array();
var boxPhysMat, groundPhysMat;
var sphereBody, groundBody;
var bodyList = new Array();


initRenderer();
initScene();
initCamera();
//initSphereMesh();
initGroundMesh();
initPhysWorld();
//initSphereBody();
initGroundBody();
//addContact();
renderer.setAnimationLoop(animate);


function initRenderer(){
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initScene(){
    scene = new THREE.Scene();
    initWater();
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // Sets orbit control to move the camera around
    orbit = new OrbitControls(camera, renderer.domElement);

    // Camera positioning
    camera.position.set(0, 20, -30);
    //rotating
    orbit.autoRotate = true; 

    orbit.update();
}


function initWater()
{
    waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(waterTexture,  texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x0072ff,
    distortionScale: 4,
    fog: scene.fog !== undefined
    });
    water.rotation.x = - Math.PI / 2;
    scene.add(water);
}

function initBoxMesh(){
    //box mesh
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const boxMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    });
    var boxMesh = new THREE.Mesh(boxGeo, boxMat);
    scene.add(boxMesh);
    meshList.push(boxMesh);
    boxMesh.position.copy(intersectionPoint);
    return boxMesh;
}

function initSphereMesh(){
    //sphere mesh
    const sphereGeo = new THREE.SphereGeometry(2);
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
}

function initPhysWorld(){
    //physics world
    physWorld = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0)
    });
}

function initGroundMesh(){
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: true
    })
    groundMesh = new THREE.Mesh(groundGeo, groundMat);
    scene.add(groundMesh);
}

function initGroundBody(){
    groundPhysMat = new CANNON.Material();

    groundBody = new CANNON.Body({
        shape: new CANNON.Plane(),
        //mass: 2,
        type: CANNON.Body.STATIC,
        material: groundPhysMat
    });
    physWorld.addBody(groundBody);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
}


function initBoxBody(worldVector){
    boxPhysMat = new CANNON.Material();

    //add box to physics world
    var boxBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
        position: new CANNON.Vec3(worldVector.x, worldVector.y, worldVector.z),
        material: boxPhysMat
    });
    physWorld.addBody(boxBody);

    boxBody.angularVelocity.set(0, 10, 0);
    boxBody.angularDamping = 0.5;

    bodyList.push(boxBody);
}

function addContact(){
    const groundBoxContactMat = new CANNON.ContactMaterial(
        groundPhysMat,
        boxPhysMat,
        {friction: 0.05}  //the contact should be slippery
    );
    
    physWorld.addContactMaterial(groundBoxContactMat);
}

function initSphereBody(){
    sphereBody = new CANNON.Body({
        mass: 10,
        shape: new CANNON.Sphere(2),
        position: new CANNON.Vec3(0, 15, 0)
    });
    physWorld.addBody(sphereBody);
    
    sphereBody.linearDamping = 0.31; //friction
}

//animate
function animate() {
    const timeStep = 1 / 60;
    physWorld.step(timeStep);
    //update the plane
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);
    //update the box
    for (var i = 0; i< meshList.length; i++)
    {
        var boxMesh = meshList[i];
        var boxBody = bodyList[i];
        boxMesh.position.copy(boxBody.position);
        boxMesh.quaternion.copy(boxBody.quaternion);
    }
    // //update the sphere
    // sphereMesh.position.copy(sphereBody.position);
    // sphereMesh.quaternion.copy(sphereBody.quaternion);

    orbit.update();

    renderer.render(scene, camera);
}


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener("click", function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    initBoxMesh(intersectionPoint);
    initBoxBody(intersectionPoint);
  });