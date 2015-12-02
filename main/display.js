/*
 * display.js handles various display dom elements used by the game
 * this code is adapted from the stats.js provided with three.js examples
 * Essentially, this is just CSS done in JavaScript for non-3D aspects of the game
*/

// Display contains level information
var Display = function () {

	var pxWidth = 240;

	var container = document.createElement( 'div' );
	container.id = 'display';
	container.style.cssText = 'width:' + pxWidth.toString() + 'px;opacity:1.0';

	var levelDiv = document.createElement( 'div' );
	levelDiv.id = 'level';
	levelDiv.style.cssText = 'padding:10px 0 10px 0;text-align:left;' +
		'background:rgb(0,0,0);background:rgba(0,0,0,0)';
	container.appendChild( levelDiv );

	var levelText = document.createElement( 'div' );
	levelText.id = 'levelText';
	levelText.style.cssText = 'color:#0f0;font-family:"Courier New",Courier,monospace;' +
		'font-size:24px;font-weight:bold;line-height:15px;text-align:center;letter-spacing: 1px';
	levelText.innerHTML = 'LEVEL 1';
	levelDiv.appendChild( levelText );

	return {

		REVISION: 11,

		w: pxWidth,

		domElement: container,

		update: function (level) {

			levelText.textContent = 'LEVEL ' + level;

		},

		reset: function () {

			levelText.textContent = 'LEVEL 1';

		}

	}

};

// GameOver displays the game over message when the ship crashes
var GameOver = function () {

	var pxWidth = 600;
	var calls = 0;

	var container = document.createElement( 'div' );
	container.id = 'gameOver';
	container.style.cssText = 'width:' + pxWidth.toString() + 'px;opacity:1.0';

	var goDiv = document.createElement( 'div' );
	goDiv.id = 'go';
	goDiv.style.cssText = 'padding:10px 0 10px 0;text-align:left;' +
		'background:rgb(0,0,0);background:rgba(0,0,0,0)';
	container.appendChild( goDiv );

	var goText = document.createElement( 'div' );
	goText.id = 'goText';
	goText.style.cssText = 'color:#f00;font-family:"Courier New",Courier,monospace;' +
		'font-size:72px;font-weight:bold;line-height:15px;text-align:center;' +
		'letter-spacing:10px;word-spacing:-20px';
	goText.innerHTML = '';
	goDiv.appendChild( goText );

	var contDiv = document.createElement( 'div' );
	contDiv.id = 'cont';
	contDiv.style.cssText = 'padding:20px 0 10px 0;text-align:left;' +
		'background:rgb(0,0,0);background:rgba(0,0,0,0)';
	container.appendChild( contDiv );

	var contText = document.createElement( 'div' );
	contText.id = 'contText';
	contText.style.cssText = 'color:#f00;font-family:"Courier New",Courier,monospace;' +
		'font-size:44px;font-weight:normal;line-height:20px;text-align:center;' +
		'letter-spacing:0px;word-spacing:-2px';
	contText.innerHTML = '';
	contDiv.appendChild( contText );

	return {

		REVISION: 11,

		w: pxWidth,

		domElement: container,

		update: function () {
			if (calls == 0) { this.domElement.style.visibility = 'visible';}
			calls++;

			goText.textContent = 'GAME OVER'.substring(0, Math.min(Math.floor(calls/13), 10));
			contText.textContent = 'PRESS ENTER TO RESTART'.substring(0, Math.min(Math.floor( (calls-130)/5), 22));

		},

		reset: function () {

			calls = 0;
			this.domElement.style.visibility = 'hidden';

		}

	}

};

// Paused partially obscures the screen when the game is paused
var Paused = function () {

	var container = document.createElement( 'div' );
	container.id = 'Paused';
	container.style.cssText = 'width:' + window.innerWidth + 'px;height:' +
		window.innerHeight + 'px;opacity:1.0;background:rgba(61, 61, 148, 0.7)';
	container.style.visibility = 'hidden';

	var pausedDiv = document.createElement( 'div' );
	pausedDiv.id = 'paused';
	pausedDiv.style.cssText = 'padding:10px 0 10px 0;text-align:left;' +
		'background:rgba(0,0,0,0)';
	container.appendChild( pausedDiv );

	var pausedText = document.createElement( 'div' );
	pausedText.id = 'pausedText';
	pausedText.style.cssText = 'color:#000;font-family:"Courier New",Courier,monospace;' +
		'font-size:72px;font-weight:bold;line-height:'+window.innerHeight*.9+
		'px;text-align:center;letter-spacing:10px;word-spacing:-20px';
	pausedText.innerHTML = 'PAUSED';
	pausedDiv.appendChild( pausedText );

	return {

		REVISION: 11,

		domElement: container,

		pause: function () {

			this.domElement.style.visibility = 'visible';
		},

		unpause: function () {

			this.domElement.style.visibility = 'hidden';

		}

	}

};


