/* =========================================================
   Birthday Surprise - script.js
   Edit the CONFIG block below, then open index.html.
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 1. Personalize here ---------- */
  const CONFIG = {
    name: 'Esther',            // her name or nickname
    birthdayMonth: 11,             // 1 = January ... 12 = December
    birthdayDay: 10,
    togetherSince: '2026-09-01T00:00:00', // when you got together (local time)
    musicVolume: 30,               // 0 to 100
    youtubeId: 'uQdl3d9LomM',      // song: youtu.be/uQdl3d9LomM
    gameTarget: 10,                // points needed to win the voucher
    unlockAt: '2026-11-10T00:00:00' // page stays locked until this moment (her local time)
  };

  const COMPLIMENTS = [
    'Your smile is my favorite thing in the whole world. 😊',
    'You make even boring Mondays feel like a holiday. 🌸',
    'Your laugh is my favorite song. 🎶',
    'You are kind in ways most people never notice, but I always do. 💗',
    'You make me want to be a better person every single day. 🌷',
    'Home is not a place. It is wherever you are. 🏡',
    'You look beautiful in everything. 🧸',
    'Your hugs fix things I did not even know were broken. 🤗',
    'You are smarter than you give yourself credit for. 🧠',
    'I fall for you a little more every time you get excited about food. 🍰',
    'You are the first person I want to tell everything to. 📱',
    'Your heart is the softest, bravest thing I know. 💖',
    'Being loved by you is the best thing that ever happened to me. ✨',
    'You make ordinary moments feel like movie scenes. 🎬',
    'The way you care for the people you love is magical. 🪄',
    'You are my favorite hello and my hardest goodbye. 👋',
    'Your sleepy voice is unbelievably cute. 🌙',
    'You make the world softer just by being in it. ☁️',
    'I love how your eyes light up when you talk about things you love. 🌟',
    'You are proof that dreams come true. 💫',
    'Even your silly jokes are perfect to me. 💃',
    'You are my calm on chaotic days. 🌊',
    'I love you more than cats. And that is saying a lot. 🐱',
    'Every love song suddenly makes sense because of you. 🎵',
    'You are strong, gentle and absolutely wonderful. 🌹',
    'Your hand fits perfectly in mine. 🤝',
    'You make me laugh until my cheeks hurt. 😂',
    'You deserve every good thing this world has to offer. 🎁',
    'I would choose you in every lifetime. ♾️',
    'You are my favorite adventure. 🗺️'
  ];

  /* ---------- 2. Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n) => String(n).padStart(2, '0');
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PINKS = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFF0F5', '#E8B4B8', '#B76E79', '#FFFFFF'];

  document.documentElement.classList.add('js');

  /* ---------- 3. Confetti ---------- */
  const fire = (opts) => {
    if (typeof window.confetti !== 'function') return;
    window.confetti(Object.assign({ colors: PINKS, zIndex: 2000, disableForReducedMotion: true }, opts));
  };

  function celebrate() {
    fire({ particleCount: 140, angle: 60, spread: 75, startVelocity: 60, origin: { x: 0, y: 1 } });
    fire({ particleCount: 140, angle: 120, spread: 75, startVelocity: 60, origin: { x: 1, y: 1 } });

    const end = Date.now() + 1800;
    (function frame() {
      fire({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } });
      fire({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => fire({ particleCount: 120, spread: 100, startVelocity: 45, scalar: 1.2, origin: { y: 0.55 } }), 400);
  }

  function fireworks(duration = 3500) {
    const end = Date.now() + duration;
    const id = setInterval(() => {
      if (Date.now() > end) { clearInterval(id); return; }
      fire({
        particleCount: 60,
        spread: 360,
        startVelocity: 32,
        ticks: 70,
        gravity: 0.9,
        origin: { x: rand(0.1, 0.9), y: rand(0.15, 0.5) }
      });
    }, 280);
  }

  function burstAt(el, count = 40) {
    const r = el.getBoundingClientRect();
    fire({
      particleCount: count,
      spread: 80,
      startVelocity: 28,
      origin: {
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height / 2) / window.innerHeight
      }
    });
  }

  /* ---------- 4. Name ---------- */
  function applyName() {
    $$('.js-name').forEach((el) => { el.textContent = CONFIG.name; });
    document.title = `Happy Birthday, ${CONFIG.name} 💖`;
    $('#year').textContent = new Date().getFullYear();
  }

  /* ---------- 5. Typewriter greeting ---------- */
  function initTypewriter() {
    const target = $('#typedText');
    const emoji = $('#heroEmoji');
    const sub = $('#heroSub');
    const text = `Happy Birthday, ${CONFIG.name}!`;
    const chars = Array.from(text);

    $('#heroTitle').setAttribute('aria-label', `${text} 💖`);

    const finish = () => {
      emoji.classList.add('is-visible');
      sub.classList.add('is-visible');
    };

    if (reduceMotion) {
      target.textContent = text;
      finish();
      return;
    }

    let i = 0;
    const step = () => {
      i++;
      target.textContent = chars.slice(0, i).join('');
      if (i < chars.length) {
        setTimeout(step, chars[i - 1] === ' ' ? 140 : rand(60, 110));
      } else {
        setTimeout(finish, 250);
      }
    };
    setTimeout(step, 500);
  }

  /* ---------- 6. Countdown ---------- */
  function initCountdown() {
    const els = { d: $('#cdDays'), h: $('#cdHours'), m: $('#cdMinutes'), s: $('#cdSeconds') };
    const label = $('#countdownLabel');
    const tabs = $$('.tab');
    const since = new Date(CONFIG.togetherSince);
    const dateFmt = { month: 'long', day: 'numeric', year: 'numeric' };
    let mode = 'birthday';

    if (Number.isNaN(since.getTime())) {
      $('[data-mode="together"]').hidden = true;
    }

    const set = (el, val) => {
      const v = pad(val);
      if (el.textContent !== v) {
        el.textContent = v;
        restart(el, 'tick');
      }
    };

    const birthdayInfo = (now) => {
      const m = CONFIG.birthdayMonth - 1;
      const d = CONFIG.birthdayDay;

      if (now.getMonth() === m && now.getDate() === d) {
        const endOfDay = new Date(now.getFullYear(), m, d + 1);
        return { ms: endOfDay - now, text: "It's your birthday today! 🎂 Time left of your special day:" };
      }

      let target = new Date(now.getFullYear(), m, d);
      if (target <= now) target = new Date(now.getFullYear() + 1, m, d);
      return { ms: target - now, text: `Counting down to ${target.toLocaleDateString(undefined, dateFmt)} 🎀` };
    };

    const update = () => {
      const now = new Date();
      let ms;
      let text;

      if (mode === 'birthday') {
        ({ ms, text } = birthdayInfo(now));
      } else {
        ms = Math.max(0, now - since);
        text = `Together since ${since.toLocaleDateString(undefined, dateFmt)} and counting 💞`;
      }

      const t = Math.floor(ms / 1000);
      set(els.d, Math.floor(t / 86400));
      set(els.h, Math.floor((t % 86400) / 3600));
      set(els.m, Math.floor((t % 3600) / 60));
      set(els.s, t % 60);
      if (label.textContent !== text) label.textContent = text;
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        mode = tab.dataset.mode;
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', String(on));
        });
        update();
      });
    });

    update();
    setInterval(update, 1000);
  }

  /* ---------- 7. Celebrate button ---------- */
  function initCelebrate() {
    $('#celebrateBtn').addEventListener('click', celebrate);
  }

  /* ---------- 8. Music widget (YouTube) ---------- */
  function initMusic() {
    const btn = $('#musicBtn');
    const widget = $('#musicWidget');
    const bubble = $('#musicBubble');
    let player = null;
    let ready = false;
    let broken = false;
    let wantPlay = false;

    const setPlaying = (playing) => {
      widget.classList.toggle('is-playing', playing);
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    };

    const showBubble = (msg) => {
      bubble.textContent = msg;
      bubble.classList.remove('is-hidden');
    };

    const isPlaying = () => ready && player.getPlayerState() === window.YT.PlayerState.PLAYING;

    const play = () => {
      if (broken) return;
      wantPlay = true;
      if (ready) player.playVideo();
    };

    const pause = () => {
      wantPlay = false;
      if (ready) player.pauseVideo();
    };

    // Music only starts when the heart button is clicked. No autoplay.
    btn.addEventListener('click', () => {
      if (broken) {
        showBubble('Song unavailable 🎵');
        return;
      }
      if (isPlaying() || (!ready && wantPlay)) {
        pause();
        setPlaying(false);
      } else {
        play();
      }
    });

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('ytPlayer', {
        width: 200,
        height: 200,
        videoId: CONFIG.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: CONFIG.youtubeId,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            ready = true;
            player.setVolume(CONFIG.musicVolume);
            if (wantPlay) player.playVideo();
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            if (e.data === S.PLAYING) {
              setPlaying(true);
              bubble.classList.add('is-hidden');
            } else if (e.data === S.PAUSED || e.data === S.ENDED) {
              setPlaying(false);
            }
          },
          onError: () => {
            broken = true;
            setPlaying(false);
            showBubble('Song unavailable 🎵');
          }
        }
      });
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onerror = () => {
      broken = true;
      showBubble('Could not load the song 🎵');
    };
    document.head.appendChild(tag);
  }

  /* ---------- 9. Modal ---------- */
  const Modal = (() => {
    let current = null;
    let lastFocus = null;

    function show(modal) {
      lastFocus = document.activeElement;
      current = modal;
      modal.hidden = false;
      document.body.classList.add('no-scroll');
      requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
      const close = modal.querySelector('.modal-close');
      setTimeout(() => close && close.focus({ preventScroll: true }), 60);
    }

    function hide() {
      if (!current) return;
      const modal = current;
      current = null;
      modal.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => { modal.hidden = true; }, 400);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide();
      if (e.key === 'Tab' && current) {
        // keep keyboard focus inside the open modal
        const focusable = $$('button, [href], [tabindex]:not([tabindex="-1"])', current);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    $$('[data-close]').forEach((el) => el.addEventListener('click', hide));

    return { show, hide };
  })();

  /* ---------- 10. Birthday cake ---------- */
  function spawnSmoke(candle) {
    for (let i = 0; i < 6; i++) {
      const puff = document.createElement('span');
      puff.className = 'smoke';
      puff.style.setProperty('--dx', `${rand(-18, 18)}px`);
      puff.style.animationDelay = `${i * 90}ms`;
      candle.appendChild(puff);
      puff.addEventListener('animationend', () => puff.remove());
    }
  }

  function initCake() {
    const candles = $$('.candle');
    const status = $('#candleStatus');
    const relight = $('#relightBtn');
    const letter = $('#letterModal');

    const updateStatus = () => {
      const lit = candles.filter((c) => !c.classList.contains('is-out')).length;
      if (lit === 0) status.textContent = 'Yay! All candles are out. Your wish is on its way ✨';
      else if (lit === candles.length) status.textContent = `${lit} candles still glowing ✨ Make a wish!`;
      else status.textContent = `${lit} more to go... keep blowing 💨`;
      return lit;
    };

    candles.forEach((candle, i) => {
      candle.addEventListener('click', () => {
        if (candle.classList.contains('is-out')) return;

        candle.classList.add('is-out');
        candle.setAttribute('aria-label', `Candle ${i + 1} is out`);
        candle.setAttribute('aria-disabled', 'true');
        spawnSmoke(candle);

        if (updateStatus() === 0) {
          relight.hidden = false;
          setTimeout(() => { fireworks(); celebrate(); }, 500);
          setTimeout(() => Modal.show(letter), 1700);
        }
      });
    });

    relight.addEventListener('click', () => {
      candles.forEach((candle, i) => {
        candle.classList.remove('is-out');
        candle.setAttribute('aria-label', `Blow out candle ${i + 1}`);
        candle.removeAttribute('aria-disabled');
      });
      relight.hidden = true;
      updateStatus();
    });

    updateStatus();
  }

  /* ---------- 11. Heart Catcher game ---------- */
  function initGame() {
    const canvas = $('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const area = $('#gameArea');
    const overlay = $('#gameOverlay');
    const oEmoji = $('#overlayEmoji');
    const oTitle = $('#overlayTitle');
    const oText = $('#overlayText');
    const startBtn = $('#gameStartBtn');
    const scoreEl = $('#score');
    const livesEl = $('#lives');
    const fillEl = $('#scoreFill');
    const barEl = $('#scoreBar');
    const voucher = $('#voucher');

    const TARGET = CONFIG.gameTarget;
    const MAX_LIVES = 3;
    const GOOD = ['💖', '💗', '💕', '🍓', '🧁', '🌸', '🍬', '🍩', '🌷', '🍫', '🍰'];
    const BAD = '💔';
    const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

    let W = 1;
    let H = 1;
    let raf = 0;
    let last = 0;
    let running = false;
    let spawnIn = 0;
    let score = 0;
    let lives = MAX_LIVES;
    let items = [];
    let particles = [];
    const basket = { x: 0, y: 0, w: 100, h: 56, targetX: 0 };
    const keys = { left: false, right: false };
    const dots = Array.from({ length: 26 }, () => ({ x: Math.random(), y: Math.random(), r: rand(1.5, 4), s: rand(0.2, 0.6) }));

    const clampX = (x) => Math.min(W - basket.w / 2 - 6, Math.max(basket.w / 2 + 6, x));

    function resize() {
      const r = area.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      basket.w = Math.min(130, Math.max(76, W * 0.2));
      basket.h = basket.w * 0.56;
      basket.y = H - basket.h - 14;
      if (!basket.x) basket.x = basket.targetX = W / 2;
      basket.x = clampX(basket.x);
      basket.targetX = clampX(basket.targetX);

      if (!running) draw(0);
    }

    /* drawing helpers */
    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function heartPath(cx, cy, s) {
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.7);
      ctx.bezierCurveTo(cx - s * 1.2, cy - s * 0.1, cx - s * 0.6, cy - s * 1.1, cx, cy - s * 0.45);
      ctx.bezierCurveTo(cx + s * 0.6, cy - s * 1.1, cx + s * 1.2, cy - s * 0.1, cx, cy + s * 0.7);
      ctx.closePath();
    }

    function drawBackground(dt) {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#FFF7FA');
      g.addColorStop(1, '#FFD9E8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      dots.forEach((d) => {
        d.y += d.s * dt * 0.04;
        if (d.y > 1.05) d.y = -0.05;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(255, 182, 193, 0.45)';
      ctx.fillRect(0, H - 8, W, 8);
    }

    function drawBasket() {
      const { x, y, w, h } = basket;
      const top = w / 2;
      const bottom = top * 0.78;

      ctx.save();

      // handle
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#B76E79';
      ctx.beginPath();
      ctx.ellipse(x, y + 2, w * 0.36, h * 0.85, 0, Math.PI, 0);
      ctx.stroke();

      // body
      ctx.beginPath();
      ctx.moveTo(x - top, y);
      ctx.lineTo(x + top, y);
      ctx.lineTo(x + bottom, y + h);
      ctx.lineTo(x - bottom, y + h);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, '#FFB6C1');
      g.addColorStop(1, '#FF69B4');
      ctx.fillStyle = g;
      ctx.fill();

      // weave
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      for (let i = 1; i < 4; i++) {
        const yy = y + (h * i) / 4;
        ctx.beginPath();
        ctx.moveTo(x - top, yy);
        ctx.lineTo(x + top, yy);
        ctx.stroke();
      }
      for (let xx = x - top; xx < x + top; xx += 12) {
        ctx.beginPath();
        ctx.moveTo(xx, y);
        ctx.lineTo(xx + 8, y + h);
        ctx.stroke();
      }
      ctx.restore();

      // rose gold rim
      const rim = ctx.createLinearGradient(0, y - 6, 0, y + 6);
      rim.addColorStop(0, '#F7D6D0');
      rim.addColorStop(1, '#B76E79');
      ctx.fillStyle = rim;
      roundRect(x - top - 5, y - 6, w + 10, 12, 6);
      ctx.fill();

      // little heart
      ctx.fillStyle = '#FFFFFF';
      heartPath(x, y + h * 0.52, h * 0.22);
      ctx.fill();

      ctx.restore();
    }

    function draw(dt) {
      drawBackground(dt);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      items.forEach((it) => {
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        ctx.font = `${it.size}px ${EMOJI_FONT}`;
        ctx.fillText(it.char, 0, 0);
        ctx.restore();
      });

      drawBasket();

      particles.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        if (p.text) {
          ctx.font = `600 18px Fredoka, ${EMOJI_FONT}`;
          ctx.fillStyle = '#E0428E';
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
    }

    /* game logic */
    function spawn() {
      const bad = score > 0 && Math.random() < Math.min(0.32, 0.16 + score * 0.015);
      const size = rand(28, 38) * Math.min(1.2, Math.max(0.85, W / 500));
      const bx = rand(size, W - size);
      items.push({
        bx,
        x: bx,
        y: -size,
        t: 0,
        size,
        bad,
        char: bad ? BAD : pick(GOOD),
        vy: H * (0.28 + score * 0.022) + rand(0, H * 0.1),
        rot: rand(-0.4, 0.4),
        vr: rand(-1.5, 1.5),
        phase: rand(0, Math.PI * 2),
        sway: rand(10, 26)
      });
    }

    function updateHud(bump) {
      const l = Math.max(0, lives);
      scoreEl.textContent = score;
      livesEl.textContent = '❤️'.repeat(l) + '🤍'.repeat(MAX_LIVES - l);
      livesEl.setAttribute('aria-label', `${l} lives left`);
      fillEl.style.width = `${Math.min(100, (score / TARGET) * 100)}%`;
      barEl.setAttribute('aria-valuenow', String(Math.min(score, TARGET)));

      if (bump === 'score') restart(scoreEl.closest('.hud-pill'), 'bump');
      if (bump === 'lives') restart(livesEl.closest('.hud-pill'), 'bump');
    }

    function catchGood(it) {
      score++;
      updateHud('score');
      for (let k = 0; k < 8; k++) {
        particles.push({
          x: it.x,
          y: basket.y,
          vx: rand(-120, 120),
          vy: rand(-260, -120),
          g: 420,
          life: rand(0.5, 0.8),
          max: 0.8,
          color: pick(['#FF69B4', '#FFB6C1', '#FFFFFF', '#E8B4B8']),
          r: rand(2, 4)
        });
      }
      particles.push({ x: it.x, y: basket.y - 12, vx: 0, vy: -70, g: 0, life: 0.9, max: 0.9, text: '+1' });
      if (score >= TARGET) end(true);
    }

    function hitBad(it) {
      lives--;
      updateHud('lives');
      restart(area, 'shake');
      particles.push({ x: it.x, y: basket.y - 12, vx: 0, vy: -60, g: 0, life: 0.9, max: 0.9, text: 'Oops! 💔' });
      if (navigator.vibrate) navigator.vibrate(80);
      if (lives <= 0) end(false);
    }

    function update(dt) {
      if (keys.left) basket.targetX -= 560 * dt;
      if (keys.right) basket.targetX += 560 * dt;
      basket.targetX = clampX(basket.targetX);
      basket.x += (basket.targetX - basket.x) * Math.min(1, dt * 16);

      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawn();
        spawnIn = Math.max(0.42, 0.95 - score * 0.045) * rand(0.8, 1.2);
      }

      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.t += dt;
        it.y += it.vy * dt;
        it.rot += it.vr * dt;
        it.x = Math.min(W - it.size / 2, Math.max(it.size / 2, it.bx + Math.sin(it.phase + it.t * 2) * it.sway));

        const caught =
          it.y + it.size * 0.35 >= basket.y &&
          it.y <= basket.y + basket.h * 0.6 &&
          Math.abs(it.x - basket.x) < basket.w / 2 + it.size * 0.2;

        if (caught) {
          items.splice(i, 1);
          if (it.bad) hitBad(it); else catchGood(it);
          if (!running) return;
          continue;
        }

        if (it.y - it.size > H) items.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.g * dt;
      }
    }

    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      draw(dt);
      if (running) raf = requestAnimationFrame(loop);
    }

    function start() {
      score = 0;
      lives = MAX_LIVES;
      items = [];
      particles = [];
      spawnIn = 0.6;
      keys.left = keys.right = false;
      basket.x = basket.targetX = W / 2;
      updateHud();
      overlay.classList.add('is-hidden');
      running = true;
      last = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
      canvas.focus({ preventScroll: true });
    }

    function end(won) {
      running = false;
      cancelAnimationFrame(raf);

      oEmoji.textContent = won ? '🏆' : '🥺';
      oTitle.textContent = won ? 'You did it, my love!' : 'Aww, so close!';
      oText.textContent = won
        ? `You caught ${TARGET} sweet things and unlocked a secret surprise. Scroll down to claim it 💝`
        : 'Those broken hearts got you this time. Try again, I believe in you 💕';
      startBtn.textContent = 'Play Again 🔁';
      setTimeout(() => overlay.classList.remove('is-hidden'), won ? 600 : 400);

      if (won) unlockVoucher();
    }

    function unlockVoucher() {
      voucher.hidden = false;
      restart(voucher, 'is-revealed');
      celebrate();
      setTimeout(() => {
        voucher.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        setTimeout(() => burstAt(voucher, 80), 500);
      }, 900);
    }

    /* controls */
    const moveTo = (e) => {
      const r = canvas.getBoundingClientRect();
      basket.targetX = clampX(e.clientX - r.left);
    };

    canvas.addEventListener('pointermove', (e) => { if (running) moveTo(e); });
    canvas.addEventListener('pointerdown', (e) => {
      if (!running) return;
      moveTo(e);
      if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
    });

    const isLeft = (k) => k === 'ArrowLeft' || k === 'a' || k === 'A';
    const isRight = (k) => k === 'ArrowRight' || k === 'd' || k === 'D';

    window.addEventListener('keydown', (e) => {
      if (!running) return;
      if (isLeft(e.key)) { keys.left = true; e.preventDefault(); }
      if (isRight(e.key)) { keys.right = true; e.preventDefault(); }
    });

    window.addEventListener('keyup', (e) => {
      if (isLeft(e.key)) keys.left = false;
      if (isRight(e.key)) keys.right = false;
    });

    startBtn.addEventListener('click', start);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) last = performance.now();
    });

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(area);
    else window.addEventListener('resize', resize);

    resize();
    updateHud();
  }

  /* ---------- 13. Love note jar ---------- */
  function popHearts(el) {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('span');
      s.className = 'jar-pop';
      s.textContent = pick(['💖', '💗', '💕', '✨', '🍬', '🌸']);
      s.style.left = `${r.left + r.width / 2}px`;
      s.style.top = `${r.top + r.height * 0.25}px`;
      s.style.setProperty('--dx', `${rand(-90, 90)}px`);
      s.style.setProperty('--dy', `${rand(-140, -60)}px`);
      s.style.setProperty('--rot', `${rand(-60, 60)}deg`);
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }
  }

  function initJar() {
    const jar = $('#jarBtn');
    const card = $('#noteCard');
    const text = $('#noteText');
    const num = $('#noteNumber');
    const count = $('#openCount');
    let bag = [];
    let opened = 0;

    const next = () => {
      if (!bag.length) bag = shuffle(COMPLIMENTS.slice());
      return bag.pop();
    };

    jar.addEventListener('click', () => {
      opened++;
      text.textContent = next();
      num.textContent = opened;
      count.textContent = opened;
      restart(jar, 'is-shaking');
      restart(card, 'is-new');
      popHearts(jar);
      if (opened % 5 === 0) burstAt(jar, 50);
    });

    jar.addEventListener('animationend', (e) => {
      if (e.target === jar) jar.classList.remove('is-shaking');
    });
  }

  /* ---------- 14. Floating hearts background ---------- */
  function initBgHearts() {
    if (reduceMotion) return;
    const layer = $('#bgHearts');
    const chars = ['💗', '💖', '💕', '🌸', '✨', '💓', '🎀'];

    const make = (prewarm) => {
      if (layer.childElementCount > 28) return;
      const h = document.createElement('span');
      const dur = rand(12, 22);
      h.className = 'bg-heart';
      h.textContent = pick(chars);
      h.style.setProperty('--x', `${rand(0, 100)}%`);
      h.style.setProperty('--size', `${rand(14, 34)}px`);
      h.style.setProperty('--o', rand(0.25, 0.6).toFixed(2));
      h.style.setProperty('--dur', `${dur}s`);
      h.style.setProperty('--drift', `${rand(-60, 60)}px`);
      if (prewarm) h.style.animationDelay = `-${rand(0, dur * 0.8)}s`;
      layer.appendChild(h);
      h.addEventListener('animationend', () => h.remove());
    };

    for (let i = 0; i < 14; i++) make(true);
    setInterval(() => { if (!document.hidden) make(false); }, 1300);
  }

  /* ---------- 15. Heart cursor trail + tap sparkles ---------- */
  function initTrail() {
    if (reduceMotion) return;
    const chars = ['💖', '💗', '💕', '✨', '🌸'];
    let lastT = 0;

    const spawnAt = (x, y) => {
      const s = document.createElement('span');
      s.className = 'trail-heart';
      s.textContent = pick(chars);
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.setProperty('--size', `${rand(12, 20)}px`);
      s.style.setProperty('--dx', `${rand(-20, 20)}px`);
      s.style.setProperty('--rot', `${rand(-40, 40)}deg`);
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    };

    const insideGame = (target) => target instanceof Element && target.closest('#gameCanvas');

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const now = performance.now();
      if (now - lastT < 45 || insideGame(e.target)) return;
      lastT = now;
      spawnAt(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const now = performance.now();
      if (now - lastT < 90 || insideGame(e.target)) return;
      lastT = now;
      const t = e.touches[0];
      if (t) spawnAt(t.clientX, t.clientY);
    }, { passive: true });
  }

  function initClickSparkles() {
    if (reduceMotion) return;
    window.addEventListener('pointerdown', (e) => {
      if (e.target instanceof Element && e.target.closest('#gameCanvas')) return;
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('span');
        const angle = (Math.PI * 2 * i) / 8;
        const dist = rand(24, 46);
        s.className = 'click-sparkle';
        s.style.left = `${e.clientX}px`;
        s.style.top = `${e.clientY}px`;
        s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        document.body.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
      }
    }, { passive: true });
  }

  /* ---------- 16. Scroll reveal + active nav link ---------- */
  function initScrollFx() {
    const reveals = $$('.reveal');
    const links = $$('.nav a');

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => revealObserver.observe(el));

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean)
      .forEach((section) => navObserver.observe(section));
  }

  /* ---------- 17. Lock screen ---------- */
  function initLock(unlockDate) {
    const els = { d: $('#lkDays'), h: $('#lkHours'), m: $('#lkMinutes'), s: $('#lkSeconds') };
    const gift = $('.lock-gift');
    const tease = $('#lockTease');
    const TEASES = [
      'Patience, my love 💕',
      'Nice try, cutie 😝',
      'It is still wrapped 🎁',
      'Soon, I promise 🤞',
      'Go to sleep and dream of me 🌙',
      'The bow is too tight 🎀',
      'Still locked. Still love you 💖'
    ];

    $('#lockDate').textContent = unlockDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    document.title = `A surprise for ${CONFIG.name} 🎁`;

    const set = (el, val) => {
      const v = pad(val);
      if (el.textContent !== v) { el.textContent = v; restart(el, 'tick'); }
    };

    const update = () => {
      const ms = unlockDate - new Date();
      if (ms <= 0) { window.location.reload(); return; }
      const t = Math.floor(ms / 1000);
      set(els.d, Math.floor(t / 86400));
      set(els.h, Math.floor((t % 86400) / 3600));
      set(els.m, Math.floor((t % 3600) / 60));
      set(els.s, t % 60);
    };

    let bag = [];
    $('#lockKnock').addEventListener('click', () => {
      if (!bag.length) bag = shuffle(TEASES.slice());
      tease.textContent = bag.pop();
      restart(gift, 'is-shaking');
    });

    update();
    setInterval(update, 1000);
  }

  /* ---------- 18. Start everything ---------- */
  const unlockDate = new Date(CONFIG.unlockAt);
  if (new Date() < unlockDate) {
    document.documentElement.classList.add('is-locked');
    initLock(unlockDate);
    initBgHearts();
    initClickSparkles();
    return;
  }
  document.documentElement.classList.remove('is-locked');

  applyName();
  initTypewriter();
  initCountdown();
  initCelebrate();
  initMusic();
  initCake();
  initGame();
  initJar();
  initBgHearts();
  initTrail();
  initClickSparkles();
  initScrollFx();
})();
