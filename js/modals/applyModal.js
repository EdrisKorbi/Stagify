import { closeModal } from './modalHelpers.js';
import { showToast } from '../ui/toast.js';

export function handleCvDrop(e){
  const file = e.target.files[0];

  if(file){
    document.getElementById('cv-drop').querySelector('.file-drop-text').innerHTML =
      `<strong style="color:var(--white);">✔ ${file.name}</strong>
       <span style="font-size:.72rem;color:var(--gray-600);">${(file.size/1024).toFixed(0)} KB</span>`;
  }
}

export function submitApplication(e){
  e.preventDefault();
  closeModal('apply-modal');
  showToast("Candidature envoyée ✦");
}