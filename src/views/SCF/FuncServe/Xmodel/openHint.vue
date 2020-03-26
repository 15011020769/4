<template>
  <div class="openHint">
    <p class="p-1">
      {{$t('SCF.total.cngkszx')}}
    </p>
    <p class="p-2">
      {{$t('SCF.total.ydgs')}}，例如 "main";
    </p>
    <p class="p-2">
      {{$t('SCF.total.edgs')}}例如 "index.main_handler";
    </p>
    <p class="p-2">
      {{$t('SCF.total.sdgs')}}，例如 "example.Hello::mainHandler";
    </p>
    <p class="p-2">
      {{$t('SCF.total.lds')}}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.openHint{
  border-top: 1px solid #e7e7e7;
  padding: 20px 0;
  font-size: 12px;
  .p-1{
    color: rgb(153, 153, 153);
    font-weight: 600;
  }
  .p-2{
    margin-top: 7px;
    color: rgb(153, 153, 153);
  }
}
</style>
