varying vec3 N;
varying vec3 v;
varying vec3 light;
varying float height;
uniform float gtime;
uniform vec2 wavePos;
uniform float wavet;
uniform float waveHeight;

// THREE.ShaderChunk["shadowmap_pars_vertex"]
#ifdef USE_SHADOWMAP

varying vec4 vShadowCoord[ MAX_SHADOWS ];
uniform mat4 shadowMatrix[ MAX_SHADOWS ];

#endif

void main(void)
{
    float M_PI = 3.14159265358;

    vec3 vertex = position; // position is a built-in variable, always available

    // Get distance from center of the wave
    float radius = sqrt(wavePos.x*wavePos.x + wavePos.y*wavePos.y);

    // Wave speed, length
    float speed = 12.0;
    float waveLength = 50.0; // Times 2 Pi

    vec3 normal0;
    normal0.x = 0.0;
    normal0.y = 0.0;
    normal0.z = 1.0;

    float waveElapsed = gtime - wavet;

    // If this vertex is in the wave, alter height and normal
    if ( wavet > 0.0 && 0.0 < radius - waveElapsed*speed && radius - waveElapsed*speed < 2.0 * waveLength * M_PI) {
        height = waveHeight - waveHeight * cos( ( radius - waveElapsed*speed ) / waveLength  );
        normal0.x = ( waveHeight * vertex.x * sin( (radius - waveElapsed*speed) / waveLength ) ) / ( waveLength * radius );
        normal0.y = ( waveHeight * vertex.y * sin( (radius - waveElapsed*speed) / waveLength ) ) / ( waveLength * radius );
        vertex.z += height;
    }

    // normal0.x = (-100.0*cos(vertex.x/100.0 - (gtime / 10.0))*(1.0/200.0));

    N = normalize(normalMatrix*(normalize(normal0)+normal)); // normal is a built-i variable, always available
    vec4 v4 = modelViewMatrix*vec4(vertex,1.0);
    v = v4.xyz;

    // next we calculate the light position in world Coordinates relative to the plane
    // vec4 lightInRelCoords = vec4(-17.0*1.5, 72.0*1.5, 45.0*1.5, 1.0);
    vec4 lightInRelCoords = vec4(0.0, 0.0, 120.0, 0.0);
    vec4 light4 = modelViewMatrix* lightInRelCoords;
    light = light4.xyz;

    // finally we return the position in projection coordinates
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertex,1.0);

    // THREE.ShaderChunk["shadowmap_vertex"]
    #ifdef USE_SHADOWMAP
    for( int i = 0; i < MAX_SHADOWS; i ++ ) {

        vShadowCoord[ i ] = shadowMatrix[ i ] * v4; // worldPosition

    }
    #endif
}
