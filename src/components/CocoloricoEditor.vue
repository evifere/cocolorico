<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-navbar"
        mode="horizontal"
        @select="addImageFromMenu"
      >
        <el-submenu
          v-for="category in getCategories"
          :index="category"
          popper-class="submenu-popup"
          :key="'menu_'+category"
        >
          <template slot="title">
            <img :src="'categories/'+category+'.png'" width="64" height="64">
          </template>
          <el-menu-item v-for="logo in logos[category]" :key="logo" :label="logo" :index="logo">
            <img :src="category + '/'+logo+'.png'" width="48" height="48">
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-main>
      <el-container>
        <el-aside width="96px">
          <el-menu
            class="el-menu-vertical-demo"
            @select="handleVerticalMenu"
            :collapse="isCollapse"
          >
            <el-menu-item index="addTextBlock">
              <img :src="'icons/add-text.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleBold" :class="getTextCssClass('bold')">
              <img :src="'icons/bold.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleItalic" :class="getTextCssClass('italic')">
              <img :src="'icons/italic.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleUnderline" :class="getTextLineCssClass('underline')">
              <img :src="'icons/underline.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleOverline" :class="getTextLineCssClass('overline')">
              <img :src="'icons/overline.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleLineThrough" :class="getTextLineCssClass('linethrough')">
              <img :src="'icons/line-through.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleAlignLeft" :class="getTextAlignCssClass('left')">
              <img :src="'icons/align-left.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleAlignCenter" :class="getTextAlignCssClass('center')">
              <img :src="'icons/align-center.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleAlignJustify" :class="getTextAlignCssClass('justify')">
              <img :src="'icons/align-justify.png'" width="48" height="48">
            </el-menu-item>
            <el-menu-item index="toggleAlignRight" :class="getTextAlignCssClass('right')">
              <img :src="'icons/align-right.png'" width="48" height="48">
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-aside class="img-preview" width="1225px" v-show="!isEditable">
          <img width="1200" height="800" ref="preview" src>
        </el-aside>
        <el-aside class="canvas-board" width="1225px" v-show="isEditable">
          <el-col :span="1" class="col-label col-text-center">T</el-col>
          <canvas id="background" tabindex="0"></canvas>
        </el-aside>
        <el-main>
          <el-header class="title">
            <img :src="'icons/chicken.png'" width="72" height="72">
            <span>Cocolorico !</span>
          </el-header>
          <hr>
          <el-container>
            <el-col class="params-panel">
              <el-row>
                <el-col :span="2" class="col-label col-text-left label-icon" :class="{'text-cmd-disabled':!isTextSelected}">
                  <img :src="'icons/police.png'" width="48" height="48">
                </el-col>
                <el-col :span="20">
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
              </el-row>
              <el-row class="empty"></el-row>
              <el-row>
                <el-col :span="2" class="col-label col-text-left label-icon" :class="{'text-cmd-disabled':((!isTextSelected && !isImageSelected) | !isEditable)}">
                  <img :src="'icons/fill-color.png'" width="48" height="48">
                </el-col>
                <el-col :span="20">
                  <el-select
                    v-model="mainColor"
                    placeholder="Couleur de fond"
                    v-bind:disabled="((!isTextSelected && !isImageSelected) | !isEditable)"
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
                <el-col :span="2" class="col-label col-text-left label-icon" :class="{'text-cmd-disabled':!isTextSelected}">
                  <img :src="'icons/text-color.png'" width="48" height="48">
                </el-col>
                <el-col :span="20">
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
              <el-row class="empty"></el-row>
              <el-row>
                <el-col :span="4" class="col-label col-text-left" :class="{'text-cmd-disabled':!isTextSelected}">
                  <img :src="'icons/thicken-text.png'" width="48" height="48">
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
                <el-col :span="8" class="col-label col-text-left" :class="{'text-cmd-disabled':!isTextSelected}">
                  <img :src="'icons/text-height.png'" width="48" height="48">
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
                <el-col :span="8" class="col-label col-text-left" :class="{'text-cmd-disabled':!isTextSelected}">
                  <img :src="'icons/line-height.png'" width="48" height="48">
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
                <el-col :span="8" :class="{'text-cmd-disabled':((!isTextSelected && !isImageSelected) | !isEditable)}">
                  <img :src="'icons/bring-forward.png'" width="48" height="48" @click="moveForward">
                </el-col>
                <el-col :span="4" class="col-label col-text-center">&nbsp;</el-col>
                <el-col :span="8" :class="{'text-cmd-disabled':((!isTextSelected && !isImageSelected) | !isEditable)}">
                  <img
                    :src="'icons/send-backward.png'"
                    width="48"
                    height="48"
                    @click="moveBackward"
                  >
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
                <el-button
                  type="primary"
                  v-on:click="downloadPng"
                  icon="el-icon-download"
                >Télécharger</el-button>
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
      isImageSelected: false,
      newText: "Tapes ton texte ici !",
      logo: "logo",
      externalLogo: "",
      newImageUrl: "",
      mainColor: "",
      logos: require("./logos.json"),
      mainColors: require("./cocoricolors.json"),
      fonts: require("./fonts.json"),
      gofonts: require("./gofonts.json"),
      alignments: ["Left", "Center", "Justify", "Right"],
      isEditable: true,
      fontStyles: ["", "normal", "italic", "oblique"],
      fontWeights: ["bold", "normal", 400, 600, 800],
      version: version,
      activeIndex: "1",
      isCollapse: true
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
      this.isImageSelected = false;
      if (!!currentObject) {
        this.isTextSelected = !(currentObject.type === "image");
        this.isImageSelected = (currentObject.type === "image");
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
      object.bringToFront();

      this.update();
    },
    moveBackward() {
      let object = this.$canvas.getActiveObject();
      console.log("moveBackward", object);

      if (!object) {
        return;
      }
      object.sendToBack(true);
      this.update();
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
      this.isTextSelected = true;
      this.currentTextObjectConfig = newTextbox.toObject();
    },
    addImageFromMenu(key, keyPath) {
      let _self = this;
      let baseUrl =
        process.env.NODE_ENV === "production"
          ? "http://evifere.lescigales.org/cocolorico/"
          : "./";

      fabric.Image.fromURL(
        baseUrl + keyPath.join("/") + ".png",
        function(oImg) {
          oImg.set("left", 125).set("top", 100);
          _self.$canvas.add(oImg).setActiveObject(oImg);
          _self.isImageSelected = true;
          _self.isTextSelected = false;
        },
        { crossOrigin: "Anonymous" }
      );
    },
    //      alignments: ["Left", "Center", "Justify", "Right"],

    toggleAlignLeft() {
      this.currentTextObjectConfig.textAlign = "left";
    },
    toggleAlignCenter() {
      this.currentTextObjectConfig.textAlign = "center";
    },
    toggleAlignJustify() {
      this.currentTextObjectConfig.textAlign = "justify";
    },
    toggleAlignRight() {
      this.currentTextObjectConfig.textAlign = "right";
    },
    toggleOverline() {
      this.currentTextObjectConfig.overline = !this.currentTextObjectConfig
        .overline;
    },
    toggleLineThrough() {
      this.currentTextObjectConfig.linethrough = !this.currentTextObjectConfig
        .linethrough;
    },
    toggleUnderline() {
      this.currentTextObjectConfig.underline = !this.currentTextObjectConfig
        .underline;
    },
    toggleItalic() {
      this.currentTextObjectConfig.fontStyle =
        this.currentTextObjectConfig.fontStyle === "italic"
          ? "normal"
          : "italic";
    },
    toggleBold() {
      this.currentTextObjectConfig.fontWeight =
        this.currentTextObjectConfig.fontWeight === "bold" ? "normal" : "bold";
    },
    handleVerticalMenu(key, keyPath) {
      this[key]();
    }
  },
  computed: {
    allFonts() {
      return this.fonts.concat(this.gofonts);
    },
    getCategories() {
      return Object.keys(this.logos);
    },
    getTextCssClass() {
      return value => {
        let cssClass = "text-cmd-enabled";

        if (!this.isTextSelected) {
          return "text-cmd-disabled";
        }
        switch (value) {
          case "bold":
            cssClass =
              this.currentTextObjectConfig.fontWeight === "bold"
                ? "text-cmd-selected"
                : "text-cmd-enabled";
            break;
          case "italic":
            cssClass =
              this.currentTextObjectConfig.fontStyle === "italic"
                ? "text-cmd-selected"
                : "text-cmd-enabled";
            break;
        }

        return cssClass;
      };
    },
    getTextLineCssClass() {
      return value => {
        if (!this.isTextSelected) {
          return "text-cmd-disabled";
        }
        let test = this.currentTextObjectConfig[value];
        return { "text-cmd-selected": test, "text-cmd-enabled": !test };
      };
    },
    getTextAlignCssClass() {
      return value => {
        if (!this.isTextSelected) {
          return "text-cmd-disabled";
        }
        let test = this.currentTextObjectConfig.textAlign === value;
        return { "text-cmd-selected": test, "text-cmd-enabled": !test };
      };
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
.el-aside.img-preview img {
  border: 1px solid black;
}

.el-aside.canvas-board {
  min-height: 815px;
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
/*
.params-panel .el-row .el-col label,
.params-panel .el-row .el-col.col-label {
  padding-top: 0.5em;
}
*/
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
  width: 48px;
  min-height: 48px;
  margin: 0 0 3px 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  border-right: 0;
}

.el-menu-vertical-demo .el-menu-item {
  width: 100%;
  margin-bottom: 1.5em;
}
.el-menu-navbar {
  border-bottom: 0;
  margin-left: 2.2em;
}

.el-menu-vertical-demo .el-menu-item:hover,.el-menu-vertical-demo .el-menu-item:focus  {
  outline: none;
  background-color: white;
}

.el-menu-vertical-demo .el-menu-item.is-active {
  color: white;
}
.el-menu-vertical-demo .el-menu-item img:hover {
  outline: none;
  background-color: #ecf5ff;
}

.el-menu-vertical-demo .el-menu-item img {
  border: 2px solid #89adce;
  padding: 10px;
  border-radius: 25px;
}

.title img , img .label-icon{
  vertical-align: middle;
  margin-right: 24px;
}

.text-cmd-disabled img {
  opacity: 0.3;
}
.text-cmd-selected img {
  background-color: #c5ddf3;
}
.text-cmd-enabled img {
  background-color: white;
}
</style>
<style>
.submenu-popup {
  width: 70px;
  max-height: 70px;
}
.submenu-popup ul {
  min-width: 70px;
  margin-left: 16px;
}
</style>
