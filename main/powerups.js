function addShieldPowerup() {

    pMat = new THREE.MeshBasicMaterial({color: 0xffaa00, wireframe: true});
    spUp = new Physijs.SphereMesh(new THREE.SphereGeometry(3, 10, 10), pMat);
    spUp.position.copy(getBoardPoint());
    spUp.position.y = avatarHeight;
    spUp.name = "ShieldPowerup";

    scene.add(spUp);
    spUp.setAngularVelocity(new THREE.Vector3(0, 1, 0));
}
