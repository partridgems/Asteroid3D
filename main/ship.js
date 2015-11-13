// Create the ship and return
function getAvatar() {
    var points = [
        new THREE.Vector3(0, 0, 5),
        new THREE.Vector3(2, 0, 0),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(0, -.5, 1),
        new THREE.Vector3(0, -.5, 2),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 1, 2)
    ];
    var avatarGeometry = new THREE.ConvexGeometry(points);
    // Move the ship's center so that it rotates as expected
    avatarGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -1.8) );

    var material = new THREE.MeshPhongMaterial({color: 0xffff40});
    material.emissive = new THREE.Color(0x001005);
    material.specular = new THREE.Color(0xeeee00);
    material.shininess = 100;
    material.metal = true;
    material.shading = THREE.FlatShading;

    var avatar = new Physijs.ConvexMesh(avatarGeometry, material);
    avatar.traverse(function (e) {
        e.castShadow = true
    });
    avatar.name="Ship";
    avatar.position.y = avatarHeight;

    // Add a wireframe
    var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000dd, wireframe: true, transparent: true } );
    avatar.add(new Physijs.ConvexMesh(avatarGeometry, wireframeMaterial));

    // Add collision listener
    avatar.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        if ( other_object.name == 'Asteroid' ) {
            avatar.isCrashed = true;
        }
    });

    //Initialize movement parameters
    avatar.turningLeft = false;
    avatar.turningRight = false;
    avatar.wasTurningL = false;
    avatar.wasTurningR = false;
    avatar.thrusting = false;
    avatar.braking = false;
    avatar.wasThrust = false;
    avatar.wasBrake = false;
    avatar.isCrashed = false;

    avatar.turnL = function() {
        if (avatar.turningRight) {
            avatar.wasTurningR = true;
            avatar.turningRight = false;
        }
        avatar.turningLeft = true;
    }
    avatar.turnR = function() {
        if (avatar.turningLeft) {
            avatar.wasTurningL = true;
            avatar.turningLeft = false;
        }
        avatar.turningRight = true;
    }
    avatar.stopTurning = function() {
        avatar.turningLeft = false;
        avatar.turningRight = false;
        if (avatar.wasTurningL) {
            avatar.wasTurningL = false;
            avatar.turningLeft = true;
        }
        if (avatar.wasTurningR) {
            avatar.wasTurningR = false;
            avatar.turningRight = true;
        }
    }
    avatar.thrust = function() {
        if (avatar.braking) {
            avatar.wasBrake = true;
            avatar.braking = false;
        }
        avatar.thrusting = true;
    }
    avatar.brake = function() {
        if (avatar.thrusting) {
            avatar.wasThrust = true;
            avatar.thrusting = false;
        }
        avatar.braking = true;
    }
    avatar.nothrust = function() {
        avatar.thrusting = false;
        avatar.braking = false;
        if (avatar.wasThrust) {
            avatar.wasThrust = false;
            avatar.thrusting = true;
        }
        if (avatar.wasBrake) {
            avatar.wasBrake = false;
            avatar.braking = true;
        }
    }
    avatar.crashed = function() {
        return avatar.isCrashed;
    }

    return avatar;
}

function updateAvatar() {
    // Update avatar from its state
    if (avatar.turningLeft) {
        avatar.rotateY(rotationSpeed);
        avatar.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        avatar.__dirtyRotation = true;
        avatar.__dirtyPosition = true;
    } else if (avatar.turningRight) {
        avatar.rotateY(-rotationSpeed);
        avatar.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        avatar.__dirtyRotation = true;
        avatar.__dirtyPosition = true;
    }
    if (avatar.thrusting) {
        var rotation = new THREE.Matrix4().extractRotation(avatar.matrix);
        var force = new THREE.Vector3(0, 0, engineThrust).applyMatrix4(rotation);
        avatar.applyCentralImpulse(force);
    } else if (avatar.braking) {
        avatar.setLinearVelocity(avatar.getLinearVelocity().multiplyScalar(1 - brakingThrust/500));
    }

    // Cap max speed
    if (avatar.getLinearVelocity().length() > maxSpeed*1.05) {
        avatar.setLinearVelocity(avatar.getLinearVelocity().normalize().multiplyScalar(maxSpeed));
    }


    // If the avatar flies off the edge, wrap it around
    if (avatar.position.x < -boardWidth/2 && avatar.getLinearVelocity().x < 0) {
        avatar.position.x += boardWidth;
        avatar.__dirtyPosition = true;
    } else if (avatar.position.x > boardWidth/2 && avatar.getLinearVelocity().x > 0) {
        avatar.position.x -= boardWidth;
        avatar.__dirtyPosition = true;
    } else if (avatar.position.z < -boardHeight/2 && avatar.getLinearVelocity().z < 0) {
        avatar.position.z += boardHeight;
        avatar.__dirtyPosition = true;
    } else if (avatar.position.z > boardHeight/2 && avatar.getLinearVelocity().z > 0) {
        avatar.position.z -= boardHeight;
        avatar.__dirtyPosition = true;
    }
}
