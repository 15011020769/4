<template>
  <div>
    <div class="header">
      <h2>运营报表</h2>
    </div>
    <div  class="container">
     <overview class="card" />
     <status class="card" />
    </div>
  </div>
</template>
<script>
import Overview from './overview'
import Status from './status'
export default {
  components: {
    Overview,
    Status,
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  margin: 25px 30px;
}
.header {
  h2 {
  padding-left: 20px;
    font-size: 16px;
    line-height: 51px;
    color: #000;
    background: #fff;
  }
}
.card {
  margin-bottom: 20px;
}
</style>