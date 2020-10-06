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
  data(){
    return{
      p5sketch: null,
    }
  },
  methods: {
    setup(sketch) {
      this.p5sketch = sketch;

      sketch.resizeCanvas(400, 400);
      sketch.background("black");
      let fileInput = sketch.createFileInput(this.importImg);
      fileInput.position(0,0);

    },
    draw(sketch) {

    },
    importImg(file){
      console.log(file)
      let img = this.p5sketch.createImg(file.data, '');
      img.hide();
      this.p5sketch.image(img,0,0,400,400);
    }
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
