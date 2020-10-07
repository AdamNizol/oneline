<template>
  <div class="displayContainer">
    <vue-p5 class="screen" v-on="{ setup, draw }"></vue-p5>
  </div>
</template>

<script>
import VueP5 from "vue-p5";

export default {
  components: {
    "vue-p5": VueP5
  },
  name: "InterpretedView",
  props: ['mazeWidth', 'mazeHeight'],
  data(){
    return{
      p5sketch: null,
      img: null,
      imgSize: 400,
    }
  },
  methods: {
    setup(sketch) {
      this.p5sketch = sketch;

      sketch.resizeCanvas(this.imgSize, this.imgSize);
      sketch.background("black");
      let fileInput = sketch.createFileInput((file) => {
        this.img = sketch.createImg(file.data,'');
        this.img.hide();
        sketch.loop();
      });
      fileInput.position(0,0);
      sketch.noLoop();
    },
    draw(sketch) {
      sketch.background("black");
      sketch.strokeWeight(0.25)
      if(this.img && this.img.width > 0){
        sketch.noLoop();
        let shape = [];

        let scale = this.imgSize/Math.max(this.img.width, this.img.height);
        let size = {w: this.img.width*scale, h: this.img.height*scale}
        sketch.image(this.img, (this.imgSize-size.w)/2, (this.imgSize-size.h)/2, size.w, size.h);
        sketch.loadPixels();
        sketch.background("black");
        let d = sketch.pixelDensity();
        let unitSize = Math.ceil(this.imgSize/Math.min(this.mazeWidth, this.mazeHeight));
        for(let xi = 0; xi < this.mazeWidth; xi++){
          let shapeRow = []
          for(let yi = 0; yi < this.mazeHeight; yi++){

            let pixSum = 0;
            for(let xn = 0; xn < unitSize; xn++){
              for(let yn = 0; yn < unitSize; yn++){
                let index = this.getPixelIndex(xi*unitSize + xn, yi*unitSize + yn, this.imgSize, d);
                for(let j=0; j<3; j++){
                  let pixVal = (sketch.pixels[index+j]/255)
                  pixSum += pixVal
                }
              }
            }
            if(pixSum > (unitSize*unitSize)/2 ){
              shapeRow.push(0)
              sketch.rect(xi*(unitSize), yi*(unitSize), unitSize, unitSize)
            }else{
              shapeRow.push(1)
            }
          }
          shape.push(shapeRow);
        }

        console.table(shape)
        this.$emit("updateShape", shape);
      }
    },

    getPixelIndex(x, y, cWidth, d){
      return ( 4*( (cWidth*(y*d) ) + (x*d) ) )
    },

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.screen{
  display: flex;
}
.displayContainer{
  position: relative;
}
</style>
