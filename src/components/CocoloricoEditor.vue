<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="addImageFromMenu"
      >
        <el-submenu v-for="category in getCategories" :index="category">
          <template slot="title">
            <img :src="'categories/'+category+'.png'" width="64" height="64">
          </template>
          <el-menu-item v-for="logo in logos[category]" :key="logo" :label="logo" :index="logo">
            <img :src="category + '/'+logo+'.png'" width="24" height="24">
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-main>
      <el-container>
      <el-aside width="1225px" v-show="!isEditable">
        <img width="1200" height="800" ref="preview" src>
      </el-aside>
      <el-aside width="1225px" v-show="isEditable">
        <canvas id="background" tabindex="0"></canvas>
      </el-aside>
      <el-main>
        <el-header>Cocolorico !</el-header>

        <el-container>
          <el-col class="params-panel">
            <el-row>
              <el-col :span="4" class="col-label col-text-center">
                <label>Police</label>
              </el-col>
              <el-col :span="4">
                <el-select
                  v-model="currentTextObjectConfig.fontFamily"
                  placeholder="Police"
                  v-bind:disabled="!isTextSelected || !isEditable"
                >
                  <el-option v-for="font in allFonts" :key="font" :label="font" :value="font">
                    <span :style="'font-family:'+font">{{ font }}</span>
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4" class="col-label col-text-center">
                <label>Graisse</label>
              </el-col>
              <el-col :span="4">
                <el-select
                  v-model="currentTextObjectConfig.fontWeight"
                  placeholder="font weight"
                  v-bind:disabled="!isTextSelected || !isEditable"
                >
                  <el-option v-for="font in fontWeights" :key="font" :label="font" :value="font"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4" class="col-label col-text-center">
                <label>Style</label>
              </el-col>
              <el-col :span="4">
                <el-select
                  v-model="currentTextObjectConfig.fontStyle"
                  placeholder="font weight"
                  v-bind:disabled="!isTextSelected || !isEditable"
                >
                  <el-option v-for="font in fontStyles" :key="font" :label="font" :value="font"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="10">
                <el-checkbox v-model="currentTextObjectConfig.underline">Underline</el-checkbox>
                <el-checkbox v-model="currentTextObjectConfig.linethrough">Line through</el-checkbox>
                <el-checkbox v-model="currentTextObjectConfig.overline">Overline</el-checkbox>
              </el-col>
            </el-row>
            <el-row class="empty"></el-row>
            <el-row>
              <el-col :span="4" class="col-label col-text-left">Ajouter bloc texte :</el-col>
              <el-col :span="1">
                <el-button
                  icon="el-icon-circle-plus"
                  type="success"
                  v-bind:disabled="!isEditable"
                  v-on:click="addTextBlock"
                  circle
                  size="small"
                ></el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="col-label col-text-left">
                <label>Couleur de fond</label>
              </el-col>
              <el-col :span="16">
                <el-select
                  v-model="mainColor"
                  placeholder="Couleur de fond"
                  v-bind:disabled="!isEditable"
                >
                  <el-option
                    v-for="mainColor in mainColors"
                    :key="mainColor"
                    :label="mainColor"
                    :value="mainColor"
                  >
                    <el-row>
                      <el-col :span="16">
                        <span>{{ mainColor }}</span>
                      </el-col>
                      <el-col :span="8">
                        <div class="color-box" :style="'background:'+mainColor+';'"></div>
                      </el-col>
                    </el-row>
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="col-label col-text-left">
                <label>Couleur texte</label>
              </el-col>
              <el-col :span="16">
                <el-select
                  v-model="currentTextObjectConfig.fill"
                  placeholder="La couleur du texte"
                  v-bind:disabled="!isTextSelected  || !isEditable"
                >
                  <el-option
                    v-for="fillColor in mainColors"
                    :key="fillColor"
                    :label="fillColor"
                    :value="fillColor"
                  >
                    <el-row>
                      <el-col :span="16">
                        <span>{{ fillColor }}</span>
                      </el-col>
                      <el-col :span="8">
                        <div class="color-box" :style="'background:'+fillColor+';'"></div>
                      </el-col>
                    </el-row>
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="col-label col-text-left">
                <label>Text align</label>
              </el-col>
              <el-col :span="16">
                <el-select
                  v-model="currentTextObjectConfig.textAlign"
                  placeholder="Alignement"
                  v-bind:disabled="!isTextSelected  || !isEditable"
                >
                  <el-option
                    v-for="alignment in alignments"
                    :key="alignment"
                    :label="alignment"
                    :value="alignment.toLowerCase()"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="empty"></el-row>
            <el-row>
              <el-col :span="4" class="col-label col-text-left">
                <label>Thunder Stroke</label>
              </el-col>
              <el-col :span="4">
                <el-color-picker
                  v-model="currentTextObjectConfig.stroke"
                  size="mini"
                  color-format="hex"
                ></el-color-picker>
              </el-col>
              <el-col :span="16">
                <el-slider
                  v-model="currentTextObjectConfig.strokeWidth"
                  :min="0"
                  :max="10"
                  :step="0.1"
                  show-input
                  v-bind:disabled="!isTextSelected || !isEditable"
                ></el-slider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="col-label col-text-left">
                <label>Font size</label>
              </el-col>
              <el-col :span="16">
                <el-slider
                  v-model="currentTextObjectConfig.fontSize"
                  :min="1"
                  :max="120"
                  :step="1"
                  show-input
                  v-bind:disabled="!isTextSelected  || !isEditable"
                ></el-slider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="col-label col-text-left">
                <label>Line height</label>
              </el-col>
              <el-col :span="16">
                <el-slider
                  v-model="currentTextObjectConfig.lineHeight"
                  :min="0"
                  :max="10"
                  :step="0.1"
                  show-input
                  v-bind:disabled="!isTextSelected  || !isEditable"
                ></el-slider>
              </el-col>
            </el-row>

            <el-row type="flex" justify="center">
              <el-col :span="8">
                <el-button
                  type="primary"
                  v-bind:disabled="!isEditable"
                  v-on:click="moveForward"
                >avancer</el-button>
              </el-col>
              <el-col :span="4" class="col-label col-text-center">et</el-col>
              <el-col :span="8">
                <el-button
                  type="primary"
                  v-bind:disabled="!isEditable"
                  v-on:click="moveBackward"
                >reculer</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-switch
                v-model="isEditable"
                active-text="Edition en cours"
                inactive-text="Mode Preview"
                v-on:change="saveToPng"
              ></el-switch>
            </el-row>
            <hr>
            <el-row>
              <a ref="downloadPng" href="#" download="cocoloriage.png" v-show="false"></a>
              <el-button type="primary" v-on:click="downloadPng" icon="el-icon-download">Télécharger</el-button>
            </el-row>
          </el-col>
        </el-container>
      </el-main>
      </el-container>
    </el-main>
    <el-footer align="right">copyright 2018-2019 @cocolorico v{{version}}</el-footer>
  </el-container>
