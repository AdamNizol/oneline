<template>
  <div class="container">
    <!-- <div class="row" v-for="(mazeRow, rowIndex) in value" :key="rowIndex" >
      <div v-for="(cell, cellIndex) in mazeRow" :key="cellIndex" :style="'background-color: '+ ( (!!cell) ? closedColour : openColour )" :class="[ 'cell' ]" > </div>
    </div> -->
    <div class="row" v-for="(mazeRow, rowIndex) in binGrid" :key="rowIndex" >
      <div v-for="(cell, cellIndex) in mazeRow" :key="cellIndex" :style="'background-color: '+ ( (cellIndex%2 == 0) ? closedColour : openColour )+ '; width: '+( cell*(100/mazeRow[0]) )+'%;' " :class="[ 'cell' ]" > </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazeView',
  props: {
    value: {},
    openColour: {
      default: 'white'
    },
    closedColour: {
      default: 'black'
    },
    mazeWidth:{
      default: 43
    },
    mazeHeight:{
      default: 43
    }
  },
  computed: {
    binGrid: function(){
      let result = [];

      for(let i = 0; i < this.value.length; i++){
        let row = [];
        let prev = false;
        let count = 0;
        for(let j = 0; j < this.value[i].length; j++){
          if(!!this.value[i][j] == prev){
            count++;
          }else{
            if(count > 0){
              row.push(count);
            }
            count = 1
            prev = !!this.value[i][j]
          }
        }
        row.push(count);

        result.push(row);
      }

      return result;
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  width: min(400px, 100vw);
  height: min(400px, 100vw);
  background-color: black;
  display: flex;
  flex-direction: column;

  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    //background-color: blue;
    flex-grow: 1;
    .cell {
      //background-color: red;
      //flex-grow: 1;
      //border: 1px solid blue;
    }

    .open {
      background-color: white;
    }
    .closed {
      background-color: black;
    }

  }
}
</style>
