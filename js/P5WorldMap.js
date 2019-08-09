let width = window.innerWidth;
let height = window.innerHeight;
let maintenance = true;
let p5map;
let marker;
let size = width/20;
let innerSize = 0;
let country;
let output = "";
let value = 0;
let projects = [];
let json;
let pluginPath = "../wp-content/plugins/cleaner-earth-customisations/";
let opacity = 127;
function preload(){
  json = loadJSON( pluginPath + "/js/json/projects.json");
}
function setup() {
  marker = loadImage(pluginPath + '/img/map_icon_ce.png');
  p5map = loadImage(pluginPath + '/img/world.topo.bathy.200407.3x5400x2700.jpg');
  projectTypeColors = {
    "reference" : color(170, opacity),
    "current" : color(201, 212, 57, opacity),
    "planned" : color(135 ,181, 255, opacity)
  };
  projectTypeMarkers = {
    "reference" : loadImage(pluginPath + '/img/map_icon_reference.png'),
    "current" : loadImage(pluginPath + '/img/map_icon_ce.png'),
    "planned" : loadImage(pluginPath + '/img/map_icon_future.png')
  };


  //JSON to Project Objects
  let ctr = 0;
  while (json[ctr] != undefined){
    projects[ctr] = new Project(json[ctr].id, json[ctr].xRatio ,json[ctr].yRatio, width,random(), size, json[ctr].title, json[ctr].description, json[ctr].type, null, json[ctr].link);
    ctr++;
  }
  projects.forEach(function(project){
    //print(project);
  });
  var cnv = createCanvas(width, width/2-10);
  cnv.parent('cl_ear_project_map');
  jQuery( '#cl_ear_project_map' ) . append( '<div id="project-cards"></div>' );
  projects.forEach(function(project){
    project.setupCards();
  });
}

function draw() {
  p5map.resize(width,0);
  background(255);
  imageMode(CORNER);
  image(p5map, 0, 0);
  fill(201,212,57,75);


  //Draw Circles
  //============================================================================
  projects.forEach(function(project){
    project.showCircle();
  });
  //Draw Markers
  //============================================================================
  projects.forEach(function(project){
    project.showMarkers();

  });
}

function flushCards(){
  projects.forEach(function(project){
    project.deactivate();
  });
}

function windowResized(){
  width = window.innerWidth;
  height = window.innerHeight;
  // alert(height);
  resizeCanvas(width, width/2-10);
  //document.getElementById('project_map_spacer') . style . height = height;
  projects.forEach(function(project){
    project.updateScale(width, size = width/20);
  });

}
function mouseClicked(){
  if (maintenance) {
    output += "[" + mouseX / width + ", " + mouseY / width /*+ ", " + size + ", \"" + country + "\"],"*/+"]";
    projects.forEach(function(project){
      project.click();
    });
  } else{
    projects.forEach(function(project){
      project.click();
    });
  }


}

function keyPressed(){
  if (key == "p") {
    print(output);
  }
}
