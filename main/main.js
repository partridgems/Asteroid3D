// Tuning Constants
var engineThrust = 30;
var brakingThrust = 30;
var rotationSpeed = .1;
var boardWidth = 120;
var boardHeight = 80;
var zoomout = 1.2; // Default 1.2
var avatarHeight = 3;
var maxSpeed = 80;
var startDifficulty = 1;
var followDistance = 100; // Max distance between camera and crashed ship
var asterStAlt = 150; // Asteroid max starting altitude
var soundDefault = 0; // Starting sound condition. 0: Off 1: On
var controlWidth = 200; // Width of control divs

debug_mode = true; // Allows additional keyboard controls for development

// Physijs setup
Physijs.scripts.worker = './libs/physijs_worker.js';
Physijs.scripts.ammo = './ammo.js';

// Globals
var stats, display, gameOver, paused, camControl, camera;

// init is run once per session
// render allocation and other per session operations are run
// per game operations are done in newGame() to allow restarting the game
function init() {
    stats = initStats(); // Contains FPS information
    display = initDisplay(); // Contains current level
    gameOver = initGameOver(); // Plays game over message
    paused = initPaused(); // Shown when paused
    camControl = initCamControl(); // Unlocks the camera for viewing the sky

    // create a render and set the size
    renderer = new THREE.WebGLRenderer(/*{ alpha: true }*/);
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.zIndex = '-1'; // Places the animation behind all other displays

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    createEventListeners();

    newGame();

    // Background sound!
    bgmusic = getBgSound();
    scene.add( bgmusic );

    soundControl = initSoundControl( bgmusic );

    render();

    function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }

    function initDisplay() {

        var display = new Display();

        // Align top center
        display.domElement.style.position = 'absolute';
        display.domElement.style.left = (window.innerWidth/2 - display.w/2).toString()+'px';
        display.domElement.style.top = '0px';

        document.getElementById('Display').appendChild(display.domElement);

        return display;
    }

    function initGameOver() {

        var gameOver = new GameOver();

        // Align just above center middle
        gameOver.domElement.style.position = 'absolute';
        gameOver.domElement.style.left = (window.innerWidth/2 - gameOver.w/2).toString()+'px';
        gameOver.domElement.style.top = window.innerHeight/2 - 132 + 'px';
        gameOver.domElement.style.visibility = 'hidden';

        document.getElementById('GameOver').appendChild(gameOver.domElement);

        return gameOver;
    }

    function initPaused() {

        var paused = new Paused();

        // Align top-left (covers screen)
        paused.domElement.style.position = 'absolute';
        paused.domElement.style.left = '0px';
        paused.domElement.style.top = '0px';
        paused.domElement.style.visibility = 'hidden';

        document.getElementById('Paused').appendChild(paused.domElement);

        return paused;
    }

    function initSoundControl( soundObj ) {

        var soundControl = new SoundControl( soundObj );

        soundControl.setMode(soundDefault + 2); // 1: play, 0: stop, +2 for init

        // Align top-right
        soundControl.domElement.style.position = 'absolute';
        soundControl.domElement.style.left =  window.innerWidth - controlWidth + 'px';
        soundControl.domElement.style.top = '0px';

        document.getElementById("SoundControl").appendChild(soundControl.domElement);

        return soundControl;
    }

    function initCamControl() {

        var camControl = new CameraControl();

        camControl.setMode();

        // Align top-right
        camControl.domElement.style.position = 'absolute';
        camControl.domElement.style.left =  window.innerWidth - controlWidth + 'px';
        camControl.domElement.style.top = '44px';

        document.getElementById("CameraControl").appendChild(camControl.domElement);

        return camControl;
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        display.domElement.style.left = (window.innerWidth/2 - display.w/2).toString()+'px';
        gameOver.domElement.style.left = (window.innerWidth/2 - gameOver.w/2).toString()+'px';
        gameOver.domElement.style.top = window.innerHeight/2 - 132 + 'px';
        soundControl.domElement.style.left =  window.innerWidth - controlWidth + 'px';
        camControl.domElement.style.left =  window.innerWidth - controlWidth + 'px';

    }
}

