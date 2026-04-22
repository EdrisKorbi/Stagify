import { companies } from '../data/companies.js';
import { renderGrid } from './grid.js';

export function filterFiliere(btn, filiere){
  document.querySelectorAll('.filiere-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid(filiere);
}