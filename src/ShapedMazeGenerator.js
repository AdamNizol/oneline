class ShapedMazeGenerator {
  static generateMaze(shape){
    let bounds = {
      x1: 0,
      y1: 0,
      x2: shape[0].length-1,
      y2: shape.length-1
    }
    let result = this.getShapeCopy(shape)

    this.carvePath(result);
    return result;
   }

   static carvePath(maze){
     let visited = this.getShapeCopy(maze);
     let curPos = this.getInitialPathTile(maze);
     let stack = [];

     visited[curPos.y][curPos.x] = 2;
     while(stack.length > 0 || this.getPossibleMoves(curPos, visited).length > 0){
       let moves = this.getPossibleMoves(curPos, visited);
       if(moves.length > 0){
         let chosen = Math.floor(Math.random()*moves.length);
         stack.push({x:curPos.x, y:curPos.y})
         for(let i=0; i<2; i++){
           curPos = {x:curPos.x+(moves[chosen].x/2) ,y:curPos.y+(moves[chosen].y/2) }
           visited[curPos.y][curPos.x] = 2;
         }
       }else{
         curPos = stack.pop();
       }
     }

     for(let yi=0; yi<maze.length; yi++){
       for(let xi=0; xi<maze[yi].length; xi++){
         if(!visited[yi][xi]){
           maze[yi][xi] = 1;
         }else if (visited[yi][xi] == 2) {
           maze[yi][xi] = 0;
         }
       }
     }

   }

   static getShapeCopy(shape){
     let result = [];
     for (let i = 0; i < shape.length; i++){
       result[i] = shape[i].slice();
     }
     return result
   }

   static getPossibleMoves(pos, visited){
     let result = [];
     if(!visited[pos.y-2][pos.x]){
       result.push({x:0, y:-2});
     }
     if(!visited[pos.y+2][pos.x]){
       result.push({x:0, y:2});
     }
     if(!visited[pos.y][pos.x-2]){
       result.push({x:-2, y:0});
     }
     if(!visited[pos.y][pos.x+2]){
       result.push({x:2,y:0});
     }
     return result;
   }

   static getInitialPathTile(tiles){
     for(let i = 0; i < ((tiles.length-1)/2); i++){
       for(let j = 0; j < ((tiles[i].length-1)/2); j++){
         if(!tiles[2*i + 1][2*j + 1]){ // path found
           return {y:2*i+1, x:2*j+1};
         }
       }
     }

     return null;
   }
}

export default ShapedMazeGenerator;
