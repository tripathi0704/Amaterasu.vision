// NEO-SHINOBI MAIN ORCHESTRATION PIPELINE
// Real-time MediaPipe Hand Tracking with Screen-Blended 3D Anime Rasengan & Chidori VFX and Official Audio

import './style.css';
import { shinobiAudio } from './audio.js';

class ShinobiApp {
  constructor() {
    this.vElement = document.getElementById('v_src');
    this.cElement = document.getElementById('out');
    this.ctx = this.cElement.getContext('2d');
    this.n = document.getElementById('n'); // Naruto Rasengan video
    this.s = document.getElementById('s'); // Sasuke Chidori video
    this.clashFlash = document.getElementById('clash-flash');
    this.clashAlert = document.getElementById('clash-alert');
    this.startOverlay = document.getElementById('start-overlay');
    this.fpsCounter = document.getElementById('fps-counter');

    // UI Buttons
    this.btnStart = document.getElementById('btn-start');
    this.btnAudio = document.getElementById('btn-audio');
    this.btnSkeleton = document.getElementById('btn-skeleton');
    this.btnMirror = document.getElementById('btn-mirror');

    // State
    this.pwr = [0, 0]; // [Left Hand (Rasengan), Right Hand (Chidori)]
    this.wasOpen = [false, false];
    this.isMirrored = true;
    this.showSkeleton = true;
    this.isClashing = false;

    // Performance Stats
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    this.initEventListeners();
  }

  initEventListeners() {
    this.btnStart.addEventListener('click', async () => {
      await shinobiAudio.init();
      this.startOverlay.classList.add('hidden');
      this.startTracking();
    });

    this.btnAudio.addEventListener('click', () => {
      shinobiAudio.init();
      const muted = shinobiAudio.toggleMute();
      const badge = document.getElementById('audio-badge');
      const label = document.getElementById('audio-label');
      const btnText = this.btnAudio.querySelector('.btn-text');

      if (muted) {
        badge.classList.add('muted');
        label.textContent = 'MUTED';
        btnText.textContent = 'SOUND OFF';
        this.btnAudio.classList.remove('active');
      } else {
        badge.classList.remove('muted');
        label.textContent = 'AUDIO LIVE';
        btnText.textContent = 'SOUND ON';
        this.btnAudio.classList.add('active');
      }
    });

    this.btnSkeleton.addEventListener('click', () => {
      this.showSkeleton = !this.showSkeleton;
      this.btnSkeleton.classList.toggle('active', this.showSkeleton);
    });

    this.btnMirror.addEventListener('click', () => {
      this.isMirrored = !this.isMirrored;
      this.vElement.classList.toggle('no-mirror', !this.isMirrored);
      this.cElement.classList.toggle('no-mirror', !this.isMirrored);
      this.btnMirror.classList.toggle('active', this.isMirrored);
    });
  }

  // Check if hand is open (tips further from wrist than PIPs)
  checkOpen(pts) {
    let count = 0;
    const wrist = pts[0];
    const tips = [8, 12, 16, 20];
    const pips = [6, 10, 14, 18];
    for (let i = 0; i < tips.length; i++) {
      const tip = pts[tips[i]];
      const pip = pts[pips[i]];
      if (Math.hypot(tip.x - wrist.x, tip.y - wrist.y) > Math.hypot(pip.x - wrist.x, pip.y - wrist.y)) {
        count++;
      }
    }
    return count >= 3;
  }

