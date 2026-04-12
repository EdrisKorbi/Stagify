window.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');

  if(!cursor || !ring) return;

  let mx=0,my=0,rx=0,ry=0;

  document.addEventListener('mousemove', e => {
    mx=e.clientX;
    my=e.clientY;
    cursor.style.left=mx+'px';
    cursor.style.top=my+'px';
  });

  (function animRing(){
    rx += (mx-rx)*.12;
    ry += (my-ry)*.12;
    ring.style.left=rx+'px';
    ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
});