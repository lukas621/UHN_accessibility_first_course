/* ── Podcast Player ── */
(function(){
  var audio, playBtn, fill, timeEl;
  function init(){
    audio = document.getElementById('podAudio');
    playBtn = document.getElementById('podPlayBtn');
    fill = document.getElementById('podFill');
    timeEl = document.getElementById('podTime');
    if(audio) audio.addEventListener('timeupdate', updateProgress);
    if(audio) audio.addEventListener('ended', function(){ if(playBtn) playBtn.textContent = '▶'; });
  }
  function fmt(s){ var m=Math.floor(s/60); var sec=Math.floor(s%60); return m+':'+(sec<10?'0':'')+sec; }
  function highlightTranscript(currentTime){
    var paras = document.querySelectorAll('.transcript-p');
    var activeIdx = -1;
    for(var i = paras.length - 1; i >= 0; i--){
      var t = parseFloat(paras[i].getAttribute('data-time'));
      if(currentTime >= t){ activeIdx = i; break; }
    }
    paras.forEach(function(p, i){
      if(i === activeIdx){
        if(!p.classList.contains('active')){
          p.classList.add('active');
          var panel = document.getElementById('podTranscript');
          if(panel && panel.style.display !== 'none'){
            p.scrollIntoView({behavior:'smooth', block:'center'});
          }
        }
      } else {
        p.classList.remove('active');
      }
    });
  }
  function updateProgress(){
    if(!audio||!fill||!timeEl) return;
    var pct = audio.duration ? (audio.currentTime/audio.duration)*100 : 0;
    fill.style.width = pct+'%';
    timeEl.textContent = fmt(audio.currentTime)+' / '+fmt(audio.duration||0);
    highlightTranscript(audio.currentTime);
  }
  window.togglePod = function(){
    if(!audio){ init(); }
    if(!audio) return;
    if(audio.paused){ audio.play(); if(playBtn) playBtn.textContent='⏸'; }
    else { audio.pause(); if(playBtn) playBtn.textContent='▶'; }
  };
  window.seekPod = function(e){
    if(!audio) init();
    if(!audio||!audio.duration) return;
    var rect = e.currentTarget.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };
  window.seekTo = function(sec){
    if(!audio) init();
    if(!audio) return;
    audio.currentTime = sec;
    if(audio.paused){ audio.play(); if(playBtn) playBtn.textContent='⏸'; }
  };
  document.addEventListener('DOMContentLoaded', init);
})();

/* ── Impact Carousel ── */
(function(){
  let carouselIdx = 0;
  const carouselTotal = 4;
  function goCarousel(idx) {
    carouselIdx = Math.max(0, Math.min(idx, carouselTotal - 1));
    var track = document.getElementById('impactTrack');
    if (track) track.style.transform = 'translateX(-' + (carouselIdx * 100) + '%)';
    var dots = document.querySelectorAll('.carousel-nav .dot');
    dots.forEach(function(d, i) { d.classList.toggle('active', i === carouselIdx); });
  }
  function moveCarousel(dir) { goCarousel(carouselIdx + dir); }
  window.goCarousel = goCarousel;
  window.moveCarousel = moveCarousel;
})();

