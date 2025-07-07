import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Setup renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true    // This makes the background transparent
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Setup camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(0, 1, 10);

// Variables for model and animation
let model = null;
let animationProgress = 0;

// Animation parameters - adjust these to fit your model
const startScale = 2;
const endScale = 32;
const startZ = -10;
const endZ = 0;


// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 4);
dirLight1.position.set(-3, 0, 0);
dirLight1.castShadow = true;
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
dirLight2.position.set(-4, -3, 0);
dirLight2.castShadow = true;
scene.add(dirLight2);

const dirLight3 = new THREE.DirectionalLight(0xffffff, 2);
dirLight3.position.set(12, -3, 5);
dirLight3.castShadow = true;
scene.add(dirLight3);


// Load the GLB model
const loader = new GLTFLoader();
loader.load(
  "../static/bose.glb", // Confirm this path is correct relative to your served root
  (gltf) => {
    model = gltf.scene;
    model.scale.set(startScale, startScale, startScale); // Start scale
    model.position.set(6, -1.5, startZ);                    // Start far back

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Error loading GLB:", error);
  }
);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render and animate
const renderLoop = () => {
  if (model) {
    if (animationProgress < 1) {
      animationProgress += 0.005; // Controls animation speed
      const easedProgress = Math.sin((animationProgress * Math.PI) / 2); // Smooth easing

      // Animate scale
      const scale = THREE.MathUtils.lerp(startScale, endScale, easedProgress);
      model.scale.set(scale, scale, scale);

      // Animate position (swoosh forward)
      const z = THREE.MathUtils.lerp(startZ, endZ, easedProgress);
      model.position.z = z;

      // Fast spin while animating
      model.rotation.y += 0.01;
    } else {
      // Slow continuous spin after animation
      model.rotation.y += 0.01;
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
};
renderLoop();

const setCameraAndModel = () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Adjust camera Z based on screen width
    if (window.innerWidth < 600) {
      camera.position.set(0, 1, 18); // Farther for small screens
      if (model) model.position.set(4, -1.5, endZ);
    } else if (window.innerWidth < 1000) {
      camera.position.set(0, 1, 12);
      if (model) model.position.set(5, -1.5, endZ);
    } else {
      camera.position.set(0, 1, 10);
      if (model) model.position.set(6, -1.5, endZ);
    }
  };
  
  // Call initially
  setCameraAndModel();
  
  // Call on resize
  window.addEventListener("resize", setCameraAndModel);

  if (model) {
  const scale = window.innerWidth < 600 ? 20 : 32;
  model.scale.set(scale, scale, scale);
}
