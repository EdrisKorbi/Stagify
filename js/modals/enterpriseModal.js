import { showToast } from '../ui/toast.js';

export function openCreatePostModal() {
    document.getElementById('create-post-modal').classList.add('open');
    document.getElementById('quiz-questions-container').innerHTML = '';
    questionCount = 0; // Reset count
    addQuizQuestion(); 
}

let questionCount = 0;
export function addQuizQuestion() {
    if (questionCount >= 10) {
        showToast("Maximum 10 questions.");
        return;
    }
    questionCount++;
    const container = document.getElementById('quiz-questions-container');
    const div = document.createElement('div');
    div.className = 'quiz-question-block';
    div.style.marginBottom = '2rem';
    div.style.padding = '1.5rem';
    div.style.background = 'rgba(255,255,255,0.03)';
    div.style.border = '1px solid rgba(255,255,255,0.1)';
    div.style.borderRadius = '8px';
    div.style.position = 'relative';
    
    div.innerHTML = `
        <button type="button" class="btn-sm" style="position:absolute; top:1rem; right:1rem; padding:.2rem .5rem; font-size:.6rem; border:1px solid rgba(255,0,0,0.3); color:rgba(255,100,100,0.8);" onclick="this.parentElement.remove(); updateQuestionLabels();">Supprimer</button>
        <div class="form-group">
            <label class="q-label">Question ${questionCount}</label>
            <input type="text" class="mcq-question" placeholder="Énoncé de la question" required />
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group" style="margin:0">
                <label style="font-size:.6rem">Option 1</label>
                <input type="text" class="mcq-opt-1" placeholder="Réponse A" required />
            </div>
            <div class="form-group" style="margin:0">
                <label style="font-size:.6rem">Option 2</label>
                <input type="text" class="mcq-opt-2" placeholder="Réponse B" required />
            </div>
            <div class="form-group" style="margin:0">
                <label style="font-size:.6rem">Option 3</label>
                <input type="text" class="mcq-opt-3" placeholder="Réponse C" required />
            </div>
            <div class="form-group" style="margin:0">
                <label style="font-size:.6rem">Option 4</label>
                <input type="text" class="mcq-opt-4" placeholder="Réponse D" required />
            </div>
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label style="font-size:.6rem">Bonne réponse</label>
            <select class="mcq-correct" required>
                <option value="0">Option 1 (A)</option>
                <option value="1">Option 2 (B)</option>
                <option value="2">Option 3 (C)</option>
                <option value="3">Option 4 (D)</option>
            </select>
        </div>
    `;
    container.appendChild(div);
}

window.updateQuestionLabels = () => {
    const labels = document.querySelectorAll('.q-label');
    questionCount = labels.length;
    labels.forEach((l, i) => {
        l.textContent = `Question ${i+1}`;
    });
};

export async function submitNewPost(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.type !== 'enterprise') return;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Publication...</span>';

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    const requirements = document.getElementById('post-requirements').value.split(',').map(s => s.trim());
    
    // Collect MCQ Data
    const quizContent = Array.from(document.querySelectorAll('.quiz-question-block')).map(block => {
        return {
            question: block.querySelector('.mcq-question').value,
            options: [
                block.querySelector('.mcq-opt-1').value,
                block.querySelector('.mcq-opt-2').value,
                block.querySelector('.mcq-opt-3').value,
                block.querySelector('.mcq-opt-4').value,
            ],
            correct: parseInt(block.querySelector('.mcq-correct').value)
        };
    });

    const response = await fetch('api.php?action=createPost', {
        method: 'POST',
        body: JSON.stringify({
            userId: user.userId,
            title,
            content,
            requirements,
            quizContent: quizContent
        })
    });

    const result = await response.json();
    if (result.status === 'success') {
        showToast("Offre publiée avec succès !");
        document.getElementById('create-post-modal').classList.remove('open');
        e.target.reset();
        questionCount = 0;
        renderEnterprisePosts(); 
    } else {
        showToast(result.message);
    }
    
    // Re-enable button
    btn.disabled = false;
    btn.innerHTML = '<span>Publier l\'offre ✦</span>';
}

export async function deletePost(postId) {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    
    const response = await fetch(`api.php?action=deletePost&postId=${postId}`);
    const result = await response.json();
    if (result.status === 'success') {
        showToast("Offre supprimée.");
        renderEnterprisePosts();
    }
}

