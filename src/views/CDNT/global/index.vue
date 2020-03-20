<template>
  <div>
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