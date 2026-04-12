import { companies } from '../data/companies.js';
import { renderGrid } from './grid.js';

export function filterFiliere(btn, key){
  document.querySelectorAll('.filiere-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');

  const filtered = key==='all'
    ? companies
    : companies.filter(c=>c.filiere===key);

  renderGrid(filtered);
}