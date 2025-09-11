<template>
<div>
<h3>Login</h3>
<input v-model="username" placeholder="Username"/>
<input type="password" v-model="password" placeholder="Password"/>
<button @click="login">Login</button>
</div>
</template>

<script>
import axios from 'axios';
export default {
data(){ return { username:'', password:'' }; },
methods:{
async login(){
try{
const res=await axios.post('http://localhost:5000/api/apps/register',{ username:this.username,password:this.password }).catch(()=>{});
const loginRes=await axios.post('http://localhost:5000/api/apps/login',{ username:this.username,password:this.password });
this.$emit('login',loginRes.data.token);
}catch{ alert('Login failed'); }
}
}
}
</script>
