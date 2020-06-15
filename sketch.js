var myStar;
var num_star = 800;
var allStars = [];
var hit = 0,
  hitwig = 0;
var odibeeSans;
var safeDur = 50;
let button;
let shipModels = [],
  shipModel, n = 0;
let tex, shiptex;
let cam;
var gameover = 0;
var score = 0;
var trashImg = [];
var backgroundImg;

function preload() {
  odibeeSans = loadFont("OdibeeSans-Regular.ttf");
  backgroundImg = loadImage("./assets/background.png");
  for (var j = 1; j < 14; j++) {
    var trash = loadImage("./assets/trash" + j + ".png");
    trashImg.push(trash);
  }

  for (var i = 1; i < 7; i++) {
    var models = loadModel("./spaceship" + i + ".obj", true);
    shipModels.push(models);
  }
  shipModel = shipModels[1];
}

// function mouseClicked() {
//   n = (n + 1) % 6;
//   shipModel = shipModels[n];
// }

function setup() {
  myCanvas = createCanvas(windowWidth,  windowHeight, WEBGL);
  cam = createCamera();
  perspective(PI / 2, width / height, 0.01, 50000);
  // debugMode();

  // setAttributes('antialias', true);
  colorMode(HSB);
  angleMode(DEGREES);


  //CREATE THE CUBE SPACE
  for (var i = 0; i < num_star; i++) {
    var stars = new star(200, random() * 120 + 120, color(random(120, 180), random(80) + 20, random(20, 100)), random(trashImg));
    allStars.push(stars);
  }
  // noCursor();
  frameRate(60);
  shiptex = loadImage("./DefaultMaterial_Base_Color.jpg");
  // tex = createGraphics(1000, 1000);
  // tex.background(255);
  // tex.image(shiptex,1000,1000);

}

function touchMoved() {
  return false; //CANVAS NO MOVING
}

function touchEnded() {
  // DeviceOrientationEvent.requestPermission() //MOBILE PHONE GYRO
}

