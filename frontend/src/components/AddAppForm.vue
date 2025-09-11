<template>
 <div class="add-app-form">
  <input v-model="name" placeholder="App Name" />
  <input v-model="url" placeholder="App URL" />
  <input v-model="icon" placeholder="Icon URL" />
  <select v-model="category"><option>Work</option><option>Tools</option><option>Fun</option><option>Other</option></select>
  <button @click="add">Add</button>
 </div>
</template>
<script>
export default {
 data(){ return { name:'', url:'', icon:'', category:'Work' } },
 methods:{
  isValidUrl(u){ try{ const p = new URL(u); return p.protocol==='https:'; }catch{return false} },
  add(){ if(!this.name||!this.url) return alert('Name & URL required'); if(!this.isValidUrl(this.url)) return alert('Use https URL'); this.$emit('add-app',{ name:this.name, url:this.url, icon:this.icon || 'https://via.placeholder.com/40', category:this.category }); this.name=this.url=this.icon='';}
 }
}
</script>
