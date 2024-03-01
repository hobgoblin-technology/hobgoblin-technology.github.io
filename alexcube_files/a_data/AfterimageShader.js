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
 *
 * Afterimage shader
 * I created this effect inspired by a demo on codepen:
 * https://codepen.io/brunoimbrizi/pen/MoRJaN?page=1&
 */

THREE.AfterimageShader = {

	uniforms: {

		"damp": { value: 0.96 },
		"tOld": { value: null },
		"tNew": { value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float damp;",

		"uniform sampler2D tOld;",
		"uniform sampler2D tNew;",

		"varying vec2 vUv;",
		
		"vec4 when_gt( vec4 x, float y ) {",

			"return max( sign( x - y ), 0.0 );",

		"}",

		"void main() {",

			"vec4 texelOld = texture2D( tOld, vUv );",
			"vec4 texelNew = texture2D( tNew, vUv );",
			
			"texelOld *= damp * when_gt( texelOld, 0.1 );",

			"gl_FragColor = max(texelNew, texelOld);",

		"}"

	].join( "\n" )

};


}
/*
     FILE ARCHIVED ON 17:54:49 Jul 15, 2023 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 05:06:51 Mar 01, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots: 0.066
  exclusion.robots.policy: 0.057
  cdx.remote: 0.083
  esindex: 0.008
  LoadShardBlock: 188.467 (6)
  PetaboxLoader3.datanode: 226.471 (9)
  load_resource: 1322.63 (2)
  PetaboxLoader3.resolve: 1245.185 (2)
  loaddict: 43.954
*/