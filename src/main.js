// NEO-SHINOBI MAIN ORCHESTRATION PIPELINE
// Real-time MediaPipe Hand Tracking with Screen-Blended 3D Anime Rasengan & Chidori VFX,
// Kage Bunshin (Shadow Clone Jutsu) 3-Live Feeds Stage, Anime Smoke VFX, and Zero-Delay Audio.

import './style.css';
import { shinobiAudio } from './audio.js';

// High-Performance Anime Smoke & Shockwave VFX Particle Engine
class SmokeEffect {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.rings = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnPuff(centerX, centerY, count = 50, isDispel = false) {
    // 1. Expanding Chakra Shockwave Ring
    this.rings.push({
      x: centerX,
      y: centerY,
      radius: 12,
      maxRadius: isDispel ? 200 : 280,
      alpha: 0.95,
      color: isDispel ? 'rgba(160, 220, 255,' : 'rgba(0, 240, 255,'
    });

    // 2. Billowing Anime Smoke Clouds
    const shades = [
      '255, 255, 255',
      '235, 248, 255',
      '190, 235, 255',
      '140, 205, 250',
      '215, 225, 235'
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 7 + 2.5) * (isDispel ? 0.75 : 1.15);
      const size = Math.random() * 38 + 24;

      this.particles.push({
        x: centerX + (Math.random() * 44 - 22),
        y: centerY + (Math.random() * 44 - 22),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 2.2 + 0.6), // upward buoyant draft
        radius: size,
        maxRadius: size * (Math.random() * 1.6 + 1.8),
        alpha: Math.random() * 0.25 + 0.75,
        decay: Math.random() * 0.014 + 0.016,
        color: shades[Math.floor(Math.random() * shades.length)]
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render Shockwave Rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.radius += (r.maxRadius - r.radius) * 0.14 + 4;
      r.alpha -= 0.035;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.rings.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `${r.color} ${r.alpha})`;
      this.ctx.lineWidth = 6;
      this.ctx.shadowBlur = 18;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Render Smoke Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94; // air drag
      p.vy *= 0.94;
      p.radius += (p.maxRadius - p.radius) * 0.09;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.ctx.shadowBlur = 14;
      this.ctx.shadowColor = 'rgba(0, 240, 255, 0.45)';
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0 || this.rings.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

class ShinobiApp {
  constructor() {
    // Primary Video & Canvas
    this.vElement = document.getElementById('v_src');
    this.cElement = document.getElementById('out');
    this.ctx = this.cElement.getContext('2d');
    this.n = document.getElementById('n'); // Naruto Rasengan video
    this.s = document.getElementById('s'); // Sasuke Chidori video
    this.clashFlash = document.getElementById('clash-flash');
    this.clashAlert = document.getElementById('clash-alert');
    this.startOverlay = document.getElementById('start-overlay');
    this.fpsCounter = document.getElementById('fps-counter');

    // Kage Bunshin Seamless Clones Elements (Same Screen)
    this.cloneLayer = document.getElementById('clone-layer');
    this.entityCloneLeft = document.getElementById('entity-clone-left');
    this.entityCloneRight = document.getElementById('entity-clone-right');
    this.vCloneLeft = document.getElementById('v_clone_left');
    this.vCloneRight = document.getElementById('v_clone_right');

    // Smoke VFX Canvas
    this.smokeCanvas = document.getElementById('smoke-canvas');
    this.smokeEffect = new SmokeEffect(this.smokeCanvas);

    // Kage Bunshin HUD Elements
    this.kageBanner = document.getElementById('kage-banner');
    this.cardClone = document.getElementById('card-clone');
    this.sealStatus = document.getElementById('seal-status');

    // UI Buttons
    this.btnStart = document.getElementById('btn-start');
    this.btnAudio = document.getElementById('btn-audio');
    this.btnClone = document.getElementById('btn-clone');
    this.btnSkeleton = document.getElementById('btn-skeleton');
    this.btnMirror = document.getElementById('btn-mirror');

    // State
    this.pwr = [0, 0]; // [Left Hand (Rasengan), Right Hand (Chidori)]
    this.wasOpen = [false, false];
    this.isMirrored = true;
    this.showSkeleton = true;
    this.isClashing = false;
    this.isCloned = false; // Kage Bunshin active state
    this.clonesPiped = false; // Video stream assigned to clones flag

    // Gesture Debounce & Cooldown
    this.crossFrames = 0;
    this.lastSealToggle = 0;
    this.isCrossSignActive = false;

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

    // Manual Kage Bunshin Toggle via HUD button
    this.btnClone.addEventListener('click', () => {
      shinobiAudio.init();
      this.toggleKageBunshin();
    });

    this.btnSkeleton.addEventListener('click', () => {
      this.showSkeleton = !this.showSkeleton;
      this.btnSkeleton.classList.toggle('active', this.showSkeleton);
    });

    this.btnMirror.addEventListener('click', () => {
      this.setMirror(!this.isMirrored);
    });
  }

  setMirror(mirrored) {
    this.isMirrored = mirrored;
    this.vElement.classList.toggle('no-mirror', !this.isMirrored);
    this.cElement.classList.toggle('no-mirror', !this.isMirrored);
    if (this.vCloneLeft) this.vCloneLeft.classList.toggle('no-mirror', !this.isMirrored);
    if (this.vCloneRight) this.vCloneRight.classList.toggle('no-mirror', !this.isMirrored);
    this.btnMirror.classList.toggle('active', this.isMirrored);
  }

  // Connect live webcam stream to the clone video feeds
  pipeStreamToClones() {
    if (!this.vElement.srcObject) return;
    const stream = this.vElement.srcObject;

    if (this.vCloneLeft && this.vCloneLeft.srcObject !== stream) {
      this.vCloneLeft.srcObject = stream;
      this.vCloneLeft.play().catch(() => {});
    }
    if (this.vCloneRight && this.vCloneRight.srcObject !== stream) {
      this.vCloneRight.srcObject = stream;
      this.vCloneRight.play().catch(() => {});
    }
    this.clonesPiped = true;
  }

  // Trigger Anime Smoke Puffs centered at the Left & Right clone positions
  triggerSmokeAtClones(isDispel = false) {
    if (!this.smokeEffect) return;

    const leftRect = this.entityCloneLeft ? this.entityCloneLeft.getBoundingClientRect() : null;
    const rightRect = this.entityCloneRight ? this.entityCloneRight.getBoundingClientRect() : null;

    const leftX = leftRect ? (leftRect.left + leftRect.width / 2) : (window.innerWidth * 0.2);
    const leftY = leftRect ? (leftRect.top + leftRect.height * 0.6) : (window.innerHeight * 0.55);

    const rightX = rightRect ? (rightRect.left + rightRect.width / 2) : (window.innerWidth * 0.8);
    const rightY = rightRect ? (rightRect.top + rightRect.height * 0.6) : (window.innerHeight * 0.55);

    const count = isDispel ? 35 : 55;
    this.smokeEffect.spawnPuff(leftX, leftY, count, isDispel);
    this.smokeEffect.spawnPuff(rightX, rightY, count, isDispel);
  }

  // Toggle Kage Bunshin (Shadow Clone Jutsu)
  toggleKageBunshin(forceState) {
    const nextState = (forceState !== undefined) ? forceState : !this.isCloned;
    if (nextState === this.isCloned) return;

    this.isCloned = nextState;
    const btnText = this.btnClone.querySelector('.btn-text');

    if (this.isCloned) {
      // 1. Ensure stream is assigned
      this.pipeStreamToClones();

      // 2. Reveal Clones on the same screen
      this.cloneLayer.classList.remove('hidden');

      // 3. Entrance burst animations on left and right clones
      this.entityCloneLeft.classList.remove('anim-burst');
      this.entityCloneRight.classList.remove('anim-burst');
      void this.entityCloneLeft.offsetWidth; // Force CSS reflow
      void this.entityCloneRight.offsetWidth;
      this.entityCloneLeft.classList.add('anim-burst');
      this.entityCloneRight.classList.add('anim-burst');

      // 4. Chakra Screen Flash
      this.clashFlash.classList.add('kage-burst');
      setTimeout(() => this.clashFlash.classList.remove('kage-burst'), 180);

      // 5. Dynamic Screen Shake
      document.body.classList.add('jutsu-shaking');
      setTimeout(() => document.body.classList.remove('jutsu-shaking'), 380);

      // 6. Spawn billowing anime smoke explosions
      this.triggerSmokeAtClones(false);

      // 7. Play authentic Kage Bunshin smoke poof + chakra sound
      shinobiAudio.playShadowClone();

      // 8. Update HUD Banner & Controls
      this.kageBanner.classList.add('visible');
      this.cardClone.classList.add('active');
      this.sealStatus.textContent = 'ACTIVE // MAKE SEAL TO DISPEL';
      this.btnClone.classList.add('active');
      btnText.textContent = 'DISPEL CLONES';
    } else {
      // Dispel Kage Bunshin
      this.triggerSmokeAtClones(true);
      shinobiAudio.playDispel();

      this.cloneLayer.classList.add('hidden');
      this.kageBanner.classList.remove('visible');
      this.cardClone.classList.remove('active');
      this.sealStatus.textContent = 'CROSS FINGERS ➔ 👥 2 CLONES';
      this.btnClone.classList.remove('active');
      btnText.textContent = 'KAGE BUNSHIN';
    }
  }

  // Analyze single hand geometry for Vertical or Horizontal extended index
  getHandPose(h) {
    const wrist = h[0];
    const idxMcp = h[5];
    const idxPip = h[6];
    const idxDip = h[7];
    const idxTip = h[8];

    const ringTip = h[16];
    const pinkyTip = h[20];

    const idxDx = idxTip.x - idxMcp.x;
    const idxDy = idxTip.y - idxMcp.y;
    const idxLen = Math.hypot(idxDx, idxDy);

    if (idxLen < 0.04) {
      return { isExtended: false };
    }

    const dirX = idxDx / idxLen;
    const dirY = idxDy / idxLen;

    const distWristTip = Math.hypot(idxTip.x - wrist.x, idxTip.y - wrist.y);
    const distWristPip = Math.hypot(idxPip.x - wrist.x, idxPip.y - wrist.y);
    const isExtended = distWristTip > distWristPip * 1.05;

    // Curled fingers check (ring and pinky should be curled into fist)
    const ringDist = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);
    const pinkyDist = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);
    const otherFingersCurled = (ringDist < distWristTip * 0.94) && (pinkyDist < distWristTip * 0.94);

    // Vertical: Pointing upwards (in camera coords, y=0 is top, so negative dy)
    // -dirY > 0.65 corresponds to angle within ~49 degrees of straight up
    const isVertical = isExtended && (-dirY > 0.65) && (Math.abs(dirX) < 0.76);

    // Horizontal: Pointing left or right
    // |dirX| > 0.65 corresponds to angle within ~49 degrees of horizontal
    const isHorizontal = isExtended && (Math.abs(dirX) > 0.65) && (Math.abs(dirY) < 0.76);

    return {
      isExtended,
      otherFingersCurled,
      isVertical,
      isHorizontal,
      dirX,
      dirY,
      idxTip,
      idxPip,
      idxDip,
      idxMcp,
      wrist
    };
  }

