import { showToast } from '../ui/toast.js';

export function submitContact(e){
  e.preventDefault();
  e.target.reset();
  showToast('Message envoyé avec succès ✦');
}