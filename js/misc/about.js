export function changeAboutImg(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = ev => {
    const container = document.getElementById('about-img-container');

    container.innerHTML = `
      <img src="${ev.target.result}"
      style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block;filter:grayscale(100%);border:1px solid rgba(255,255,255,.08);" />`;
  };

  reader.readAsDataURL(file);
}