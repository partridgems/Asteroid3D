THREE.Audio.prototype.restart = function () {

	this.source.stop();

	var source = this.context.createBufferSource();

	source.buffer = this.source.buffer;
	source.loop = this.source.loop;
	source.onended = this.source.onended;
	source.start( 0, 0 );
	source.playbackRate.value = this.playbackRate;

	this.isPlaying = true;

	this.source = source;

	this.connect();

};

var getBgSound = function() {
    var listener = new THREE.AudioListener();
    camera.add( listener );

    var bgmusic = new THREE.Audio( listener );
    bgmusic.load( 'media/376737_Skullbeatz___Bad_Cat_Maste.ogg' );
    bgmusic.setRefDistance( 1000 );
    bgmusic.autoplay = soundDefault;
    bgmusic.setLoop( true );

    return bgmusic;
}
