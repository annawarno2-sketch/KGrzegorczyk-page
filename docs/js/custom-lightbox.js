/* Custom Lightbox v1
   - Replaces PhotoSwipe for this project
   - Features: captions, keyboard navigation, touch swipe, prev/next, close
   - Usage: anchors in galleries should link to full image URL and include data-caption attribute or have an adjacent .caption element
*/
(function(){
  'use strict';

  // Create lightbox DOM
  const tmpl = document.createElement('div');
  tmpl.id = 'custom-lightbox';
  tmpl.innerHTML = `
    <div class="clb-backdrop" data-clb-role="backdrop"></div>
    <div class="clb-shell" role="dialog" aria-modal="true" data-clb-role="shell">
      <button class="clb-close" data-clb-action="close" aria-label="Close">×</button>
      <button class="clb-prev" data-clb-action="prev" aria-label="Previous">‹</button>
      <div class="clb-stage" data-clb-role="stage">
        <img class="clb-img" src="" alt="" data-clb-role="img">
        <div class="clb-caption" data-clb-role="caption"></div>
      </div>
      <button class="clb-next" data-clb-action="next" aria-label="Next">›</button>
    </div>
  `;
  document.body.appendChild(tmpl);

  const lb = document.getElementById('custom-lightbox');
  const backdrop = lb.querySelector('[data-clb-role="backdrop"]');
  const shell = lb.querySelector('[data-clb-role="shell"]');
  const imgEl = lb.querySelector('[data-clb-role="img"]');
  const videoEl = document.createElement('video');
  videoEl.className = 'clb-video';
  videoEl.controls = true;
  videoEl.playsInline = true;
  videoEl.style.display = 'none';
  videoEl.style.maxWidth = '100%';
  videoEl.style.maxHeight = '80vh';
  document.querySelector('[data-clb-role="stage"]').appendChild(videoEl);
  const capEl = lb.querySelector('[data-clb-role="caption"]');
  const closeBtn = lb.querySelector('[data-clb-action="close"]');
  const prevBtn = lb.querySelector('[data-clb-action="prev"]');
  const nextBtn = lb.querySelector('[data-clb-action="next"]');

  let items = []; // {src, caption, thumbEl}
  let current = -1;

  function collectGalleryAnchors(scopeEl){
    const scope = scopeEl && scopeEl.querySelectorAll ? scopeEl : document;
    const anchors = scope.classList && scope.classList.contains('strip')
      ? Array.from(scope.querySelectorAll('a'))
      : Array.from(scope.querySelectorAll('.strip a'));
    items = anchors.map(a=>{
      const pswpCap = a.getAttribute('data-pswp-caption');
      const caption = pswpCap || a.dataset.caption || (a.querySelector('img') && a.querySelector('img').alt) || getSiblingCaption(a);
      return { src: a.getAttribute('href'), caption: caption, thumbEl: a };
    });
  }

  function getSiblingCaption(a){
    const c = a.parentElement.querySelector('.caption');
    return c ? c.textContent.trim() : '';
  }

  function openAt(index){
    if(index<0||index>=items.length) return;
    current = index;
    showItem(items[current]);
    lb.classList.add('open');
    document.body.classList.add('clb-open');
    requestAnimationFrame(()=>shell.focus());
  }

  function close(){
    lb.classList.remove('open');
    document.body.classList.remove('clb-open');
    imgEl.src = '';
    videoEl.pause();
    // remove sources and poster
    while (videoEl.firstChild) videoEl.removeChild(videoEl.firstChild);
    videoEl.removeAttribute('src');
    videoEl.removeAttribute('poster');
    current = -1;
  }

  function showItem(it){
    // preload and choose type
    const isVideo = it.src.toUpperCase().endsWith('.MOV');
    if (isVideo) {
      imgEl.style.display = 'none';
      videoEl.style.display = '';
      // set poster from thumbnail if available
      try {
        const imgThumb = it.thumbEl && it.thumbEl.querySelector && it.thumbEl.querySelector('img');
        if (imgThumb && imgThumb.src) videoEl.setAttribute('poster', imgThumb.src);
      } catch (e) {}
      // clear any previous sources
      while (videoEl.firstChild) videoEl.removeChild(videoEl.firstChild);
      const src = document.createElement('source');
      src.src = it.src;
      // choose a reasonable mime type for .mov
      src.type = /\.mov$/i.test(it.src) ? 'video/quicktime' : 'video/mp4';
      videoEl.appendChild(src);
      videoEl.setAttribute('aria-label', it.caption || 'Video');
      videoEl.load();
      // do not auto-play; show controls and let user start playback (autoplay can be blocked)
    } else {
      videoEl.style.display = 'none';
      videoEl.pause();
      while (videoEl.firstChild) videoEl.removeChild(videoEl.firstChild);
      videoEl.removeAttribute('src');
      videoEl.removeAttribute('poster');
      imgEl.style.display = '';
      imgEl.src = it.src;
      imgEl.alt = it.caption || '';
    }
    capEl.textContent = it.caption || '';
    // update nav buttons
    prevBtn.style.display = current>0 ? '' : 'none';
    nextBtn.style.display = current<items.length-1 ? '' : 'none';
  }

  function next(){ if(current<items.length-1) openAt(current+1); }
  function prev(){ if(current>0) openAt(current-1); }

  // events
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e)=>{
    if(current===-1) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowRight') next();
    if(e.key==='ArrowLeft') prev();
  });

  // touch swipe
  let touchStartX = 0, touchStartY = 0;
  shell.addEventListener('touchstart', e=>{
    const t = e.touches[0]; touchStartX = t.clientX; touchStartY = t.clientY;
  }, {passive:true});
  shell.addEventListener('touchend', e=>{
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX; const dy = t.clientY - touchStartY;
    if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)){
      if(dx<0) next(); else prev();
    }
  });

  // delegate click on gallery anchors
  document.addEventListener('click', (e)=>{
    const a = e.target.closest && e.target.closest('.strip a');
    if(!a) return;
    // ensure href is an image
    const href = a.getAttribute('href');
    if(!href) return;
    e.preventDefault();
    // rebuild items only for the clicked gallery strip, then find exact anchor index
    const strip = a.closest('.strip');
    collectGalleryAnchors(strip || undefined);
    let idx = items.findIndex(it=>it.thumbEl===a);
    if(idx<0) idx = items.findIndex(it=>it.src===href);
    if(idx>=0) openAt(idx);
  });

  // initial collect (in case galleries already in DOM)
  collectGalleryAnchors();

  // expose for debug
  window.CUSTOM_LIGHTBOX = {openAt, close, collectGalleryAnchors};
})();
