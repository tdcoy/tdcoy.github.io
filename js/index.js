//import * as THREE from "../three.js-master/build/three.module.js";
import * as THREE from "three";
import { GLTFLoader } from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

var model;

const loader = new GLTFLoader();
loader.load(
  "../assets/models/skull.glb",
  function (glb) {
    console.log(glb);
    model = glb.scene;
    model.position.set( 0, 0, 0 );
    model.scale.set(0.5,0.5,0.5);
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

//Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

//Setup scene
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;

//Animation
function animate() {
  requestAnimationFrame(animate);

  model.rotation.x += 0.01;
  model.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
