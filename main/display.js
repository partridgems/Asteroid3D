/*
 * display.js handles various display dom elements used by the game
 * this code is adapted from the stats.js provided with three.js examples
*/

var Display = function () {

	var pxWidth = 240;

	var container = document.createElement( 'div' );
	container.id = 'display';
	container.style.cssText = 'width:' + pxWidth.toString() + 'px;opacity:1.0';

	var levelDiv = document.createElement( 'div' );
	levelDiv.id = 'level';
	levelDiv.style.cssText = 'padding:10px 0 10px 0;text-align:left;background:rgb(0,0,0);background:rgba(0,0,0,0)';
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

var GameOver = function () {

	var pxWidth = 600;
	var calls = 0;

	var container = document.createElement( 'div' );
	container.id = 'gameOver';
	container.style.cssText = 'width:' + pxWidth.toString() + 'px;opacity:1.0';

	var goDiv = document.createElement( 'div' );
	goDiv.id = 'go';
	goDiv.style.cssText = 'padding:10px 0 10px 0;text-align:left;background:rgb(0,0,0);background:rgba(0,0,0,0)';
	container.appendChild( goDiv );

	var goText = document.createElement( 'div' );
	goText.id = 'goText';
	goText.style.cssText = 'color:#f00;font-family:"Courier New",Courier,monospace;' +
		'font-size:72px;font-weight:bold;line-height:15px;text-align:center;letter-spacing:10px;word-spacing:-20px';
	goText.innerHTML = '';
	goDiv.appendChild( goText );

	var contDiv = document.createElement( 'div' );
	contDiv.id = 'cont';
	contDiv.style.cssText = 'padding:20px 0 10px 0;text-align:left;background:rgb(0,0,0);background:rgba(0,0,0,0)';
	container.appendChild( contDiv );

	var contText = document.createElement( 'div' );
	contText.id = 'contText';
	contText.style.cssText = 'color:#f00;font-family:"Courier New",Courier,monospace;' +
		'font-size:44px;font-weight:normal;line-height:20px;text-align:center;letter-spacing:0px;word-spacing:-2px';
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

var Paused = function () {

	var container = document.createElement( 'div' );
	container.id = 'Paused';
	container.style.cssText = 'width:' + window.innerWidth + 'px;height:' + window.innerHeight +
		'px;opacity:1.0;background:rgba(61, 61, 148, 0.7)';
	container.style.visibility = 'hidden';

	var pausedDiv = document.createElement( 'div' );
	pausedDiv.id = 'paused';
	pausedDiv.style.cssText = 'padding:10px 0 10px 0;text-align:left;background:rgba(0,0,0,0)';
	container.appendChild( pausedDiv );

	var pausedText = document.createElement( 'div' );
	pausedText.id = 'pausedText';
	pausedText.style.cssText = 'color:#000;font-family:"Courier New",Courier,monospace;' +
		'font-size:72px;font-weight:bold;line-height:'+window.innerHeight*.9+'px;text-align:center;letter-spacing:10px;word-spacing:-20px';
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
