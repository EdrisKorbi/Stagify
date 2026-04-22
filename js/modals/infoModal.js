import { openModal, closeModal } from './modalHelpers.js';
import { openQuiz } from './quizModal.js';
import { showToast } from '../ui/toast.js';


export async function openInfo(id){
  try {
    const response = await fetch(`api.php?action=getPostDetails&postId=${id}`);
    const data = await response.json();
    
    if (!data || data.status === 'error') {
        showToast("Impossible de charger les détails de l'offre.");
        return;
    }

    const ent = data.enterpriseInfo || {};
    const user = JSON.parse(localStorage.getItem('user'));
    window.currentCompany = data; 

    document.getElementById('info-eyebrow').textContent = ent.sector || 'Technologie';
    document.getElementById('info-title').textContent = data.enterpriseName;

    document.getElementById('info-meta').innerHTML = `
      <div class="meta-item"><p class="meta-label">Localisation</p><p class="meta-value">📍 ${ent.address || 'Alger'}</p></div>
      <div class="meta-item"><p class="meta-label">Revenus (Mensuel)</p><p class="meta-value">💰 ${ent.revenue || 'Non spécifié'}</p></div>
      <div class="meta-item"><p class="meta-label">Employés</p><p class="meta-value">👥 ${ent.employees || '1-10'}</p></div>
      <div class="meta-item"><p class="meta-label">Domaine</p><p class="meta-value">🏢 ${ent.sector || 'Technologie'}</p></div>`;

    let extraInfo = `\n\n🎯 À propos de l'offre:\n${data.content}`;
    extraInfo += `\n\n🏢 À propos de l'entreprise:\n${ent.description || 'Aucune description fournie.'}`;

    if (user && user.type === 'enterprise') {
        const quizRes = await fetch(`api.php?action=getQuiz&postId=${id}`);
        const quiz = await quizRes.json();
        
        if (data.requirements) {
            extraInfo += `\n\n🚀 Prérequis:\n${Array.isArray(data.requirements) ? data.requirements.join(', ') : data.requirements}`;
        }
        
        if (quiz && quiz.content && quiz.content.length > 0) {
            extraInfo += `\n\n📝 Quiz d'évaluation (${quiz.content.length} questions):\n`;
            quiz.content.forEach((q, i) => {
                extraInfo += `   ${i+1}. ${q.question}\n`;
            });
        }
    }

    document.getElementById('info-desc').textContent = extraInfo;

    const applyBtn = document.querySelector('#info-modal .btn-filled');
    if (applyBtn) {
      let isTaken = false;
      if (user && user.type === 'student') {
          const histRes = await fetch(`api.php?action=getHistory&userId=${user.userId}`);
          const history = await histRes.json();
          isTaken = history.some(h => parseInt(h.postId) === parseInt(id));
      }
      
      applyBtn.style.display = (user && user.type === 'student' && !isTaken) ? 'inline-flex' : 'none';
    }

    openModal('info-modal');
  } catch (err) {
    console.error("Info Modal error:", err);
    showToast("Une erreur est survenue lors du chargement des détails.");
  }
}


export function startApplyFlow(){
  closeModal('info-modal');
  openQuiz(window.currentCompany.postId);
}