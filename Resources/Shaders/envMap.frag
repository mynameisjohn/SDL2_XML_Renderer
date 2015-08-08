#version 120

// These are defined in post
// #define NUM_LIGHTS
// #define NUM_MATS

struct Light{
	int Type;
	vec3 PosOrHalf;
	vec3 DirOrAtten; // or attenuation
	vec3 Intensity;
};
const int DIRECTIONAL = 0;
const int POINT = 1;
const int AMBIENT = 2;

struct Material{
	float shininess;
	float reflectivity;
	vec4 diff;
	vec4 spec;
};

uniform Light LightArr[NUM_LIGHTS];
uniform Material MatArr[NUM_MATS];
uniform int mIdx;

uniform sampler2D u_TextureMap;
uniform sampler2D u_NormalMap;
uniform samplerCube u_EnvMap;

// I interpolate them for lighting calculations; is this common?
varying vec2 v_Tex;
varying vec3 v_Refl;
varying vec3 v_LightDir[NUM_LIGHTS];
varying vec3 v_Half[NUM_LIGHTS];

void main(){
	vec4 light = vec4(0, 0, 0, 1);
	vec3 nrm = 2. * texture2D(u_NormalMap, v_Tex).rgb - 1.;
	
	for (int i = 0; i < NUM_LIGHTS; i++){
		// Grab intensity from each light,
		vec4 lightColor = vec4(LightArr[i].Intensity, 1);
	
		// multiply by each light's contribution
		if (LightArr[i].Type == DIRECTIONAL)
		{ 
			vec3 L = normalize(v_LightDir[i]);
			vec3 H = normalize(v_Half[i]);
			float nDotL = max(0, dot(nrm, L));
			float nDotH = max(0, dot(nrm, H));
			float pf = nDotH == 0 ? 0 : pow(nDotH, MatArr[mIdx].shininess);
			
			vec4 contrib = nDotL * MatArr[mIdx].diff + pf * MatArr[mIdx].spec;
			light += contrib * lightColor;
		}
		else if (LightArr[i].Type == 1) // point
		{ // For point lights, 
			// attenuation factor
			vec3 L = normalize(v_LightDir[i]);
			vec3 H = normalize(v_Half[i]);
			float d = length(v_LightDir[i]);
			
			float nDotL = max(0, dot(nrm, L));
			float nDotH = max(0, dot(nrm, H));
			float pf = nDotH == 0 ? 0 : pow(nDotH, MatArr[mIdx].shininess);
			
			float attenuation = 1.0 / // DirOrAtten becomes quadratic polynomial coefs
				(LightArr[i].DirOrAtten[0] + 
				LightArr[i].DirOrAtten[1] * d + 
				LightArr[i].DirOrAtten[2] * d*d);
				
			vec4 contrib = nDotL * MatArr[mIdx].diff + pf * MatArr[mIdx].spec;
			light += attenuation * contrib * lightColor;
		}
		else if (LightArr[i].Type == 2) // ambient
		{
			light += lightColor;
		}
	}
	
	vec4 envColor = textureCube(u_EnvMap, v_Refl);
	
	gl_FragColor = mix(texture2D (u_TextureMap, v_Tex) * light, envColor, MatArr[mIdx].reflectivity);
}