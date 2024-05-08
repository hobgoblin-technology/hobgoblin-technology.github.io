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


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer;
var source;
var skybox;
var use_webgl = false;
var use_canvas = false;
try {
  renderer = new THREE.WebGLRenderer({ alpha: true });
  use_webgl = true;
} catch (ex)
{
  try
  {
    renderer = new THREE.CanvasRenderer({ alpha: true });
    use_canvas = true;
  } catch( err) {
  }
}
if(renderer)
{
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
  var cube ;
  var dance_cube;
var light = new THREE.PointLight(0xffffff);
scene.add(light);

const imgsrc = "../../images/live-midnight-reaction.jpg";
const skysrc = "../../images/containment.jpg";
  
var loader = new THREE.TextureLoader();
loader.load(imgsrc, function(tex) {
  var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { map: tex } );
  cube = new THREE.Mesh( geometry, material );
  scene.add(cube);
});
  //skybox
  var skyboxside = THREE.ImageUtils.loadTexture( skysrc );
  var materialArray = [];
  for (var i = 0; i < 6; i++)
  {
    materialArray.push( new THREE.MeshBasicMaterial({
      map: skyboxside,
      side: THREE.BackSide
    }));
  }
 
  var skyGeometry = new THREE.CubeGeometry( 500, 500, 500 );
  var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  skybox = new THREE.Mesh( skyGeometry, skyMaterial );
  skybox.rotation.x += Math.PI / 2;
  scene.add( skybox );
}

var composer ;
if(use_webgl)
{
  composer = new THREE.EffectComposer( renderer );

	composer.addPass( new THREE.RenderPass( scene, camera ) );
	afterimagePass = new THREE.AfterimagePass(0.9);
	afterimagePass.renderToScreen = true;
	composer.addPass( afterimagePass );
}

function resizeCanvas(force) {
  const canvas = renderer.domElement;
  if(!canvas) return;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (force || canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}

/*
  var loader = new THREE.JSONLoader();
  loader.load("model.json", function(geo, mat) {
  mat = mat[0];
  var mesh = new THREE.Mesh(geo, mat);

  scene.add(mesh);
  cube = mesh;
  cube.material.wireframe = true;
  
  });
*/

camera.position.z = 20;

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
javascriptNode = audioContext.createScriptProcessor(512, 1, 1);
javascriptNode.connect(audioContext.destination);


var state = {
  dx: 0.0,
  dy: 0,
  dz: 0,
  counter: 0,
  intense: 1,
  vol: 0,
  interval: 0,
  ticker:0,
  rms: 0,
  lowpass: [],
  beats: [],
  lastBeat: 0,
  lastRecalc: 0,
  dancer: 0,
  lastDance: 0
};


function onSuccess (request) {
  var audioData = request.response;
  audioContext.decodeAudioData(audioData, onBuffer, onDecodeBufferError);
}

function reloadCube(e) {
  var files = e.files;
  var file = files[0];
  if(file) {
    e.value = "";
    file = URL.createObjectURL(file);
    loader.load(file, function(tex) {
      var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { map: tex } );
      scene.remove(cube);
      cube = new THREE.Mesh( geometry, material );
      scene.add(cube);
      
    });
    
    //skybox
    var skyboxside = THREE.ImageUtils.loadTexture( file );
    var materialArray = [];
    for (var i = 0; i < 6; i++)
    {
      materialArray.push( new THREE.MeshBasicMaterial({
        map: skyboxside,
        side: THREE.BackSide
      }));
    }
    
    var skyGeometry = new THREE.CubeGeometry( 500, 500, 500 );
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    scene.remove(skybox);
    skybox = new THREE.Mesh( skyGeometry, skyMaterial );
    skybox.rotation.x += Math.PI / 2;
    scene.add( skybox );
  }
}

function reloadFile(e) {
  var files = e.files;
  var file = files[0];
  if(file) {
    e.value = "";
    if(source) source.stop();
    document.getElementById("beat").innerText = "loading...";
    var r = new FileReader();
    r.onload = function() {
      audioContext.decodeAudioData(r.result, onBuffer, onDecodeBufferError);
    }
    r.readAsArrayBuffer(file);
  }
}