function draw() {
  cam.lookAt(0, 0, 0);
  cam.setPosition(random(hitwig * 3) + (mouseX - width / 2) / 30, random(hitwig * 3) + (mouseY - height / 2) / 30, 700);
  // myCanvas.background(backgroundImg);
  // image(backgroundImg,0,0);
  blendMode(BLEND);
// background(lerpColor(color("#4e035b"), color("#08002a"), mouseY / height));
  push();
  clear();
  noStroke();
  texture(backgroundImg);
  translate(0,0,-28000);
  rectMode(CENTER);
  rect(0,0,windowWidth*100,windowHeight*100);
pop();

  // console.log(rotationX);
  // console.log("H=" + hitwig);
  // console.log("S=" + safeDur);
  // background(0);
  if (gameover == 0) {
    score++;
  }
  safeDur = constrain(safeDur + 1, 0, 100); //MAKE COLLISION COUNT ONLY ONCE
  // elx = constrain(map(rotationY, -20, 20, 1, width), 1, width);//X POSITION
  // ely = constrain(map(rotationX, 10, 60, 1, height), 1, height);//Y POSITION
  elx = mouseX;
  ely = mouseY;

  // DRAW A SPACESHIP
  push();
  translate(elx - width / 2 + random(hitwig / 5), ely - height * 0.55 + random(hitwig / 5), 500);
  rotateY(180);
  // rotateX(90);
  rotateZ((elx - width / 2) / 3 + 180);
  // stroke(frameCount % 360, 255, 255);
  stroke(0);
  strokeWeight(1);

  // noFill();
  // scale(1, 1, 0.5);
  // cone(50, 300, 3, 1, 0);
  translate(0, -50, 0);
  // scale(1, 1, 0.2);
  // cone(200, 100, 3, 1, 0);
  directionalLight(color(0, 0, 255), 10, 5, 10);
  directionalLight(color(0, 0, 255), 10, 5, 10);
  directionalLight(color(20, 30, 155), 10, 5, 10);
  directionalLight(color(200, 50, 55), -10, 5, -10);
  specularMaterial(100);
  texture(shiptex);
  // sphere(200);
  model(shipModel);
  rotateX(-90);
  translate(0, 150, 0);
  noStroke();
  blendMode(SCREEN);
  emissiveMaterial(15, 230, 155);
  cone(10 + random(-3, 3), 200, 24, 1, 0);
  translate(-20, 0, 0);
  cone(6 + random(-3, 3), 200, 24, 1, 0);
  translate(40, 0, 0);
  cone(6 + random(-3, 3), 200, 24, 1, 0);
  blendMode(BLEND);
  pop();

  //HP & SCORE
  push();
  translate((elx - width / 2) * 2, (ely - height / 2) * 2, -200);
  fill(255);
  rect(400, 0, 15, hitwig * 5 - 375);
  textFont(odibeeSans);
  textSize(100);
  textAlign(RIGHT);
  text('HP', 460, 120);
  text('SCORE: ' + score, -350, 120);
  noFill();
  pop();



  //COLLISION: CANVAS WIGGLE
  hitwig = constrain(hitwig - 1, 0, 75);
  myCanvas.position(0, 0.0 * windowHeight);

  for (var i = 0; i < allStars.length; i++) {
    // SHOW THE CUBESPACE
    var b = allStars[i];
    b.move();
    b.display();
    b.acc();
  }
  if (hitwig == 75 && hit > 5) {
    // Game Over & SCORE
    // noLoop();
    // clear();
    // background(0);
    fill(255);
    textFont(odibeeSans);
    textAlign(CENTER);
    translate(0, 0, -200);
    textSize(200);
    text('GAME OVER', 0, -200);
    textSize(100);
    text('YOUR SCORE: ' + score, 0, 100);

    // Restart Button
    button = createButton('Restart');
    button.size(width / 4, 100);
    button.style('font-size', 300);
    button.style('margin', 'auto');
    button.style('width', '25%');
    button.position(width * 0.375, height / 2);
    button.mousePressed(restt);
  }
}

function restt() {
  // Restart Button
  gameover = 0;
  button.hide();
  score = 0;
  // loop();
}

function star(_speed, _size, _color, _image) {
  this.x = random(-8, 8) * windowWidth;
  this.y = random(-8, 8) * windowHeight;
  this.z = random(-50000);
  this.speed = _speed;
  this.color = _color;
  this.size = _size;
  var zpos = this.z;
  var spd = this.speed;
  this.acc = function () {
    if (gameover == 0) {
      spd += 0.1; //acceleration
    }
  }
  this.move = function () {
    if (gameover == 0) {
      if (zpos < 0) {
        zpos += spd; //CUBE MOVE
      } else {
        this.x = random(-8, 8) * windowWidth;
        this.y = random(-8, 8) * windowHeight;
        zpos -= 50000; //CUBE WILL REBORN AT RANDOM POSITION
      }
    }
    if (hitwig == 75 && hit > 5) {
      gameover = 1;
      spd = this.speed;
    }
  }
  var randomAngle = random(360); //RANDOM CUBE ORIENTATION
  this.display = function () {
    stroke(this.color);
    strokeWeight(3 + zpos / 10000);
    noFill();

    push();
    translate(this.x, this.y, zpos);

    //CUBES ROTATE
    rotateX(frameCount / 10 + randomAngle);
    rotateY(frameCount / 10 + randomAngle);

    //CREATE CUBE
    // box(this.size);
    image(_image, 0, 0);

    //COLLISION: CACULATE DISTANCE BETWEEN SPACESHIP & CUBES
    if (gameover == 0) {
      var dis = dist(this.x, this.y, zpos, elx - width / 2, ely - height / 2, 0);
      if (dis < 250 && safeDur > 35) {
        hit++;
        hitwig += spd / 10;
        safeDur -= 49; //COLLISION SHOULD COUNTED ONLY ONCE
        console.log(hit);
      }
    }
    pop();
  }
}
