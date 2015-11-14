function createEventListeners(){

    function keyDownListener( event ) {
        switch( event.keyCode ) {

        case 80: /* P */
            if (!scene.paused) {
                scene.paused = true;
                clock.stop();
                paused.pause();
            } else {
                scene.paused = false;
                clock.start();
                paused.unpause();
            }
        break;

        case 73: /* I */
            if (debug_mode) {
                addAsteroid(Math.random() * 3 + 4, Math.random()*10 + 5);
            }
        break;

        case 85: /* U */
            if (debug_mode) {
                avatar.isCrashed = true;
            }
        break;

        case 79: /* O */
            if (debug_mode) {
                avatar.isShield = !avatar.isShield;
            }
        break;

        case 89: /* Y */
            if (debug_mode) {
                addShieldPowerup();
            }
        break;

        case 32: /* space */
            if ( !avatar.crashed() ) { // Don't allow hyperspace after a crash
                newPos = getBoardPoint();
                avatar.position.x = newPos.x * .9;
                avatar.position.z = newPos.z * .9;
                avatar.__dirtyPosition = true;
            }
        break;

        case 13: /* enter */
            if ( avatar.crashed() ) { // Prevent accidental restarts
                newGame();
            }
        break;

        case 38: /*up*/
        case 87: /*W*/
            avatar.thrust();
        break;

        case 40: /*down*/
        case 83: /*S*/
            avatar.brake();
        break;

        case 37: /*left*/
        case 65: /*A*/
            avatar.turnL();
        break;

        case 39: /*right*/
        case 68: /*D*/
            avatar.turnR();
        break;

        }
    }

    document.addEventListener("keydown",keyDownListener,false);

    function keyUpListener( event ) {
        switch( event.keyCode ) {

        case 38: /*up*/
        case 87: /*W*/
            if (avatar.thrusting) {
                avatar.nothrust();
            } else {
                avatar.wasThrust = false;
            }
        break;

        case 40: /*down*/
        case 83: /*S*/
            if (avatar.braking) {
                avatar.nothrust();
            } else {
                avatar.wasBrake = false;
            }
        break;

        case 37: /*left*/
        case 65: /*A*/
            if (avatar.turningLeft) {
                avatar.stopTurning();
            } else {
                avatar.wasTurningL = false;
            }
        break;

        case 39: /*right*/
        case 68: /*D*/
            if (avatar.turningRight) {
                avatar.stopTurning();
            } else {
                avatar.wasTurningR = false;
            }
        break;

        }
    }

    document.addEventListener("keyup",keyUpListener,false);

 }
