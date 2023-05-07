// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
// import * as CANNON from 'cannon-es';

// var renderer, scene, camera, physWorld;
// var sphereMesh, groundMesh;
// var meshList = new Array();
// var boxPhysMat, groundPhysMat;
// var sphereBody, groundBody;
// var bodyList = new Array();


// initRenderer();
// initScene();
// initCamera();
// //initBoxMesh();
// initSphereMesh();
// initGroundMesh();
// initPhysWorld();
// //initBoxBody();
// initSphereBody();
// initGroundBody();
// //addContact();
// renderer.setAnimationLoop(animate);


// function initRenderer(){
//     renderer = new THREE.WebGLRenderer({antialias: true});
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     // Sets the color of the background
//     //renderer.setClearColor(0xFEFEFE);
//     document.body.appendChild(renderer.domElement);
// }

// function initScene(){
//     scene = new THREE.Scene();
// }

// function initCamera(){
//     camera = new THREE.PerspectiveCamera(
//         45,
//         window.innerWidth / window.innerHeight,
//         0.1,
//         1000
//     );
//     // Sets orbit control to move the camera around
//     const orbit = new OrbitControls(camera, renderer.domElement);

//     // Camera positioning
//     camera.position.set(0, 20, -30);
//     orbit.update();
// }

// function initBoxMesh(position){
//     //box mesh
//     const boxGeo = new THREE.BoxGeometry(0.02, 0.02, 0.02);
//     const boxMat = new THREE.MeshBasicMaterial({
//         color: 0x00ff00,
//         wireframe: true
//     });
//     var boxMesh = new THREE.Mesh(boxGeo, boxMat);
//     boxMesh.position.set(position.x, position.y, position.z);
//     scene.add(boxMesh);
//     meshList.push(boxMesh);
//     return boxMesh;
// }

// function initSphereMesh(){
//     //sphere mesh
//     const sphereGeo = new THREE.SphereGeometry(2);
//     const sphereMat = new THREE.MeshBasicMaterial({
//         color: 0xff0000,
//         wireframe: true
//     });
//     sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
//     scene.add(sphereMesh);
// }

// function initPhysWorld(){
//     //physics world
//     physWorld = new CANNON.World({
//         gravity: new CANNON.Vec3(0, -9.81, 0)
//     });
// }

// function initGroundMesh(){
//     const groundGeo = new THREE.PlaneGeometry(30, 30);
//     const groundMat = new THREE.MeshBasicMaterial({
//         color: 0xffffff,
//         side: THREE.DoubleSide,
//         wireframe: true
//     })
//     groundMesh = new THREE.Mesh(groundGeo, groundMat);
//     scene.add(groundMesh);
// }

// function initGroundBody(){
//     groundPhysMat = new CANNON.Material();

//     groundBody = new CANNON.Body({
//         shape: new CANNON.Plane(),
//         //mass: 2,
//         type: CANNON.Body.STATIC,
//         material: groundPhysMat
//     });
//     physWorld.addBody(groundBody);
//     groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
// }


// function initBoxBody(boxMesh){
//     boxPhysMat = new CANNON.Material();

//     //add box to physics world
//     var boxBody = new CANNON.Body({
//         mass: 0.1,
//         shape: new CANNON.Box(new CANNON.Vec3(2, 2, 2)),
//         position: new CANNON.Vec3(boxMesh.position.x, boxMesh.position.y, boxMesh.position.z),
//         material: boxPhysMat
//     });
//     physWorld.addBody(boxBody);

//     boxBody.angularVelocity.set(0, 10, 0);
//     boxBody.angularDamping = 0.5;

//     bodyList.push(boxBody);
// }

// function addContact(){
//     const groundBoxContactMat = new CANNON.ContactMaterial(
//         groundPhysMat,
//         boxPhysMat,
//         {friction: 0.05}  //the contact should be slippery
//     );
    
//     physWorld.addContactMaterial(groundBoxContactMat);
// }

// function initSphereBody(){
//     sphereBody = new CANNON.Body({
//         mass: 10,
//         shape: new CANNON.Sphere(2),
//         position: new CANNON.Vec3(0, 15, 0)
//     });
//     physWorld.addBody(sphereBody);
    
//     sphereBody.linearDamping = 0.31; //friction
// }

// //animate
// function animate() {
//     const timeStep = 1 / 60;
//     physWorld.step(timeStep);
//     //update the plane
//     groundMesh.position.copy(groundBody.position);
//     groundMesh.quaternion.copy(groundBody.quaternion);
//     //update the box
//     for (var i = 0; i< meshList.length; i++)
//     {
//         var boxMesh = meshList[i];
//         var boxBody = bodyList[i];
//         boxMesh.position.copy(boxBody.position);
//         boxMesh.quaternion.copy(boxBody.quaternion);
//     }
//     //update the sphere
//     sphereMesh.position.copy(sphereBody.position);
//     sphereMesh.quaternion.copy(sphereBody.quaternion);

//     renderer.render(scene, camera);
// }


// window.addEventListener('resize', function() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
 
 
// function onDocumentMouseDown( event ) {
//     var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
//     vector = vector.unproject(camera);
//     var boxMesh = initBoxMesh(vector);
//     initBoxBody(boxMesh);

//     // const boxGeo = new THREE.BoxGeometry(0.02, 0.02, 0.02);
//     // const boxMat = new THREE.MeshBasicMaterial({
//     //     color:new THREE.Color( 'skyblue' ),
//     //     wireframe: true
//     // });
//     // const boxMesh = new THREE.Mesh(boxGeo, boxMat);
//     // boxMesh.position.set(vector.x, vector.y, vector.z );
//     // scene.add(boxMesh);
//     // meshList.push(boxMesh);
// }

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

var renderer, scene, camera, physWorld;
var sphereMesh, groundMesh;
var meshList = new Array();
var boxPhysMat, groundPhysMat;
var sphereBody, groundBody;
var bodyList = new Array();


initRenderer();
initScene();
initCamera();
//initBoxMesh();
initSphereMesh();
initGroundMesh();
initPhysWorld();
//initBoxBody();
initSphereBody();
initGroundBody();
//addContact();
renderer.setAnimationLoop(animate);


function initRenderer(){
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Sets the color of the background
    //renderer.setClearColor(0xFEFEFE);
    document.body.appendChild(renderer.domElement);
}

function initScene(){
    scene = new THREE.Scene();
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
        //position: new CANNON.Vec3(1, 20, 0),
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
    //update the sphere
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);
}


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
 
 
// function onDocumentMouseDown( event ) {
//     var x = event.clientX;//鼠标单击坐标X
//     var y = event.clientY;//鼠标单击坐标Y
//     // 屏幕坐标转标准设备坐标
//     var x1 = ( x / window.innerWidth ) * 2 - 1;
//     var y1 = -( y / window.innerHeight ) * 2 + 1;
//     //标准设备坐标(z=0.5这个值并没有一个具体的说法)
//     var stdVector = new THREE.Vector3(x1, y1, 0.5);
//     var worldVector = stdVector.unproject(camera);
//     initBoxMesh();
//     initBoxBody(worldVector);
// }

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
    // const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    // const sphereMat = new THREE.MeshStandardMaterial({
    //   color: 0xffea00,
    //   metalness: 0,
    //   roughness: 0
    // });
    // const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    // scene.add(sphereMesh);
    initBoxMesh(intersectionPoint);
    initBoxBody(intersectionPoint);
  });