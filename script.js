// ══════════════════════════════════
// DATA
// ══════════════════════════════════
const WELCOME_MESSAGES = [
    "Welcome back, ",
    "Good to see you, ",
    "Let's get it, ",
    "Ready to grind, ",
];
const DAYS = [
    {name:'Monday',   focus:'Chest & Triceps', rest:false,
     exercises:[
      {name:'Bench Press',         detail:'Barbell, flat bench', sets:'4×8'},
      {name:'Incline Dumbbell Press', detail:'30° incline',      sets:'3×10'},
      {name:'Cable Fly',           detail:'Mid-height cables',   sets:'3×12'},
      {name:'Tricep Pushdown',     detail:'Rope attachment',     sets:'3×12'},
      {name:'Skull Crushers',      detail:'EZ-bar',              sets:'3×10'},
      {name:'Diamond Push-ups',    detail:'Bodyweight, to failure', sets:'2×F'},
    ]},
    {name:'Tuesday',  focus:'Back & Biceps', rest:false,
     exercises:[
      {name:'Pull-ups',            detail:'Wide grip',           sets:'4×8'},
      {name:'Barbell Row',         detail:'Overhand grip',       sets:'4×8'},
      {name:'Lat Pulldown',        detail:'Close grip',          sets:'3×12'},
      {name:'Seated Row',          detail:'Neutral grip',        sets:'3×10'},
      {name:'Barbell Curl',        detail:'Standing',            sets:'3×10'},
      {name:'Hammer Curls',        detail:'Alternating',         sets:'3×12'},
    ]},
    {name:'Wednesday', focus:'Legs Day 🦵', rest:false,
     exercises:[
      {name:'Back Squat',          detail:'Bar on traps',        sets:'4×8'},
      {name:'Romanian Deadlift',   detail:'Slight knee bend',    sets:'4×10'},
      {name:'Leg Press',           detail:'Feet shoulder-width', sets:'3×12'},
      {name:'Walking Lunges',      detail:'Dumbbells',           sets:'3×10'},
      {name:'Leg Curl',            detail:'Machine',             sets:'3×12'},
      {name:'Standing Calf Raise', detail:'Slow tempo',          sets:'4×15'},
    ]},
    {name:'Thursday', focus:'Shoulders & Arms', rest:false,
     exercises:[
      {name:'Overhead Press',      detail:'Barbell, standing',   sets:'4×8'},
      {name:'Lateral Raises',      detail:'Dumbbells, slow',     sets:'4×15'},
      {name:'Front Raises',        detail:'Alternating',         sets:'3×12'},
      {name:'Face Pulls',          detail:'Rope, high cable',    sets:'3×15'},
      {name:'Concentration Curl',  detail:'Seated',              sets:'3×10'},
      {name:'Overhead Tricep Ext.', detail:'Dumbbell, both hands', sets:'3×10'},
    ]},
    {name:'Friday',   focus:'Full Body Power', rest:false,
     exercises:[
      {name:'Deadlift',            detail:'Conventional',        sets:'4×5'},
      {name:'Push Press',          detail:'Explosive',           sets:'3×6'},
      {name:'Goblet Squat',        detail:'Dumbbell',            sets:'3×10'},
      {name:'Dumbbell Row',        detail:'Single arm',          sets:'3×10'},
      {name:'Plyo Push-up',        detail:'Explosive',           sets:'3×8'},
      {name:'Farmer Carry',        detail:'Heavy dumbbells, 20m',sets:'3×1'},
    ]},
    {name:'Saturday', focus:'Core & Cardio', rest:false,
     exercises:[
      {name:'Plank Hold',          detail:'3 × 60 seconds',      sets:'3×60s'},
      {name:'Cable Crunch',        detail:'Kneeling',            sets:'3×15'},
      {name:'Russian Twist',       detail:'Weighted plate',      sets:'3×20'},
      {name:'Leg Raise',           detail:'Hanging',             sets:'3×12'},
      {name:'Jump Rope',           detail:'2 minutes HIIT',      sets:'5×2m'},
      {name:'Mountain Climbers',   detail:'Fast pace',           sets:'3×30s'},
    ]},
    {name:'Sunday',   focus:'Rest & Recovery', rest:true,
     exercises:[]},
  ];
  
  let currentDay = null;
  let completedExercises = new Set();
  //let streak = parseInt(localStorage.getItem('fitStreak')) || 0;      
  let streak = 40;
  
  // ══════════════════════════════════
  // PAGE TRANSITIONS
  // ══════════════════════════════════



  function goTo(pageId, skipAnim=false) {
    const current = document.querySelector('.page.active');
    const target  = document.getElementById(pageId);
    if (!target || target === current) return;
  
    if (skipAnim) {
      if(current) current.classList.remove('active');
      target.classList.add('active');
      return;
    }
  
    if(current) {
      current.classList.add('slide-out');
      setTimeout(()=>{
        current.classList.remove('active','slide-out');
      }, 350);
    }
    setTimeout(()=>{
      target.classList.add('active','slide-in');
      setTimeout(()=>target.classList.remove('slide-in'), 400);
    }, 150);
    if (pageId !== 'done') playWhoosh();
  }
  
  // ══════════════════════════════════
  // HOME
  // ══════════════════════════════════
  document.getElementById('startBtn').addEventListener('click', function(e) {
    // ripple
    const btn = this;
    const rect = btn.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.5;
    r.style.cssText = `width:${size}px;height:${size}px;top:${e.clientY-rect.top-size/2}px;left:${e.clientX-rect.left-size/2}px;`;
    btn.appendChild(r);
    btn.classList.add('pressed');
    setTimeout(()=>r.remove(), 600);
    setTimeout(()=>btn.classList.remove('pressed'), 200);
  
    // avatar bounce
    const av = document.querySelector('.avatar');
    av.classList.remove('bounce','excited');
    void av.offsetWidth;
    av.classList.add('bounce');
  
    // after bounce, go to day select
    setTimeout(()=>{
      av.classList.remove('bounce');
      av.classList.add('excited');
      setTimeout(()=>{
        av.classList.remove('excited');
        buildDaySelect();
        goTo('dayselect');
      }, 400);
    }, 600);
  });
  
  // ══════════════════════════════════
  // DAY SELECT
  // ══════════════════════════════════
  function buildDaySelect() {
    const todayIndex = new Date().getDay(); // 0=Sun…6=Sat
  
    const grid = document.getElementById('daysGrid');
    grid.innerHTML = '';
  
    DAYS.forEach((day, i) => {
      // day index in week: Mon=1,Tue=2…Sun=0
      const dayIndex = i === 6 ? 0 : i + 1;
      const isToday  = dayIndex === todayIndex;
  
      const card = document.createElement('div');
      card.className = 'day-card' + (isToday?' today':'') + (day.rest?' rest-day':'');
      card.innerHTML = `
        <div class="day-info">
          <div class="day-name">${day.name}</div>
          <div class="day-focus">${day.focus}</div>
        </div>
        <div class="day-arrow">${day.rest ? '😴' : '→'}</div>`;
  
      card.addEventListener('click', () => {
        currentDay = day;
        buildWorkout(day);
        goTo('workout');
      });
  
      grid.appendChild(card);
    });
  }
  
  // ══════════════════════════════════
  // WORKOUT
  // ══════════════════════════════════
  function buildWorkout(day) {
    completedExercises.clear();
    document.getElementById('wDayLabel').textContent = day.name.toUpperCase();
    document.getElementById('wTitle').textContent    = day.focus;
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressLabel').textContent = `0 / ${day.exercises.length} completed`;
    document.getElementById('finishBtn').disabled    = true;
    document.getElementById('finishBtn').classList.remove('ready');
  
    const list = document.getElementById('exercisesList');
    list.innerHTML = '';
  
    day.exercises.forEach((ex, i) => {
      const card = document.createElement('div');
      card.className = 'exercise-card';
      card.dataset.index = i;
      card.innerHTML = `
        <div class="ex-check">✓</div>
        <div class="ex-info">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-detail">${ex.detail}</div>
        </div>
        <div class="ex-sets">${ex.sets}</div>`;
  
      card.addEventListener('click', () => toggleExercise(card, i));
      list.appendChild(card);
    });
  }
  
  function toggleExercise(card, index) {
    if (completedExercises.has(index)) {
      completedExercises.delete(index);
      card.classList.remove('done');
      playUnding(); // ← geri alınınca
    } else {
      completedExercises.add(index);
      card.classList.add('done', 'completing');
      setTimeout(() => card.classList.remove('completing'), 400);
      playDing();   // ← tamamlanınca
    }
    updateProgress();
  }
  
  function updateProgress() {
    const total  = currentDay.exercises.length;
    const done   = completedExercises.size;
    const pct    = total > 0 ? (done/total)*100 : 0;
  
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = `${done} / ${total} completed`;
  
    const btn = document.getElementById('finishBtn');
    if(done === total && total > 0) {
      btn.disabled = false;
      btn.classList.add('ready');
    } else {
      btn.disabled = true;
      btn.classList.remove('ready');
    }
  }
  
  // ══════════════════════════════════
  // FINISH
  // ══════════════════════════════════
  const lastDate = localStorage.getItem('lastWorkoutDate');
