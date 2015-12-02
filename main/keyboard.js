// Handle keyboard controls
// Event listeners respond to keyboard actions by calling avatar state funcitons
// or setting other game states such as paused
function createEventListeners(){

    function mouseMoveListener(event){
        if (debug_mode && event.buttons) {

            var angleX = event.movementX/10.0/180.0*Math.PI;
            var angleY = event.movementY/10.0/180.0*Math.PI
            camera.rotateX(angleY);
            camera.rotateY(angleX);
        }
    }

   document.addEventListener("mousemove",mouseMoveListener,false);

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

        // Next 4 are special debug mode controls
        // I: add a new asteroid to the scene
        // U: immediate game over
        // O: shield/unshield the avatar
        // Y: add a shield power up to the board
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
                avatar.hyperspace();
            }
        break;

        case 13: /* enter */
            if ( avatar.crashed() ) { // Prevent accidental restarts

                bgmusic.setVolume( 1.0 );

                // Restart music if turned on, otherwise stop it (resets at next play)
                if ( soundControl.getMode() == 1 ) { bgmusic.restart(); }
                else if ( bgmusic.isPlaying ) { bgmusic.stop(); }

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

    // By adding key up listeners, we are able to respond to multiple inputs
    // effectively even when they are released in a different order than pressed
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
