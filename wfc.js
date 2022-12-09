import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { modules, initModules } from "./module.js";

let camera, renderer, scene;
const size = 3;

init();
solver();

function init() {
  //#region Camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(8, 8, 8);
  camera.lookAt(0, 0, 0);
  //#endregion

  //#region Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  //#endregion

  //#region lights
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

  render();
}

async function solver() {
  //Create sockets
  const loadModules = await initModules();
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        //instantiate module at this position
        let mesh = new THREE.Object3D();
        mesh = modules[0].mesh.clone();
        mesh.position.set(x, y, z);
        scene.add(mesh);
        render();
      }
    }
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
