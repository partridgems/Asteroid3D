// This vertex shader grows and shrinks the mesh it is mapped onto according to a sine wave
varying vec3 N;
varying vec3 v;
varying vec3 light;
uniform float gtime;
uniform vec3 lightLocation;

void main(void)
{

	vec3 vertex = position; // position is a built-in variable, always available

    vertex += normal * 0.18 * sin(gtime/15.0); // Grow and shrink by moving vertices in normal direction

	N = normalize(normalMatrix*normal); // Normal position for lighting model
   vec4 v4 = modelViewMatrix*vec4(vertex,1.0);
   v = v4.xyz;

   // calculate the light position in world Coordinates relative to the ship
   vec4 lightInRelCoords = vec4(lightLocation, 1.0);
   vec4 light4 = modelViewMatrix*lightInRelCoords;
   light = light4.xyz;

   // return the position in projection coordinates
   gl_Position = projectionMatrix * modelViewMatrix * vec4(vertex,1.0);
}