const today = new Date().toDateString();
const yesterday = new Date(Date.now() - 86400000).toDateString();

if (lastDate && lastDate !== today && lastDate !== yesterday) {
  // Gün atlandıysa streak sıfırla
  streak = 0;
  localStorage.setItem('fitStreak', 0);
}

  function finishWorkout() {

    playSuccess();
    
    const todayStr = new Date().toDateString();
    const lastDate = localStorage.getItem('lastWorkoutDate');

    if (lastDate !== todayStr) {   // ← sadece yeni günse artır
        streak++;
        localStorage.setItem('fitStreak', streak);
        localStorage.setItem('lastWorkoutDate', todayStr);
    }
    updateStreakBadge();

    // toplam antrenman sayısını artır
const totalW = parseInt(localStorage.getItem('totalWorkouts') || '0') + 1;
localStorage.setItem('totalWorkouts', totalW);

// gün bazlı sayaç
const dayCounts = JSON.parse(localStorage.getItem('dayCounts') || '{}');
dayCounts[currentDay.name] = (dayCounts[currentDay.name] || 0) + 1;
localStorage.setItem('dayCounts', JSON.stringify(dayCounts));

// sabah kontrolü
if (new Date().getHours() < 7) {
  localStorage.setItem('earlyBird', 'true');
}

// rozet kontrolü
const newBadges = checkBadges();
newBadges.forEach((b, i) => {
  setTimeout(() => showNewBadge(b), 1000 + i * 1500);
});

    // update stats
    const total = currentDay.exercises.length;
    const sets  = currentDay.exercises.reduce((acc,ex)=>{
      const n = parseInt(ex.sets); return acc + (isNaN(n)?3:n);
    },0);
    document.getElementById('statExercises').textContent = total;
    document.getElementById('statSets').textContent      = sets;
    document.getElementById('statStreak').textContent    = streak;
    document.getElementById('doneSubText').textContent   =
      `${currentDay.focus} — every rep counted. Rest up and come back stronger.`;
  
    goTo('done');
  
    // start confetti + avatar after transition
    setTimeout(() => {
      document.getElementById('doneAvatar').classList.add('celebrating');
      startConfetti();
      burstEffect();
      setTimeout(() => burstEffect(), 1000);
      setTimeout(stopConfetti, 4000);
    }, 400);
    updateAvatarStyle();

    // tamamlanan günü kaydet
const done = JSON.parse(localStorage.getItem('completedDays') || '{}');
done[new Date().toDateString()] = true;
localStorage.setItem('completedDays', JSON.stringify(done));
buildCalendar(); // takvimi güncelle
  }
  function setRandomWelcome() {
    const msg = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    const el = document.getElementById('welcomeMsg');
    if (el) el.textContent = msg;
  }

  function goHome() {
    document.getElementById('doneAvatar').classList.remove('celebrating');
    setRandomWelcome();
    goTo('home');
  }
  
  // ══════════════════════════════════
  // CONFETTI
  // ══════════════════════════════════
  let confettiAF = null;
  const CONFETTI_COLORS = [
    '#fff','#4ade80','#facc15','#f472b6','#60a5fa','#a78bfa','#fb923c'
  ];
  
  function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth  || 390;
    canvas.height = canvas.offsetHeight || 780;
  
    const particles = Array.from({length:120}, ()=>({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * .3 - canvas.height * .3,
      vx: (Math.random()-.5)*4,
      vy: Math.random()*3 + 2,
      rot: Math.random()*360,
      vr: (Math.random()-.5)*8,
      w: Math.random()*8+4,
      h: Math.random()*4+2,
      color: CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],
      alpha: 1,
    }));
  
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.vr;
        p.vy += 0.05; // gravity
        if(p.y > canvas.height) { p.alpha -= 0.05; }
  
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      });
      confettiAF = requestAnimationFrame(draw);
    }
    draw();
  }
  
  function stopConfetti() {
    if(confettiAF) {
      cancelAnimationFrame(confettiAF);
      const canvas = document.getElementById('confettiCanvas');
      canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    }
  }
  
  // ══════════════════════════════════
  // INIT
  // ══════════════════════════════════

  function initAvatar() {
    const av = document.getElementById('homeAvatar');
    updateAvatarStyle();
  }
  
  function updateAvatarStyle() {
    const av = document.getElementById('homeAvatar');
    av.classList.remove('streak-gold', 'streak-purple');
    
    if (streak >= 30) {
      av.classList.add('streak-purple');
    } else if (streak >= 7) {
      av.classList.add('streak-gold');
    }
  }


















  function burstEffect() {
    // Enerji halkaları
    const ring = document.getElementById('energyRing');
    const wrap = document.querySelector('.done-avatar-wrap');
  
    // 3 halka art arda
    [0, 300, 600].forEach(delay => {
      setTimeout(() => {
        const r = ring.cloneNode();
        wrap.appendChild(r);
        void r.offsetWidth;
        r.classList.add('burst');
        setTimeout(() => r.remove(), 900);
      }, delay);
    });
  
    // Işık partikülleri
    const colors = ['#fff','#4ade80','#facc15','#f472b6','#60a5fa'];
    for (let i = 0; i < 12; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      const angle = (i / 12) * 360;
      const dist  = 80 + Math.random() * 60;
      const tx = Math.cos(angle * Math.PI/180) * dist;
      const ty = Math.sin(angle * Math.PI/180) * dist;
      spark.style.cssText = `
        left: 50%; top: 50%;
        background: ${colors[i % colors.length]};
        --tx: ${tx}px; --ty: ${ty}px;
        animation: sparkFly ${0.5 + Math.random() * 0.4}s ease-out ${Math.random() * 200}ms forwards;
      `;
      wrap.appendChild(spark);
      setTimeout(() => spark.remove(), 1000);
    }
  }











  const MOTIVATIONS = [
    "Let's get it! 💪",
    "No days off.",
    "You showed up. That's half the battle.",
    "Beast mode: ON",
    "One more rep.",
    "Consistency > intensity.",
    "Your future self says thank you.",
    "Pain is temporary. Glory is forever.",
    "Today's effort = tomorrow's strength.",
    "Don't stop when it hurts. Stop when done.",
  ];
  
  function initSpeechBubble() {
    const bubble = document.getElementById('speechBubble');
    let current  = -1;
  
    function showNext() {
      // farklı bir söz seç
      let next;
      do { next = Math.floor(Math.random() * MOTIVATIONS.length); }
      while (next === current);
      current = next;
  
      // önce gizle
      bubble.classList.remove('visible');
  
      setTimeout(() => {
        bubble.textContent = MOTIVATIONS[current];
        bubble.classList.add('visible');
  
        // 4sn göster, sonra gizle, 2sn bekle, tekrar
        setTimeout(() => {
          bubble.classList.remove('visible');
          setTimeout(showNext, 2000);
        }, 4000);
      }, 400);
    }
  
    // 2sn sonra başlat
    setTimeout(showNext, 2000);
  }

















  const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function buildCalendar() {
  const grid    = document.getElementById('weekCalendar');
  const todayIdx = new Date().getDay(); // 0=Sun
  grid.innerHTML = '';

  // localStorage'dan tamamlanan günleri oku
  const done = JSON.parse(localStorage.getItem('completedDays') || '{}');

  // Bu haftanın başlangıcı (Pazartesi)
  const now       = new Date();
  const monday    = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  for (let i = 0; i < 7; i++) {
    const d    = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key  = d.toDateString();
    const isToday  = d.getDay() === todayIdx && 
                     d.toDateString() === now.toDateString();
    const isDone   = !!done[key];

    const day  = document.createElement('div');
    day.className = 'cal-day';

    const dot  = document.createElement('div');
    dot.className = 'cal-dot' + 
                    (isDone  ? ' done'  : '') + 
                    (isToday ? ' today' : '');
    dot.textContent = isDone ? '✓' : '';

    const lbl  = document.createElement('div');
    lbl.className = 'cal-label' + (isToday ? ' today' : '');
    lbl.textContent = DAY_LABELS[(i + 1) % 7]; // Mo=0

    day.appendChild(dot);
    day.appendChild(lbl);
    grid.appendChild(day);
  }
}