// once everything is loaded, we run our Three.js stuff.
// This function handles all initializations that are redone for every new game
// It can be safely called numerous times and freed resources will be gc'd
function newGame() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new Physijs.Scene();

    scene.paused = false;

    // SPACE!!
    scene.setGravity(new THREE.Vector3(0, 0, 0));
    addSkyBox();

    // create a camera looking from above and to the right, slightly rotated
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 12000);
    camera.position.x = -8*zoomout;
    camera.position.y = 80*zoomout;
    camera.position.z = 60*zoomout;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add the board (plane) to the scene
    var board = createBoard();
    scene.add(board);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x121212);
    ambientLight.name = "AmbLight";
    scene.add(ambientLight);

    // add spotlight for the shadows with a large shadow camera
    var light = new THREE.SpotLight(0xffffff);
    var backoff = 1.5;
    light.position.set(-17*backoff, 72*backoff, 45*backoff);
    light.exponent = 25;
    light.castShadow = true;
    light.shadowCameraFov = 70;
    light.shadowCameraNear = 25;
    light.shadowCameraFar = 600;
    light.name = "Light";
    scene.add(light);

    // Add the avatar (ship)
    avatar = getAvatar();
    scene.add(avatar);

    difficulty = startDifficulty;
    clock = new THREE.Clock(false);
    clock.start();

    // Starting asteroids to get the game rolling
    addAsteroid(4, 9);
    addAsteroid(6, 7);
    addAsteroid(8, 5);

    // Necessary to reset displays on game restarts
    display.reset();
    gameOver.reset();
}

function render() {
    stats.update();

    // Add an asteroid every 5 seconds and cleanup existing asteroids
    var time = clock.getElapsedTime();
    if (time % 5 < 1 / 59 ) {
        addAsteroid(Math.random() * 6 + 2,
            Math.random()*(5+difficulty) + 4*difficulty + 3);

        cleanupAsteroids();
    }

    // Add a shield powerup every 30 seconds
    if (time > 1 && time % 30 < 1/60 ) {
        addShieldPowerup();
    }

    if ( clock.running ) {
        // Add additional asteroids every 10 seconds/difficulty on average
        if (Math.random() < difficulty/10/60) {
            addAsteroid(Math.random() * 6 + 2,
                Math.random()*(5+difficulty) + 2*difficulty + 3);
        }
    }

    // Check for crash--
    // update avatar's position/speed unless we crashed
    // update level every 10 seconds unless we crashed
    if ( !avatar.crashed() ) {
        // Up difficulty every 10 seconds
        if (time > difficulty*10 ) {
            display.update(++difficulty);
        }

        if (!scene.paused) {
            updateAvatar();
        }

        if (camControl.getMode()) {
            camera.lookAt(avatar.position);
        }
    } else { // We've crashed!
        clock.stop();
        gameOver.update();

        // Fade out the music
        bgmusic.setVolume( bgmusic.getVolume() * 0.99 );

        camera.lookAt(avatar.position);
        // Keeps the camera within followDistance of the crashed ship
        if (camera.position.distanceTo(avatar.position) > followDistance) {
            camera.position.add(avatar.position.clone().sub(camera.position)
            .setLength(camera.position.distanceTo(avatar.position) - followDistance));
        }
    }

    // Simulate one step of physics per scene
    if (!scene.paused) {
        scene.simulate( undefined, 1 );
    }

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// Gets a random point on the board at y=0
function getBoardPoint() {
    return new THREE.Vector3(boardWidth/2 - Math.random() * boardWidth, 0,
        boardHeight/2 - Math.random() * boardHeight);
}

window.onload = init