function onBuffer (buffer, vid) {
  if(source) source.stop();
  if(vid)
  {
    source = audioContext.createMediaElementSource(vid);
  }
  else
  {
    source = audioContext.createBufferSource();
    console.info('Got the buffer', buffer);
    source.buffer = buffer;
  }
  document.getElementById("beat").innerText = "(._.)";
  
  //create the analyser node
  analyser = audioContext.createAnalyser();

  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.25;

  source.connect(analyser);

  //analyser to speakers
  analyser.connect(javascriptNode);

  

  function tickit()
  {
    var scaler =1.75;
    var s = (state.dancer % 8 >= 4) ? scaler : 0-scaler;
    var t = (state.dancer % 4 >= 2) ? scaler : 0-scaler;
    if(cube)
    {
      cube.rotation.x += state.dx * state.intense;
      cube.rotation.y += state.dy * state.vol * ((state.dancer % 2) ? scaler : 0-scaler);
      cube.scale.z = state.intense * scaler;
      cube.scale.x = state.intense * scaler;
      cube.scale.y = state.intense * scaler;
      cube.rotation.z = state.vol / (0-2.5);
    }
    camera.position.z = 20 + ( state.intense * scaler );
    skybox.rotation.x += Math.PI / 128;
    skybox.rotation.y += state.dy * state.vol * ((state.dancer % 2) ? scaler : 0-scaler);
  }

  var e = document.getElementById("beat");
  var d = document.getElementById("dancer");

  function dance(i)
  {
    //var doc =document.querySelector("#ebin");
    //if(doc)
    //  doc.style = "filter: hue-rotate("+((360/16)*(i%16))+"deg); transform: rotateZ("+((360/4)*(i % 4))+"deg);";

    if(!d)
      return;
    switch(i % 4)
    {
      case 0:
      d.innerText = "\n(._.)";
      return;
      case 1:
      d.innerText = "(._.)";
      return;
      case 2:
      d.innerText = "\n(-.-)";
      return;
      case 3:
      d.innerText = "(-.-)";
      return;
    }
  };
  
  
  function dance_tick(i)
  {
    switch(i % 4)
    {
      case 0:
      e.innerText = "_/(>_<)/‾";
      return;
      case 1:
      e.innerText = "‾\\(._.)\\_";
      return;
      case 2:
      e.innerText = "_/(._.)/‾";
      return;
      case 3:
      e.innerText = "‾\\(>_<)\\_";
      return;
    }
  };
  
  //connect source to analyser
  source.connect(audioContext.destination);
  javascriptNode.onaudioprocess = function () {
    var i = 1 / (state.vol || 2);
    if(i > 1)
    {
      i = 1;
    }
    //analyser.smoothingTimeConstant = i / 5;
    // get the average for the first channel
    //var array = new Uint8Array(512);
    var array = new Uint8Array(256);
    analyser.getByteFrequencyData(array);
    
    //var intense =  1024 / (array[64] || 5 ) ;
    //camera.position.z = intense ;
    //cube.material.color.g = 1 / (intense/5);
   
    state.dy = 0.0001 * array[16];
    state.intense = (array[1] + array[2] + array[0]) / (0.5 * 255);
    //state.dx = 0.0001 * array[10] ;
    //state.intense += array[5] / 127.0;
    var now = new Date().getTime();
    if(now - state.lastBeat > Math.ceil(50, state.inetrval / 2))
    {
      if(array[3] >= 250 && array[2] > 240)
      {
        e.style.color ="red";
        if(state.lowpass.length == 0)
        {
          state.lowpass.push(now);
        }
        else
        {
          var dlt = now - state.lowpass[state.lowpass.length-1];
          if(dlt > 2000)
          {
            state.lowpass = [];
            state.beats = [];
            state.rms = 0;
            state.interval = 0;
            e.innerText = "(;_;)";
          }
          else
          {
            state.lowpass.push(now);
            if(state.lowpass.length > 128)
              state.lowpass.shift();
            var top = Math.ceil( state.interval / 4,  10.0);
            if( Math.abs(state.lowpass[state.lowpass.length -1] -  state.lowpass[state.lowpass.length - 2]) > top)
            {
              state.beats.push(now);
              if(state.beats.length > 32)
                state.beats.shift();
              recalcBPM(state);
              if(now - state.lastBeat > (state.interval / 0.95))
              {
                dance_tick(state.counter++);
                state.lastBeat = now;
              }
            }
          }
        } 
      }
      else
      {
        e.style.color ="#900";
        if(now - state.lastRecalc > state.interval)
          recalcBPM(state);
      }
      // tick dancer if we think we should
      if(state.interval > 20)
      {
        if(now - state.lastDance > state.interval)
        {
          dance(state.dancer++);
          
          state.lastDance = now;
        }
      }
    }
    if(cube)
    {
      cube.material.color.r = array[64] / 255.0;
      cube.material.color.g = (64 * (state.dancer % 4)) / 255.0;
      cube.material.color.b = array[32] / 255.0;
    }
    //state.intense += (array[128] + array[256] ) / ( 255) ;
    analyser.getByteTimeDomainData(array);
    var mx = 0;
    array.map(function(v) {
      mx += v * v;
    })
    mx /= array.length;
    mx = Math.sqrt(mx);
    mx /= 100.0;
    
    state.vol = mx;

    tickit();
    //renderer.render( scene, camera );
    // geometry.vertices[1].multiplyScalar(state.dx);
    //render the scene and update control
  }

  source.loop = true;
  source.start();
  var elem = document.getElementById("hide");
  if(elem) elem.setAttribute("id", "");
  elem = document.getElementById("load");
  if(elem) elem.remove();
}