export async function viewApplicants(postId) {
    document.getElementById('candidates-modal').classList.add('open');
    const container = document.getElementById('candidates-list');
    container.innerHTML = '<p style="text-align:center; padding:2rem;">Chargement des candidatures...</p>';

    const response = await fetch(`api.php?action=viewApplications&postId=${postId}`);
    const apps = await response.json();

    if (!apps || apps.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--gray-600);">Aucune candidature pour le moment.</p>';
        return;
    }

    container.innerHTML = `
        <table style="width:100%; border-collapse: collapse; font-size:.85rem;">
            <thead>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--gray-600); text-align:left;">
                    <th style="padding:1rem;">Candidat</th>
                    <th style="padding:1rem;">Motivation & CV</th>
                    <th style="padding:1rem;">Score Quiz</th>
                    <th style="padding:1rem;">Status</th>
                    <th style="padding:1rem;">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${apps.map(a => `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding:1rem;">
                            <div style="font-weight:600;">${a.username || 'Candidat'}</div>
                            <div style="font-size:.7rem; color:var(--gray-600);">${a.email || 'Pas d\'email'}</div>
                            <div style="font-size:.7rem; color:var(--white);">${a.phone || 'Pas de téléphone'}</div>
                            <div style="font-size:.7rem; color:var(--gray-500);">${a.field}</div>
                        </td>
                        <td style="padding:1rem;">
                            <div style="max-width:200px; font-size:.75rem; color:var(--gray-400); margin-bottom:.5rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${a.motivation || ''}">
                                ${a.motivation || 'N/A'}
                            </div>
                            ${a.cv_link ? `<a href="${a.cv_link}" target="_blank" style="color:var(--primary-light); text-decoration:none; font-size:.7rem;">📄 Voir le CV</a>` : '<span style="color:var(--gray-600); font-size:.7rem;">Pas de CV</span>'}
                        </td>
                        <td style="padding:1rem;">
                            <span style="padding:.2rem .5rem; background:rgba(255,255,255,0.05); border-radius:4px;">
                                ${a.score}/${a.totalQuestions}
                            </span>
                        </td>
                        <td style="padding:1rem;">
                            <span class="status-badge ${a.acceptState}">${a.acceptState}</span>
                        </td>
                        <td style="padding:1rem;">
                            ${a.acceptState === 'pending' ? `
                                <div style="display:flex; gap:.5rem;">
                                    <button class="btn-sm btn-outline" style="font-size:.6rem; padding:.3rem .6rem;" onclick="updateAppStatus(${a.id}, 'accepted', ${postId})">Accepter</button>
                                    <button class="btn-sm btn-outline" style="font-size:.6rem; padding:.3rem .6rem; border-color:rgba(255,0,0,0.3);" onclick="updateAppStatus(${a.id}, 'rejected', ${postId})">Refuser</button>
                                </div>
                            ` : '<span style="color:var(--gray-600); font-size:.6rem;">Décision prise</span>'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

export async function updateAppStatus(appId, status, postId) {
    const response = await fetch(`api.php?action=updateApplicationStatus&appId=${appId}&status=${status}`);
    const result = await response.json();
    if (result.status === 'success') {
        showToast(`Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'}.`);
        viewApplicants(postId); // Refresh the list
    }
}

export async function updateEnterpriseProfile(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const data = {
        userId: user.userId,
        sector: document.getElementById('prof-sector').value,
        employees: document.getElementById('prof-employees').value,
        revenue: document.getElementById('prof-revenue').value,
        address: document.getElementById('prof-address').value,
        description: document.getElementById('prof-desc').value
    };

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enregistrement...';

    const response = await fetch('api.php?action=updateProfile', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if(result.status === 'success') {
        showToast("Profil mis à jour avec succès.");
    } else {
        showToast("Erreur lors de la mise à jour.");
    }

    btn.disabled = false;
    btn.textContent = originalText;
}

export async function loadEnterpriseProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user || user.type !== 'enterprise') return;

    const response = await fetch(`api.php?action=getEnterpriseDetails&userId=${user.userId}`);
    const ent = await response.json();
    if(ent && ent.status !== 'error') {
        document.getElementById('prof-sector').value = ent.sector || '';
        document.getElementById('prof-employees').value = ent.employees || '1-10';
        document.getElementById('prof-revenue').value = ent.revenue || '';
        document.getElementById('prof-address').value = ent.address || '';
        document.getElementById('prof-desc').value = ent.description || '';
    }
}

export async function renderEnterprisePosts() {

    const user = JSON.parse(localStorage.getItem('user'));
    const container = document.getElementById('enterprise-posts');
    if (!container) return;

    const response = await fetch(`api.php?action=getEnterprisePosts&userId=${user.userId}`);
    const posts = await response.json();

    if (!posts || posts.length === 0) {
        container.innerHTML = '<p style="padding:3rem;color:var(--gray-600);font-size:.85rem;grid-column:1/-1;text-align:center;">Aucune offre publiée pour le moment.</p>';
        return;
    }

    // LIST STYLE instead of grid
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';

    container.innerHTML = posts.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.1); border-radius:12px; transition:all .3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
            <div>
                <h3 style="margin:0; font-size:1.1rem; color:var(--white); cursor:pointer; text-decoration:underline;" onclick="openInfo(${p.postId})">${p.title}</h3>
                <p style="margin:.5rem 0 0; font-size:.8rem; color:var(--gray-600);">${p.content.substring(0,100)}...</p>
            </div>
            <div style="display:flex; gap:1rem; align-items:center;">
                <button class="btn-sm btn-outline" onclick="viewApplicants(${p.postId})">
                    <span>Voir Candidats</span>
                </button>
                <button class="btn-sm btn-outline" style="border-color:rgba(255,0,0,0.2); color:rgba(255,100,100,0.8);" onclick="deletePost(${p.postId})">
                    <span>Supprimer</span>
                </button>
            </div>
        </div>
    `).join('');
}



