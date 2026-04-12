    import { openInfo } from '../modals/infoModal.js';
import { openQuiz } from '../modals/quizModal.js';

export function renderGrid(list){
  const grid = document.getElementById('company-grid');
  grid.innerHTML = '';

  if(!list.length){
    grid.innerHTML = '<p style="padding:3rem;color:var(--gray-600);font-size:.85rem;grid-column:1/-1;text-align:center;">Aucune entreprise pour cette filière.</p>';
    return;
  }

  list.forEach(c => {
    const card = document.createElement('div');
    card.className = 'company-card';

    card.innerHTML = `
      <div class="company-card-inner">
        <div class="company-logo-placeholder">${c.initial}</div>
        <span class="company-name">${c.name}</span>
      </div>
      <div class="company-overlay">
        <p class="overlay-tag">${c.sector}</p>
        <h3 class="overlay-name">${c.name}</h3>
        <p class="overlay-info">📍 ${c.location} &nbsp;·&nbsp; ⏱ ${c.duration}</p>
        <p class="overlay-info" style="font-size:.72rem;margin-top:-.25rem;opacity:.7;">Indemnité : ${c.compensation}</p>
        <div class="overlay-btns">
          <button class="btn-sm btn-outline" onclick="openInfo(${c.id})">Plus d'info</button>
          <button class="btn-sm btn-filled" onclick="openQuiz(${c.id})">Postuler</button>
        </div>
      </div>`;

    grid.appendChild(card);
  });
}