  startTracking() {
    if (!window.Hands || !window.Camera) {
      console.error('MediaPipe libraries not loaded from CDN.');
      return;
    }

    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65
    });

    hands.onResults((res) => this.onResults(res));

    const camera = new window.Camera(this.vElement, {
      onFrame: async () => {
        await hands.send({ image: this.vElement });
      },
      width: 1280,
      height: 720
    });

    camera.start();
  }

  onResults(res) {
    // Sync canvas resolution with live video stream
    this.cElement.width = this.vElement.videoWidth || window.innerWidth;
    this.cElement.height = this.vElement.videoHeight || window.innerHeight;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.cElement.width, this.cElement.height);

    let foundLeft = false;
    let foundRight = false;
    let leftPos = null;
    let rightPos = null;

    this.n.style.display = 'none';
    this.s.style.display = 'none';

    if (res.multiHandLandmarks && res.multiHandedness) {
      res.multiHandLandmarks.forEach((pts, i) => {
        const label = res.multiHandedness[i].label;
        // In mirrored mode, camera 'Right' corresponds to user's Right hand (Chidori), 'Left' to Left hand (Rasengan)
        const isRightHand = label === 'Right';
        const idx = isRightHand ? 1 : 0;

        // Draw Glowing Chakra Skeleton
        if (this.showSkeleton && window.drawConnectors && window.drawLandmarks) {
          this.ctx.save();
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#00fbff';
          window.drawConnectors(this.ctx, pts, window.HAND_CONNECTIONS, { color: '#00d4ff', lineWidth: 3 });
          window.drawLandmarks(this.ctx, pts, { color: '#ffffff', lineWidth: 1, radius: 2 });
          this.ctx.restore();
        }

        const open = this.checkOpen(pts);
        this.pwr[idx] += open ? 0.08 : -0.15;
        this.pwr[idx] = Math.max(0, Math.min(1, this.pwr[idx]));

        // Trigger Audio when opening hand
        if (open && !this.wasOpen[idx]) {
          const vid = isRightHand ? this.s : this.n;
          vid.currentTime = 0;
          vid.play().catch(() => {});

          if (isRightHand) {
            shinobiAudio.playChidori();
          } else {
            shinobiAudio.playRasengan();
          }
        }
        this.wasOpen[idx] = open;

        const wrist = pts[0];
        const knk = pts[9];

        // Dynamic hand size scaling
        const handDist = Math.hypot(knk.x - wrist.x, knk.y - wrist.y);
        const scaleFactor = Math.max(0.6, Math.min(1.6, handDist / 0.22));

        if (this.pwr[idx] > 0.01) {
          if (isRightHand) {
            foundRight = true;
            const tx = (wrist.x + knk.x) / 2;
            const ty = (wrist.y + knk.y) / 2;
            const screenX = this.isMirrored ? (1 - tx) * window.innerWidth : tx * window.innerWidth;
            const screenY = ty * window.innerHeight;

            this.s.style.width = `${Math.round(2300 * scaleFactor)}px`;
            this.s.style.left = `${screenX}px`;
            this.s.style.top = `${screenY}px`;
            this.s.style.display = 'block';
            this.s.style.opacity = this.pwr[idx];

            rightPos = { x: screenX, y: screenY };

            this.updateHandHUD('right', 'CHIDORI', this.pwr[idx]);
          } else {
            foundLeft = true;
            const dx = knk.x - wrist.x;
            const dy = knk.y - wrist.y;
            const tx = knk.x + (dx * 0.8);
            const ty = knk.y + (dy * 0.8);
            const screenX = this.isMirrored ? (1 - tx) * window.innerWidth : tx * window.innerWidth;
            const screenY = (ty * window.innerHeight) - (window.innerHeight * 0.12);

            this.n.style.width = `${Math.round(1550 * scaleFactor)}px`;
            this.n.style.left = `${screenX}px`;
            this.n.style.top = `${screenY}px`;
            this.n.style.display = 'block';
            this.n.style.opacity = this.pwr[idx];

            leftPos = { x: screenX, y: screenY };

            this.updateHandHUD('left', 'RASENGAN', this.pwr[idx]);
          }
        }
      });
    }

    // Decay and stop audio if left hand not present
    if (!foundLeft) {
      this.pwr[0] = Math.max(0, this.pwr[0] - 0.15);
      if (this.pwr[0] > 0.01) {
        this.n.style.display = 'block';
        this.n.style.opacity = this.pwr[0];
      } else {
        shinobiAudio.stopRasengan();
        this.resetHandHUD('left');
      }
      this.wasOpen[0] = false;
    }

    // Decay and stop audio if right hand not present
    if (!foundRight) {
      this.pwr[1] = Math.max(0, this.pwr[1] - 0.15);
      if (this.pwr[1] > 0.01) {
        this.s.style.display = 'block';
        this.s.style.opacity = this.pwr[1];
      } else {
        shinobiAudio.stopChidori();
        this.resetHandHUD('right');
      }
      this.wasOpen[1] = false;
    }

    // Jutsu Clash Check (Both hands active and close together)
    if (foundLeft && foundRight && leftPos && rightPos) {
      const dist = Math.hypot(leftPos.x - rightPos.x, leftPos.y - rightPos.y);
      if (dist < 320) {
        if (!this.isClashing) {
          this.isClashing = true;
          this.clashFlash.classList.add('active');
          setTimeout(() => this.clashFlash.classList.remove('active'), 120);
          shinobiAudio.triggerClash();
        }
        this.clashAlert.classList.add('visible');
      } else {
        this.stopClash();
      }
    } else {
      this.stopClash();
    }

    this.ctx.restore();

    // FPS calculation
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.fpsCounter.textContent = `${fps} FPS`;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  stopClash() {
    if (this.isClashing) {
      this.isClashing = false;
      this.clashAlert.classList.remove('visible');
    }
  }

  updateHandHUD(side, jutsuName, charge) {
    const card = document.getElementById(`card-${side}`);
    const status = document.getElementById(`status-${side}`);
    const name = document.getElementById(`name-${side}`);
    const bar = document.getElementById(`charge-${side}`);

    if (!card) return;

    card.className = `jutsu-card active-${side}`;
    status.className = 'status-pill active';
    status.textContent = 'ACTIVE';
    name.textContent = side === 'left' ? '🌀 RASENGAN' : '⚡ CHIDORI';
    bar.style.width = `${Math.round(charge * 100)}%`;
  }

  resetHandHUD(side) {
    const card = document.getElementById(`card-${side}`);
    const status = document.getElementById(`status-${side}`);
    const name = document.getElementById(`name-${side}`);
    const bar = document.getElementById(`charge-${side}`);

    if (!card) return;

    card.className = 'jutsu-card';
    status.className = 'status-pill idle';
    status.textContent = 'SCANNING...';
    name.textContent = 'STANDBY';
    bar.style.width = '0%';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ShinobiApp();
});
