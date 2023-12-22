import * as THREE from 'three';

let SIZE = 5;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, SIZE * 4);
camera.position.set(SIZE, SIZE, SIZE);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
function adjustThreeStuff() {
    camera.far = SIZE * 4;
    camera.position.setLength(Math.sqrt(3) * SIZE);
    camera.updateProjectionMatrix();
}

let state: boolean[][][] = [];

function randomizeState() {
    const new_state = [];
    for (let i = 0; i < SIZE; ++i) {
        const a = [];
        for (let j = 0; j < SIZE; ++j) {
            const b = [];
            for (let k = 0; k < SIZE; ++k) {
                b.push(Math.random() < 0.5);
            }
            a.push(b);
        }
        new_state.push(a);
    }
    state = new_state;
}
randomizeState();


function addCube(x: number, y: number, z: number) {
    const HALF_SIZE = SIZE / 2;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x - HALF_SIZE, y - HALF_SIZE, z - HALF_SIZE);
    scene.add(cube);
}


function addCubes() {
    for (let i = 0; i < SIZE; ++i) {
        for (let j = 0; j < SIZE; ++j) {
            for (let k = 0; k < SIZE; ++k) {
                if (state[i][j][k])
                    addCube(i, j, k);
            }
        }
    }
}

function update() {
    SIZE = Math.floor(Math.random() * 20) + 1;
    adjustThreeStuff();
    randomizeState();
    scene.clear();
    addCubes();
    renderer.render(scene, camera);
}

setInterval(update, 1000);

