import * as THREE from 'three';

let SIZE = 20;
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
// function adjustThreeStuff() {
//     camera.far = SIZE * 4;
//     camera.position.setLength(Math.sqrt(3) * SIZE);
//     camera.updateProjectionMatrix();
// }

let state: boolean[][][] = Array(SIZE)
    .fill(0)
    .map(_ => Array(SIZE)
        .fill(0)
        .map(_ => Array(SIZE)
            .fill(0)
            .map(_ => Math.random() < 0.3)
        )
    );

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
function addCube(x: number, y: number, z: number) {
    const HALF_SIZE = SIZE / 2;
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

function repaint() {
    scene.clear();
    addCubes();
}

function step() {
    const newState = Array(SIZE)
        .fill(0)
        .map(_ => Array(SIZE)
            .fill(0)
            .map(_ => Array(SIZE)
                .fill(0)
                .map(_ => false)
            )
        );
    for (let i = 0; i < SIZE; ++i) {
        for (let j = 0; j < SIZE; ++j) {
            for (let k = 0; k < SIZE; ++k) {
                let now = state[i][j][k];

                let count = 0;
                for (let x = Math.max(0, i - 1); x <= Math.min(SIZE - 1, i + 1); ++x) {
                    for (let y = Math.max(0, j - 1); y <= Math.min(SIZE - 1, j + 1); ++y) {
                        for (let z = Math.max(0, k - 1); z <= Math.min(SIZE - 1, k + 1); ++z) {
                            if (state[x][y][z]) count += 1;
                        }
                    }
                }

                if (now && !(count == 5 || count == 6 || count == 7)) now = false;
                else if (!now && count == 6) now = true;

                newState[i][j][k] = now;
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
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate)

