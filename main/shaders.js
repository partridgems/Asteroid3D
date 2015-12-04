/*
 * shaders contains all shader code for the final part of the assignment
 * Author: Mike Partridge
 */

// *************************************************************************
// Skybox
// With help from: http://learningthreejs.com/blog/2011/08/15/lets-do-a-sky/
// And textures from http://scmapdb.com/skybox:space,
// http://en.spaceengine.org/forum/21-514-1
// *************************************************************************
var textureCube;
function addSkyBox() {
    /* Skybox image files:
     *   2
     * 1 4 5 6
     *   3
     */
    var pfx = "media/planet-skybox/sky_";
    var ext = ".jpg"
    var urls = [ pfx + "pos_x" + ext, pfx + "neg_x" + ext,
        pfx + "pos_y" + ext, pfx + "neg_y" + ext,
        pfx + "neg_z" + ext, pfx + "pos_z" + ext ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );

    /* Load the shader for the sky box */
    var shader = THREE.ShaderLib["cube"];
    shader.uniforms['tCube'].value = textureCube;
    var material = new THREE.ShaderMaterial({
        fragmentShader    : shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms  : shader.uniforms,
        depthWrite: false,
		side: THREE.BackSide
    });

    // build the skybox Mesh
    skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000), material );
    // add it to the scene
    scene.add( skyboxMesh );
    scene.textureCube = textureCube;
}

// Create the game board (plane) and return
function createBoard() {

    // Custom shader setup
    // uniforms = THREE.UniformsUtils.merge( [
    //
    //     THREE.UniformsLib[ "common" ],
    //     THREE.UniformsLib[ "shadowmap" ],
    //     THREE.UniformsLib[ "lights" ],
    // {
    //     ambient: { type: "c", value: new THREE.Color(0x121212) },
    //     diffuse: { type: "c", value: new THREE.Color(0xffffff) },
    //     gtime: { type: "f", value: 0.0},
    //     wavePos: { type: "2f", value: new THREE.Vector3(0.0, 0.0) },
    //     wavet: { type: "f", value: 200.0},
    //     waveColor: { type: "c", value: new THREE.Color(0xffaa00) },
    //     waveHeight: { type: "f", value: 20.0 },
    //     transparency: { type: "f", value: 0.8}, // Usually 0.8
    //     lightPosition: { type: "3f", value: new THREE.Vector3(0.0, 0.0, 0.0) }
    //
    // }] );

    var mat = new THREE.MeshLambertMaterial({color: 0xffffff});

    // var mat = new THREE.ShaderMaterial(
    //     {
    //       uniforms : uniforms,
    //       vertexShader : vertexShaderText,
    //       fragmentShader : fragmentShaderText,
    //     });

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


/*
 * Fireball effect
 * Source: https://www.clicktorelease.com/code/perlin/explosion.html
 * Uses custom shader with temperature map texture and perlin noise (random distortion)
 * to create the effect of a burning fireball
*/
function getFireball() {
    var material = new THREE.ShaderMaterial( {

        uniforms: scene.uniforms,
        vertexShader: vertexShaderText,
        fragmentShader: fragmentShaderText

    } );

    var mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 10, 5 ), material );
    mesh.scale.set(0.01, 0.01, 0.01);
    return mesh;
}

function loadUniforms() {
    return {
        tExplosion: { type: "t", value: THREE.ImageUtils.loadTexture( 'media/explosion.png' ) },
        time: { type: "f", value: 0.0 },
        weight: { type: "f", value: 8.0 },
        size: { type: "f", value: 0.1 }
    }
}

// Load shader code and then call init to load the game
// This pattern synchronizes loading the shader code before proceeding to avoid race conditions
function getPlaneVShader() {
    vertexShaderText = "";
    // $.get( "main/vertex.shader", function( data ) {
    $.get( "main/fireballVertex.shader", function( data ) {
        vertexShaderText = data;
        getPlaneFShader();
    })
}
function getPlaneFShader() {
    fragmentShaderText = "";
    // $.get( "main/fragment.shader", function( data ) {
    $.get( "main/fireballFragment.shader", function( data ) {
        fragmentShaderText = data;
        init();
    })

}
