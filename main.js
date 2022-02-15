import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");
let scene, camera, renderer, controls, mesh;

window.addEventListener("load", init);

function init() {
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("grey");

  // camera
  camera = new THREE.PerspectiveCamera();
  camera.position.set(1, 1.5, 4);
  scene.add(camera);

  // renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  // controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // axesHelper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0.5;
  scene.add(mesh);

  resize();
  window.addEventListener("resize", resize);

  animate();
}

// animate
function animate() {
  window.requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

// resize
function resize() {
  // canvasエレメントのサイズを使用してリサイズ
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

document.getElementById("box-button").onclick = () => {
  mesh.geometry = new THREE.BoxGeometry();
  mesh.position.y = 0.5;
}

document.getElementById("sphere-button").onclick = () => {
  mesh.geometry = new THREE.SphereGeometry();
  mesh.position.y = 1;
}

document.getElementById("torusKnot-button").onclick = () => {
  mesh.geometry = new THREE.TorusKnotGeometry();
  mesh.position.y = 1.8;
}

document.getElementById("basic-button").onclick = () => {
  mesh.material = new THREE.MeshBasicMaterial();
}

document.getElementById("normal-button").onclick = () => {
  mesh.material = new THREE.MeshNormalMaterial();
}

const wireframeCheck = document.getElementById("wireframe");
wireframeCheck.onchange = () => {
  mesh.material.wireframe = wireframeCheck.checked;
}

document.getElementById("ARbutton").onclick = () => {
  const params = new URLSearchParams();
  params.append('geometry', mesh.geometry.constructor.name);
  params.append('material', mesh.material.constructor.name);
  params.append('wireframe', mesh.material.wireframe);
  params.append('position.y', mesh.position.y);
  // console.log(params.toString());
  // window.location.href = "/ar_page/ar.html?" + params.toString();
  const url = 'https://192.168.3.4:3000/ar_page/ar.html?' + params.toString();
  navigator.clipboard.writeText(url);
}
