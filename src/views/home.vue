<template>
  <div>
    <van-nav-bar title="乡镇查询">
      <van-icon name="search" slot="right" @click="handleSearch()" />
    </van-nav-bar>

    <div class="amap-page-container" ref="imageTofile">
      <el-amap-search-box
        class="search-box"
        v-show="isSearch"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>
      <el-amap
        vid="amapDemo"
        :center="center"
        :plugin="plugin"
        :amap-manager="amapManager"
        :zoom="zoom"
        :events="events"
        class="amap-demo"
      >
        <el-amap-text
          v-for="(marker, index) in markers"
          :position="marker.position"
          :events="marker.events"
          :visible="marker.visible"
          :draggable="marker.draggable"
          :vid="index"
          :key="index"
          :text="marker.tag"
          
        >
        </el-amap-text>
      </el-amap>
    </div>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="isSearch=false;">首页</van-tabbar-item>
      <van-tabbar-item icon="search" @click="handleSearch()">查询</van-tabbar-item>
      <van-tabbar-item icon="upgrade" @click="show=true;">上传</van-tabbar-item>
    </van-tabbar>
    <van-popup v-model="show" position="bottom" round style="height:75%;" closeable>
      <Upload @handleAdd="addMarker" @handleAddAll="showAllMarker"></Upload>
    </van-popup>
  </div>
</template>
  <script>
// NPM 方式
import { AMapManager } from "vue-amap";
import Upload from "./upload";
import html2canvas from "html2canvas";
// CDN 方式
let amapManager = new AMapManager();
export default {
  components: { Upload, html2canvas },
  data() {
    let self = this;
    return {
      dataList: [],
      markers: [], //标记点
      searchOption: {
        city: "江西",
        citylimit: false
      }, //搜索地点选项
      lng: 0, //经度
      lat: 0, //纬度
      show: false,
      isSearch: false,
      zoom: 15,
      center: [121.59996, 31.197646],
      amapManager,
      plugin: [
        //定位
        {
          pName: "Geolocation",
          events: {
            init(o) {
              console.log(o);
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (status == "error") {
                  self.$toast.fail("定位失败");
                }
                console.log(status, result);
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                  console.log(self.center);
                  self.$nextTick();
                }
              });
            }
          }
        },
        // 工具条
        {
          pName: "ToolBar",
          events: {
            init(instance) {
              console.log(instance);
            }
          }
        }
      ],
      events: {
        init(o) {
                     o.setMapStyle('amap://styles/normal');//自定义的高德地图的样式，我选的是马卡龙
                       
               },
        complete() {
          const map = self.amapManager.getMap(); // 获取地图组件实例
          // setFitView(overlayList:Array)
          // 根据地图上添加的覆盖物分布情况，
          // 自动缩放地图到合适的视野级别，参数overlayList默认为当前地图上添加的所有覆盖物图层
          map.setFitView();
        }
      }
    };
  },
  computed: {
    active(val) {
      if (this.isSearch == true) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  methods: {
    add(lng, lat) {
      let o = amapManager.getMap();
      let marker = new AMap.Marker({
        position: [lng, lat]
      });
      marker.setMap(o);
    },

    toImage(name) {
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      html2canvas(this.$refs.imageTofile, {
        backgroundColor: null,
        useCORS: true
      }).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL(); //下载链接
        link.setAttribute("download", `${name}.png`);
        link.style.display = "none"; //a标签隐藏
        document.body.appendChild(link);
        link.click(); //this.htmlUrl = url; // 把生成的base64位图片上传到服务器,生成在线图片地址
      });
    },
    async showAllMarker(dataList) {
      this.dataList = dataList;
      for (let i = 0; i < this.dataList.length; i++) {
        setTimeout(() => {
          this.addMarker(this.dataList[i]);
              this.toImage(this.dataList[i].name);
        },2000*i);
      }
    },
    handleSearch() {
      this.isSearch = !this.isSearch;
    },
    addMarker(data) {
      var markers = data.points.map(item => {
        return {
          tag: item.tag,
          position: item.position
        };
      });
      console.log(markers);
      this.markers = [];
      this.markers.push(...markers);
      
      this.center = getCenter(this.markers)
      this.show = false;

      function getCenter(markers){
          let len=markers.length
          let lngs=markers.reduce((pre,cur)=>{
              return pre+cur.position[0]
          },0)
          let lats=markers.reduce((pre,cur)=>{
              return pre+cur.position[1]
          },0)
          return [lngs/len,lats/len]
      }
    },
    //TODO：搜索地点
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.markers = [];
          this.markers.push({
            tag: "你的位置",
            position: [poi.lng, poi.lat]
          });
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.center = [center.lng, center.lat];
        this.$toast.success("定位成功");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.amap-page-container {
  height: calc(100vh - 100px) !important;
}
.amap-demo {
  height: 100%;
}
.amap-text /deep/ {
  background-color: deeppink !important;
  border-radius: 1px;
  color: #ffffff;
}
.search-box {
  width: 80%;
  max-width: 720px;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>