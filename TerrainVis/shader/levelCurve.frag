#version 400

struct LightInfo {
  vec4 Position;  // Light position in eye coords.
  vec3 Intensity; // A,D,S intensity
};
uniform LightInfo Light;

struct MaterialInfo {
  vec3 Ka;            // Ambient reflectivity
  vec3 Kd;            // Diffuse reflectivity
  vec3 Ks;            // Specular reflectivity
  float Shininess;    // Specular shininess factor
};
uniform MaterialInfo Material;

in vec3 GPosition;
in vec3 GNormal;
flat in int  GCurveLevel;

layout( location = 0 ) out vec4 FragColor;

vec3 phongModel( vec3 pos, vec3 norm )
{
    vec3 s = normalize(vec3(Light.Position) - pos);
    vec3 v = normalize(-pos.xyz);
    vec3 r = reflect( -s, norm );
    vec3 ambient;
	ambient = (GCurveLevel == 0 ) ? Light.Intensity * vec3(0.1,0.4,0.8) : Light.Intensity * vec3(0.1,0.8,0.1);
	//ambient = (GCurveLevel == 0 ) ? Light.Intensity * Material.Ka :  vec3(0.1,0.8,0.1);
    float sDotN = max( dot(s,norm), 0.0 );
    vec3 diffuse = Light.Intensity * Material.Kd * sDotN;
    vec3 spec = vec3(0.0);
    if( sDotN > 0.0 )
        spec = Light.Intensity * Material.Ks *
               pow( max( dot(r,v), 0.0 ), Material.Shininess );

    return ambient + diffuse + spec;
}

void main() {

    vec4 color;
	//color = vec4( phongModel(GPosition, GNormal), 1.0 );
	color = vec4( phongModel(GPosition, GNormal), 1.0 );
    FragColor = color;
}
