// Functions for background sound (music)
var Sound = function ( sources, radius, volume ) {

    var audio = document.createElement( 'audio' );

    for ( var i = 0; i < sources.length; i ++ ) {

        var source = document.createElement( 'source' );
        source.src = sources[ i ];

        audio.appendChild( source );

    }

    this.position = new THREE.Vector3();

    this.play = function () {

        audio.play();

    }

    this.update = function ( camera ) {

        var distance = this.position.distanceTo( camera.position );

        if ( distance <= radius ) {

            audio.volume = volume * ( 1 - distance / radius );

        } else {

            audio.volume = 0;

        }

    }

}

sound1 = new Sound( [ 'sounds/358232_j_s_song.mp3', 'sounds/358232_j_s_song.ogg' ], 275, 1 );
sound1.play();


var listener = new THREE.AudioListener();
camera.add( listener );

var sound2 = new THREE.Audio( listener );
sound2.load( 'sounds/376737_Skullbeatz___Bad_Cat_Maste.ogg' );
sound2.setRefDistance( 20 );
sound2.autoplay = true;
mesh2.add( sound2 );
