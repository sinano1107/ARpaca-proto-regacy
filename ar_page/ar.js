import * as THREE from "three";
const THREEx = window.THREEx;

const canvas = document.getElementById("canvas");
// Three.js core
let scene, camera, renderer;
// jsARtoolkit core
let arToolkitSource, arToolkitContext, markerControls;
const onRenderFcts = [];

window.addEventListener("load", init);

function init() {
  // #region Three.js core
  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.Camera();
  scene.add(camera);

  // renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  // #endregion

  // #region jsARtoolkit core
  // arToolkitSource
  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
  });
  arToolkitSource.init(() => setTimeout(() => {
    resize();
  }, 1000));

  // arToolkitContext
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: '../data/data/camera_para.dat',
    detectionMode: 'mono',
  });
  arToolkitContext.init(() => {
    // プロジェクションマトリックスをカメラにコピー
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  // 毎フレームartoolkitを更新
  onRenderFcts.push(() => {
    if (arToolkitSource.ready === false) return;

    arToolkitContext.update(arToolkitSource.domElement);
    // マーカーを発見したらsceneをvisibleに変更
    scene.visible = camera.visible;
  });

  // markerControls
  markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type: 'pattern',
    patternUrl: '../data/data/patt.hiro',
    changeMatrixMode: 'cameraTransformMatrix',
  });
  // シーンを非表示で開始する
  scene.visible = false;
  // #endregion

  // #region Objects
  buildObject();

  // let geometry = new THREE.BoxGeometry(1, 1, 1);
  // let material = new THREE.MeshNormalMaterial({
  //   transparent: true,
  //   opacity: 0.5,
  //   side: THREE.DoubleSide,
  // });
  // let mesh = new THREE.Mesh(geometry, material);
  // mesh.position.y = geometry.parameters.height / 2;
  // scene.add(mesh);

  // geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
  // material = new THREE.MeshNormalMaterial();
  // mesh = new THREE.Mesh(geometry, material);
  // mesh.position.y = 0.5;
  // scene.add(mesh);

  // onRenderFcts.push((delta) => {
  //   mesh.rotation.x += Math.PI * delta;
  // });
  // #endregion

  // eventListener
  window.addEventListener("resize", resize);

  animate();
}

// clock
const clock = new THREE.Clock();

// animate
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  onRenderFcts.forEach(onRenderFct => onRenderFct(delta));
  renderer.render(scene, camera);
}

// resize
function resize() {
  // renderのリサイズ
  renderer.setSize(innerWidth, innerHeight);
  // arToolkitのリサイズ
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

/**
 * queryの情報をもとにオブジェクトを生成する
 */
function buildObject() {
  const searchParams = new URLSearchParams(window.location.search);

  // geometry
  let geometry;
  switch (searchParams.get("geometry")) {
    case "BoxGeometry":
      geometry = new THREE.BoxGeometry();
      break;
    case "SphereGeometry":
      geometry = new THREE.SphereGeometry();
      break;
    case "TorusKnotGeometry":
      geometry = new THREE.TorusKnotGeometry();
      break;
    default:
      console.error("不明なジオメトリが指定されました");
  }

  // material
  let material;
  switch (searchParams.get("material")) {
    case "MeshNormalMaterial":
      material = new THREE.MeshNormalMaterial();
      break;
    case "MeshBasicMaterial":
      material = new THREE.MeshBasicMaterial();
      break;
    default:
      console.error("不明なマテリアルが指定されました");
  }

  const mesh = new THREE.Mesh(geometry, material);
  // position
  mesh.position.y = searchParams.get("position.y");
  // wireframe
  mesh.material.wireframe = searchParams.get("wireframe") === 'true';
  scene.add(mesh);
}
