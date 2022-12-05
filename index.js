import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let camera, renderer, scene, controls;
let plane;
let pointer, raycaster;
let rollOverMesh, rollOverMaterial;
let cubeGeo, cubeMaterial, boxGeo;

const objects = [];

const gridSize = 20;
const gridDivisions = 10;
const boxSize = gridSize / gridDivisions;
const modelScale = 1;

const clock = new THREE.Clock();

const stats = new Stats();
const container = document.getElementById("container");
container.appendChild(stats.dom);

init();
render();

function init() {
  //#region Camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(10, 16, 26);
  camera.lookAt(0, 0, 0);
  //#endregion

  //Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // roll-over helpers
  const rollOverGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true,
  });
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  scene.add(rollOverMesh);

  // cubes
  try {
    cubeGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xfeb74c,
      map: new THREE.TextureLoader().load(
        "../assets/textures/square-outline-textured.png"
      ),
    });
  } catch (error) {
    console.error(error);
  }

  // grid size, divisions
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
  scene.add(gridHelper);

  //Raycast
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  //#region Enviroment
  //Ground
  const geometry = new THREE.PlaneGeometry(gridSize, gridSize);
  geometry.rotateX(-Math.PI / 2);

  plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ visible: false })
  );

  scene.add(plane);
  objects.push(plane);

  // lights
  const ambientLight = new THREE.AmbientLight(0x606060);
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);
  scene.add(ambientLight);
  //#endregion

  //#region Rendering
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);
  //#endregion

  //#region Controls
  /* controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true; */
  //#endregion

  //#region Events
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("resize", onWindowResize);
  //#endregion
}

function onPointerDown(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  //setFromCamera(vector3 origin, vector3 direction)
  raycaster.setFromCamera(pointer, camera);

  //check if hit any of the objects created (or the ground plane)
  const intersects = raycaster.intersectObjects(objects, true);

  if (intersects.length > 0) {
    //Get last object hit
    const intersect = intersects[0];

    try {
      const loader = new GLTFLoader();
      loader.load("assets/models/Box.glb", function (gltf) {
        const model = gltf.scene;
        model.position.copy(intersect.point).add(intersect.face.normal);
        model.position
          .divideScalar(boxSize)
          .floor()
          .multiplyScalar(boxSize)
          .addScalar(boxSize / 2);
        model.scale.set(modelScale, modelScale, modelScale);
        scene.add(model);
        objects.push(model);
      });
    } catch (error) {
      console.error(error);
    }

    render();
  }
}

function onPointerMove(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, true);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
    rollOverMesh.position
      .divideScalar(boxSize)
      .floor()
      .multiplyScalar(boxSize)
      .addScalar(boxSize / 2);

    render();
  }
}

//Resize Window
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  //controls.update();
  stats.update();
}
