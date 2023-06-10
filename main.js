import './style.css'
import * as THREE from 'three'
// OrbitControls are only needed for setting up the scene
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Setup

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)
camera.position.setX(-3)

renderer.render(scene, camera)

// Torus geometry

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({ color: 0x004680 })
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

// Lights

// PointLight is a light that gets emitted from a single point in all directions
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5, 5, 5)

// AmbientLight is a light that "covers" the whole scene
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

// Helpers - used only for setting up the scene

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// Adding star geometries to the background - randFloatSpread() returns a random number between -100 and 100 (in this case, 3 times, to set a random position for each star)
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add(star)
}

// This is a trick for running a function a certain number of times. In this case, generating a certain number of stars
Array(400).fill().forEach(addStar)

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture

// Avatar geometry

const nimrodTexture = new THREE.TextureLoader().load('nimrod.jpg')

const nimrod = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: nimrodTexture })
)

scene.add(nimrod)

// Moon geometry
// The "normal map" is added to give the illusion of depth to a flat surface, by making the light react to the texture

const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
)

scene.add(moon)

moon.position.z = 30
moon.position.setX(-10)

nimrod.position.z = -5
nimrod.position.x = 2

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top
  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05

  nimrod.rotation.y += 0.01
  nimrod.rotation.z += 0.01

  camera.position.z = t * -0.01
  camera.position.x = t * -0.0002
  camera.rotation.y = t * -0.0002
}

document.body.onscroll = moveCamera
moveCamera()

// Animation Loop

function animate() {
  requestAnimationFrame(animate)

  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01

  moon.rotation.x += 0.005

  // controls.update();

  renderer.render(scene, camera)
}

animate()