// ══════════════════════════════════
// SES EFEKTLERİ
// ══════════════════════════════════
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

// Egzersiz tamamlanınca — kısa "ding"
function playDing() {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

// Egzersiz geri alınınca — aşağı ton
function playUnding() {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

// Antrenman tamamlanınca — başarı fanfarı
function playSuccess() {
  const ctx  = getAudio();
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const t = ctx.currentTime + i * 0.12;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.start(t);
    osc.stop(t + 0.4);
  });
}

// Sayfa geçişi — hafif "whoosh"
function playWhoosh() {
  const ctx  = getAudio();
  const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src  = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  src.buffer = buf;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
  
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  
  src.start();
  src.stop(ctx.currentTime + 0.2);
}






// ══════════════════════════════════
// ROZET SİSTEMİ
// ══════════════════════════════════
const BADGES = [
  { id:'first_blood', icon:'🔥', name:'First Blood',     req:'İlk antrenman',        check: (s,t) => t >= 1 },
  { id:'week',        icon:'⚡', name:'Week Warrior',    req:'7 günlük streak',       check: (s,t) => s >= 7 },
  { id:'biweek',      icon:'💪', name:'Two Weeks',       req:'14 günlük streak',      check: (s,t) => s >= 14 },
  { id:'month',       icon:'💀', name:'No Days Off',     req:'30 günlük streak',      check: (s,t) => s >= 30 },
  { id:'unstoppable', icon:'👑', name:'Unstoppable',     req:'60 günlük streak',      check: (s,t) => s >= 60 },
  { id:'ten',         icon:'🎯', name:'Ten Down',        req:'10 antrenman',          check: (s,t) => t >= 10 },
  { id:'fifty',       icon:'🏆', name:'Half Century',    req:'50 antrenman',          check: (s,t) => t >= 50 },
  { id:'century',     icon:'💯', name:'Century',         req:'100 antrenman',         check: (s,t) => t >= 100 },
  { id:'legday',      icon:'🦵', name:'Leg Day Hero',    req:'Çarşamba antrenmanı',   check: (s,t,d) => d['Wednesday'] >= 3 },
  { id:'chest',       icon:'🏋️', name:'Chest Master',   req:'Pazartesi 5 kez',       check: (s,t,d) => d['Monday'] >= 5 },
  { id:'earlybird',   icon:'🌅', name:'Early Bird',      req:'Sabah 7\'den önce',     check: (s,t,d,h) => h === true },
  { id:'fullbody',    icon:'⚙️', name:'Full Body',       req:'Cuma antrenmanı',       check: (s,t,d) => d['Friday'] >= 1 },
];