</template>

<script scoped>
import { fabric } from "fabric";
import { version } from "../../package.json";

let FontFaceObserver = require("fontfaceobserver");

export default {
  name: "CocoloricoEditor",
  props: {
    msg: String
  },

  data() {
    return {
      currentTextObjectConfig: {
        fontFamily: "Times New Roman",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: 5,
        underline: false,
        linethrough: false,
        overline: false,
        lineHeight: 1.16,
        textAlign: "left",
        fill: "white",
        strokeWidth: 1,
        stroke: "#ffffff"
      },
      isTextSelected: false,
      newText: "Tapes ton texte ici !",
      logo: "logo",
      externalLogo: "",
      newImageUrl: "",
      mainColor: "darkmagenta",
      logos: require("./logos.json"),
      mainColors: require("./cocoricolors.json"),
      fonts: require("./fonts.json"),
      gofonts: require("./gofonts.json"),
      alignments: ["Left", "Center", "Justify", "Right"],
      isEditable: true,
      fontStyles: ["", "normal", "italic", "oblique"],
      fontWeights: ["bold", "normal", 400, 600, 800],
      version: version,
      activeIndex: "1"
    };
  },

  mounted() {
    this.$canvas = new fabric.Canvas("background", {
      width: 1200,
      height: 800,
      backgroundColor: "white"
    });

    this.$canvas.upperCanvasEl.setAttribute("tabindex", "1");
    this.$canvas.upperCanvasEl.addEventListener("keydown", this.onKeyDown);

    let cocoloricopyright = new fabric.Text("Cocoloricopyright 2019", {
      left: 10,
      top: 780,
      fontSize: 10,
      fontWeight: "bold"
    });
    this.$canvas.add(cocoloricopyright);

    this.registerTextWatcher();

    this.$canvas.on("selection:cleared", this.onObjectSelected);

    this.$canvas.on("selection:created", this.onObjectSelected);

    this.$canvas.on("selection:updated", this.onObjectSelected);
    this.$canvas.renderAll();

    this.saveToPng();
  },

  methods: {
    /**
     * registerTextWatcher - map defaut wtacher for main currentTextObjectConfig values
     *
     */
    registerTextWatcher() {
      Object.keys(this.currentTextObjectConfig)
        .filter(confKey => confKey !== "fontFamily")
        .forEach(confKey =>
          this.$watch("currentTextObjectConfig." + confKey, newVal =>
            this.setActiveProp(confKey, newVal)
          )
        );
    },
    onObjectSelected(evt) {
      let currentObject = this.$canvas.findTarget(evt);
      this.isTextSelected = false;
      if (!!currentObject) {
        this.isTextSelected = !(currentObject.type === "image");
        this.currentTextObjectConfig = currentObject.toObject();
      }
    },
    onKeyDown(evt) {
      if (evt.code === "Backspace" || evt.code === "Delete") {
        this.deleteActiveObject();
      }
    },

    deleteActiveObject() {
      var object = this.$canvas.getActiveObject();
      if (!object) {
        return;
      }
      this.$canvas.remove(object);
    },

    setActiveProp(name, value) {
      var object = this.$canvas.getActiveObject();
      if (!object) {
        return;
      }

      object.set(name, value).setCoords();
      this.update();
      this.$canvas.renderAll();
    },

    update() {
      if (!this.$canvas) {
        return;
      }
      this.$canvas.fire("object:modified");
      this.$canvas.requestRenderAll();
    },
    loadAndUse(font) {
      let myfont = new FontFaceObserver(font);
      let _self = this;
      myfont
        .load()
        .then(function() {
          // when font is loaded, use it.
          _self.setActiveProp("fontFamily", font);
        })
        .catch(function(e) {
          console.error(e);
        });
    },

    saveToPng() {
      this.$refs.preview.src = this.$canvas.toDataURL("image/png");
    },

    downloadPng() {
      this.$refs.downloadPng.href = this.$canvas.toDataURL("image/png");
      this.$refs.downloadPng.click();
    },

    makeLine(coords, color) {
      return new fabric.Line(coords, {
        fill: color,
        stroke: color,
        strokeWidth: 5,
        selectable: false,
        originX: "left",
        originY: "top"
      });
    },

    moveForward() {
      let object = this.$canvas.getActiveObject();
      if (!object) {
        return;
      }
      object.bringForward(true);

      this.$canvas.requestRenderAll();
    },
    moveBackward() {
      let object = this.$canvas.getActiveObject();
      if (!object) {
        return;
      }
      object.sendBackwards(true);

      this.$canvas.requestRenderAll();
    },

    addTextBlock() {
      let newTextbox = new fabric.Textbox(this.newText, {
        left: 50,
        top: 400,
        width: 400,
        fontSize: 30,
        fontStyle: "italic",
        borderColor: "green",
        textAlign: "center"
      });

      this.$canvas.add(newTextbox).setActiveObject(newTextbox);
    },
    addImageFromMenu(key, keyPath) {
      let _self = this;
      let baseUrl =
        process.env.NODE_ENV === "production"
          ? "http://evifere.lescigales.org/cocolorico/animals/"
          : "./";

      fabric.Image.fromURL(
        baseUrl + keyPath.join("/") + ".png",
        function(oImg) {
          oImg.set("left", 125).set("top", 100);
          _self.$canvas.add(oImg);
        },
        { crossOrigin: "Anonymous" }
      );
    }
  },
  computed: {
    allFonts() {
      return this.fonts.concat(this.gofonts);
    },
    getCategories() {
      return Object.keys(this.logos);
    }
  },
  watch: {
    "currentTextObjectConfig.fontFamily"() {
      if (this.gofonts.includes(this.currentTextObjectConfig.fontFamily)) {
        this.loadAndUse(this.currentTextObjectConfig.fontFamily);
      } else {
        this.setActiveProp(
          "fontFamily",
          this.currentTextObjectConfig.fontFamily
        );
      }
    },

    mainColor: function() {
      this.setActiveProp("textBackgroundColor", this.mainColor);
      this.setActiveProp("backgroundColor", this.mainColor);
      this.setActiveProp("stroke", this.mainColor);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.page {
  display: inline-flex;
}

canvas,
.el-aside img {
  border: 1px solid black;
}

.el-aside {
  overflow: hidden;
  min-height: 706px;
}

.el-header {
  font-size: 30px;
  font-weight: bold;
}

.el-footer {
  font-size: 20px;
  font-weight: italic;
}

.params-panel .el-row {
  padding-top: 0.6em;
}
.params-panel .el-row .el-col label,
.params-panel .el-row .el-col.col-label {
  padding-top: 0.5em;
}

.col-text-left {
  text-align: left;
}

.col-text-center {
  text-align: center;
}
.color-box {
  margin-top: 8px;
  width: 16px;
  height: 16px;
}
.el-row.empty {
  height: 2em;
}
.el-menu-item {
  width: 64px;
}
</style>
