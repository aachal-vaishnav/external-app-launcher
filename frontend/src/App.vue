<template>
  <div class="app">
    <div v-if="!token" class="login">
      <input v-model="username" placeholder="username"/><input v-model="password" type="password" placeholder="password"/>
      <button @click="register">Register</button>
      <button @click="login">Login</button>
    </div>
    <div v-else>
      <header>
        <h1>External App Launcher</h1>
        <label><input type="checkbox" v-model="dark"/> Dark</label>
        <button @click="exportPack">Export</button>
        <input type="file" @change="importPack" />
      </header>

      <section class="top">
        <div class="favorites">
          <h3>Most used</h3>
          <AppItem v-for="a in topUsed" :key="a.id" :app="a" @open-preview="openPreview" @remove="removeApp(a)"/>
        </div>
        <div class="suggestions">
          <h3>Suggested</h3>
          <div v-for="s in suggestions" :key="s.name">
            <div>{{s.name}} <button @click="addSuggestion(s)">Add</button></div>
          </div>
        </div>
      </section>

      <AddAppForm @add-app="createApp"/>
      <div class="grid">
        <AppItem v-for="app in apps" :key="app.id" :app="app" @open-preview="openPreview" @edit="editApp" @remove="removeApp(app)"/>
      </div>

      <PreviewOverlay v-if="previewAppObj" :app="previewAppObj" :visible="previewVisible" @update:visible="previewVisible=$event" @used="onUsed" @closed="closePreview"/>
    </div>
  </div>
</template>

<script>
import API, { setToken } from './services/api';
import AddAppForm from './components/AddAppForm.vue';
import AppItem from './components/AppItem.vue';
import PreviewOverlay from './components/PreviewOverlay.vue';
import { loadLocal, saveLocal, syncToServer } from './services/sync';
import suggestions from './data/suggestions.json';

export default {
 components:{ AddAppForm, AppItem, PreviewOverlay },
 data(){ return { username:'', password:'', token:null, apps:[], previewAppObj:null, previewVisible:false, dark:false, suggestions } },
 computed:{
   topUsed(){ return [...this.apps].sort((a,b)=> (b.useCount||0)-(a.useCount||0)).slice(0,3); }
 },
 methods:{
  async register(){ await API.post('/api/auth/register',{ username:this.username, password:this.password }); alert('registered'); },
  async login(){ const res = await API.post('/api/auth/login',{ username:this.username, password:this.password }); this.token = res.data.token; setToken(this.token); localStorage.setItem('eal_token', this.token); this.loadApps(); },
  async loadApps(){ try{ const res = await API.get('/api/apps'); this.apps = res.data; saveLocal(this.apps); }catch(e){ this.apps = loadLocal(); },
    // try sync when online
    sync(){ syncToServer(this.apps); }
  },
  async createApp(app){ const res = await API.post('/api/apps', app); this.apps.push(res.data); saveLocal(this.apps); },
  async removeApp(app){ await API.delete(`/api/apps/${app.id}`); this.apps = this.apps.filter(a=>a.id!==app.id); saveLocal(this.apps); },
  openPreview(app){ this.previewAppObj = app; this.previewVisible = true; },
  async onUsed(){ if(this.previewAppObj){ // increment local count
    const a = this.apps.find(x=>x.id===this.previewAppObj.id); if(a){ a.useCount=(a.useCount||0)+1; a.lastOpened = Date.now(); saveLocal(this.apps); } await API.post(`/api/apps/${this.previewAppObj.id}/usage`); }},
  closePreview(){ this.previewAppObj=null; this.previewVisible=false; },
  addSuggestion(s){ this.createApp(s); },
  exportPack(){ const blob=new Blob([JSON.stringify(this.apps,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='apps-pack.json'; a.click(); },
  importPack(e){ const f=e.target.files[0]; const r=new FileReader(); r.onload=()=>{ const pack=JSON.parse(r.result); pack.forEach(p=>this.createApp(p)); }; r.readAsText(f); }
 }
}
</script>

<style>
/* minimal styling for clarity */
.app{ padding:16px; font-family:Arial; }
.grid{ display:grid; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); gap:12px; margin-top:12px; }
.top{ display:flex; gap:16px; }
.favorites,.suggestions{ flex:1; background:#f7f7f7; padding:8px; border-radius:6px; }
</style>