function getStats() {
  const total     = parseInt(localStorage.getItem('totalWorkouts') || '0');
  const dayCounts = JSON.parse(localStorage.getItem('dayCounts') || '{}');
  const earlyBird = localStorage.getItem('earlyBird') === 'true';
  return { total, dayCounts, earlyBird };
}

function checkBadges() {
  const { total, dayCounts, earlyBird } = getStats();
  const unlocked = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
  const newlyUnlocked = [];

  BADGES.forEach(badge => {
    if (!unlocked.includes(badge.id)) {
      if (badge.check(streak, total, dayCounts, earlyBird)) {
        unlocked.push(badge.id);
        newlyUnlocked.push(badge);
      }
    }
  });

  localStorage.setItem('unlockedBadges', JSON.stringify(unlocked));
  return newlyUnlocked;
}

function buildBadges() {
  const grid     = document.getElementById('badgesGrid');
  const unlocked = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
  grid.innerHTML = '';

  BADGES.forEach(badge => {
    const isUnlocked = unlocked.includes(badge.id);
    const card = document.createElement('div');
    card.className = 'badge-card' + (isUnlocked ? ' unlocked' : '');
    card.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-req">${badge.req}</div>
    `;
    grid.appendChild(card);
  });
}

function showNewBadge(badge) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed; bottom: 100px; left: 50%;
    transform: translateX(-50%);
    background: rgba(250,200,0,0.15);
    border: 1px solid rgba(250,200,0,0.4);
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 13px;
    color: #fff;
    z-index: 999;
    text-align: center;
    animation: badgeSlide .4s ease;
  `;
  notif.innerHTML = `${badge.icon} <strong>${badge.name}</strong> rozeti açıldı!`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}


// ══════════════════════════════════
// HATIRLATICI SİSTEMİ
// ══════════════════════════════════

// ══════════════════════════════════
// SERVICE WORKER + HATIRLATICI
// ══════════════════════════════════

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('SW registered');
    });

    // Service Worker'dan gelen mesajları dinle
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data.type === 'RESCHEDULE') {
        scheduleReminder();
      }
    });
  }
}

