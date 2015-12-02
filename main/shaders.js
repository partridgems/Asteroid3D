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
function addSkyBox() {
    /* Skybox image files:
     *   2
     * 1 4 5 6
     *   3
     */
    var pfx = "media/planet-skybox/sky_";
    var ext = ".jpg"
    var urls = [ pfx + "neg_x" + ext, pfx + "pos_x" + ext,
        pfx + "pos_y" + ext, pfx + "neg_y" + ext,
        pfx + "pos_z" + ext, pfx + "neg_z" + ext ];
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
}
