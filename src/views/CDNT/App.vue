<template>
  <div>
    <router-view></router-view>
    <!-- <div id="sdk"></div> -->
  </div>
</template>

<script>
// import { CloudStudioLiteSDK, FileTreeModel } from 'cloudstudio-lite'
export default {
  // mounted() {
  //   const f = new FileTreeModel({
  //     fileName: 'a.js',
  //     isFile: true,
  //     monacoInfo: {
  //       content: '3232',
  //       row: 1,
  //     },
  //     originalMonacoContent: 'dsds',
  //     isShow: true,
  //     fileType: 'js',
  //     isOpened: true,
  //   })
  //   window.f = f
  //   window.c = new CloudStudioLiteSDK({
  //     rootNode: document.querySelector('#sdk')
  //   })
    
  //   .execHandleFileTreeData([
  //     f
  //   ])
  // }
};
</script>
<style scoped>
#sdk {
  width: 100vw;
  height: 100vh;
}
</style>
