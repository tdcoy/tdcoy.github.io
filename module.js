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
  constructor(faces, mesh) {
    this.faces = faces;
    this.mesh = mesh;
  }
}

function init() {
  //#region create modules
  //-empty
  //-wall straight
  //--create module
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

  const cubeFaces = new Faces(up, down, left, right, back, front);
  let cubeMesh;

  const loader = new GLTFLoader();
  loader.load(
    "assets/models/wall_straight.glb",
    function (gltf) {
      cubeMesh = gltf.scene;
      //cubeMesh.position.set(x, z, y);
      cubeMesh.scale.set(1, 1, 1);
      scene.add(cubeMesh);
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  straightWallModule = new Module(cubeFaces, cubeMesh);
  modules.push(straightWallModule);

  //--load model
  //--set faces
  //-roof corner = roof_corner
  //-roof straight = roof_straight
  //#endregion
}