// Sound effects control on/off switch
var SoundControl = function ( soundObj, soundDefault ) {

	var container = document.createElement( 'div' );
	container.id = 'sounds';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ smode % 2 ) }, false );
	container.style.cssText = 'width:'+controlWidth+'px;opacity:0.9;cursor:pointer';

	var soundonDiv = document.createElement( 'div' );
	soundonDiv.id = 'soundon';
	soundonDiv.style.cssText = 'padding:10px 5px 10px 5px;text-align:center;background-color:#020';
	container.appendChild( soundonDiv );

	var soundonText = document.createElement( 'div' );
	soundonText.id = 'soundonText';
	soundonText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:15px';
	soundonText.innerHTML = 'SOUND ON';
	soundonDiv.appendChild( soundonText );

	var soundoffDiv = document.createElement( 'div' );
	soundoffDiv.id = 'soundoff';
	soundoffDiv.style.cssText = 'padding:10px 5px 10px 5px;text-align:center;background-color:#220000;display:none';
	container.appendChild( soundoffDiv );

	var soundoffText = document.createElement( 'div' );
	soundoffText.id = 'soundoffText';
	soundoffText.style.cssText = 'color:#ff0000;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:15px';
	soundoffText.innerHTML = 'SOUND OFF';
	soundoffDiv.appendChild( soundoffText );

	var setMode = function ( value ) {

		smode = value;

		switch ( smode ) {

			case 1:
				soundonDiv.style.display = 'block';
				soundoffDiv.style.display = 'none';
				soundObj.play();
				break;
			case 0:
				soundonDiv.style.display = 'none';
				soundoffDiv.style.display = 'block';
				soundObj.pause();
				break;
			case 2: // Init Off
				soundonDiv.style.display = 'none';
				soundoffDiv.style.display = 'block';
				break;
			case 3: // Init On
				soundonDiv.style.display = 'block';
				soundoffDiv.style.display = 'none';
				break;
		}

	}

	var getMode = function () {

		return smode;

	}

	return {

		REVISION: 11,

		domElement: container,

		setMode: setMode,

		getMode: getMode

	}

};

// Unlocks camera for viewing sky box
var CameraControl = function () {

	var container = document.createElement( 'div' );
	container.id = 'camcontrol';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ cmode % 2 ) }, false );
	container.style.cssText = 'width:'+controlWidth+'px;opacity:0.9;cursor:pointer';

	var camonDiv = document.createElement( 'div' );
	camonDiv.id = 'camon';
	camonDiv.style.cssText = 'padding:10px 5px 10px 5px;text-align:center;background-color:#3c3d00';
	container.appendChild( camonDiv );

	var camonText = document.createElement( 'div' );
	camonText.id = 'camonText';
	camonText.style.cssText = 'color:#faff00;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:15px';
	camonText.innerHTML = 'FOLLOW CAMERA';
	camonDiv.appendChild( camonText );

	var camoffDiv = document.createElement( 'div' );
	camoffDiv.id = 'camoff';
	camoffDiv.style.cssText = 'padding:10px 5px 10px 5px;text-align:center;background-color:#020;display:none';
	container.appendChild( camoffDiv );

	var camoffText = document.createElement( 'div' );
	camoffText.id = 'camoffText';
	camoffText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:15px';
	camoffText.innerHTML = 'FIXED CAMERA';
	camoffDiv.appendChild( camoffText );

	var setMode = function ( value ) {
		cmode = value;

		switch ( cmode ) {

			case 1:
				camonDiv.style.display = 'block';
				camoffDiv.style.display = 'none';
				break;
			case 0:
				camonDiv.style.display = 'none';
				camoffDiv.style.display = 'block';
				if (! avatar.crashed) {
					camera.lookAt(new THREE.Vector3(0,0,0));
				}
				break;
			default: // Init case
				camonDiv.style.display = 'none';
				camoffDiv.style.display = 'block';
				cmode = 0;
				break;
		}

	}

	var getMode = function () {

		return cmode;

	}

	return {

		REVISION: 11,

		domElement: container,

		setMode: setMode,

		getMode: getMode

	}

};
