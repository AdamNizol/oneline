<template>
  <div class="mazeContainer">
    <div class="controls">

      <div class="controlRow">
        <p>Output:</p>
        <select v-model="outputType" >
          <option value="coloured" >Coloured</option>
          <option value="maze" >Maze</option>
          <option value="bw" >B&W</option>
        </select>

        <p>Size:</p>
        <input type="range" v-model="outputSize"  min="400" max="1000" step="1"  style="width:200px"/>
        <input type="number" v-model="outputSize" style="width: 4em"/>

      </div>

      <div class="controlRow">
        <p>Detail:</p>
        <input type="range" v-model="mazeDetail" min="31" max="87" step="2"  style="width:29.5em"/>
      </div>

      <div class="controlRow" v-show="outputType=='coloured'">
        <p>Line:</p>
        <input type="color" v-model="lineCol" />

        <p>Fill:</p>
        <input type="color" v-model="pathCol" />

        <p>Background:</p>
        <input type="color" v-model="wallCol" />
      </div>

      <div class="refreshRow">
        <div></div>
        <button @click="newMaze()">Refresh</button>
      </div>
    </div>

    <InterpretedView :mazeWidth="mazeWidth" :mazeHeight="mazeHeight" @updateShape="updateShape" :refresh="refreshImg" />

    <div class="row">
      <!-- Maze view -->
      <MazeView v-if="outputType=='maze'" :value="maze" :mazeWidth="mazeWidth" :mazeHeight="mazeHeight" :style="'width:'+outputSize+'px;height:'+outputSize+'px;'"/>

      <!-- Black & White view -->
      <div class="svgRep" v-if="outputType=='bw'" :style="'width:'+outputSize+'px;height:'+outputSize+'px;'">
        <svg viewBox="0 0 100 100" style="height: 100%; width: 100%" preserveAspectRatio="none" >
          <path :d="pathSvg + 'Z'" stroke="black" :stroke-width="1-(previousDetailLvl/220)" fill="none" />
        </svg>
      </div>

      <!-- Coloured view -->
      <div class="svgRep" :style="'width:'+outputSize+'px;height:'+outputSize+'px;'+'background-color: '+wallCol" v-if="outputType=='coloured'">
        <svg viewBox="0 0 100 100" style="height: 100%; width: 100%" preserveAspectRatio="none" >
          <path :d="pathSvg + 'Z'" :stroke="lineCol" :stroke-width="1-(previousDetailLvl/220)" :fill="pathCol" />
        </svg>
      </div>

    </div>

  </div>
</template>

<script>
import MazeView from './MazeView.vue';
import MazeGenerator from '@/MazeGenerator';
import ShapedMazeGenerator from '@/ShapedMazeGenerator';
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
      lineCol: '#FFC0CB',
      shape: null,
      refreshImg: false,
      previousDetailLvl: mazeDetail,
      outputType: "bw",
      outputSize: 400,
    }
  },
  computed: {
    path: function(){
      let height = this.maze.length;
      let width = this.maze[0].length;
      let unitH = 100/height;
      let unitW = 100/width;

      let mScan = new MazeScanner( ...this.getPathTile(this.maze) );
      let start = [mScan.x, mScan.y]
      let result = [ [unitW*start[0], unitH*(start[1]+1) ] ];

      let timesVisitingStart = 0;
      let timeVisitingStartRequired = 0;
      if(!this.maze[mScan.x+1][mScan.y]){
        timeVisitingStartRequired ++;
      }
      if(!this.maze[mScan.x-1][mScan.y]){
        timeVisitingStartRequired ++;
      }
      if(!this.maze[mScan.x][mScan.y+1]){
        timeVisitingStartRequired ++;
      }
      if(!this.maze[mScan.x][mScan.y-1]){
        timeVisitingStartRequired ++;
      }


      while( !(mScan.x == start[0] && mScan.y == start[1] && timesVisitingStart == timeVisitingStartRequired) ){
        if(mScan.x == start[0] && mScan.y == start[1]){
          timesVisitingStart++;
        }
        //check/move left then do the same progressively to the right

        mScan.turn('left');
        while( (this.maze[ mScan.y + mScan.dir[1] ][ mScan.x + mScan.dir[0] ]) ){ //spot closed
          let p = mScan.getPoints();
          for(let i = 0; i< p.length; i++){
            p[i][0] = p[i][0]*unitW;
            p[i][1] = p[i][1]*unitH
          }
          result = result.concat(p);
          mScan.turn('right');
        }
        mScan.move();
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
    newMaze(maze = null){
      if(maze){
        this.maze = maze;
      }else{
        if(this.shape){
          if(this.previousDetailLvl != this.mazeDetail){
            this.refreshImg = true;
          }else{
            this.updateShape(this.shape);
          }
        }else{
          this.maze = MazeGenerator.generateMaze(this.mazeWidth, this.mazeHeight);
        }
      }
    },
    getPathTile(tiles){
      for(let i = 0; i < tiles.length; i++){
        for(let j = 0; j < tiles[i].length; j++){
          if(!tiles[i][j]){ // path
            return [j,i];
          }
        }
      }

      return [1, 1] //no path
    },
    updateShape(newShape){
      this.previousDetailLvl = this.mazeDetail
      if(this.refreshImg){this.refreshImg=false}
      this.shape = newShape

      let shapeCopy = [];
      for (let i = 0; i < newShape.length; i++){
        shapeCopy[i] = newShape[i].slice();
      }
      this.newMaze( ShapedMazeGenerator.generateMaze( shapeCopy ) )
    },
  }

}
</script>

<style scoped lang="scss">
.mazeContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.row {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  >* {
    margin: 2px;
    padding: 0px;
  }
}
.svgRep{
  width: min(400px, 100vw);
  height: min(400px, 100vw);
  background-color: #eee
}
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #8b8b8b;
  border: 1px solid #555;
  border-top: 0;
  border-radius: 0 0 3px 3px;
  padding: 4px;
  p {
      font-weight: bold;
      margin-left: 0.2em;
      margin-right: 0.2em;
      margin-top: 0.2em;
      margin-bottom: 0.2em;
  }
  >p {
    margin: 0;
  }
  .controlRow{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .refreshRow{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    button{
      margin: 0;
      height: 2.5em;
      font-weight: bold;
      margin-top:0.5em;
    }
    width: 100%;
  }
}
</style>
