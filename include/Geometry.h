#pragma once

#include "GL_Includes.h"
#include "Material.h"

#include <vec4.hpp>
#include <mat4x4.hpp>

class Geometry
{
	friend class Scene;
public:
    // Constructors
	Geometry();
	Geometry(GLuint tex, GLuint nrm, GLuint VAO, GLuint nIdx, mat4& MV);
    
    // Public Modifiers
    void identity();
    void leftMultMV(glm::mat4& lhs);
    void setMaterial(const Material& M);
    void setTexMap(GLuint tex);
	void setNrmMap(GLuint nrm);
    void setVAO(GLuint VAO);
    void setNumIndices(GLuint nIndices);
    
    // Public Accessors
	GLuint getVAO();
	GLuint getNumIdx();
	GLuint GetTexMap();
	GLuint GetNrmMap();
	vec4 getColor();
	mat4 getMV();
	Material getMaterial();
	
    // Static shader handle access
	static GLint getMVHandle();
	static GLint getNHandle();
	static GLint getTexMapHandle();
	static GLint getNrmMapHandle();
    
private:
    // Texture, MV locations, index count, MV, Material
	GLuint m_Tex;
	GLuint m_Nrm;
	GLuint m_uVAO;
	GLuint m_nIdx;
	mat4 m_m4MV;
	Material m_Material;
    
protected:
    // Static shader handles
	static GLint s_MVHandle;
	static GLint s_NHandle;
	static GLint s_TexMapHandle;
	static GLint s_NrmMapHandle;
    
    // Only Scene should set shader handles (and above)
	static void setTexMapHandle(GLint texh);
	static void setNrmMapHandle(GLint nrmh);
	static void setMVHandle(GLint mvh);
	static void setNHandle(GLint nh);
};