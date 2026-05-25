/* ═══════════════════════════════════════════════════════════════
   Course Completion & Variable Tracking System
   - Persists progress in localStorage (key: guide01_progress)
   - Tracks visited slides, quiz score, MAP completion, time
   - Shows resume modal, progress indicator, completion overlay
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'guide01_progress';
  var allSlides = document.querySelectorAll('.slide[data-slide]');
  var totalSlides = allSlides.length;
  var MAP_SLIDE = 18; // data-slide for MAP Action Planning

  // ── 1. Global courseData object ──
  window.courseData = {
    currentSlide: 1,
    totalSlides: totalSlides,
    visitedSlides: [1],
    quizScore: 0,
    quizTotal: 4,
    quizPassed: false,
    mapCompleted: false,
    courseCompleted: false,
    completionDate: null,
    timeSpent: 0,
    bookmarkSlide: 1
  };

  // ── Helper: deep copy ──
  function cloneData() {
    return JSON.parse(JSON.stringify(window.courseData));
  }

  // ── 7. getCourseData for SCORM ──
  window.getCourseData = function() {
    return cloneData();
  };

  // ── 3. localStorage persistence ──
  var quizAnswers = {}; // keyed by qnum => true/false

  function saveProgress() {
    try {
      var data = JSON.parse(JSON.stringify(window.courseData));
      data.quizAnswers = quizAnswers;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) { /* quota exceeded — silently fail */ }
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) { return null; }
  }

  // ── 6. Time tracking ──
  var timerInterval = null;
  var timerRunning = false;

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(function() {
      window.courseData.timeSpent++;
    }, 1000);
  }

  function pauseTimer() {
    timerRunning = false;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) { pauseTimer(); saveProgress(); }
    else { startTimer(); }
  });

  // ── 4. Progress indicator (update existing side menu elements) ──
  function updateProgressIndicator() {
    var visited = window.courseData.visitedSlides.length;
    var total = window.courseData.totalSlides;
    var pct = Math.round((visited / total) * 100);

    // Update side menu progress bar
    var fill = document.querySelector('.sm-progress-fill');
    if (fill) {
      fill.style.width = pct + '%';
      if (pct >= 100) {
        fill.style.background = 'var(--red)';
      } else {
        fill.style.background = 'var(--chartreuse)';
      }
    }
    var txt = document.querySelector('.sm-progress-text');
    if (txt) {
      txt.textContent = visited + ' / ' + total + ' \u00B7 ' + pct + '%';
    }
  }

  // ── Quiz score tracking ──
  function recalcQuizScore() {
    var correct = 0;
    for (var k in quizAnswers) {
      if (quizAnswers[k]) correct++;
    }
    window.courseData.quizScore = correct;
    window.courseData.quizPassed = (correct >= 3); // 80% of 4 = 3.2, so 3/4 meets threshold
    saveProgress();
    checkCompletion();
  }

  // Hook into KC options click to detect quiz answers
  document.querySelectorAll('.kc-options[data-qnum]').forEach(function(kcContainer) {
    var correctAnswer = kcContainer.getAttribute('data-correct');
    var qnum = kcContainer.getAttribute('data-qnum');
    var opts = kcContainer.querySelectorAll('.kc-opt');

    opts.forEach(function(opt) {
      opt.addEventListener('click', function() {
        if (quizAnswers.hasOwnProperty(qnum)) return; // already answered
        var answer = opt.getAttribute('data-answer');
        if (!answer) return;
        quizAnswers[qnum] = (answer === correctAnswer);
        recalcQuizScore();
      });
    });
  });

  // Also hook branching scenario options for save triggers
  document.querySelectorAll('.options[data-correct]').forEach(function(optContainer) {
    var opts = optContainer.querySelectorAll('.option');
    var answered = false;
    opts.forEach(function(opt) {
      opt.addEventListener('click', function() {
        if (answered) return;
        var choice = opt.getAttribute('data-choice');
        if (!choice) return;
        answered = true;
        saveProgress();
      });
    });
  });

  // ── MAP completion tracking ──
  function checkMapCompletion() {
    var mapSlide = document.querySelector('[data-slide="' + MAP_SLIDE + '"]');
    if (!mapSlide) return false;
    var fields = mapSlide.querySelectorAll('.map-field .input[contenteditable]');
    var defaults = ['Type your response here...', 'Type your response here... (optional)', ''];
    for (var i = 0; i < fields.length; i++) {
      var val = fields[i].textContent.trim();
      if (val && defaults.indexOf(val) === -1) {
        return true;
      }
    }
    return false;
  }

  // Listen for input on MAP fields
  document.querySelectorAll('.map-field .input[contenteditable]').forEach(function(field) {
    field.addEventListener('input', function() {
      window.courseData.mapCompleted = checkMapCompletion();
      saveProgress();
      checkCompletion();
    });
    field.addEventListener('blur', function() {
      window.courseData.mapCompleted = checkMapCompletion();
      saveProgress();
      checkCompletion();
    });
  });

  // ── 2. Completion check ──
  function checkCompletion() {
    if (window.courseData.courseCompleted) return true;

    var allVisited = (window.courseData.visitedSlides.length >= window.courseData.totalSlides);
    var quizOk = window.courseData.quizPassed;
    var mapOk = window.courseData.mapCompleted;

    if (allVisited && quizOk && mapOk) {
      window.courseData.courseCompleted = true;
      window.courseData.completionDate = new Date().toISOString();
      saveProgress();
      return true;
    }
    return false;
  }

  // ── Format time ──
  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + 'm ' + s + 's';
  }

  // ── 5. Completion / Incomplete overlays ──
  // Create resume modal
  var resumeModal = document.createElement('div');
  resumeModal.className = 'tracking-resume-modal';
  resumeModal.innerHTML =
    '<div class="modal-card">' +
      '<h2>Welcome Back</h2>' +
      '<p>Resume where you left off?</p>' +
      '<div class="modal-btns">' +
        '<button class="btn-resume">RESUME</button>' +
        '<button class="btn-start-over">START OVER</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(resumeModal);

  // Create completion overlay — printable certificate with UHN branding
  var certLogoSrc = '';
  var logoEl = document.querySelector('.topbar .brand img.logo');
  if (logoEl) certLogoSrc = logoEl.src;
  var completionOverlay = document.createElement('div');
  completionOverlay.className = 'tracking-completion-overlay';
  completionOverlay.innerHTML =
    '<div class="cert-card" id="printCert">' +
      '<div class="cert-logo-row"><img class="cert-logo" src="' + certLogoSrc + '" alt="UHN — Canada\'s Hospital"></div>' +
      '<div class="cert-eyebrow">UNIVERSITY HEALTH NETWORK</div>' +
      '<div class="cert-rule"></div>' +
      '<h2>Certificate of <span class="accent">Completion</span></h2>' +
      '<p class="cert-presents">This certifies that</p>' +
      '<div class="cert-name-row"><input type="text" class="cert-learner-name" placeholder="Enter your full name" spellcheck="false"></div>' +
      '<p class="cert-presents">has successfully completed</p>' +
      '<h3 class="cert-course-title">Accessibility First Series — Guide 01</h3>' +
      '<p class="cert-course-sub">Foundations of Disability, Inclusion &amp; Accessible Design</p>' +
      '<div class="cert-badge">Accessibility<br>First:<br>Foundations</div>' +
      '<div class="cert-stats">' +
        '<div class="cert-stat"><span class="val cert-score">0/4</span><span class="lbl">Quiz Score</span></div>' +
        '<div class="cert-stat"><span class="val cert-time">0m 0s</span><span class="lbl">Time Spent</span></div>' +
        '<div class="cert-stat"><span class="val cert-slides">0/0</span><span class="lbl">Slides</span></div>' +
      '</div>' +
      '<div class="cert-date"></div>' +
      '<div class="cert-signatures">' +
        '<div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name">Jacqueline Silvera</div><div class="cert-sig-title">IDEAA, People &amp; Culture, UHN</div></div>' +
        '<div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name cert-sig-learner">Learner</div><div class="cert-sig-title">Date of Completion</div></div>' +
      '</div>' +
      '<div class="cert-footer-text">Accessibility First eLearning Series · University Health Network · Toronto, Ontario, Canada</div>' +
      '<div class="cert-actions no-print">' +
        '<button class="cert-print-btn">PRINT CERTIFICATE</button>' +
        '<button class="cert-close">CLOSE</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(completionOverlay);

  completionOverlay.querySelector('.cert-close').addEventListener('click', function() {
    completionOverlay.classList.remove('visible');
  });
  completionOverlay.querySelector('.cert-print-btn').addEventListener('click', function() {
    window.print();
  });
  // Sync learner name to signature line
  var nameInput = completionOverlay.querySelector('.cert-learner-name');
  var sigLearner = completionOverlay.querySelector('.cert-sig-learner');
  nameInput.addEventListener('input', function() {
    sigLearner.textContent = nameInput.value || 'Learner';
  });

  // Create incomplete checklist overlay
  var incompleteOverlay = document.createElement('div');
  incompleteOverlay.className = 'tracking-incomplete-overlay';
  incompleteOverlay.innerHTML =
    '<div class="checklist-card">' +
      '<h2>Almost There</h2>' +
      '<div class="sub">Complete the following to finish the course:</div>' +
      '<div class="checklist-items"></div>' +
      '<button class="checklist-close">GOT IT</button>' +
    '</div>';
  document.body.appendChild(incompleteOverlay);

  incompleteOverlay.querySelector('.checklist-close').addEventListener('click', function() {
    incompleteOverlay.classList.remove('visible');
  });

  function showCompletionOverlay() {
    var d = window.courseData;
    completionOverlay.querySelector('.cert-score').textContent = d.quizScore + '/' + d.quizTotal;
    completionOverlay.querySelector('.cert-time').textContent = formatTime(d.timeSpent);
    completionOverlay.querySelector('.cert-slides').textContent = d.visitedSlides.length + '/' + d.totalSlides;
    var dateStr = d.completionDate ? new Date(d.completionDate).toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' }) : '';
    completionOverlay.querySelector('.cert-date').textContent = 'Completed: ' + dateStr;
    completionOverlay.classList.add('visible');
  }

  function showIncompleteOverlay() {
    var d = window.courseData;
    var items = '';
    var remaining = d.totalSlides - d.visitedSlides.length;
    var slideDone = remaining <= 0;
    var quizDone = d.quizPassed;
    var mapDone = d.mapCompleted;

    items += '<div class="checklist-item">' +
      '<span class="check-icon ' + (slideDone ? 'done' : 'pending') + '">' + (slideDone ? '\u2713' : '') + '</span>' +
      '<span>' + (slideDone ? 'All slides visited' : 'Visit ' + remaining + ' more screen' + (remaining !== 1 ? 's' : '')) + '</span>' +
    '</div>';

    items += '<div class="checklist-item">' +
      '<span class="check-icon ' + (quizDone ? 'done' : 'pending') + '">' + (quizDone ? '\u2713' : '') + '</span>' +
      '<span>' + (quizDone ? 'Knowledge check passed' : 'Complete the knowledge check (score: ' + d.quizScore + '/' + d.quizTotal + ', need 3/' + d.quizTotal + ')') + '</span>' +
    '</div>';

    items += '<div class="checklist-item">' +
      '<span class="check-icon ' + (mapDone ? 'done' : 'pending') + '">' + (mapDone ? '\u2713' : '') + '</span>' +
      '<span>' + (mapDone ? 'MAP action plan started' : 'Fill in at least one MAP field') + '</span>' +
    '</div>';

    incompleteOverlay.querySelector('.checklist-items').innerHTML = items;
    incompleteOverlay.classList.add('visible');
  }

  // ── Hook SUBMIT & FINISH button and add Complete Course on last slide ──
  function hookCompletionButtons() {
    // Find the SUBMIT & FINISH button on ANY slide
    var allBtns = document.querySelectorAll('button');
    allBtns.forEach(function(btn) {
      if (btn.textContent.indexOf('SUBMIT') !== -1 && btn.textContent.indexOf('FINISH') !== -1) {
        btn.addEventListener('click', function() {
          handleCourseComplete();
        });
      }
    });

    // Add a Complete Course button on the last slide
    var lastSlideNum = 0;
    allSlides.forEach(function(s) {
      var n = parseInt(s.getAttribute('data-slide'));
      if (n > lastSlideNum) lastSlideNum = n;
    });
    var lastSlide = document.querySelector('[data-slide="' + lastSlideNum + '"]');
    if (lastSlide && !lastSlide.querySelector('.tracking-complete-btn')) {
      var completeBtn = document.createElement('button');
      completeBtn.className = 'tracking-complete-btn';
      completeBtn.style.cssText = 'position:absolute; bottom:100px; right:96px; background:#C0233B; color:#fff; font-family:Arial Black,Arial,sans-serif; font-size:20px; padding:18px 36px; border:0; letter-spacing:2px; cursor:pointer; display:inline-flex; align-items:center; gap:10px; z-index:9999; box-shadow:0 4px 16px rgba(0,0,0,0.3);';
      completeBtn.innerHTML = 'COMPLETE COURSE<span style="font-size:24px;">\u203A</span>';
      completeBtn.addEventListener('click', function() {
        handleCourseComplete();
      });
      lastSlide.appendChild(completeBtn);
    }
  }

  function handleCourseComplete() {
    // Re-check MAP status
    window.courseData.mapCompleted = checkMapCompletion();
    if (checkCompletion()) {
      showCompletionOverlay();
    } else {
      showIncompleteOverlay();
    }
  }

  // ── 8. Hook into existing goSlide ──
  var _trackingPrevGoSlide = window.goSlide;
  window.goSlide = function(n) {
    _trackingPrevGoSlide(n);

    // Update current slide
    window.courseData.currentSlide = n;

    // Add to visitedSlides if not already there
    if (window.courseData.visitedSlides.indexOf(n) === -1) {
      window.courseData.visitedSlides.push(n);
    }

    // Update bookmark
    window.courseData.bookmarkSlide = n;

    // Update progress indicator
    updateProgressIndicator();

    // Save to localStorage
    saveProgress();

    // Check completion
    checkCompletion();
  };

  // ── Initialization ──
  function init() {
    var saved = loadProgress();

    if (saved && saved.bookmarkSlide && saved.bookmarkSlide > 1) {
      // Restore state
      window.courseData.visitedSlides = saved.visitedSlides || [1];
      window.courseData.quizScore = saved.quizScore || 0;
      window.courseData.quizPassed = saved.quizPassed || false;
      window.courseData.mapCompleted = saved.mapCompleted || false;
      window.courseData.courseCompleted = saved.courseCompleted || false;
      window.courseData.completionDate = saved.completionDate || null;
      window.courseData.timeSpent = saved.timeSpent || 0;
      window.courseData.bookmarkSlide = saved.bookmarkSlide;
      window.courseData.currentSlide = saved.currentSlide || 1;
      window.courseData.totalSlides = totalSlides;

      // Restore quiz answers
      if (saved.quizAnswers) quizAnswers = saved.quizAnswers;

      // Show resume modal
      var slideNum = saved.bookmarkSlide;
      resumeModal.querySelector('p').textContent = 'Resume where you left off? Slide ' + slideNum;
      resumeModal.classList.add('visible');

      resumeModal.querySelector('.btn-resume').addEventListener('click', function() {
        resumeModal.classList.remove('visible');
        window.goSlide(slideNum);
      });

      resumeModal.querySelector('.btn-start-over').addEventListener('click', function() {
        resumeModal.classList.remove('visible');
        // Reset progress
        window.courseData.visitedSlides = [1];
        window.courseData.quizScore = 0;
        window.courseData.quizPassed = false;
        window.courseData.mapCompleted = false;
        window.courseData.courseCompleted = false;
        window.courseData.completionDate = null;
        window.courseData.timeSpent = 0;
        window.courseData.bookmarkSlide = 1;
        window.courseData.currentSlide = 1;
        quizAnswers = {};
        saveProgress();
        updateProgressIndicator();
        window.goSlide(1);
      });
    } else {
      // First visit — mark slide 1 as visited
      window.courseData.visitedSlides = [1];
      saveProgress();
    }

    // Start timer
    startTimer();

    // Update progress indicator
    updateProgressIndicator();

    // Hook completion buttons
    hookCompletionButtons();
  }

  // Run init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded, defer slightly so other scripts finish
    setTimeout(init, 100);
  }

})();
