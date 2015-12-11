// Creates an asteroid with specified size (radius) and speed
// Shape is chosen randomly from several geometries.
function addAsteroid(size, speed, rare) {
    var materials = [

        new THREE.MeshLambertMaterial({color: Math.random() * 0xeeeeee, shading: THREE.FlatShading}),
        new THREE.MeshBasicMaterial( { color: 0xf0f0f0, envMap: scene.textureCube, shading: THREE.FlatShading } )

    ];

    // Get random geometry and create mesh
    var mesh;
    var rareProb = .03;
    if (debug_mode) { rare *= 2; } // Makes reflective asteroids twice as likely in deubg mode
    var types = 5; // Number of asteroid geometries including the special rare one
    var type = Math.floor(Math.random()*types*(1+rareProb));  // Once in a great while, make a reflective one! (TYPE 5)

    if (rare) { type = 5; } // Allows manually spawning rate asteroids

    switch (type) {
    case 0:
        mesh = new Physijs.ConvexMesh( new THREE.IcosahedronGeometry(size), materials[0]);
    break;
    case 1:
        mesh = new Physijs.ConvexMesh(new THREE.TetrahedronGeometry(size, 1), materials[0]);
    break;
    case 2:
        mesh = new Physijs.ConvexMesh(new THREE.DodecahedronGeometry(size, 0), materials[0]);
    break;
    case 3:
        mesh = new Physijs.ConvexMesh(new THREE.SphereGeometry(size, 7, 5), materials[0]);
    break;
    case 4:
        mesh = new Physijs.ConvexMesh(new THREE.SphereGeometry(size, 6, 4), materials[0]);
    break;
    case 5:
        size = 10;
        speed = 7;
        mesh = new Physijs.ConvexMesh( new THREE.IcosahedronGeometry(size), materials[1]);
        console.log("Created a reflective asteroid");
    break;
    default:
        console.warn("Hit default case in asteroid creation. This is not expected.");
        mesh = new Physijs.ConvexMesh(new THREE.DodecahedronGeometry(size, 0), materials[0]);
    }




    mesh.traverse(function (e) {
        e.castShadow = true
    });

    // Get a random position for the asteroid and send it moving towards the board
    var quadrant = Math.floor(Math.random() * 4);
    // Starting random position, to be placed in a quadrant
    var start = getBoardPoint();
    // Heading toward this position
    var target;
    if (type == 5) {
        target = new THREE.Vector3(0,0,0);
    } else {
        target = getBoardPoint();
    }

    switch (quadrant) {
    case 0: // Left of the board
        start.x = Math.abs(start.x) - boardWidth*1.1;
    break;
    case 1: // Far side of board
        start.z = -Math.abs(start.z) + boardHeight*1.1;
    break;
    case 2: // Right side of board
        start.x = -Math.abs(start.x) + boardWidth*1.1;
    break;
    case 3: // Near side of board
        start.z = Math.abs(start.z) - boardHeight*1.1;
    break;
    }

    // Pick a random starting altitude, biased towards low angles
    var altRoll = Math.random();
    if (altRoll < .6) {
        start.y = (asterStAlt / 3) * altRoll;

    } else if (altRoll < .9) {
        start.y = asterStAlt * (1/3 + altRoll/3);
    } else {
        start.y = asterStAlt * (2/3 + altRoll/3);
    }

    // Set the direction, speed
    target.sub(start);
    target.normalize();
    target.multiplyScalar(speed);

    mesh.position.copy(start);

    mesh.name = "Asteroid";

    scene.add(mesh);
    if (type == 5) {
        mesh.setAngularVelocity(new THREE.Vector3(Math.random(), Math.random(), Math.random()));
    } else {
        mesh.setAngularVelocity(new THREE.Vector3(Math.random()*5, Math.random()*5, Math.random()*5));
    }
    mesh.setLinearVelocity(target);
}

// Periodically remove asteroids that are far away to free resources
function cleanupAsteroids() {
    var child;
    for (child of scene.children) {
        if (child.name == "Asteroid" && child.position.length() > 1000) {
            scene.remove(child);
        }
    }
}

// Create the game board (plane) and return
function createBoard() {

    var mat = new THREE.MeshLambertMaterial({color: 0xffffff});

    // create the ground plane
    var numW = 5; // size of each box
    var numH = 5; // size of each box
    var planeW =boardWidth / numW; // number of boxes (wireframe)
    var planeH = boardHeight / numH; // number of boxes (wireframe)

    mat.transparent = true;
    mat.opacity = 0.8;

    var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( planeW*numW, planeH*numH, planeW, planeH ),
        mat
    );
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,0,0);

    plane.name = "Board";

    return plane;
}