/* ── Slide Navigation ── */
(function(){
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  let current = 1;

  function goSlide(n) {
    if (n < 1 || n > total) return;
    slides.forEach(s => s.classList.remove('active'));
    current = n;
    const target = document.querySelector('[data-slide="' + n + '"]');
    if (target) target.classList.add('active');
    resize();
  }
  window.goSlide = goSlide;

  var currentScale = 1;

  function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleW = vw / 1920;
    const scaleH = vh / 1080;
    var scale = Math.min(scaleW, scaleH);
    currentScale = scale;
    var renderedW = 1920 * scale;
    var renderedH = 1080 * scale;
    var offsetX = (vw - renderedW) / 2;
    var offsetY = (vh - renderedH) / 2;
    slides.forEach(function(s) {
      s.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + scale + ')';
    });
  }

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', function() {
    setTimeout(resize, 100);
  });
  resize();

  /* ── Touch / Swipe Navigation ── */
  (function() {
    var touchStartX = 0;
    var touchStartY = 0;
    var SWIPE_MIN = 50;
    var interactiveSelector = 'input, textarea, select, button, [contenteditable], [contenteditable="true"], .option, .kc-opt, .tab-btn, .vo-controls, .vo-progress-wrap, .vo-vol-slider, .carousel-nav, .side-menu';

    document.addEventListener('touchstart', function(e) {
      if (e.target.closest && e.target.closest(interactiveSelector)) return;
      var touch = e.changedTouches[0];
      touchStartX = touch.screenX;
      touchStartY = touch.screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      if (window.welcomeDialogOpen) return;
      if (e.target.closest && e.target.closest(interactiveSelector)) return;
      var touch = e.changedTouches[0];
      var dx = touch.screenX - touchStartX;
      var dy = touch.screenY - touchStartY;
      // Only horizontal swipes — ignore if vertical movement exceeds horizontal
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) < SWIPE_MIN) return;
      if (dx < 0) { goSlide(current + 1); } // swipe left → next
      else { goSlide(current - 1); }         // swipe right → prev
    }, { passive: true });
  })();

  document.addEventListener('keydown', function(e) {
    if (window.welcomeDialogOpen) return;
    if (e.target.hasAttribute && e.target.hasAttribute('contenteditable')) return;
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    // Escape: close side menu or feedback overlays
    if (e.key === 'Escape') {
      if (document.body.classList.contains('nav-open')) {
        closeMenu();
        var menuBtn = document.querySelector('.slide.active .menu-btn');
        if (menuBtn) menuBtn.focus();
        e.preventDefault();
        return;
      }
      var openOverlay = document.querySelector('.slide.active .feedback-overlay.show');
      if (openOverlay) {
        openOverlay.classList.remove('show');
        e.preventDefault();
        return;
      }
    }

    // Arrow keys for slide navigation (only when not focused on interactive elements)
    var isInteractive = e.target.closest && e.target.closest('.option, .kc-opt, .tab-btn, .acc-header, .step, .sm-item');
    if (!isInteractive) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goSlide(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goSlide(current - 1); }
    }

    // Space: activate focused element or advance slide
    if (e.key === ' ' && !isInteractive) {
      e.preventDefault();
      goSlide(current + 1);
    }
  });

  /* ── Tab switching (with ARIA) ── */
  document.querySelectorAll('.tabbed').forEach(function(tabbed) {
    var btns = tabbed.querySelectorAll('.tab-btn');
    var panels = tabbed.querySelectorAll('.tab-panel');
    btns.forEach(function(btn, i) {
      btn.addEventListener('click', function() {
        btns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        if (panels[i]) panels[i].classList.add('active');
      });
      // Arrow key navigation within tablist
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          var next = btns[(i + 1) % btns.length];
          next.focus();
          next.click();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = btns[(i - 1 + btns.length) % btns.length];
          prev.focus();
          prev.click();
        }
      });
    });
  });

  /* ── Grid card expand/collapse ── */
  document.querySelectorAll('.g-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest && e.target.closest('.g-detail')) {
        card.classList.remove('expanded');
        return;
      }
      card.classList.toggle('expanded');
    });
  });

  /* ── Decision Path stepper ── */
  var stepDetailData = [
    { num: '01', title: 'Pause and Assess', text: 'Before you act, take a moment. Is there an accessibility need here? Don\'t assume — observe.' },
    { num: '02', title: 'Listen and Ask', text: 'Engage respectfully. Ask how you can help. Listen to what the person tells you, not what you think they need.' },
    { num: '03', title: 'Apply', text: 'Use the principles you\'re learning in this series. Think about the Accessibility in Practice model.' },
    { num: '04', title: 'Adapt', text: 'Adjust your communication, the environment, or the process. Accessibility often means flexibility, not perfection.' },
    { num: '05', title: 'Seek Support', text: 'If you\'re unsure, reach out. Talk to your manager, contact IDEAA, or connect with accessibility resources at UHN.' }
  ];

  document.querySelectorAll('.stepper-rail').forEach(function(rail) {
    var steps = rail.querySelectorAll('.step');
    var slide = rail.closest('.slide');
    if (!slide) return;
    var detail = slide.querySelector('.step-detail');
    if (!detail) return;

    steps.forEach(function(step, i) {
      step.addEventListener('click', function() {
        steps.forEach(function(s, j) {
          s.classList.remove('active', 'done');
          s.removeAttribute('aria-current');
          if (j < i) s.classList.add('done');
          if (j === i) { s.classList.add('active'); s.setAttribute('aria-current', 'step'); }
        });
        var d = stepDetailData[i];
        if (d) {
          var marker = detail.querySelector('.marker');
          var contentH3 = detail.querySelector('.content h3');
          var contentP = detail.querySelector('.content p');
          if (marker) marker.innerHTML = 'STEP<b>' + d.num + '</b>';
          if (contentH3) contentH3.textContent = d.title;
          if (contentP) contentP.textContent = d.text;
          announceToSR('Step ' + d.num + ': ' + d.title + '. ' + d.text);
        }
      });
    });
  });

  /* ── Branching scenario choices (with submit/lock) ── */
  if (!window.courseData) window.courseData = {};
  if (!window.courseData.submissions) window.courseData.submissions = {};

  document.querySelectorAll('.options[data-correct]').forEach(function(optionsContainer) {
    var correctAnswer = optionsContainer.getAttribute('data-correct');
    var overlayId = optionsContainer.getAttribute('data-overlay');
    var options = optionsContainer.querySelectorAll('.option');
    var submitBtn = optionsContainer.parentElement.querySelector('.submit-btn');
    var containerKey = overlayId || optionsContainer.getAttribute('data-correct') + '-' + Array.prototype.indexOf.call(document.querySelectorAll('.options[data-correct]'), optionsContainer);
    var selectedChoice = null;

    // Restore state if previously submitted
    if (window.courseData.submissions[containerKey]) {
      var saved = window.courseData.submissions[containerKey];
      options.forEach(function(o) {
        var ch = o.getAttribute('data-choice');
        if (ch === saved.selected) {
          if (ch === correctAnswer) { o.classList.add('correct'); }
          else { o.classList.add('incorrect'); }
        }
        if (ch === correctAnswer && saved.selected !== correctAnswer) { o.classList.add('correct'); }
      });
      optionsContainer.classList.add('locked');
      if (submitBtn) { submitBtn.classList.remove('ready'); submitBtn.classList.add('submitted'); submitBtn.textContent = '\u2713 SUBMITTED'; submitBtn.disabled = true; }
      if (overlayId) {
        var overlay = document.getElementById(overlayId);
        if (overlay) {
          var fbContent = overlay.querySelector('.fb-content');
          var savedOpt = optionsContainer.querySelector('[data-choice="' + saved.selected + '"]');
          if (fbContent && savedOpt) fbContent.innerHTML = savedOpt.getAttribute('data-fb') || '';
          overlay.classList.add('show');
        }
      }
      return;
    }

    options.forEach(function(opt) {
      opt.addEventListener('click', function() {
        if (optionsContainer.classList.contains('locked')) return;
        options.forEach(function(o) { o.classList.remove('sel'); o.setAttribute('aria-checked', 'false'); });
        opt.classList.add('sel');
        opt.setAttribute('aria-checked', 'true');
        selectedChoice = opt.getAttribute('data-choice');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.add('ready'); }
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        if (!selectedChoice || optionsContainer.classList.contains('locked')) return;

        // Grade
        options.forEach(function(o) { o.classList.remove('sel', 'correct', 'incorrect'); });
        var chosenOpt = optionsContainer.querySelector('[data-choice="' + selectedChoice + '"]');
        if (selectedChoice === correctAnswer) {
          chosenOpt.classList.add('correct');
        } else {
          chosenOpt.classList.add('incorrect');
          options.forEach(function(o) { if (o.getAttribute('data-choice') === correctAnswer) o.classList.add('correct'); });
        }

        // Lock
        optionsContainer.classList.add('locked');
        submitBtn.classList.remove('ready');
        submitBtn.classList.add('submitted');
        submitBtn.textContent = '\u2713 SUBMITTED';
        submitBtn.disabled = true;

        // Save state
        window.courseData.submissions[containerKey] = { selected: selectedChoice };

        // Show feedback overlay
        if (overlayId) {
          var overlay = document.getElementById(overlayId);
          if (overlay) {
            var fbContent = overlay.querySelector('.fb-content');
            var fbText = chosenOpt.getAttribute('data-fb') || '';
            if (fbContent) fbContent.innerHTML = fbText;
            overlay.classList.add('show');
          }
        }
      });
    }
  });

  /* ── Knowledge Check quiz interaction (with submit/lock) ── */
  document.querySelectorAll('.kc-options[data-qnum]').forEach(function(kcContainer) {
    var correctAnswer = kcContainer.getAttribute('data-correct');
    var qnum = kcContainer.getAttribute('data-qnum');
    var opts = kcContainer.querySelectorAll('.kc-opt');
    var quizQ = kcContainer.closest('.quiz-q') || kcContainer.closest('.kc-question');
    var submitBtn = kcContainer.parentElement.querySelector('.submit-btn');
    var containerKey = 'kc-' + qnum;
    var selectedAnswer = null;

    // Restore state if previously submitted
    if (window.courseData.submissions[containerKey]) {
      var saved = window.courseData.submissions[containerKey];
      opts.forEach(function(o) {
        var ans = o.getAttribute('data-answer');
        if (ans === saved.selected) {
          if (ans === correctAnswer) { o.classList.add('correct'); }
          else { o.classList.add('incorrect'); }
        }
        if (ans === correctAnswer && saved.selected !== correctAnswer) { o.classList.add('correct'); }
      });
      kcContainer.classList.add('locked');
      if (submitBtn) { submitBtn.classList.remove('ready'); submitBtn.classList.add('submitted'); submitBtn.textContent = '\u2713 SUBMITTED'; submitBtn.disabled = true; }

      // Show feedback panel
      var kcGrid = kcContainer.closest('.kc-grid');
      if (kcGrid) {
        var fbPanel = kcGrid.querySelector('.kc-feedback');
        if (fbPanel) {
          fbPanel.classList.remove('hidden');
          var head = fbPanel.querySelector('.head');
          if (saved.selected === correctAnswer) { if (head) head.style.background = 'var(--chartreuse)'; }
          else { if (head) head.style.background = 'var(--red)'; }
        }
      }
      if (quizQ) {
        if (saved.selected === correctAnswer) { var cfb = quizQ.querySelector('[data-fb-correct]'); if (cfb) cfb.classList.add('show', 'correct-fb'); }
        else { var fb = quizQ.querySelector('[data-fb-wrong]'); if (fb) fb.classList.add('show', 'incorrect-fb'); }
        var nextBtn = quizQ.querySelector('[data-quiz-next]');
        if (nextBtn) nextBtn.style.display = 'inline-block';
      }
      return;
    }

    opts.forEach(function(opt) {
      opt.addEventListener('click', function() {
        if (kcContainer.classList.contains('locked')) return;
        opts.forEach(function(o) { o.classList.remove('selected'); o.setAttribute('aria-checked', 'false'); });
        opt.classList.add('selected');
        opt.setAttribute('aria-checked', 'true');
        selectedAnswer = opt.getAttribute('data-answer');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.add('ready'); }
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        if (!selectedAnswer || kcContainer.classList.contains('locked')) return;

        // Grade
        opts.forEach(function(o) { o.classList.remove('selected', 'correct', 'incorrect'); });
        var chosenOpt = kcContainer.querySelector('[data-answer="' + selectedAnswer + '"]');
        if (selectedAnswer === correctAnswer) {
          chosenOpt.classList.add('correct');
          if (quizQ) { var cfb = quizQ.querySelector('[data-fb-correct]'); if (cfb) cfb.classList.add('show', 'correct-fb'); }
        } else {
          chosenOpt.classList.add('incorrect');
          opts.forEach(function(o) { if (o.getAttribute('data-answer') === correctAnswer) o.classList.add('correct'); });
          if (quizQ) { var fb = quizQ.querySelector('[data-fb-wrong]'); if (fb) fb.classList.add('show', 'incorrect-fb'); }
        }

        // Lock
        kcContainer.classList.add('locked');
        submitBtn.classList.remove('ready');
        submitBtn.classList.add('submitted');
        submitBtn.textContent = '\u2713 SUBMITTED';
        submitBtn.disabled = true;

        // Save state
        window.courseData.submissions[containerKey] = { selected: selectedAnswer };

        // Show next button if present
        if (quizQ) {
          var nextBtn = quizQ.querySelector('[data-quiz-next]');
          if (nextBtn) nextBtn.style.display = 'inline-block';
        }

        // Show feedback panel
        var kcGrid = kcContainer.closest('.kc-grid');
        if (kcGrid) {
          var fbPanel = kcGrid.querySelector('.kc-feedback');
          if (fbPanel) {
            fbPanel.classList.remove('hidden');
            var head = fbPanel.querySelector('.head');
            if (selectedAnswer === correctAnswer) { if (head) head.style.background = 'var(--chartreuse)'; }
            else { if (head) head.style.background = 'var(--red)'; }
          }
        }
      });
    }
  });

  /* ── Quiz navigation (KC1 multi-question) ── */
  document.querySelectorAll('[data-quiz-next]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetQ = btn.getAttribute('data-quiz-next');
      var container = btn.closest('[id]') || btn.closest('.kc-grid');
      if (container) {
        container.querySelectorAll('.quiz-q').forEach(function(q) { q.classList.remove('active'); });
        var target = container.querySelector('.quiz-q[data-q="' + targetQ + '"]');
        if (target) target.classList.add('active');
      }
    });
  });

  /* ── Objective cards expand ── */
  document.querySelectorAll('.obj-card').forEach(function(card) {
    card.addEventListener('click', function() {
      card.classList.toggle('expanded');
    });
  });

  /* ── MAP form input clear-on-focus ── */
  document.querySelectorAll('.map-field .input[contenteditable], [contenteditable="true"]').forEach(function(input) {
    var original = input.textContent;
    input.addEventListener('focus', function() {
      if (input.textContent === original) {
        input.textContent = '';
        input.style.color = 'var(--ink)';
        input.style.fontStyle = 'normal';
      }
    });
    input.addEventListener('blur', function() {
      if (input.textContent.trim() === '') {
        input.textContent = original;
        input.style.color = '#888';
        input.style.fontStyle = 'italic';
      }
    });
  });

  /* ── Start button on slide 1 ── */
  document.querySelectorAll('.start-bar .cta').forEach(function(btn) {
    btn.addEventListener('click', function() {
      goSlide(2);
    });
  });

  /* ── Side Menu Navigation ── */
  var menuSlides = [
    {n:1, name:'Welcome', screen:'1.1'},
    {n:2, name:'Learning Objectives', screen:'1.2'},
    {n:3, name:'Why This Matters: The Stat', screen:'1.3A'},
    {n:4, name:'Impact: Missed Care', screen:'1.3B'},
    {n:5, name:'Impact: Communication Gap', screen:'1.3C'},
    {n:6, name:'Impact: Avoidance', screen:'1.3D'},
    {n:7, name:'Models of Disability', screen:'1.4'},
    {n:8, name:'Accessibility in Practice Model', screen:'1.5'},
    {n:9, name:'Accessibility Decision Path', screen:'1.6'},
    {n:10, name:'Scenario 1: Hospital Booking', screen:'1.7'},
    {n:11, name:'Scenario 2: Clinic Signage', screen:'1.8'},
    {n:12, name:'Scenario 3: Employee Awareness', screen:'1.9'},
    {n:13, name:'Knowledge Check 1', screen:'1.10'},
    {n:14, name:'Knowledge Check 2', screen:'1.11'},
    {n:15, name:'Knowledge Check 3', screen:'1.12'},
    {n:16, name:'Inclusive Practice Tips', screen:'1.13'},
    {n:17, name:'Reflection Prompt', screen:'1.14'},
    {n:18, name:'MAP Action Planning', screen:'1.15'},
    {n:19, name:'Key Takeaways', screen:'1.16'},
    {n:20, name:'Listen & Reflect (Podcast)', screen:'1.17'},
    {n:21, name:'Decision Tree Activity', screen:'1.18'},
    {n:22, name:'Series Progress Map', screen:'1.19'},
    {n:23, name:'Resources & Completion', screen:'1.20'},
  ];

  function buildMenu(){
    var list = document.querySelector('.sm-list');
    if(!list) return;
    list.innerHTML = '';
    menuSlides.forEach(function(s){
      var btn = document.createElement('button');
      btn.className = 'sm-item' + (s.n === current ? ' active' : '');
      btn.setAttribute('data-menu-slide', s.n);
      btn.innerHTML = '<span class="sm-num">' + s.n + '</span><span class="sm-name">' + s.name + '</span><span class="sm-status">' + s.screen + '</span>';
      btn.onclick = function(){ goSlide(s.n); closeMenu(); };
      list.appendChild(btn);
    });
  }

  function openMenu(){
    document.body.classList.add('nav-open');
    buildMenu();
    // Focus the close button when menu opens
    setTimeout(function() {
      var closeBtn = document.querySelector('.sm-close');
      if (closeBtn) closeBtn.focus();
    }, 50);
  }
  function closeMenu(){ document.body.classList.remove('nav-open'); }
  window.openMenu = openMenu;
  window.closeMenu = closeMenu;

  /* ── Screen reader announcement helper ── */
  function announceToSR(message) {
    var el = document.getElementById('sr-announce');
    if (!el) return;
    el.textContent = '';
    setTimeout(function() { el.textContent = message; }, 100);
  }
  window.announceToSR = announceToSR;

  /* ── Get slide name from menuSlides array ── */
  function getSlideName(n) {
    for (var i = 0; i < menuSlides.length; i++) {
      if (menuSlides[i].n === n) return menuSlides[i].name;
    }
    return 'Slide ' + n;
  }

  // Update menu active state when slide changes
  var origGoSlide = window.goSlide;
  window.goSlide = function(n){
    origGoSlide(n);
    current = n;
    var items = document.querySelectorAll('.sm-item');
    items.forEach(function(el){
      var sn = parseInt(el.getAttribute('data-menu-slide'));
      el.classList.toggle('active', sn === n);
    });
    // Update progress bar
    var fill = document.querySelector('.sm-progress-fill');
    if(fill) fill.style.width = Math.round((n/total)*100) + '%';
    var txt = document.querySelector('.sm-progress-text');
    if(txt) txt.textContent = n + ' / ' + total;

    // Announce slide change to screen readers
    var name = getSlideName(n);
    announceToSR('Slide ' + n + ' of ' + total + ': ' + name);

    // Move focus to the active slide for focus trapping
    var activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
      activeSlide.setAttribute('tabindex', '-1');
      activeSlide.focus({ preventScroll: true });
    }
  };

  /* ── Focus trapping within active slide ── */
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    if (document.body.classList.contains('nav-open')) {
      // Trap focus within side menu
      var menu = document.querySelector('.side-menu');
      if (!menu) return;
      var focusable = menu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    // Trap focus within active slide + VO controls
    var activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;
    var slideFocusable = Array.prototype.slice.call(
      activeSlide.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"]), .option, .kc-opt, .tab-btn, .acc-header, .step, .myth-card, .g-card, .risk-card')
    );
    // Include VO controls
    var voControls = document.getElementById('voControls');
    if (voControls && !voControls.classList.contains('hidden')) {
      var voFocusable = voControls.querySelectorAll('button:not([disabled]), input');
      slideFocusable = slideFocusable.concat(Array.prototype.slice.call(voFocusable));
    }
    if (slideFocusable.length === 0) return;
    var first = slideFocusable[0];
    var last = slideFocusable[slideFocusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !slideFocusable.includes(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !slideFocusable.includes(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ── Enter/Space on interactive elements ── */
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target;
    if (!el) return;
    // Clickable elements that aren't native buttons
    if (el.classList.contains('option') || el.classList.contains('kc-opt') ||
        el.classList.contains('myth-card') || el.classList.contains('g-card') ||
        el.classList.contains('risk-card') || el.classList.contains('step') ||
        el.classList.contains('acc-header') || el.classList.contains('obj-card') ||
        el.classList.contains('spoke-card')) {
      e.preventDefault();
      el.click();
    }
  });

})();
