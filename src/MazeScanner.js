class MazeGenerator {
  constructor(x = 1, y = 1){
    this.x = x;
    this.y = y;
    this.dir = [1,0];
  }

  turn(dir = 'right'){
    let turnedDir = [this.dir[1], this.dir[0]];
    if(dir == 'right'){
      turnedDir[0] *= -1;
    }else{
      turnedDir[1] *= -1;
    }

    this.dir = turnedDir;
  }

  move(){
    this.x += this.dir[0];
    this.y += this.dir[1];
  }

  getPoints(){
    let pos = [this.x + 0.5, this.y + 0.5];
    let pMid = [ pos[0] + (this.dir[0]/2) , pos[1] + (this.dir[1]/2) ]

    this.turn('left');
    let pCorner = [pMid[0]+ (this.dir[0]/2), pMid[1] + (this.dir[1]/2)]
    this.turn('right');
    //console.log(pMid)

    return [pCorner, pMid];
  }

}

export default MazeGenerator;
