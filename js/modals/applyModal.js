import { getQuizResults } from './quizModal.js';
import { closeModal } from './modalHelpers.js';
import { showToast } from '../ui/toast.js';
import { renderGrid } from '../companies/grid.js';

export function handleCvDrop(e){
  // No longer needed for file drop, but keeping for compatibility if needed
}

export async function submitApplication(e){
  e.preventDefault();
  
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span>Envoi en cours...</span>';

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const quizResults = getQuizResults();
    
    if (!quizResults || !quizResults.postId) {
      throw new Error("Résultats du quiz introuvables.");
    }

    const cvLink = document.getElementById('apply-cv-link').value;
    const motivation = document.getElementById('apply-motivation').value;
    const phone = document.getElementById('apply-phone').value;

    const response = await fetch('api.php?action=submitQuiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.userId,
        postId: quizResults.postId,
        answers: quizResults.answers,
        cv_link: cvLink,
        motivation: motivation,
        phone: phone
      })
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    if (result.status === 'success') {
      closeModal('apply-modal');
      closeModal('company-posts-modal');
      showToast("Candidature envoyée avec succès ! ✦");
      renderGrid(); 
    } else {
      showToast(result.message || "Erreur lors de l'envoi.");
    }
  } catch (err) {
    console.error("Application error:", err);
    showToast(`Erreur: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}