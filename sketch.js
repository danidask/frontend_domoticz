//tablet 2560 x 1600 pixels 1280, 800
// http://192.168.1.10:8090/json.htm?type=command&param=switchlight&idx=11&switchcmd=On


config = {
  "name":"John",
  "age":30,
  "interruptores":[ 
    {
    "idx":"11",
    "name":"luz 1"
    },
    {
    "idx":"12",
    "name":"luz 2"
    },
    {
    "idx":"13",
    "name":"luz 3"
    }
  ]
} 
// CONFIGURACION
var tiempodormir = 60*3; //segundos
var colorbg = 0;
var bgimg;
var ip = "192.168.1.10";
var port = "8090";

// OTROS
var bombilla_on;
var bombilla_off;
var lelementos = [];
var cuentadormir;
var submenu = null;

function preload() {
  bombilla_off = loadImage("img/bombilla_off.png");
  bombilla_on = loadImage("img/bombilla_on.png");
}

function setup() {
  //createCanvas(displayWidth, displayHeight);
  bgimg = loadImage("img/fondo.jpg");
  imageMode(CENTER);
  createCanvas(1280, 800);  //just for debug
  var v = new Elementos(900 , 100);
  lelementos.push(v);
  v = new Elementos(1100 ,100);
  lelementos.push(v);

  cuentadormir = millis();
}

function draw() {
  imageMode(CORNER);
  background(bgimg);
  imageMode(CENTER);


  for (var i = 0; i < lelementos.length; i++) {
    lelementos[i].show();
  }
  
  if (submenu){
    if (!submenu.alive){
      submenu = null;
    }
    else {
      submenu.show();
    }
  }

  if (millis() - cuentadormir > tiempodormir*1000)
    setFrameRate(1);
  else
    setFrameRate(60);
  //console.log("milis: " + millis() + " cuentadormir: " + cuentadormir + "   resta: " + str(millis() - cuentadormir) );

}


function mouseClicked() {
   if(!screenfull.isFullscreen) {
     screenfull.request();
     return;
   }
  cuentadormir = millis(); // reinicia el modo sleep
  
  if (mouseButton == LEFT){
    if (!submenu) {
      for (var i = 0; i < lelementos.length; i++) {
        var d = dist(mouseX, mouseY, lelementos[i].pos.x, lelementos[i].pos.y)
        if ( d < lelementos[i].r) {
          vibrar();
          submenu = new SubMenu();
        }
        // console.log("distancia: " + d);
      }
    }
    else {
      submenu.clicked(mouseX, mouseY);
      //console.log("submenu");
    }
  }

  return false; //sugested
}

function vibrar (){
  navigator.vibrate(100); // tambien admite array [500, 200, 500, 200]
}

function pulsador (idx, estado){
  var estadostr = "Toggle";
  // if (estado == false)
  //   estadostr = "On"
  // else
  //   estadostr = "Off";
  var url = "http://" + ip + ":" + port + "/json.htm?type=command&param=switchlight&idx=" + idx + "&switchcmd=" + estadostr;
  httpGet(url);
  }

  function Elementos(x, y) {
  this.pos = createVector(x, y);
  this.r = 50;

  this.show = function() {
    fill(255, 204, 0);
    noStroke();
    //ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    image(bombilla_on, this.pos.x, this.pos.y, this.r*2, this.r*2);
  }
}

  function SubMenu() {
    this.r = 50;
    this.pos = [];
    this.alive = true;
    this.listo = false;

    var v = createVector(width/2, height/2-150);
    this.pos.push(v);
    v = createVector(width/2+150, height/2+120);
    this.pos.push(v);
    v = createVector(width/2-150, height/2+120);
    this.pos.push(v);

    this.show = function() {
    fill(255, 0, 0);
    noStroke();
    textSize(32);
    textAlign(CENTER);
    for (var i = 0; i < this.pos.length; i++) {
      ellipse(this.pos[i].x, this.pos[i].y, this.r*2, this.r*2);
      text(config.interruptores[i].name, this.pos[i].x, this.pos[i].y + this.r + 42);
      //console.log("i: " + i + " posx: " + this.pos[i].x);
    }
    this.listo = true;
  }

    this.clicked = function(_x, _y) {
      if (!this.listo) return;
      var pulsadovacio = true;
      for (var i = 0; i < this.pos.length; i++) {
          var d = dist(_x, _y, this.pos[i].x, this.pos[i].y)
          if ( d < this.r) {
            vibrar();
          console.log("click");
          pulsador(config.interruptores[i].idx, true);
          console.log(config.interruptores[i].idx);
          this.alive = false;
          pulsadovacio = false;
          break;
          }
      }
      if (pulsadovacio)
      this.alive = false;
    }
}
