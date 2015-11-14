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
            if ( avatar.isShield ) {
                // Stabilize the avatar and blast the asteroid away
                other_object.setLinearVelocity(contact_normal.setLength(100));
                avatar.shieldsDn();
                avatar.stabilize();
            } else {
                avatar.isCrashed = true;
            }
        } else if ( !avatar.isShield && other_object.name == 'ShieldPowerup' ) {
            scene.remove( other_object );
            avatar.shieldsUp();
        }
    });

    avatar.shield = getShield();
    avatar.add(avatar.shield);

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
    avatar.isShield = false;

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
    avatar.shieldsUp = function() {
        avatar.isShield = true;
    }
    avatar.shieldsDn = function() {
        avatar.isShield = false;
    }
    avatar.updateShield = function() {
        avatar.shield.material.visible = avatar.isShield;
    }
    avatar.stabilize = function() {
        avatar.position.y = avatarHeight;
        avatar.__dirtyPosition = true;
        avatar.__dirtyRotation = true;
        avatar.setLinearVelocity(new THREE.Vector3(avatar.getLinearVelocity().x, 0, avatar.getLinearVelocity().z));
        avatar.setAngularVelocity(new THREE.Vector3(0, 0, 0));
    }

    return avatar;
}

function updateAvatar() {
    // Update avatar from its state
    avatar.updateShield();
    avatar.stabilize();

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

function getShield() {
    // Add a shield?
    var sPoints = [
        // Nose
        new THREE.Vector3(-.2, -.2, 5),
        new THREE.Vector3(-.2, .2, 5),
        new THREE.Vector3(.2, -.2, 5),
        new THREE.Vector3(.2, .2, 5),
        // Rear
        new THREE.Vector3(.2, 0, -1),
        new THREE.Vector3(-.2, 0, -1),
        // Left and right sides
        new THREE.Vector3(1.7, 0, 2),
        new THREE.Vector3(-1.7, 0, 2),
        new THREE.Vector3(1.5, 0, 2.2),
        new THREE.Vector3(-1.5, 0, 2.2),
        new THREE.Vector3(2, 0, 0),
        new THREE.Vector3(-2, 0, 0),
        // Upper and lower geometry
        new THREE.Vector3(0, -.5, 1),
        new THREE.Vector3(0, -.5, 2),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 1, 2)
    ];
    var shieldGeometry = new THREE.ConvexGeometry(sPoints);
    // Move the ship's center so that it rotates as expected
    shieldGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -1.8) );
    var shieldSize = 1.4;
    shieldGeometry.applyMatrix( new THREE.Matrix4().makeScale(shieldSize, shieldSize, shieldSize) );
    var shieldMaterial = new THREE.MeshLambertMaterial({color: 0x62cbff,
        shading: THREE.SmoothShading, transparent: true, opacity: .3});
    var shield = new Physijs.ConvexMesh(shieldGeometry, shieldMaterial);

    shield.name = "Shield";

    // Add collision listener
    shield.addEventListener( 'collision', function( other_object,
        relative_velocity, relative_rotation, contact_normal ) {
        if ( other_object.name == 'Asteroid' ) {
            other_object.setLinearVelocity(contact_normal*5);
        }
    });

    return shield;
}
