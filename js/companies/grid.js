    import { openInfo } from '../modals/infoModal.js';
import { openQuiz } from '../modals/quizModal.js';

export async function renderGrid(filiere = 'all'){
  const grid = document.getElementById('company-grid');
  grid.innerHTML = '<p style="padding:3rem;grid-column:1/-1;text-align:center;">Chargement...</p>';

  const user = JSON.parse(localStorage.getItem('user'));
  const isStudent = user && user.type === 'student';

  const response = await fetch(`api.php?action=getCompanies&filiere=${filiere}`);
  const companies = await response.json();

  grid.innerHTML = '';

  if(!companies || !companies.length){
    grid.innerHTML = '<p style="padding:3rem;color:var(--gray-600);font-size:.85rem;grid-column:1/-1;text-align:center;">Aucune entreprise trouvée.</p>';
    return;
  }

  companies.forEach(c => {
    const initial = c.name.substring(0,2).toUpperCase();
    
    const card = document.createElement('div');
    card.className = 'company-card';

    card.innerHTML = `
      <div class="company-card-inner">
        <div class="company-logo-placeholder">${initial}</div>
        <span class="company-name">${c.name}</span>
      </div>
      <div class="company-overlay">
        <p class="overlay-tag">${c.sector || 'Secteur'}</p>
        <h3 class="overlay-name">${c.name}</h3>
        <p class="overlay-info">📍 ${c.location || 'Algérie'}</p>
        <div class="overlay-btns">
          <button class="btn-sm btn-outline" style="width:100%" onclick="openCompanyPosts(${c.enterpriseId}, '${c.name.replace(/'/g, "\\'")}')">Voir les offres</button>
        </div>
      </div>`;

    grid.appendChild(card);
  });
}

export async function openCompanyPosts(entId, entName) {
    const modal = document.getElementById('company-posts-modal');
    const list = document.getElementById('company-posts-list');
    document.getElementById('company-posts-title').textContent = entName;
    
    list.innerHTML = '<p style="text-align:center; padding:2rem;">Chargement des offres...</p>';
    modal.classList.add('open');

    const user = JSON.parse(localStorage.getItem('user'));
    const isStudent = user && user.type === 'student';

    const [postsRes, historyRes] = await Promise.all([
        fetch(`api.php?action=getEnterprisePosts&enterpriseId=${entId}`),
        isStudent ? fetch(`api.php?action=getHistory&userId=${user.userId}`) : Promise.resolve({json:()=>[]})
    ]);

    const posts = await postsRes.json();
    const history = isStudent ? await historyRes.json() : [];
    const takenPostIds = new Set(history.map(h => parseInt(h.postId)));

    if (!posts || posts.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--gray-600);">Aucune offre disponible pour le moment.</p>';
        return;
    }

    list.innerHTML = posts.map(p => {
        const historyItem = history.find(h => parseInt(h.postId) === parseInt(p.postId));
        const isTaken = !!historyItem;
        let statusHtml = '';
        if (isTaken) {
            const status = historyItem.acceptState || 'pending';
            let color = '#aaa';
            if (status === 'accepted') color = '#4ade80';
            if (status === 'rejected') color = '#f87171';
            statusHtml = `<span style="font-size:.6rem; font-weight:bold; color:${color}; margin-left:auto;">${status.toUpperCase()} ✓</span>`;
        }

        return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:1.2rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                <div style="flex:1">
                    <h4 style="margin:0; font-size:.95rem; color:var(--white);">${p.title}</h4>
                    <p style="margin:.3rem 0 0; font-size:.75rem; color:var(--gray-600);">${p.content.substring(0,80)}...</p>
                </div>
                <div style="display:flex; align-items:center; gap:1rem;">
                    ${statusHtml}
                    <button class="btn-sm btn-outline" onclick="openInfo(${p.postId})">Infos</button>
                    ${isStudent && !isTaken ? `<button class="btn-sm btn-filled" onclick="closeModal('company-posts-modal'); openQuiz(${p.postId});">Postuler</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

export async function renderHistory(){
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user || user.type !== 'student') return;

  const grid = document.getElementById('history-grid');
  grid.innerHTML = '<p style="padding:3rem;grid-column:1/-1;text-align:center;">Chargement...</p>';

  const response = await fetch(`api.php?action=getHistory&userId=${user.userId}`);
  const list = await response.json();

  grid.innerHTML = '';

  if(!list || !list.length){
    grid.innerHTML = '<p style="padding:3rem;color:var(--gray-600);font-size:.85rem;grid-column:1/-1;text-align:center;">Vous n\'avez pas encore postulé à des stages.</p>';
    return;
  }

  list.forEach(c => {
    const card = document.createElement('div');
    card.className = 'company-card';

    let statusClass = 'status-pending';
    if(c.acceptState === 'accepted') statusClass = 'status-accepted';
    if(c.acceptState === 'rejected') statusClass = 'status-rejected';

    card.innerHTML = `
      <div class="company-card-inner">
        <div class="company-logo-placeholder">${c.enterpriseName.substring(0,2).toUpperCase()}</div>
        <span class="company-name">${c.enterpriseName}</span>
      </div>
      <div class="company-overlay" style="opacity:1;transform:none;background:rgba(0,0,0,0.85)">
        <p class="overlay-tag">${c.title}</p>
        <h3 class="overlay-name" style="font-size:1.2rem;margin-bottom:0.5rem">${c.enterpriseName}</h3>
        <p class="overlay-info">Score Quiz : <strong>${c.score}</strong></p>
        <div class="status-badge ${statusClass}">${c.acceptState.toUpperCase()}</div>
      </div>`;

    grid.appendChild(card);
  });
}
