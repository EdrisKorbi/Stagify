import { showToast } from '../ui/toast.js';
import { renderGrid, renderHistory } from '../companies/grid.js';


export function switchRole(role){
  document.querySelectorAll('.role-tab').forEach((t,i)=>{
    t.classList.toggle('active', (role==='etudiant'&&i===0)||(role==='entreprise'&&i===1));
  });
}

export async function doLogin(e){
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  const activeTab = document.querySelector('.role-tab.active');
  const selectedRole = activeTab && activeTab.textContent.toLowerCase().includes('étudiant') ? 'student' : 'enterprise';

  const response = await fetch('api.php?action=login', {
    method: 'POST',
    body: JSON.stringify({ email, password, selectedRole })
  });
  
  const result = await response.json();
  
  if(result.status === 'success') {
    localStorage.setItem('user', JSON.stringify(result));
    if(window.initApp) {
        window.initApp(result);
    } else {
        console.error("initApp not found!");
    }
  } else {


    showToast(result.message);
  }
}



export function doLogout(){
  localStorage.removeItem('user');
  location.reload(); // Refresh the page to clear all state
}

export function showSignup(){
  window.scrollTo(0,0);
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('signup-page').classList.add('active');
}

export function showLogin(){
  window.scrollTo(0,0);
  document.getElementById('signup-page').classList.remove('active');
  document.getElementById('login-page').classList.add('active');
}


export function toggleSignupFields(){
  const role = document.getElementById('signup-role').value;
  document.getElementById('student-fields').style.display = role === 'student' ? 'block' : 'none';
  document.getElementById('enterprise-fields').style.display = role === 'enterprise' ? 'block' : 'none';
}

export async function doRegister(e){
  e.preventDefault();
  const role = document.getElementById('signup-role').value;
  const data = {
    type: role,
    username: document.getElementById('reg-username').value,
    email: document.getElementById('reg-email').value,
    password: document.getElementById('reg-password').value,
  };

  if(role === 'student'){
    data.university = document.getElementById('reg-univ').value;
    data.field = document.getElementById('reg-field').value;
    data.address = "";
  } else {
    data.name = document.getElementById('reg-ent-name').value;
    data.proof_link = document.getElementById('reg-proof').value;
    data.address = "";
  }

  const response = await fetch('api.php?action=register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  if(result.status === 'success'){
    const msg = role === 'enterprise' 
      ? "Compte créé, en attente de l'approbation de l'administration." 
      : "Un e-mail de confirmation a été envoyé à votre boîte de réception.";
    showToast(msg);
    showLogin();
  } else {
    showToast(result.message);
  }
}


