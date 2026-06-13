/* QDN — Tailwind build · shared scripts · qdn.vn */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
  document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=((i%3)*70)+'ms';io.observe(el);});

  var hdr=document.querySelector('header.site');
  if(hdr){
    var scrolled=false,ticking=false;
    var apply=function(){ticking=false;var s=window.scrollY>20;if(s!==scrolled){scrolled=s;hdr.classList.toggle('scrolled',s);}};
    var onS=function(){if(!ticking){ticking=true;requestAnimationFrame(apply);}};
    requestAnimationFrame(apply); /* defer initial scrollY read so it batches with layout, not a forced reflow */
    addEventListener('scroll',onS,{passive:true});
  }

  /* mobile menu */
  var mb=document.querySelector('.menu-btn'),links=document.querySelector('.nav-links');
  if(mb&&links)mb.addEventListener('click',function(){
    var open=links.style.display==='flex';
    if(open){links.style.display='';}
    else{links.style.display='flex';links.style.position='absolute';links.style.top='70px';links.style.left='0';links.style.right='0';links.style.flexDirection='column';links.style.background='var(--paper)';links.style.borderBottom='1px solid var(--line)';links.style.padding='14px 28px';links.style.gap='6px';links.style.zIndex='60';}
  });

  /* specimen — Idea -> AI mockup -> Live pipeline, auto-looping (home) */
  var sp=document.getElementById('specimen');
  if(sp){
    var seq=['idea','mockup','live'], si=0, hover=false, started=false, timer=null;
    var dwell={idea:1500,mockup:1500,live:2400};
    var stp={idea:sp.querySelector('.s-idea'),mockup:sp.querySelector('.s-mockup'),live:sp.querySelector('.s-live')};
    var segs=sp.querySelectorAll('.seg');
    var setStage=function(k){
      si=seq.indexOf(k);
      var live=(k==='live');
      sp.classList.toggle('is-live',live);
      sp.classList.toggle('is-mockup',!live);
      sp.classList.toggle('is-gen',k==='idea');
      var u=sp.querySelector('.u-state'); if(u){u.textContent=(k==='idea'?'brief':k);}
      seq.forEach(function(name,i){var el=stp[name]; if(el){el.classList.toggle('on',i===si);el.classList.toggle('done',i<si);}});
      if(segs[0]){segs[0].classList.toggle('fill',si>=1);}
      if(segs[1]){segs[1].classList.toggle('fill',si>=2);}
      sp.querySelectorAll('.spec-toggle button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-m')===(live?'live':'mockup'));});
    };
    var loop=function(){ if(!hover){ si=(si+1)%seq.length; setStage(seq[si]); } timer=setTimeout(loop,dwell[seq[si]]); };
    setStage('idea');
    sp.addEventListener('mouseenter',function(){hover=true;});
    sp.addEventListener('mouseleave',function(){hover=false;});
    sp.querySelectorAll('.spec-toggle button').forEach(function(b){b.addEventListener('click',function(){setStage(b.getAttribute('data-m'));});});
    var spo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!started){started=true;sp.classList.add('in');
      if(reduce){setStage('live');}
      else{timer=setTimeout(loop,1200);}
      spo.unobserve(sp);}});},{threshold:.3});
    spo.observe(sp);
  }
  /* ai console reveal */
  document.querySelectorAll('.ailog').forEach(function(el){var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target);}});},{threshold:.3});o.observe(el);});

  /* contact form — AJAX submit to Netlify (no page reload). Native POST to
     action="/thank-you" remains the no-JS fallback. */
  var cf=document.getElementById('brief-form');
  if(cf){
    var st=document.getElementById('form-status');
    var say=function(msg,cls){if(st){st.textContent=msg;st.className='form-status'+(cls?' '+cls:'');}};
    cf.addEventListener('submit',function(e){
      e.preventDefault();
      var data=new FormData(cf);
      var btn=cf.querySelector('button[type=submit]');
      if(btn)btn.disabled=true;
      say('Sending…');
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data).toString()})
        .then(function(r){
          if(!r.ok)throw new Error(r.status);
          cf.reset();
          say('Thanks — your brief is in. We reply within one business day.','ok');
        })
        .catch(function(){say('Could not send right now — email quang.dinh@qdn.vn and we’ll jump on it.','err');})
        .finally(function(){if(btn)btn.disabled=false;});
    });
  }
})();
