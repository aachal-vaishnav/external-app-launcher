<template>
<div v-if="app" class="iframe-overlay">
<div class="iframe-header">
<span>{{ app.name }} Preview</span>
<button @click="$emit('close')">X</button>
</div>
<iframe :src="app.url" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
</div>
</template>

<script>
export default { props:['app'] }
</script>

<style scoped>
.iframe-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;}
.iframe-header{display:flex;justify-content:space-between;padding:10px;background:#333;color:#fff;}
iframe{flex:1;border:none;}
</style>
