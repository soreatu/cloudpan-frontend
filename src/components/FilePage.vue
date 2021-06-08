<template>
  <div class="filepage">
    <h1>私人加密网盘</h1>

    <el-table
    :data="tableData"
    style="width: 100%"
    max-height="400">
    <el-table-column
      fixed
      prop="filename"
      label="文件名"
      width="400">
    </el-table-column>
    <el-table-column
      prop="size"
      label="大小"
      width="150">
    </el-table-column>
    <el-table-column
      prop="created_at"
      label="上传时间"
      width="250">
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="120">
      <template slot-scope="scope">
        <el-button @click.native.prevent="download(scope.row)" type="text" size="small">
         下载
        </el-button>
        <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">
         删除
        </el-button>
      </template>
    </el-table-column>

  </el-table>


  <el-upload style="margin-top: 50px"
    class="upload-demo"
    drag
    :action="upload_url"
    :with-credentials="true"
    :on-success="(value) => fetch()"
    multiple>
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>

    <div class='button' style="margin-top: 30px">
      <!-- <el-button @click="fetch()" type="primary">抓取</el-button> -->
      <el-button @click="logout()" type="primary">注销</el-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SearchPage',
  data () {
    return {
      upload_url: this.$http.defaults.baseURL + "user/upload",
      tableData: '',
    }
  },
  mounted:function() {
    this.fetch();
  },
  methods: {
    pushRouter(address) {
      this.$router.push(address)
    },
    fetch: async function() {
        try {
            var rsp;
            console.log()
            rsp = await this.$http.get('/user/files', {withCredentials: true} );

            for (var i=0; i < rsp.data.data.length; i++) {
              let row = rsp.data.data[i]
              console.log(row)

              Date.prototype.format = function(fmt){
                var o = {
                  "M+" : this.getMonth()+1,                 //月份
                  "d+" : this.getDate(),                    //日
                  "h+" : this.getHours(),                   //小时
                  "m+" : this.getMinutes(),                 //分
                  "s+" : this.getSeconds(),                 //秒
                  "q+" : Math.floor((this.getMonth()+3)/3), //季度
                  "S"  : this.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt)){
                  fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                }
                for(var k in o){
                  if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(
                      RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                  }
                }
                return fmt;
              }

              row["created_at"] = new Date(row["created_at"]).format("yyyy-MM-dd hh:mm:ss");
              row["size"] = Math.floor(row["size"] / 1024) + "KB"
            }

            this.tableData = rsp.data.data
        } catch (err) {
            alert(err);
        }
    },
    logout: async function() {
      this.$confirm('确定退出该账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const rsp = await this.$http.get("/user/logout", { withCredentials: true });

          if (rsp.status == 200) {
            this.$message({
              type: 'success',
              message: '登出成功!'
            });
            this.$router.push("/")
          } else {
            alert(rsp.data.msg);
          }
        } catch(err) {
          alert(err);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消登出'
        });
      });
    },
    deleteRow: async function(row) {
      console.log(row.id);

      this.$confirm('此操作将永久删除该条航班信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const rsp = await this.$http.delete("/user/file/"+row.id, { withCredentials: true });

        if (rsp.status == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // this.tableData.splice(index, 1);
          this.fetch()
        } else {
          alert(rsp.data.msg);
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    download: async function(row) {
      console.log(row.id);
      this.$confirm('此操作将下载文件' + row.filename, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const rsp = await this.$http.get("/user/download/"+row.id, { withCredentials: true });

        if (rsp.status == 200) {
          console.log(rsp)
          // decode base64 string, remove space for IE compatibility
          var binary = atob(rsp.data.replace(/\s/g, ''));
          var len = binary.length;
          var buffer = new ArrayBuffer(len);
          var view = new Uint8Array(buffer);
          for (var i = 0; i < len; i++) {
              view[i] = binary.charCodeAt(i);
          }
          // create the blob object
          var blob = new Blob( [view], {type: "application/octet-stream; charset=UTF-8"});
          {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = row.filename ; // 设置下载下来的文件名
            a.click();
            window.URL.revokeObjectURL(url); // 释放通过调用 URL.createObjectURL() 创建的 URL 对象
          }
        } else {
          alert(rsp.data.msg);
        }
      }).then(
          this.$message({
            type: 'success',
            message: '下载成功!'
          })
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下载'
          });
        })
    }
  }
}
</script>
