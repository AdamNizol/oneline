<template>
  <div class="mazeContainer">
    <div class="controls">
      <div class="controlRow">
        <p>Path Colour:</p>
        <input type="color" v-model="pathCol" />

        <p>Wall Colour:</p>
        <input type="color" v-model="wallCol" />

        <p>Line Colour:</p>
        <input type="color" v-model="lineCol" />

        <button style="margin-left: 1em;" @click="newMaze">New</button>
      </div>

      <p>Detail:</p>
      <input type="range" v-model="mazeDetail" min="31" max="61" step="2"  style="width:400px"/>

    </div>

    <div class="row">
      <InterpretedView :mazeWidth="mazeWidth" :mazeHeight="mazeHeight" />
      <MazeView :value="maze" />
      <div class="svgRep">
        <svg viewBox="0 0 100 100" style="height: 100%; width: 100%" preserveAspectRatio="none" >
          <path :d="pathSvg" stroke="black" stroke-width="1" fill="none" />
        </svg>
      </div>

      <div class="overlaid">
        <MazeView :value="maze" :openColour="pathCol" :closedColour="wallCol" />
        <div class="svgRepOverlay">
          <svg viewBox="0 0 100 100" style="height: 100%; width: 100%" preserveAspectRatio="none" >
            <path :d="pathSvg" :stroke="lineCol" stroke-width="1" fill="none" />
          </svg>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import MazeView from './MazeView.vue';
import MazeGenerator from '@/MazeGenerator';
import MazeScanner from '@/MazeScanner';
import InterpretedView from './InterpretedView.vue';

export default {
  name: 'OneLine',
  components: {
    MazeView, InterpretedView
  },
  data(){
    let mazeDetail = 47;
    return {
      maze: MazeGenerator.generateMaze(mazeDetail, mazeDetail),
      mazeDetail: mazeDetail,
      pathCol: '#D01F1F',
      wallCol: '#400A0A',
      lineCol: '#FFC0CB'
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

    pathSvg: function(){
      let result = "M ";
      if(this.path.length > 1){
        result += this.path[0][0] + ' ' + this.path[0][1];
        result += " S ";
        for(let i=1; i< this.path.length; i++){
          result += this.path[i][0] + ' ' + this.path[i][1] + ' ';
        }
      }

      return result;
    },

    mazeWidth: function(){
      return this.mazeDetail
    },
    mazeHeight: function(){
      return this.mazeDetail
    },
  },
  methods: {
    newMaze(){
      this.maze = MazeGenerator.generateMaze(this.mazeWidth, this.mazeHeight);
    }
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
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  >* {
    margin: 0px;
    padding: 0px;
  }
}
.svgRep{
  width: min(400px, 100vw);
  height: min(400px, 100vw);
  background-color: rgb(100,100,130);
}
.svgRepOverlay{
  width: min(400px, 100vw);
  height: min(400px, 100vw);
  position: absolute;
}
.overlaid {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
      font-weight: bold;
      margin-left: 0.3em;
  }
  >p {
    margin: 0;
  }
  .controlRow{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>
