import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  SpotLight,
  sRGBEncoding,
  Clock
} from 'three'

import Avatar from './objects/Avatar'
import {
  preloader
} from './loader'
import {
  TextureResolver
} from './loader/resolvers/TextureResolver'
import {
  ImageResolver
} from './loader/resolvers/ImageResolver'
import {
  GLTFResolver
} from './loader/resolvers/GLTFResolver'

/* IMPORTANT
Change the following to match your preferences: */

const ASSET_SETTINGS = {
  avatarPath: 'assets/models/gordonfreeman.glb',
}

// To see available morph targets and animations, view your avatar on: https://gltf-viewer.donmccurdy.com/
const AVATAR_SETTINGS = {
  isTrackCursor: true,
  isAutoAnimated: true,
  isAutoMorphAnimated: true,
  morphTargets: [{
      key: "mouthOpen",
      targetValue: 0.6
    },
    {
      key: "mouthLeft"
    },
    {
      key: "browOuterUpRight"
    },
    {
      key: "eyeBlinkRight",
      targetValue: 1,
      transition: 100,
      duration: 100
    },
    {
      key: "mouthPressRight"
    }
  ],
  defaultAnimation: "idle_eyes"
}

const DOM_SETTINGS = {
  avatarDivID: '3d_avatar', // <- make sure you have a div with this id when deploying
  canvasWidth: 300,
  canvasHeight: 300,
}

const _RENDERER_SETTINGS = {
  alpha: true,
  antialias: true
}

/* Init renderer and canvas */

var container;

/* IMPORTANT */
if (DEVELOPMENT) { // In development, the div will be created automatically
  container = document.createElement("div");
  document.body.appendChild(container);
} else {
  container = document.getElementById(DOM_SETTINGS.avatarDivID); // When deployed, make sure you have a div with corresponding id
}

const renderer = new WebGLRenderer(_RENDERER_SETTINGS);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
renderer.setClearColor(0x000000, 0) // transparent

const clock = new Clock();

container.style.width = DOM_SETTINGS.canvasWidth + "px";
container.style.height = DOM_SETTINGS.canvasHeight + "px";
container.style.margin = "auto"; // Centers the container, could be done differently. 
// Add your preferred style settings here.

container.appendChild(renderer.domElement)

/* Main scene and camera */

const scene = new Scene()

const camera = new PerspectiveCamera(50, DOM_SETTINGS.canvasWidth / DOM_SETTINGS.canvasHeight, 0.1, 1000)
camera.position.y = 0.6;
camera.position.z = 0.5;

/* Lights - (Sorta) Three-Point Lighting */

const ambientLight = new AmbientLight(0x222222);
const backLight = new DirectionalLight(0xffffff);
const fillLight = new DirectionalLight(0xffffff);
const keyLight = new SpotLight(0xffffff);

scene.add(ambientLight);
scene.add(backLight);
scene.add(fillLight);
scene.add(keyLight);

ambientLight.intensity = 5;

backLight.position.set(-4.187, 0.839, -5.601);
backLight.intensity = 4;

fillLight.position.set(2.780, 0.942, 2.727);
fillLight.intensity = 2;

keyLight.position.set(-2.268, 2.076, 5);
keyLight.intensity = 12;
// keyLight.angle = 0.314;

/* Various event listeners */
window.addEventListener('resize', onResize)

/* Preloader */
preloader.init(new ImageResolver(), new GLTFResolver(), new TextureResolver())
preloader.load([{
  id: 'avatar',
  type: 'gltf',
  url: ASSET_SETTINGS.avatarPath
}]).then(() => {

  onResize()
  animate()

  const avatar = new Avatar(renderer, AVATAR_SETTINGS);
  scene.add(avatar);

  backLight.target = avatar.headMesh;
  keyLight.target = avatar.headMesh;
  fillLight.target = avatar.headMesh;
})

/**
  Resize canvas
*/
function onResize() {
  camera.aspect = DOM_SETTINGS.canvasWidth / DOM_SETTINGS.canvasHeight
  camera.updateProjectionMatrix()
  renderer.setSize(DOM_SETTINGS.canvasWidth, DOM_SETTINGS.canvasHeight)
}

/**
  RAF
*/
function animate() {
  window.requestAnimationFrame(animate)
  render()
}

/**
  Render loop
*/
function render() {
  renderer.clear()
  renderer.render(scene, camera)

  const delta = clock.getDelta();
  scene.traverse(function (element) {
    if (element.update != null) {
      element.update(scene, camera, renderer, delta);
    }
  })
}