import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

let SIZE = 30;
// function setSize(newSize: number) {
//     SIZE = newSize;
//     adjustThreeStuff();
// }

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, SIZE * 4);
camera.position.set(SIZE, SIZE, SIZE);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const d1 = new THREE.DirectionalLight(0xFF0000, 2);
d1.position.set(SIZE, SIZE, 0);
d1.lookAt(0, 0, 0);
scene.add(d1);

const d2 = new THREE.DirectionalLight(0x00FF00, 2);
d2.position.set(0, SIZE, SIZE);
d2.lookAt(0, 0, 0);
scene.add(d2);

const d3 = new THREE.DirectionalLight(0x0000FF, 2);
d3.position.set(SIZE, 0, SIZE);
d3.lookAt(0, 0, 0);
scene.add(d3);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.rotateSpeed = 5;

// function adjustThreeStuff() {
//     camera.far = SIZE * 4;
//     camera.position.setLength(Math.sqrt(3) * SIZE);
//     camera.updateProjectionMatrix();
// }

let state = new Uint8Array(SIZE * SIZE * SIZE)
function get(arr: Uint8Array, i: number, j: number, k: number) {
    return arr[i * SIZE * SIZE + j * SIZE + k];
}
function set(arr: Uint8Array, i: number, j: number, k: number, val: number) {
    arr[i * SIZE * SIZE + j * SIZE + k] = val;
}
for (let i = 0; i < SIZE * SIZE * SIZE; ++i) {
    state[i] = Math.random() < 0.3 ? 1 : 0;
}

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

let cubes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial, THREE.Object3DEventMap>[] = []
function addCubes() {
    for (let i = 0; i < SIZE; ++i) {
        for (let j = 0; j < SIZE; ++j) {
            for (let k = 0; k < SIZE; ++k) {
                if (get(state, i, j, k)) {
                    const HALF_SIZE = SIZE / 2;
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(i - HALF_SIZE, j - HALF_SIZE, k - HALF_SIZE);
                    cubes.push(cube);
                    scene.add(cube);
                }
            }
        }
    }
}

function repaint() {
    for (const cube of cubes) {
        scene.remove(cube);
    }
    addCubes();
}

function step() {
    let newState = new Uint8Array(SIZE * SIZE * SIZE);
    for (let i = 0; i < SIZE; ++i) {
        for (let j = 0; j < SIZE; ++j) {
            for (let k = 0; k < SIZE; ++k) {

                let count = 0;
                for (let x = Math.max(0, i - 1); x <= Math.min(SIZE - 1, i + 1); ++x) {
                    for (let y = Math.max(0, j - 1); y <= Math.min(SIZE - 1, j + 1); ++y) {
                        for (let z = Math.max(0, k - 1); z <= Math.min(SIZE - 1, k + 1); ++z) {
                            if (get(state, x, y, z)) count += 1;
                        }
                    }
                }

                let val = get(state, i, j, k);
                if (val && !(count == 5 || count == 6 || count == 7)) val = 0;
                else if (!val && count == 6) val = 1;

                set(newState, i, j, k, val);
            }
        }
    }
    return newState;
}

function update() {
    // setSize(Math.floor(Math.random() * 20) + 1);
    repaint();
    state = step();
}

let lastTime = 0;
function animate(time: number) {
    if (time - lastTime > 100) {
        lastTime = time;
        update();
    }
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate)