function getDayWorkout() {
  const todayIndex = new Date().getDay();
  const dayMap = [6, 0, 1, 2, 3, 4, 5];
  return DAYS[dayMap[todayIndex]];
}

function scheduleReminder() {
  if (!('serviceWorker' in navigator)) return;
  if (Notification.permission !== 'granted') return;

  const now    = new Date();
  const target = new Date();
  target.setHours(12, 0, 0, 0);
  if (now > target) target.setDate(target.getDate() + 1);

  const delay = target - now;
  const day   = getDayWorkout();

  const title = day.rest ? '🧘 Rest Day' : `💪 ${day.focus}`;
  const body  = day.rest
    ? 'Bugün dinlenme günün. İyi dinlen!'
    : `${day.name} — ${day.focus} zamanı! Hazır mısın?`;

  navigator.serviceWorker.ready.then(reg => {
    reg.active.postMessage({
      type: 'SCHEDULE_REMINDER',
      delay,
      title,
      body,
    });
  });
}

function requestNotifPermission() {
  if (!('Notification' in window)) {
    alert('Tarayıcın bildirim desteklemiyor.');
    return;
  }

  Notification.requestPermission().then(permission => {
    const btn = document.getElementById('notifBtn');
    if (permission === 'granted') {
      btn.textContent = '✓ Reminder set';
      btn.classList.add('active');
      localStorage.setItem('reminderOn', 'true');
      scheduleReminder();
    } else {
      btn.textContent = '✗ Blocked';
    }
  });
}

function initReminder() {
  const btn = document.getElementById('notifBtn');
  if (localStorage.getItem('reminderOn') === 'true' &&
      Notification.permission === 'granted') {
    btn.textContent = '✓ Reminder set';
    btn.classList.add('active');
    scheduleReminder();
  }
}



function updateStreakBadge() {
  const badge = document.getElementById('streakBadge');
  badge.classList.remove('level-1', 'level-2', 'level-3');

  if (streak >= 30)      badge.classList.add('level-3'); // kırmızı
  else if (streak >= 7)  badge.classList.add('level-1'); // altın
  else if (streak >= 14) badge.classList.add('level-2'); // mor

  // sayı zıplama
  badge.classList.remove('pop');
  void badge.offsetWidth;
  badge.classList.add('pop');
  setTimeout(() => badge.classList.remove('pop'), 400);

  document.getElementById('streakCount').textContent = streak;
}


  // INIT'e ekle:
  updateStreakBadge();
  buildDaySelect();
  setRandomWelcome();
  initAvatar();  // ← Three.js yerine bu
  initSpeechBubble(); // ← bunu ekle
  buildCalendar(); // ← bunu ekle
  checkBadges();
  // scheduleReminder();
