<template>
  <el-container class="container">
    <div class="divx"></div>
    <div class="setting" v-show="is_setting">
      <el-input v-model="input" placeholder="请输入URL" clearable size="mini" @keyup.enter.native="onSo"></el-input>
      <el-button size="small" @click="handleOpenPage('https://weread.qq.com')">微信阅读</el-button>
      <el-button size="small" @click="handleOpenPage('https://www.baidu.com')">百度</el-button>
      <el-button size="small" @click="handleOpenPage('https://www.bilibili.com')">哔哩哔哩</el-button>
    </div>
    <webview
      v-if="url"
      class="ifr"
      :src="url"
      :plugins="true"
      useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
    ></webview>
  </el-container>
</template>

<script>
import hotkeys from "hotkeys-js";
import { ipcRenderer } from "electron";

export default {
  name: "web",
  data() {
    return {
      url: null,
      is_setting: true,
      input: "",
    };
  },
  created() {
    this.onKey();
  },
  methods: {
    onSo() {
      this.url = this.input;
      ipcRenderer.send("webOpacity", "change");
    },
    open() {
      if (this.is_setting) {
        this.is_setting = false;
      } else {
        this.is_setting = true;
      }
    },
    handleOpenPage(url) {
      this.url = url;
      ipcRenderer.send("webOpacity", "change");
    },
    onKey() {
      var that = this;

      hotkeys.filter = function (event) {
        return true;
      };

      hotkeys("*", function (e) {
        if (e.key === "z") {
          var t = document.querySelector(".ifr");
          t.reload();
        } else if (e.key === "-") {
          ipcRenderer.send("webOpacity", "-");
        } else if (e.key === "+") {
          ipcRenderer.send("webOpacity", "+");
        } else if (e.key === "c") {
          that.open();
        } else if (e.key === "x") {
          ipcRenderer.send("webOpacity", "exit");
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  border: 0px;

  .divx {
    width: 50px;
    height: 50px;
    position: absolute;
    z-index: 999;
    -webkit-app-region: drag;
  }

  .ifr {
    width: 100%;
    height: 100%;
    border: 0px;
    overflow: hidden;
  }

  .setting {
    width: 100%;
    clear: both;
    position: absolute;
    padding-top: 0px;
  }
}
</style>
