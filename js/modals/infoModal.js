import { companies } from '../data/companies.js';
import { currentCompany } from '../state/state.js';
import { openModal, closeModal } from './modalHelpers.js';
import { openQuiz } from './quizModal.js';

export function openInfo(id){
  const c = companies.find(x=>x.id===id);
  if(!c) return;

  window.currentCompany = c;

  document.getElementById('info-eyebrow').textContent = c.sector;
  document.getElementById('info-title').textContent = c.name;

  document.getElementById('info-meta').innerHTML = `
    <div class="meta-item"><p class="meta-label">Localisation</p><p class="meta-value">📍 ${c.location}</p></div>
    <div class="meta-item"><p class="meta-label">Durée</p><p class="meta-value">⏱ ${c.duration}</p></div>
    <div class="meta-item"><p class="meta-label">Indemnité</p><p class="meta-value">💰 ${c.compensation}</p></div>
    <div class="meta-item"><p class="meta-label">Filière cible</p><p class="meta-value">🎓 ${c.filiere.charAt(0).toUpperCase()+c.filiere.slice(1)}</p></div>`;

  document.getElementById('info-desc').textContent = c.desc;

  openModal('info-modal');
}

export function startApplyFlow(){
  closeModal('info-modal');
  openQuiz(window.currentCompany.id);
}