/* ── Voiceover + Closed Captions Engine — Guide 02 ── */
(function(){
  var audio = document.getElementById('voAudio');
  var playBtn = document.getElementById('voPlayBtn');
  var playIcon = document.getElementById('voPlayIcon');
  var pauseIcon = document.getElementById('voPauseIcon');
  var progressFill = document.getElementById('voProgressFill');
  var progressWrap = document.getElementById('voProgressWrap');
  var timeLabel = document.getElementById('voTime');
  var ccBtn = document.getElementById('voCCBtn');
  var ccBar = document.getElementById('ccBar');
  var ccEnabled = true; // CC on by default
  ccBtn.classList.add('active');

  // Slide → VO file mapping (slide data-slide number → filename)
  var voMap = {
    1:  'voiceover_2.1.mp3',
    2:  'voiceover_2.2.mp3',
    3:  'voiceover_2.3.mp3',
    4:  'voiceover_2.4.mp3',
    5:  'voiceover_2.5.mp3',
    6:  'voiceover_2.6.mp3',
    7:  'voiceover_2.7.mp3',
    8:  'voiceover_2.8.mp3',
    9:  'voiceover_2.9.mp3',
    10: 'voiceover_2.10.mp3',
    11: 'voiceover_2.11.mp3',
    12: 'voiceover_2.12.mp3',
    13: 'voiceover_2.13.mp3',
    14: 'voiceover_2.14.mp3',
    15: 'voiceover_2.15.mp3',
    16: 'voiceover_2.16.mp3',
    17: 'voiceover_2.17.mp3',
    18: 'voiceover_2.18.mp3',
    19: 'voiceover_2.19.mp3',
    20: 'voiceover_2.20.mp3',
    21: 'voiceover_2.21.mp3',
    22: 'voiceover_2.22.mp3',
    23: 'voiceover_2.23.mp3'
  };

  // Caption text per slide (broken into timed segments)
  // Source: Master Storyboard narration scripts, Guide 02
  var ccData = {
    1: [
      "Welcome back to the Accessibility First series. This is Guide 2: Perceptions, Attitudes, and Barriers.",
      "In Guide 1, you explored what disability means, the models that shape how we think about it, and a practical framework for everyday decisions.",
      "This guide goes deeper. It asks a more personal question: how do our own perceptions and attitudes shape the care and environments we create?",
      "We all carry assumptions. Some we are aware of. Many we are not.",
      "And in a healthcare setting, those assumptions — even well-intentioned ones — can create barriers as real as any locked door or missing ramp.",
      "Over the next 15 to 20 minutes, you will examine those assumptions, explore where they come from, and build practical strategies to move from compliance toward genuine inclusion.",
      "This guide is relevant for everyone at UHN. Let us get started."
    ],
    2: [
      "By the end of this guide, you will be able to do four things.",
      "First, you will be able to define attitudinal barriers and explain the difference between implicit and explicit bias — and why both matter in healthcare.",
      "Second, you will be able to recognize how assumptions about ability, culture, mental health, and identity show up in patient care and workplace interactions.",
      "Third, you will be able to apply reflective practice strategies to identify your own assumptions and adjust your behaviour.",
      "And fourth, you will be able to demonstrate responses that go beyond compliance — responses grounded in dignity, curiosity, and genuine inclusion.",
      "These four objectives build on Guide 1. Each one connects directly to a scenario you will encounter later in this guide."
    ],
    3: [
      "Here is a number worth sitting with. According to Statistics Canada, people with disabilities are nearly three times more likely than people without disabilities to report unmet healthcare needs.",
      "Not because services do not exist.",
      "But because the experience of seeking care — the assumptions made, the language used, the way people are treated — creates barriers that make people give up before they even get the help they need.",
      "The most persistent barriers in healthcare are not physical. They are attitudinal.",
      "And the good news is that attitudes can change. That is what this guide is about."
    ],
    4: [
      "Attitudinal barriers are among the most common — and the hardest to see — in any workplace.",
      "In healthcare, they can affect who receives equitable treatment, who gets taken seriously, and who feels safe enough to come back.",
      "An employee who speaks over a patient with a cognitive disability.",
      "A clinician who assumes a patient with a mental health history cannot make sound decisions.",
      "A colleague who speaks to a patient's support person instead of the patient directly.",
      "None of these require bad intent. They require awareness. And awareness is something we can build."
    ],
    5: [
      "Stigma is one of the most powerful attitudinal barriers we know of.",
      "The Mental Health Commission of Canada reports that fear of stigma causes many people to delay seeking help for mental health conditions for over a decade.",
      "At UHN, this affects both patients and employees.",
      "Patients may not disclose conditions that are relevant to their care. Employees may not ask for the accommodations they need.",
      "When we examine our own assumptions about mental health — our language, our reactions, our expectations — we begin to break down stigma from the inside out."
    ],
    6: [
      "Accessibility cannot be understood through a single lens.",
      "A First Nations elder navigating the healthcare system brings a different set of experiences than a young Black professional with an invisible disability, or a new immigrant with a cognitive disability who speaks neither English nor French.",
      "Intersectionality means that disability intersects with race, gender, language, income, and culture to shape a person's experience in ways that are unique to them.",
      "At UHN, this means our responses must be flexible, humble, and informed by the person in front of us — not a category or a checklist."
    ],
    7: [
      "Let us be clear about something: bias is not a character flaw. It is a feature of how the human brain processes information.",
      "We all carry biases — they are shaped by our upbringing, our experiences, media, and culture.",
      "The question is not whether you have bias. The question is whether you can recognize it and choose a different response.",
      "There are two types of bias worth knowing.",
      "Implicit bias is unconscious. You may not even be aware it is shaping your behaviour.",
      "A nurse who automatically slows their speech when talking to a patient using a mobility device — not because of hearing loss, but because of an automatic assumption about disability. That nurse likely means well. The harm is real regardless.",
      "Explicit bias is conscious. It is a deliberate belief or stereotype that the person knows they hold. This is rarer in formal healthcare settings, but it exists — and it creates direct discrimination.",
      "Both types matter. Both cause harm.",
      "The difference is that implicit bias is harder to see and easier to deny. That is why reflective practice — which we will explore in the next section — is so important."
    ],
    8: [
      "Attitudinal barriers are not monolithic — they come in different forms, and recognizing the specific form helps you respond more effectively.",
      "The first is paternalism: deciding for someone what is best for them without asking. It often comes from a desire to help but removes the person's autonomy.",
      "The second is stereotyping: applying a generalization about a group to an individual. Not every person who is Deaf communicates the same way.",
      "The third is the pity or charity model: seeing disability as tragedy rather than recognizing people as rights-holders with agency.",
      "The fourth is the spread effect: assuming that because someone has one disability, they must have others too.",
      "The fifth is othering: treating people as fundamentally different — as objects of curiosity or concern rather than as people.",
      "And the sixth is invisibilization: dismissing or doubting disclosures of non-visible disabilities. 'You don't look sick' is a form of attitudinal barrier.",
      "Each of these can be unlearned. And each one requires us to pause and ask."
    ],
    9: [
      "Reflective practice is a disciplined habit of pausing to examine your own assumptions and reactions.",
      "It sounds simple. It is not always easy — especially in a busy clinical environment.",
      "But it is one of the most powerful tools we have for improving accessibility and equity.",
      "Here is a four-step cycle you can use in any interaction.",
      "Step one: Notice. Catch yourself in the moment. Did you react differently to this patient than to the last?",
      "Step two: Name it. Not as an accusation against yourself, but as an observation. 'I assumed this patient could not make their own decision.' Naming it makes it visible.",
      "Step three: Examine. Where does this assumption come from? What impact could it have on this patient's care?",
      "And step four: Act. Choose a different response — one based on what the patient in front of you has actually said or expressed, not on what you expected.",
      "This cycle does not require perfection. It requires honesty and the willingness to grow."
    ],
    10: [
      "Let us put what you have learned into practice with a scenario.",
      "You are walking past the reception desk on your way to another task. Mr. Santos, a patient using a manual wheelchair, has been waiting for 10 minutes.",
      "There are no staff at the desk and no sign indicating when someone will return. His intake form is on his armrest — he has not started it yet.",
      "Think about what you know: autonomy, paternalism, the duty to ask before assuming.",
      "Choose from the three options on screen. Consider which response honours Mr. Santos's independence while also addressing the situation."
    ],
    11: [
      "Here is a second scenario — this one happens in the workplace, not at the bedside.",
      "You are a team leader. Two employees have applied for a lead role on a quality improvement project. Both have strong performance reviews.",
      "One of them, Priya, disclosed a mood disorder last year and took a medical leave. Her performance since returning has been consistently excellent.",
      "Think about the Ontario Human Rights Code and what you know about the duty to accommodate.",
      "Choose the response that best reflects equitable, dignity-centred leadership."
    ],
    12: [
      "Here is a third scenario — this one involves cultural communication in a clinical setting.",
      "You are a nurse conducting a pre-procedure assessment for Mrs. Nguyen.",
      "She is quiet, avoids direct eye contact, and gives short indirect answers. Her daughter Linh is present and responds more fully when you ask questions.",
      "Mrs. Nguyen does not appear confused — she follows the conversation and nods at appropriate moments.",
      "Think about what you know about communication styles and the principle of addressing the patient directly.",
      "Choose the response that creates the conditions for Mrs. Nguyen to be heard."
    ],
    13: [
      "Here is the fourth and final scenario — this one is about bias transfer during shift handoff.",
      "During handoff, the outgoing nurse David says: 'Room 4B — Mr. Thompson. He can be difficult. There's a mental health history. Just be aware.'",
      "You are Amir, the incoming nurse. You have not yet met Mr. Thompson.",
      "Think about what you know about diagnostic labels, attitudinal barriers, and the Notice-Name-Examine-Act cycle.",
      "Choose the response that gives Mr. Thompson a fresh start."
    ],
    14: [
      "Time for a knowledge check.",
      "You will see a question on screen with four answer options. Select the best answer.",
      "You have two attempts. This is not a test — it is a chance to reinforce what you have learned about types of bias.",
      "Read the question carefully and select your answer when you are ready."
    ],
    15: [
      "Here is a second knowledge check.",
      "This one is scenario-based. Read the situation carefully and choose the answer that identifies the specific attitudinal barrier at work.",
      "Think about the six barrier types from Screen 2.8.",
      "You have two attempts."
    ],
    16: [
      "One final knowledge check — this one involves legal and ethical reasoning.",
      "Read the scenario carefully. Think about what you know about the Ontario Human Rights Code and the duty to accommodate.",
      "Choose the answer that most accurately describes the manager's action.",
      "You have two attempts."
    ],
    17: [
      "Before we move to the reflection activity, here are five inclusive practice tips you can use starting today.",
      "The first is simple but powerful: ask, do not assume. Before you assist, before you adapt — ask the person in front of you what they need.",
      "The second is about language. Words like 'has a visual impairment' or 'uses a wheelchair' are more accurate and more respectful than 'suffers from' or 'wheelchair-bound.'",
      "The third tip is to always address the patient directly — not their family member, not their care worker.",
      "The fourth is about handoff language. 'Difficult patient' is a red flag phrase. It transfers bias rather than clinical information. When you hear it, ask a clarifying question.",
      "And fifth: carry the Notice-Name-Examine-Act cycle with you. You do not need a reflective journal. You just need a habit of pausing."
    ],
    18: [
      "Take a moment to slow down.",
      "We have covered a lot in this guide — bias, attitudinal barriers, intersectionality, reflective practice.",
      "Now it is time to make it personal.",
      "In the text field on screen, take two minutes to respond to this prompt: Think about a recent interaction at work. Was there a moment when you noticed yourself making an assumption? What did you do? What would you do differently now?",
      "This reflection is private. It will not be submitted, assessed, or reviewed. It is for you.",
      "Take the habit with you."
    ],
    19: [
      "You are almost done. Before we reach the final summary, it is time to make a personal commitment.",
      "This is your My Action Planning activity — the MAP.",
      "The MAP appears in every guide in this series, and it is always about translating what you have learned into one concrete behaviour change.",
      "In the fields on screen, complete three prompts.",
      "Stop: one thing you will stop doing — an assumption, a habit, a phrase.",
      "Start: one thing you will start doing — a question you will ask, a pause you will take.",
      "And Continue: one thing you are already doing well that you want to keep doing.",
      "Take two to three minutes. Be specific and honest. Your MAP is private."
    ],
    20: [
      "Let us recap what you have learned in this guide.",
      "First: attitudinal barriers are often invisible to those who hold them but are deeply felt by those who experience them. Awareness begins with a decision to look.",
      "Second: implicit bias is not a character flaw. It is how the brain works. The question is whether you can recognize it, name it, and choose differently.",
      "Third: intersectionality matters. A person's experience of disability is shaped by race, gender, language, age, and culture. There is no one-size-fits-all response.",
      "And fourth: inclusive practice is not about getting it right every time. It is about the commitment to try, to notice when you did not, and to do better next time.",
      "These are the habits that build an accessible culture — one interaction at a time."
    ],
    21: [
      "Before we close this guide, take some time to listen.",
      "On this screen you will find a deep dive conversation exploring how bias manifests in healthcare, what dignity-centred care actually looks like, and how staff can build reflective habits.",
      "Key moments to listen for: at the opening, you will hear the central question that guides the whole episode.",
      "Around the two-minute mark, the discussion turns to what research says about the difference between implicit and explicit bias.",
      "At six minutes, you will hear about the 'difficult patient' phenomenon — and what it really means.",
      "Captions and a full transcript are available. After listening, consider the reflection prompt on screen."
    ],
    22: [
      "You have completed Guide 2 — and with it, you have completed two of the four Foundation guides.",
      "On this screen, you can see the full 18-guide journey mapped across three stages.",
      "Stage 1 is Foundations — Guides 1 through 4. You have completed Guides 1 and 2.",
      "Complete Guides 3 and 4 to unlock Stage 2: Understanding Disability Experiences.",
      "You are on your way."
    ],
    23: [
      "Congratulations — you have completed Guide 2: Perceptions, Attitudes, and Barriers.",
      "You have explored how implicit and explicit bias work, examined six types of attitudinal barriers, practised four branching scenarios, and committed to a personal action plan.",
      "That is meaningful work.",
      "The habits you practise in this guide — noticing assumptions, naming them, examining their source, and choosing a different response — these are not one-time lessons. They are ongoing practices.",
      "Below you will find links to resources including the OHRC Human Rights Code, CAMH anti-stigma materials, and UHN's IDEAA office.",
      "You have also earned the Accessibility First: Perceptions and Attitudes badge.",
      "In Guide 3, we will shift to vision disabilities. Well done. See you in Guide 3."
    ]
  };

  var currentSlide = 1;

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Build word-weighted timing breakpoints per slide
  var ccTimingCache = {};
  function getCCTimings(slideNum) {
    if (ccTimingCache[slideNum]) return ccTimingCache[slideNum];
    var segs = ccData[slideNum];
    if (!segs || !audio.duration) return null;
    var wordCounts = segs.map(function(s){ return s.split(/\s+/).length; });
    var totalWords = wordCounts.reduce(function(a,b){ return a+b; }, 0);
    var breakpoints = [];
    var cumulative = 0;
    for (var i = 0; i < segs.length; i++) {
      breakpoints.push(cumulative);
      cumulative += (wordCounts[i] / totalWords) * audio.duration;
    }
    ccTimingCache[slideNum] = breakpoints;
    return breakpoints;
  }

  function updateProgress() {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    timeLabel.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);

    // Update CC text with word-weighted timing
    if (ccEnabled && ccData[currentSlide]) {
      var segs = ccData[currentSlide];
      var bp = getCCTimings(currentSlide);
      if (!bp) return;
      var idx = 0;
      for (var i = bp.length - 1; i >= 0; i--) {
        if (audio.currentTime >= bp[i]) { idx = i; break; }
      }
      ccBar.textContent = segs[idx];
      ccBar.classList.add('visible');
    }
  }

  function playSlideVO(slideNum) {
    currentSlide = slideNum;
    delete ccTimingCache[slideNum]; // recalc with new audio duration
    audio.pause();
    audio.currentTime = 0;
    progressFill.style.width = '0%';
    ccBar.classList.remove('visible');
    ccBar.textContent = '';

    var file = voMap[slideNum];
    if (!file) {
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
      timeLabel.textContent = '\u2014';
      return;
    }

    audio.src = 'media/vo/' + file;
    audio.load();
    audio.play().then(function(){
      playIcon.style.display = 'none';
      pauseIcon.style.display = '';
    }).catch(function(){
      // Autoplay blocked — user must click play
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
    });
  }

  // Play/Pause button
  playBtn.addEventListener('click', function(){
    if (!audio.src || !voMap[currentSlide]) return;
    if (audio.paused) {
      audio.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = '';
    } else {
      audio.pause();
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
    }
  });

  // Progress bar click to seek
  progressWrap.addEventListener('click', function(e){
    if (!audio.duration) return;
    var rect = progressWrap.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // CC toggle
  ccBtn.addEventListener('click', function(){
    ccEnabled = !ccEnabled;
    ccBtn.classList.toggle('active', ccEnabled);
    if (!ccEnabled) {
      ccBar.classList.remove('visible');
    }
  });

  // Audio events
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', function(){
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
    ccBar.classList.remove('visible');
  });

  // Volume control
  var volBtn = document.getElementById('voVolBtn');
  var volRange = document.getElementById('voVolRange');
  var volIcon = document.getElementById('voVolIcon');
  var muteIcon = document.getElementById('voMuteIcon');
  audio.volume = 0.8;
  var savedVol = 0.8;
  volRange.addEventListener('input', function(){
    audio.volume = this.value / 100;
    savedVol = audio.volume;
    volIcon.style.display = audio.volume === 0 ? 'none' : '';
    muteIcon.style.display = audio.volume === 0 ? '' : 'none';
  });
  volBtn.addEventListener('click', function(){
    if (audio.volume > 0) {
      savedVol = audio.volume;
      audio.volume = 0;
      volRange.value = 0;
      volIcon.style.display = 'none';
      muteIcon.style.display = '';
    } else {
      audio.volume = savedVol || 0.8;
      volRange.value = Math.round(audio.volume * 100);
      volIcon.style.display = '';
      muteIcon.style.display = 'none';
    }
  });

  // Show/hide controls bar
  var controls = document.getElementById('voControls');
  var hideBtn = document.getElementById('voHideBtn');
  var showBtn = document.getElementById('voShowBtn');
  hideBtn.addEventListener('click', function(){
    controls.classList.add('hidden');
    showBtn.classList.add('visible');
  });
  showBtn.addEventListener('click', function(){
    controls.classList.remove('hidden');
    showBtn.classList.remove('visible');
  });

  // Hook into goSlide
  var _prevGoSlide = window.goSlide;
  window.goSlide = function(n){
    var beforeSlide = document.querySelector('.slide.active');
    var beforeN = beforeSlide ? parseInt(beforeSlide.getAttribute('data-slide')) : 0;
    _prevGoSlide(n);
    // Only play VO if slide actually changed
    var afterSlide = document.querySelector('.slide.active');
    var afterN = afterSlide ? parseInt(afterSlide.getAttribute('data-slide')) : beforeN;
    if (afterN !== beforeN) playSlideVO(afterN);
  };

  // Play VO after welcome dialog is dismissed
  var voStarted = false;
  function startVOAfterWelcome() {
    if (voStarted) return;
    voStarted = true;
    var activeSlide = document.querySelector('.slide.active');
    var slideNum = activeSlide ? parseInt(activeSlide.getAttribute('data-slide')) : 1;
    setTimeout(function(){ playSlideVO(slideNum); }, 300);
  }
  var welcomeStart = document.getElementById('welcomeStartBtn');
  var welcomeResume = document.getElementById('welcomeResumeBtn2') || document.getElementById('welcomeResumeBtn');
  var welcomeStartOver = document.getElementById('welcomeStartOverBtn');
  if (welcomeStart) welcomeStart.addEventListener('click', startVOAfterWelcome);
  if (welcomeResume) welcomeResume.addEventListener('click', startVOAfterWelcome);
  if (welcomeStartOver) welcomeStartOver.addEventListener('click', startVOAfterWelcome);
  // Fallback if no welcome dialog
  if (!welcomeStart) setTimeout(function(){ playSlideVO(1); }, 500);
})();
