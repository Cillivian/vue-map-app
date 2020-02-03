<template>
  <div class="upload">
    <div class="upload-tab">
      <van-uploader
        ref="inputName"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        v-model="fileList"
        multiple
      ></van-uploader>
      <h3>上传文件，文件大小<5M</h3>
      <div class="operation">
      <van-button plain type="info" @click="handleOk()" class="operation-btn">上传文件解析</van-button>
      <van-button plain type="info" @click="handleOk()" class="operation-btn">截图全部数据</van-button>
      </div>
      
    </div>
    <van-collapse v-model="activeNames" v-if="dataList" accordion>
      <van-collapse-item
        v-for="(data,index) in dataList"
        :title="data.name"
        :name="index"
        :key="index"
      >
        <van-swipe-cell>
          <van-cell :border="false" :title="'共'+data.points.length+'个标记'">
            <van-tag
              plain
              type="primary"
              v-for="(point,index) in data.points"
              :key="index"
            >{{point.tag}}</van-tag>
          </van-cell>

          <template slot="right">
            <van-button square type="info" text="标记" style="height:100%;" @click="onMark(index)" />
          </template>
        </van-swipe-cell>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  data() {
    return {
      activeNames: 0,
      parmas: [],
      fileList: [],
      dataList: [
        {
          name: "安福县-jc",
          count: 2,
          points: [
            {
              tag: "石陂村",
              position: [120.002, 24.0211]
            },
            {
              tag: "石陂村",
              position: [121.402, 25.0211]
            }
          ]
        }
      ]
    };
  },
  methods: {
    onMark(index) {
      var data = this.dataList[index];
      console.log(data);
      this.$emit("handleAdd", data);
    },
    handleOk() {
      this.$toast.loading({
        message: "解析中...",
        forbidClick: true,
        overlay: true,
        duration: 5000
      });
      // 上传文件并解析数据
      let _this = this;
      var promise = new Promise(resolve => {
        let X = XLSX;
        let rABS = false; // 是否转为二进制字符串
        let files = _this.fileList.map(item => {
          return item.file;
        });
        _this.parmas = [];
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          var reader = new FileReader();
          var name = f.name;
          sessionStorage.setItem("name", name);
          reader.onload = function(e) {
            var data = e.target.result;
            var wb; // 读取完成的数据
            if (rABS) {
              wb = X.read(data, { type: "binary" });
            } else {
              var arr = fixdata(data); // 手动转化
              wb = X.read(btoa(arr), { type: "base64" });
            }
            processWb(wb, "json");
          };
          if (rABS) reader.readAsBinaryString(f);
          else reader.readAsArrayBuffer(f);
        }
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            _this.getList();
          }, 1000);
        })
        .then(() => {
          _this.$toast.clear();
        })
        .catch(() => {
          _this.$toast.fail({
            message: "解析失败"
          });
        });

      // 将读取到的数据转为字符串
      function processWb(wb, type) {
        var output = "";
        if (type === "json") {
          output = JSON.stringify(toJson(wb), 2, 2);
          return output;
        }
      }
      function fixdata(data) {
        // 文件流转BinaryString
        let o = "";
        let l = 0;
        let w = 10240;
        for (; l < data.byteLength / w; ++l)
          o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w))
          );
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      }
      function toJson(workbook) {
        var result = {};
        // SheetNames是获取Sheets中Sheet的名字
        // Sheets[Sheet名]获取第一个Sheet的数据
        workbook.SheetNames.forEach(function(sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName]
          );
          if (roa.length > 0) {
            result[sheetName] = roa;
          }
        });
        let str = result.Sheet1;
        _this.parmas.push(str);
        console.log(_this.parmas);
        return result;
      }
    },
    getList() {
    //   console.log(Array.isArray(this.parmas));
    //   console.log(this.parmas);
    //   console.log(this.parmas[0]);
      if (this.parmas !== []) {
        let datas = this.parmas[0];
    var result = [];
    var start = 1;
    var i = 0,
        obj;
    var len = datas.length;
    for (; i < len - 1;) {
        obj = {
            name: datas[i].name,
            points: [{
                tag: datas[i].tag,
                position: [datas[i].lng, datas[i].lat]
            }]
        };
        //  console.log(i)
        for (let j = i + 1; j < len; j++) {
            if (datas[i].name == datas[j].name) {
                obj.points.push({
                    tag: datas[j].tag,
                    position: [datas[j].lng, datas[j].lat]
                });
                if (j == len - 1) {
                    result.push(obj);
                    i = len;
                    break;
                }

            } else if (j == len - 1) {
                result.push(obj, {
                    name: datas[j].name,
                    points: [{
                        tag: datas[j].tag,
                        position: [datas[j].lng, datas[j].lat]
                    }]

                })
                i = len;
                break;
            } else {
                i = j;
                result.push(obj);
                break;
            }

        }

    }
    this.dataList=result;
      } else {
        this.dataList= [];
      }
      this.$emit('handleAddAll',this.dataList)
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-tab {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin: 15px 10px 15px 10px;
}
.delete-button {
  height: 100%;
}
.operation{
    width:100%;
    display:flex;
    flex-flow: column,nowrap;
    justify-content: center;
    &-btn:nth-child(1){
        margin-right:10px; 
    }
    &-btn:nth-child(2){
        margin-left:10px; 
    }
}
</style>