<template>

  <div class="homepage">
    <el-card class="box-card" >
    <div slot="header" class="clearfix">
        <span>请输入用户信息</span>
    </div>
        <div class="kuang">
            <el-form :model="logoData" ref="login">

                <el-form-item label="" prop="username">
                    <el-input v-model="logoData.username" placeholder="请输入账号" type="text"></el-input>
                </el-form-item>
                <el-form-item label="" prop="passwd">
                    <el-input v-model="logoData.password" placeholder="请输入密码" style=" margin-top: 5px"
                              type="password"></el-input>
                </el-form-item>

                <el-button :type="primary" @click="login()" :loading="loading"
                           :style="buttonStyle">登 录
                </el-button>

                <el-button :type="primary" @click="register()" :loading="loading"
                           :style="buttonStyle">注 册
                </el-button>

                <el-button :type="primary" @click="pushRouter('/')" :loading="loading"
                           :style="buttonStyle">返 回
                </el-button>

                <el-alert
                        v-if="showMsg"
                        :title="msg"
                        :type="msgType"
                        show-icon>
                </el-alert>
                <slot name="default"></slot>
            </el-form>
        </div>
    </el-card>
  </div>

</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                loading: false,
                showMsg: false,
                msg: '',
                msgType: 'success',
                logoData: {
                    username: "",
                    password: ""
                },
            }
        },
        // rules() {},
        props: {
            buttonStyle: {
                type: Object,
                default: function () {
                    return {
                        'height': '50px',
                        'border-radius': '0px',
                        '-moz-box-shadow': '0px 2px 5px #999',
                        '-webkit-box-shadow': '0px 2px 5px #999',
                        'box-shadow': '0px 2px 5px #999',
                        'font-size': '22px'
                    }
                }
            },
            primary: {
                type: String,
                default: "primary"
            },
            width: {
                default: '360px'
            },
            url: {
                type: String,
                default: 'login'
            },
            go: {
                type: String,
                default: 'home'
            },
            success: {
                type: Function || null
            },
            error: {
                type: Function || null
            },

        },
        computed: {
            style() {
                return {
                    border: 'none',
                    borderRadius: 0,
                    width: this.width
                }
            }
        },
        methods: {
            pushRouter(address) {
                this.$router.push(address)
            },
            login: async function() {
                const auth = { username: this.logoData.username, password: this.logoData.password };

                try {
                    const rsp = await this.$http.post('/login', auth, {withCredentials: true});
                    console.log(rsp);
                    if (rsp.status == 200) {
                        this.pushRouter("/file");
                        this.$message({title: '成功', message: '登陆成功', type: 'success'});
                    } else {
                        // alert(rsp.data.msg);
                        this.$message({title: '失败', message: rsp.data.msg, type: 'warning'});
                    }
                } catch (err) {
                    console.log(err);
                    alert("error");
                }
            },
            register: async function() {
                const auth = { username: this.logoData.username, password: this.logoData.password };

                try {
                    this.logoData.username = ""
                    this.logoData.password = ""
                    const rsp = await this.$http.post('/register', auth, {withCredentials: true});
                    console.log(rsp);
                    if (rsp.status == 200) {

                        this.$message({title: '成功', message: '注册成功，请重新登陆！', type: 'success'});

                        this.pushRouter("/auth");

                    } else {
                        // alert(rsp.data.msg);
                        this.$message({title: '失败', message: rsp.data.msg, type: 'warning'});
                    }
                } catch (err) {
                    console.log(err);
                    alert("error");
                }
            },
        }
    }

</script>

<style>
    .kuang .el-input__inner {
        height: 50px;
        line-height: 50px;
        border-radius: 0px;
    }
</style>


<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>