  // Check if hand pair forms the perpendicular "+" cross seal
  checkCrossPair(vPose, hPose) {
    if (!vPose.isVertical || !hPose.isHorizontal) return false;

    // 1. Orthogonality: Direction vectors should be perpendicular
    const dot = Math.abs(vPose.dirX * hPose.dirX + vPose.dirY * hPose.dirY);
    if (dot > 0.68) return false;

    // 2. Proximity: Fingers must cross or touch
    const vPoints = [vPose.idxMcp, vPose.idxPip, vPose.idxDip, vPose.idxTip];
    const hPoints = [hPose.idxMcp, hPose.idxPip, hPose.idxDip, hPose.idxTip];

    let minPairDist = Infinity;
    for (const vp of vPoints) {
      for (const hp of hPoints) {
        const d = Math.hypot(vp.x - hp.x, vp.y - hp.y);
        if (d < minPairDist) minPairDist = d;
      }
    }

    // Touching or intersecting within normalized bounding distance
    if (minPairDist > 0.15) return false;

    // 3. Horizontal finger points towards the vertical hand
    const wristToVDist = Math.hypot(hPose.wrist.x - vPose.idxTip.x, hPose.wrist.y - vPose.idxTip.y);
    const tipToVDist = Math.hypot(hPose.idxTip.x - vPose.idxTip.x, hPose.idxTip.y - vPose.idxTip.y);
    if (tipToVDist > wristToVDist * 1.15) return false;

    return true;
  }

