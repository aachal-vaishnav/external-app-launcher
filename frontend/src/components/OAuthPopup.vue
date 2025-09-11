<template>
<div>
 <button @click="start">Connect</button>
</div>
</template>
<script>
import API from '../services/api';
export default {
 props:['appId','provider'],
 methods:{
  async start(){
    const res = await API.get(`/api/oauth/${this.provider}/start?appId=${this.appId}`);
    const url = res.data.url;
    const win = window.open(url, 'oauth', 'width=800,height=700');
    window.addEventListener('message', (ev)=>{
      if(ev.data?.type==='oauth-token' && ev.data.appId===this.appId){
        const token = ev.data.token;
        // save token via API (store encrypted)
        API.post(`/api/apps/${this.appId}/credentials`, { secret: token });
        win.close();
        alert('Connected');
      }
    });
  }
 }
}
</script>
