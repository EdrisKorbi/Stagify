import { companies } from '../data/companies.js';
import { renderGrid } from '../companies/grid.js';

export function switchRole(role){
  document.querySelectorAll('.role-tab').forEach((t,i)=>{
    t.classList.toggle('active', (role==='etudiant'&&i===0)||(role==='entreprise'&&i===1));
  });
}

export function doLogin(e){
  e.preventDefault();
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('main-app').classList.add('active');
  renderGrid(companies);
}

export function doLogout(){
  document.getElementById('main-app').classList.remove('active');
  document.getElementById('login-page').classList.add('active');
}