class MazeGenerator {

  //returns a maze of width x height (minus one row/column if even)
  static generateMaze(width, height){
    if( (width % 2) == 0 ){
      width = width - 1;
    }
    if( (height % 2) == 0 ){
      height = height - 1;
    }

    let result = [];
    for(let i = 0; i < height; i++){
      result.push([]);
      for(let j = 0; j < width; j++){
        if(i == 0 || j == 0 || i == (height-1) || j == (width-1)){
          result[i].push(1);
        }else{
          result[i].push(0);
        }

      }
    }

    this.populateSection(result, 1, 1, width-2, height-2);
    
    return result;
   }

   static populateSection(maze, startX, startY, endX, endY){
     let width = endX - startX + 1;
     let height = endY - startY + 1;

     if(width <= 1 || height <= 1){
       return;
     }

     //dividerX = startY
     if( width > height ){
       let dividerX = 2*Math.floor( Math.random()*( (width-1)/2 ) ) + startX + 1;
       let gap = 2*Math.floor( Math.random()*( (height+1)/2 ) ) + startY

       for(let i = startY; i <= endY; i++){
         if(i != (gap) ){
           maze[i][dividerX] = 1;
         }
       }

       this.populateSection(maze, startX, startY, dividerX-1, endY);
       this.populateSection(maze, dividerX+1, startY, endX, endY);

     }else{
       let dividerY = 2*Math.floor( Math.random()*( (height-1)/2 ) )  + startY + 1;
       let gap = 2*Math.floor( Math.random()*( (width+1)/2 ) ) + startX

       for(let i = startX; i <= endX; i++){
         if(i != (gap) ){
           maze[dividerY][i] = 1;
         }
       }

       this.populateSection(maze, startX, startY, endX, dividerY-1);
       this.populateSection(maze, startX, dividerY+1, endX, endY);

     }


   }
}

export default MazeGenerator;