  // Cross Seal Detector: Checks both hand combinations symmetrically
  // Photo 1: Right hand vertical, Left hand horizontal
  // Photo 2: Left hand vertical, Right hand horizontal
  detectCrossSeal(handA, handB) {
    const poseA = this.getHandPose(handA);
    const poseB = this.getHandPose(handB);

    return this.checkCrossPair(poseA, poseB) || this.checkCrossPair(poseB, poseA);
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
        if (!this.clonesPiped && this.vElement.srcObject) {
          this.pipeStreamToClones();
        }
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

    // 1. Check for Kage Bunshin Cross Hand Seal (+) when 2 hands are present
    const hasTwoHands = res.multiHandLandmarks && res.multiHandLandmarks.length >= 2;
    let isCrossDetected = false;

    if (hasTwoHands) {
      isCrossDetected = this.detectCrossSeal(res.multiHandLandmarks[0], res.multiHandLandmarks[1]);
    }

    const now = performance.now();

    if (isCrossDetected) {
      this.crossFrames++;
      this.isCrossSignActive = true;

      if (!this.isCloned) {
        this.cardClone.classList.add('active');
        this.sealStatus.textContent = 'SEAL LOCKED! REPLICATING...';
      }

      // Debounce: Trigger after 3 consecutive stable frames (~50-80ms) with 1.2s cooldown
      if (this.crossFrames >= 3 && (now - this.lastSealToggle > 1200)) {
        this.lastSealToggle = now;
        this.toggleKageBunshin();
      }
    } else {
      this.crossFrames = 0;
      this.isCrossSignActive = false;

      if (!this.isCloned) {
        this.cardClone.classList.remove('active');
        this.sealStatus.textContent = 'CROSS FINGERS ➔ 👥 2 CLONES';
      } else {
        this.sealStatus.textContent = 'ACTIVE // MAKE SEAL TO DISPEL';
      }
    }

    // 2. Process Hand Tracking for Skeleton, Rasengan, and Chidori
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

        // Suppress Rasengan/Chidori while user is actively forming the Cross Seal
        const open = !this.isCrossSignActive && this.checkOpen(pts);
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
