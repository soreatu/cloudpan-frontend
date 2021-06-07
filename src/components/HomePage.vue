<template>
  <div class="homepage">
    <h1>{{ title }}</h1>

  <el-button @click="pushRouter('/auth')" type="primary">{{ login }}</el-button>


  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data () {
    return {
      title: '欢迎使用私人加密云网盘',
      login: '登陆',
    }
  },
  methods: {
        pushRouter(address) {
          this.$router.push(address)
        }
      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
