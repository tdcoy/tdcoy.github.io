import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function importGLB(modelName) {
  const loader = new GLTFLoader();
  loader.load(
    modelName,
    function (gltf) {
      const model = gltf.scene;
      //model.position.set(modelPos);
      //model.scale.set(modelScale, modelScale, modelScale);
      //scene.add(model);

      return model;
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );
}
