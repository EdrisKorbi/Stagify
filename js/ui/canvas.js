(function initCanvas() {
  const c = document.getElementById('bg-canvas');
  const ctx = c.getContext('2d');
  let W,H, pts=[];

  function resize(){
    W=c.width=window.innerWidth;
    H=c.height=window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  for(let i=0;i<55;i++)
    pts.push({ x:Math.random()*1800, y:Math.random()*900, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4 });

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,255,255,1)';
    ctx.lineWidth=.4;

    for(let i=0;i<pts.length;i++){
      let p=pts[i];
      p.x+=p.vx; p.y+=p.vy;

      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;

      ctx.beginPath();
      ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,.6)';
      ctx.fill();

      for(let j=i+1;j<pts.length;j++){
        let q=pts[j], d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<130){
          ctx.globalAlpha=(1-d/130)*.35;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);
          ctx.lineTo(q.x,q.y);
          ctx.stroke();
          ctx.globalAlpha=1;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();