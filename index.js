import * as THREE from 'three'
import './styles.css'

let cubeSize = 0
let width = 0
let height = 0
let cubeActive = false
let intersects = []

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
document.getElementById('root').appendChild(renderer.domElement)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const geometry = new THREE.BoxBufferGeometry()
const material = new THREE.MeshStandardMaterial({ color: 'orange' })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const ambientLight = new THREE.AmbientLight()
const pointLight = new THREE.PointLight()
pointLight.position.set(10, 10, 10)
scene.add(ambientLight)
scene.add(pointLight)

function resize() {
  width = window.innerWidth
  height = window.innerHeight
  camera.aspect = width / height
  const target = new THREE.Vector3(0, 0, 0)
  const distance = camera.position.distanceTo(target)
  const fov = (camera.fov * Math.PI) / 180
  const viewportHeight = 2 * Math.tan(fov / 2) * distance
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  cubeSize = (viewportHeight * camera.aspect) / 5
  cube.scale.set(...(cubeActive ? [cubeSize * 1.5, cubeSize * 1.5, cubeSize * 1.5] : [cubeSize, cubeSize, cubeSize]))
}

window.addEventListener('resize', resize)
resize()

window.addEventListener('mousemove', e => {
  mouse.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1)
  raycaster.setFromCamera(mouse, camera)
  intersects = raycaster.intersectObjects(scene.children)
  const findCube = intersects.find(hit => hit.object === cube)
  cube.material.color.set(findCube ? 'hotpink' : 'orange')
})

window.addEventListener('click', e => {
  const findCube = intersects.find(hit => hit.object === cube)
  if (findCube) {
    cubeActive = !cubeActive
    cube.scale.set(...(cubeActive ? [cubeSize * 1.5, cubeSize * 1.5, cubeSize * 1.5] : [cubeSize, cubeSize, cubeSize]))
  }
})

function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x = cube.rotation.y += 0.01
  renderer.render(scene, camera)
}

animate()
