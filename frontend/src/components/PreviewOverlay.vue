<template>
 <div>
  <ResizableWindow v-if="visible" :title="app.name" :src="app.url" :visible="visible" @update:visible="visible=$event" @closed="onClose" @opened="onOpen"/>
 </div>
</template>
<script>
import ResizableWindow from './ResizableWindow.vue';
import API from '../services/api';
export default { props:['app','visible'], components:{ResizableWindow}, data(){ return { visibleLocal: this.visible }}, methods:{ async onOpen(){ await API.post(`/api/apps/${this.app.id}/usage`); this.$emit('used'); }, onClose(){ this.$emit('closed'); } } }
</script>
