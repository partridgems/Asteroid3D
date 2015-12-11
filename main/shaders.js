/*
 * shaders contains shader code for the final part of the assignment
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

/*
 * Fireball effect
 * Source: https://www.clicktorelease.com/code/perlin/explosion.html
 * Uses custom shader with temperature map texture and perlin noise (random distortion)
 * to create the effect of a burning fireball
*/
function getFireball() {
    var material = new THREE.ShaderMaterial( {

        uniforms: scene.uniforms,
        vertexShader: vertexFBShaderText,
        fragmentShader: fragmentFBShaderText

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
        size: { type: "f", value: 0.1 },
		gtime: {type: "f", value: 0.0},
        ambient: { type: "c", value: new THREE.Color(0x62cbff) },
		diffuse: { type: "c", value: new THREE.Color(0x62cbff) },
		specular: { type: "c", value: new THREE.Color(0x62cbff) },
		shininess: {type:"f",value:40.0},
        lightLocation: { type:"3f", value: new THREE.Vector3(0,0,0) }
    }
}

// Load shader code and then call init to load the game
// This pattern synchronizes loading the shader code before proceeding to avoid race conditions
function getFireVShader() {
    vertexFBShaderText = "";
    $.get( "main/fireballVertex.shader", function( data ) {
        vertexFBShaderText = data;
        getFireFShader();
    })
}
function getFireFShader() {
    fragmentFBShaderText = "";
    $.get( "main/fireballFragment.shader", function( data ) {
        fragmentFBShaderText = data;
        getShieldVShader();
    })
}
function getShieldVShader() {
    vertexSHShaderText = "";
    $.get( "main/vertex.shader", function( data ) {
        vertexSHShaderText = data;
        getShieldFShader();
    })
}
function getShieldFShader() {
    fragmentSHShaderText = "";
    $.get( "main/fragment.shader", function( data ) {
        fragmentSHShaderText = data;
        init();
    })
}
