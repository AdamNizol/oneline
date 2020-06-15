<template>
  <div class="mazeContainer">
    <div class="row">
      <MazeView :value="maze" />
      <div class="svgRep">
        <svg viewBox="0 0 100 100" style="height: 100%; width: 100%" preserveAspectRatio="none" >
          <path v-for="n in Math.floor(path.length/2)"
          :d="'M ' + path[(n-1)*2][0]+ ' ' + path[(n-1)*2][1] + ' Q '+ path[(n-1)*2+1][0] +' '+ path[(n-1)*2+1][1] +' '+ path[(n-1)*2+2][0] +' '+ path[(n-1)*2+2][1]"
          stroke="black" stroke-width="1" fill="none" :key="n" />
        </svg>
      </div>
    </div>

    <div class="overlaid">

      <MazeView :value="maze" openColour="red" closedColour="rgb(60,0,0)" />
      <div class="svgRepOverlay">
        <svg viewBox="0 0 100 100" style="height: 100%; width: 100%" preserveAspectRatio="none" >
          <path v-for="n in Math.floor(path.length/2)"
          :d="'M ' + path[(n-1)*2][0]+ ' ' + path[(n-1)*2][1] + ' Q '+ path[(n-1)*2+1][0] +' '+ path[(n-1)*2+1][1] +' '+ path[(n-1)*2+2][0] +' '+ path[(n-1)*2+2][1]"
          stroke="pink" stroke-width="1" fill="none" :key="n" />
        </svg>
      </div>

    </div>

  </div>
</template>

<script>
import MazeView from './MazeView.vue'
import MazeGenerator from '@/MazeGenerator';
import MazeScanner from '@/MazeScanner'

export default {
  name: 'OneLine',
  components: {
    MazeView
  },
  data(){
    return {
      maze: MazeGenerator.generateMaze(43, 43)
    }
  },
  computed: {
    path: function(){
      let height = this.maze.length;
      let width = this.maze[0].length;
      let unitH = 100/height;
      let unitW = 100/width;

      let mScan = new MazeScanner();
      let start = [mScan.x, mScan.y]
      let result = [ [unitW, 1.5*unitH] ];

      let timesVisitingStart = 0;
      let timeVisitingStartRequired = 0;
      if(this.maze[mScan.x+1][mScan.y]){
        timeVisitingStartRequired ++;
      }
      if(this.maze[mScan.x-1][mScan.y]){
        timeVisitingStartRequired ++;
      }
      if(this.maze[mScan.x][mScan.y+1]){
        timeVisitingStartRequired ++;
      }
      if(this.maze[mScan.x][mScan.y-1]){
        timeVisitingStartRequired ++;
      }


      while( !(mScan.x == start[0] && mScan.y == start[1] && timesVisitingStart == timeVisitingStartRequired) ){
        if(mScan.x == start[0] && mScan.y == start[1]){
          timesVisitingStart++;
        }
        //check/move left then do the same progressively to the right

        mScan.turn('left');
        while( (this.maze[ mScan.y + mScan.dir[1] ][ mScan.x + mScan.dir[0] ]) ){ //spot closed
          //TODO: add points to result
          let p = mScan.getPoints();
          for(let i = 0; i< p.length; i++){
            p[i][0] = p[i][0]*unitW;
            p[i][1] = p[i][1]*unitH
          }
          result = result.concat(p);
          //result.push([mScan.x*unitW, mScan.y*unitH]) //not right
          //result.push([(mScan.x+0.5)*unitW, mScan.y*unitH]) //not right
          mScan.turn('right');
        }
        mScan.move();

        //console.log(mScan.dir);
        //mScan.turn('left');
      }

      mScan.turn('left');
      let p = mScan.getPoints();
      for(let i = 0; i< p.length; i++){
        p[i][0] = p[i][0]*unitW;
        p[i][1] = p[i][1]*unitH
      }
      result = result.concat(p);

      return result;
      //return [ [10,10], [25,0], [50,50] ]
    },
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mazeContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.svgRep{
  width: 400px;
  height: 400px;
  background-color: rgb(100,100,130);
}
.svgRepOverlay{
  width: 400px;
  height: 400px;
  position: absolute;
}
.overlaid {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>