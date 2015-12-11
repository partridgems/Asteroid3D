// from the vertex shader and the rasterizer we get a pixel with
// an interpolated normal
varying vec3 N;
// an interpolated position in world coordinates
varying vec3 v;
// a light position in world coordinates
varying vec3 light;

// we also get several uniforms from the javascript program
uniform vec3 ambient;     // colors for ambient, diffuse, and specular illumination
uniform vec3 diffuse;
uniform vec3 specular;
uniform float shininess;  // the shininess of the specular light
uniform float gtime;  // Frame number for pulsations

void main (void)
{

   // illumination vectors
   vec3 lightPos = light;
   vec3 position = v; // fragment position in world coordinates, with camera at (0,0,0)
   vec3 eyeVector = normalize(cameraPosition - position);
   vec3 lightVector = normalize(lightPos - position);
   vec3 normal = normalize(N);

   //ambient illumination with lots of pulsation
   vec3 Iamb = vec3(0.5*ambient) * (0.2 + 1.0*sin(gtime/15.0)) ;

   // diffuse illumination with pulsation
   vec3 Idiff = diffuse * 1.0 * max(dot(normal,lightVector),0.0) * (1.0 + 0.4*sin(gtime/15.0));

   //Phong illumination
   vec3 reflection = normalize(-reflect(lightVector,normal));
   float phong0 = max(dot(reflection,eyeVector),0.0);
   float phong = pow(phong0, shininess);

   // calculate the specular illumination, dimmed slightly
   vec3 Ispec = phong*specular*0.7;

   // sum the specular, diffuse, and ambient colors to get the fragment color
   gl_FragColor = vec4(Ispec + Idiff + Iamb, 0.3);
}
