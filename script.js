import * as THREE from 'three';
import { bleach } from 'three/examples/jsm/tsl/display/BleachBypass.js';

// =====================================
// SCENE
// =====================================

const scene = new THREE.Scene();

// =====================================
// CAMERA
// =====================================

const camera = new THREE.OrthographicCamera(
    window.innerWidth / -80,
    window.innerWidth / 80,
    window.innerHeight / 80,
    window.innerHeight / -80,
    0.1,
    1000
);

camera.position.z = 10;

// =====================================
// RENDERER
// =====================================

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

document.body.appendChild(
    renderer.domElement
);

// =====================================
// LOADER
// =====================================

const loader =
new THREE.TextureLoader();

// =====================================
// BACKGROUND
// =====================================

const bgTexture =
loader.load(
    '/assets/textures/background.jpg'
);

bgTexture.colorSpace =
THREE.SRGBColorSpace;

bgTexture.wrapS =
THREE.ClampToEdgeWrapping;

bgTexture.wrapT =
THREE.ClampToEdgeWrapping;

// VERY SMALL BACKGROUND

scene.background =
bgTexture;

// =====================================
// LIGHT
// =====================================

const ambientLight =
new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(
    ambientLight
);

// =====================================
// ROAD
// =====================================

const groundGeometry =
new THREE.PlaneGeometry(
    200,
    2
);

const groundMaterial =
new THREE.MeshBasicMaterial({
    color:0x8b2e1a
});

const ground =
new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.position.y = -7.5;

scene.add(
    ground
);

// =====================================
// PLAYER
// =====================================

const horseTexture =
loader.load(
    '/assets/models/horse.png'
);

horseTexture.colorSpace =
THREE.SRGBColorSpace;

const horseMaterial =
new THREE.MeshBasicMaterial({
    map:horseTexture,
    transparent:true
});

const horseGeometry =
new THREE.PlaneGeometry(
    4,
    4
);

const player =
new THREE.Mesh(
    horseGeometry,
    horseMaterial
);

player.position.set(
    -12,
    -5,
    1
);

scene.add(
    player
);

// =====================================
// VARIABLES
// =====================================

let gameStarted = false;

let score = 0;

let speed = 0.45;

let jumping = false;

let velocityY = 0;

const gravity = 0.025;

const obstacles = [];

const eagles = [];

// =====================================
// SCORE
// =====================================

const scoreBox =
document.getElementById(
    "scoreBox"
);

// =====================================
// HIGH SCORE
// =====================================

let highScore =
localStorage.getItem(
    "kingHighScore"
) || 0;

document.getElementById(
    "highScore"
).innerText = highScore;

// =====================================
// PLAY BUTTON
// =====================================

document.getElementById(
    "playBtn"
).addEventListener(
    "click",
    ()=>{

        document.getElementById(
            "menu"
        ).style.display = "none";

        gameStarted = true;

    }
);

// =====================================
// CONTROLS
// =====================================

window.addEventListener(
    "keydown",
    (e)=>{

        if(
            e.code === "Space"
            &&
            !jumping
        ){

            velocityY = 0.55;

            jumping = true;

        }

    }
);

// MOBILE TOUCH

window.addEventListener(
    "touchstart",
    ()=>{

        if(!jumping){

            velocityY = 0.55;

            jumping = true;

        }

    }
);

// =====================================
// CREATE SOLDIER
// =====================================

function createObstacle(){

    const soldierTexture =
    loader.load(
        '/assets/models/soldier.png'
    );

    soldierTexture.colorSpace =
    THREE.SRGBColorSpace;

    const soldierMaterial =
    new THREE.MeshBasicMaterial({
        map:soldierTexture,
        transparent:true
    });

    const soldierGeometry =
    new THREE.PlaneGeometry(
        2,
        2.5
    );

    const soldier =
    new THREE.Mesh(
        soldierGeometry,
        soldierMaterial
    );

    soldier.position.set(
        30,
        -5.3,
        1
    );

    scene.add(
        soldier
    );

    obstacles.push(
        soldier
    );

}

// =====================================
// CREATE EAGLE
// =====================================

function createEagle(){

    const eagleTexture =
    loader.load(
        '/assets/models/eagle.png'
    );

    eagleTexture.colorSpace =
    THREE.SRGBColorSpace;

    const eagleMaterial =
    new THREE.MeshBasicMaterial({
        map:eagleTexture,
        transparent:true
    });

    const eagleGeometry =
    new THREE.PlaneGeometry(
        2.5,
        1.5
    );

    const eagle =
    new THREE.Mesh(
        eagleGeometry,
        eagleMaterial
    );

    eagle.position.set(
        30,
        -1,
        1
    );

    scene.add(
        eagle
    );

    eagles.push(
        eagle
    );

}

// =====================================
// SPAWN SOLDIERS
// =====================================

setInterval(()=>{

    if(gameStarted){

        createObstacle();

    }

},2200);

// =====================================
// SPAWN EAGLES
// =====================================

setInterval(()=>{

    if(
        gameStarted
        &&
        score > 8
    ){

        createEagle();

    }

},5000);

// =====================================
// GAME OVER
// =====================================

function gameOver(){

    gameStarted = false;

    document.getElementById(
        "gameOver"
    ).style.display = "flex";

    if(score > highScore){

        localStorage.setItem(
            "kingHighScore",
            score
        );

    }

}

// =====================================
// ANIMATION LOOP
// =====================================

function animate(){

    requestAnimationFrame(
        animate
    );

    if(gameStarted){

        // PLAYER JUMP

        player.position.y += velocityY;

        velocityY -= gravity;

        if(player.position.y <= -5){

            player.position.y = -5;

            jumping = false;

        }

        // MOVE SOLDIERS

        obstacles.forEach(
            (obs,index)=>{

                obs.position.x -= speed;

                // COLLISION

                if(

                    obs.position.x <
                    player.position.x + 1.2

                    &&

                    obs.position.x >
                    player.position.x - 1.2

                    &&

                    player.position.y < -3.8

                ){

                    gameOver();

                }

                // REMOVE

                if(obs.position.x < -30){

                    scene.remove(
                        obs
                    );

                    obstacles.splice(
                        index,
                        1
                    );

                    score++;

                    speed += 0.01;

                }

            }
        );

        // MOVE EAGLES

        eagles.forEach(
            (eagle,index)=>{

                eagle.position.x -=
                speed + 0.15;

                // COLLISION

                if(

                    eagle.position.x <
                    player.position.x + 1.2

                    &&

                    eagle.position.x >
                    player.position.x - 1.2

                    &&

                    player.position.y > -3

                ){

                    gameOver();

                }

                // REMOVE

                if(eagle.position.x < -30){

                    scene.remove(
                        eagle
                    );

                    eagles.splice(
                        index,
                        1
                    );

                }

            }
        );

        // SCORE

        scoreBox.innerHTML =
        "Score : " + score;

    }

    renderer.render(
        scene,
        camera
    );

}

animate();

// =====================================
// RESIZE
// =====================================

window.addEventListener(
    "resize",
    ()=>{

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);