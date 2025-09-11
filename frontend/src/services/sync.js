import API from './api';
const KEY = 'eal_apps_v1';
export function loadLocal(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch{return [];} }
export function saveLocal(apps){ localStorage.setItem(KEY, JSON.stringify(apps)); }
export async function syncToServer(apps){ try{ await API.post('/api/apps', apps.map(a=>({ name:a.name,url:a.url,icon:a.icon,category:a.category }))); return true; }catch{ return false; } }