function recalcBPM(state)
{
  var intervalArr = state.beats;
  var sum = 0;
  if(intervalArr.length)
  {
    var last = intervalArr[0];
    var dltArr = [];
    intervalArr.slice(1).forEach(function(val) {
      var dlt = val - last;
      if(state.interval > 0)
      {
        // half sized beat
        if(dlt <= state.interval / 2 && dlt > state.interval / 4)
        {
          dltArr.push(dlt * 2);
          sum += dlt;
        }
        else if(dlt > state.interval * 2 && dlt < state.interval * 3)
        {
          // double sized beat
          dltArr.push(dlt / 2);
          dltArr.push(dlt / 2);
          sum += dlt;
        }
        else if(dlt > state.interval / 1.15 && dlt < state.interval * 1.15)
        {
          // probably a normal beat
          dltArr.push(dlt);
          sum += dlt;
        }
      }
      else
      {
        // no detected interval
        dltArr.push(dlt);
        sum += dlt;
      }
      last = val;
    });
    var dltMean = 0;
    dltArr.forEach(function(val) {
      dltMean += val;
    });
    dltMean /= dltArr.length;
    var interval = dltMean;
    if(interval == 0)
      interval ++;
    var bpm = Math.floor(60000 / interval);
    while(bpm > 200 && bpm < 100000)
    {
      bpm /= 2;
      interval *= 2;
    }
    if(interval < 100.0)
    {
      interval ++;
      interval *= 2;
    }
    while(bpm < 80)
    {
      // too slow
      interval /= 2;
      bpm *= 2;
    }
    if(interval > 25.0)
    {
      state.interval = interval;
    }
    else
    {
      state.interval = 25.0;
    }
    console.log(bpm + " bpm "+ state.interval + " interval");
  }
  state.lastRecalc = new Date().getTime();
}

function onDecodeBufferError (e) {
  console.log('Error decoding buffer: ' + e.message);
  console.log(e);
  alert("Failde to decode buffer: "+e.message);
}

function fetch (url, resolve) {
  var request = new XMLHttpRequest();
  document.getElementById("beat").innerText = "loading...";
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function () { resolve(request) };
  request.send();
}


function play_the_thingy() {
	var elem = document.getElementById("music_url");
	if(elem && elem.value)
  {
    fetch(elem.value, onSuccess);
  }
	else
		alert("no music selected");
}

function stop_the_thingy() {
  if(source) source.stop();
}

function toggle_the_thingy() {
  if(source) stop_the_thingy();
  else play_the_thingy();
}

function animate () {
	resizeCanvas();
	requestAnimationFrame( animate );

	if(composer)
	  composer.render();
	else if(renderer)
	  renderer.render(scene, camera);
  
};
if(use_webgl || use_canvas)
{
  resizeCanvas(true);
  requestAnimationFrame( animate );
}

window.addEventListener('resize', function () {

  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
  if(renderer)
  {
    renderer.setSize(WIDTH, HEIGHT);
  }
  if(camera)
  {
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }
});


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
  exclusion.robots: 0.067
  exclusion.robots.policy: 0.057
  cdx.remote: 0.088
  esindex: 0.008
  LoadShardBlock: 171.981 (6)
  PetaboxLoader3.resolve: 155.213 (2)
  PetaboxLoader3.datanode: 105.322 (7)
  load_resource: 122.196
*/