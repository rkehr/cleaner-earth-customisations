class Project {
  constructor(id, x, y, scale, animState, size , title, description, type, image, link = "#") {
    this.id = id;
    this.title = title;
    this.elementId = 'project-card-' + this.id;
    this.x = x*scale;
    this.y = y*scale;
    this.infoX = this.x;
    this.infoY = this.y;
    this.xRatio = x;
    this.yRatio = y;
    this.image = image;
    this.link = "";
    this.link += link;
    this.description = description;
    this.size = size;
    this.isActive = false;
    this.animState = animState;
    this.description = description;
    this.type = type;
    //==============================================================
    //========== ADD PROJECT CARDS BENEATH THE MAP
    //==============================================================

  }

  setupCards(){
    jQuery( "#project-cards" ) . append('<div id="' + this.elementId + '" class="project-card"><h3>' + this.title + '</h3><p>' + this.description + '</p><a href="' + this.link + '">Learn More!</a></div>');
    if(this.id == 0){
      this.click();
    }
  }

  deactivate(){
    jQuery( '#'+ this.elementId ) . removeClass('project-card-active');
    this.isActive = false;
  }

  checkForHover(){
    if(dist(this.x,this.y,mouseX,mouseY) <= this.size/2){
      return true;
    }else if(dist(this.x,this.y,mouseX,mouseY) > this.size/2){
      return false;
    }
  }

  click(){
    if(this.checkForHover()){
      //window.open("https://cleaner.earth/" + this.link)
      if( !this.isActive ){
        flushCards();
        jQuery( '#'+ this.elementId ) . addClass( "project-card-active" );
        this.isActive = true;
      }else{
        flushCards()
      }
    }
  }

  showCircle(){
    //let cl = color(projectTypeColors[this.type]);
    //cl.setAlpha(127);
    fill(projectTypeColors[this.type]);
    strokeWeight(1);
    ellipse(this.x, this.y, this.size * this.animState, this.size * this.animState);
    if(this.isActive){
      stroke(200,100,100,170);
      strokeWeight(3);
    }
    ellipse(this.x, this.y, this.size, this.size);
    stroke(230,170);
    this.animState = ( this.animState + (0.007-(0.005 * this.animState)) ) % 1 ;
  }
  showMarkers(){
    imageMode(CENTER);
    //projectTypeMarkers[this.type].resize(marker.width/2 , marker.height /2);
    image(projectTypeMarkers[this.type], this.x, this.y - this.size/4,this.size/3,this.size/2);
  }
  updateScale(scale){
    this.x = this.xRatio * scale;
    //print("test");
    this.y = this.yRatio * scale;
    this.size = scale /20;
  }
}
