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

  /* mobile menu — class toggle only (no inline styles), with overlay + a11y */
  var mb=document.querySelector('.menu-btn');
  var ov=document.querySelector('.nav-overlay');
  var links=document.querySelector('.nav-links');
  if(mb&&links){
    var setMenu=function(open){
      document.body.classList.toggle('nav-open',open);
      mb.setAttribute('aria-expanded',open?'true':'false');
      mb.setAttribute('aria-label',open?'Close menu':'Open menu');
    };
    mb.addEventListener('click',function(){setMenu(!document.body.classList.contains('nav-open'));});
    if(ov)ov.addEventListener('click',function(){setMenu(false);});
    links.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});
    /* close + reset when crossing into desktop, so inline/open state never leaks across breakpoints */
    var mq=window.matchMedia('(min-width:1024px)');
    (mq.addEventListener?mq.addEventListener.bind(mq,'change'):mq.addListener.bind(mq))(function(e){if(e.matches)setMenu(false);});
  }

  /* specimen — Idea (typed) -> AI mockup (wireframe) -> Live (finished + live activity), auto-looping (home).
     The rail segment after the current step fills over that step's duration and its end advances the step;
     hover or a click pauses it. */
  var sp=document.getElementById('specimen');
  if(sp){
    var seq=['idea','mockup','live'], si=0, hover=false, held=false, started=false, timer=null, typer=null, ticker=null, holdT=null;
    var DUR={mockup:3400,live:5600}, TYPE=32;
    var btns=sp.querySelectorAll('.sp-steps .stp'), segs=sp.querySelectorAll('.sp-steps .seg');
    var cap=sp.querySelector('.cap'), tx=sp.querySelector('.tx'), full=tx?tx.getAttribute('data-text'):'';
    var setPaused=function(){sp.classList.toggle('paused',hover||held);};
    var advance=function(){setStage(seq[(si+1)%seq.length],true);};
    segs.forEach(function(s){s.addEventListener('animationend',function(){if(s.classList.contains('run')&&segs[si]===s)advance();});});
    var run=function(ms){
      var s=segs[si];
      if(s){s.style.setProperty('--dur',ms+'ms');void s.offsetWidth;s.classList.add('run');return;}
      /* last step has no segment after it: plain timer that waits while paused */
      var left=ms, step=200;
      timer=setInterval(function(){if(hover||held)return;left-=step;if(left<=0){clearInterval(timer);advance();}},step);
    };
    var setStage=function(k,auto){
      si=seq.indexOf(k);
      clearInterval(typer); clearInterval(timer); clearTimeout(ticker);
      sp.classList.remove('tick','is-gen');
      sp.classList.toggle('is-idea',k==='idea');
      sp.classList.toggle('is-mockup',k==='mockup');
      sp.classList.toggle('is-live',k==='live');
      btns.forEach(function(b,i){b.classList.toggle('on',i===si);b.classList.toggle('done',i<si);b.setAttribute('aria-selected',i===si?'true':'false');});
      segs.forEach(function(s,i){s.classList.remove('run');s.classList.toggle('fill',i<si);});
      var c=btns[si]&&btns[si].getAttribute('data-cap');
      if(cap&&c&&cap.textContent!==c){cap.classList.add('fade');setTimeout(function(){cap.textContent=c;cap.classList.remove('fade');},200);}
      /* Live: a beat later the app does something on its own (new order / AI reply) */
      if(k==='live'){ticker=setTimeout(function(){sp.classList.add('tick');},reduce?0:1300);}
      if(reduce){if(tx)tx.textContent=full;return;}
      if(k==='idea'&&tx){
        if(auto){
          /* type the brief, then show "generating…" */
          var n=0; tx.textContent='';
          typer=setInterval(function(){n++;tx.textContent=full.slice(0,n);if(n>=full.length){clearInterval(typer);sp.classList.add('is-gen');}},TYPE);
          run(full.length*TYPE+1500);
        } else {tx.textContent=full;sp.classList.add('is-gen');run(2600);}
      } else {run(DUR[k]);}
    };
    sp.classList.add('is-idea');
    sp.addEventListener('mouseenter',function(){hover=true;setPaused();});
    sp.addEventListener('mouseleave',function(){hover=false;setPaused();});
    /* clicking a step jumps there and holds it for a while before auto-play resumes */
    btns.forEach(function(b){b.addEventListener('click',function(){
      held=true; setPaused(); clearTimeout(holdT); holdT=setTimeout(function(){held=false;setPaused();},8000);
      setStage(b.getAttribute('data-k'),false);
    });});
    var spo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!started){started=true;sp.classList.add('in');
      if(reduce){setStage('live');}
      else{setTimeout(function(){setStage('idea',true);},500);}
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
    var msg={
      sending:cf.getAttribute('data-msg-sending')||'Sending…',
      ok:cf.getAttribute('data-msg-ok')||'Thanks — your brief is in.',
      err:cf.getAttribute('data-msg-err')||'Could not send right now — email quang.dinh@qdn.vn.'
    };
    var say=function(m,cls){if(st){st.textContent=m;st.className='form-status'+(cls?' '+cls:'');}};
    cf.addEventListener('submit',function(e){
      e.preventDefault();
      var data=new FormData(cf);
      var btn=cf.querySelector('button[type=submit]');
      if(btn)btn.disabled=true;
      say(msg.sending);
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data).toString()})
        .then(function(r){
          if(!r.ok)throw new Error(r.status);
          cf.reset();
          say(msg.ok,'ok');
        })
        .catch(function(){say(msg.err,'err');})
        .finally(function(){if(btn)btn.disabled=false;});
    });
  }
})();
