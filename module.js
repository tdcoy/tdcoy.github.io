import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js";

export const modules = [];

class Faces {
  constructor(up, down, left, right, back, front) {
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    this.front = front;
    this.back = back;
  }
}

class Module {
  constructor(faces, mesh, name) {
    this.moduleFaces = faces;
    this.moduleMesh = mesh;
    this.moduleName = name;
  }

  get mesh() {
    return this.moduleMesh;
  }

  get name() {
    return this.moduleName;
  }
}

export async function initModules() {
  return new Promise((resolve, reject) => {
    //#region create modules
    const up = new Array(
      "empty",
      "wall_straight",
      "roof_corner",
      "roof_straight"
    );

    const down = new Array("empty", "wall_straight");
    const left = new Array("empty", "wall_straight");
    const right = new Array("empty", "wall_straight");
    const back = new Array("empty", "wall_straight");
    const front = new Array("empty", "wall_straight");

    const moduleFaces = new Faces(up, down, left, right, back, front);
    let moduleMesh = new THREE.Object3D();

    const loader = new GLTFLoader();
    loader.load(
      "assets/models/wall_straight.glb",
      function (gltf) {
        moduleMesh = gltf.scene;
        moduleMesh.scale.set(1, 1, 1);
        const straightWallModule = new Module(
          moduleFaces,
          moduleMesh,
          "wall_straight"
        );
        modules.push(straightWallModule);
        resolve();
      },
      undefined,
      function (e) {
        reject(e);
      }
    );
  });
  //#endregion
}
