export function openModal(id){
  document.getElementById(id).classList.add('open');
}

export function closeModal(id){
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click', e=>{
    if(e.target===m) closeModal(m.id);
  });
});