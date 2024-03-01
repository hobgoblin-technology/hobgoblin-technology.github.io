var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/**
 * @author HypnosNova / https://www.threejs.org.cn/gallery/
 */

THREE.AfterimagePass = function ( damp ) {

	THREE.Pass.call( this );

	if ( THREE.AfterimageShader === undefined )
		console.error( "THREE.AfterimagePass relies on THREE.AfterimageShader" );

	this.shader = THREE.AfterimageShader;

	this.uniforms = THREE.UniformsUtils.clone( this.shader.uniforms );

	this.uniforms[ "damp" ].value = damp !== undefined ? damp : 0.96;

	this.textureComp = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {

		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat

	} );

	this.textureOld = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {

		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat

	} );

	this.shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: this.shader.vertexShader,
		fragmentShader: this.shader.fragmentShader

	} );

	this.sceneComp = new THREE.Scene();
	this.scene = new THREE.Scene();

	this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
	this.camera.position.z = 1;

	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

	this.quadComp = new THREE.Mesh( geometry, this.shaderMaterial );
	this.sceneComp.add( this.quadComp );

	var material = new THREE.MeshBasicMaterial( { 
		map: this.textureComp.texture
	} );

	var quadScreen = new THREE.Mesh( geometry, material );
	this.scene.add( quadScreen );

};

THREE.AfterimagePass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.AfterimagePass,

	render: function ( renderer, writeBuffer, readBuffer ) {

		this.uniforms[ "tOld" ].value = this.textureOld.texture;
		this.uniforms[ "tNew" ].value = readBuffer.texture;

		this.quadComp.material = this.shaderMaterial;

		renderer.render( this.sceneComp, this.camera, this.textureComp );
		renderer.render( this.scene, this.camera, this.textureOld );
		
		if ( this.renderToScreen ) {
			
			renderer.render( this.scene, this.camera );
			
		} else {
			
			renderer.render( this.scene, this.camera, writeBuffer, this.clear );
			
		}

	}

} );


}
/*
     FILE ARCHIVED ON 17:54:50 Jul 15, 2023 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 05:06:51 Mar 01, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots: 0.065
  exclusion.robots.policy: 0.055
  cdx.remote: 0.087
  esindex: 0.009
  LoadShardBlock: 468.518 (6)
  PetaboxLoader3.resolve: 121.011 (2)
  PetaboxLoader3.datanode: 163.102 (7)
  load_resource: 116.205
*/