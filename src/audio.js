// Zero-Delay Audio Engine for NEO-SHINOBI
// Preloads downloaded Rasengan & Chidori MP3 audio files in memory for instantaneous zero-latency playback

class ShinobiAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.initialized = false;

    // Decoded audio buffers
    this.rasenganBuffer = null;
    this.chidoriBuffer = null;

    // Active playback instances
    this.rasenganSource = null;
    this.rasenganGain = null;
    this.chidoriSource = null;
    this.chidoriGain = null;

    this.isRasenganPlaying = false;
    this.isChidoriPlaying = false;
  }

  async init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      await this.preloadAudio();
      this.initialized = true;
      console.log('⚡ Shinobi Audio Engine initialized and buffers decoded in RAM!');
    } catch (e) {
      console.error('Audio init error:', e);
    }
  }

  async preloadAudio() {
    const fetchBuffer = async (url) => {
      try {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        return await this.ctx.decodeAudioData(arrayBuf);
      } catch (err) {
        console.warn(`Could not preload ${url}:`, err);
        return null;
      }
    };

    const [rBuf, cBuf] = await Promise.all([
      fetchBuffer('/audio/rasengan.mp3'),
      fetchBuffer('/audio/chidori.mp3')
    ]);

    this.rasenganBuffer = rBuf;
    this.chidoriBuffer = cBuf;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.9;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  playRasengan() {
    if (!this.initialized || !this.ctx || this.isMuted || !this.rasenganBuffer) return;
    if (this.isRasenganPlaying) return;

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.rasenganBuffer;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.95, this.ctx.currentTime + 0.1);

      source.connect(gain);
      gain.connect(this.masterGain);
      source.start(0);

      this.rasenganSource = source;
      this.rasenganGain = gain;
      this.isRasenganPlaying = true;
    } catch (e) {
      console.error('Rasengan audio play error:', e);
    }
  }

  stopRasengan() {
    if (!this.isRasenganPlaying || !this.rasenganGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.rasenganGain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      const src = this.rasenganSource;
      setTimeout(() => {
        try { src.stop(); src.disconnect(); } catch (_) {}
      }, 110);
    } catch (_) {}
    this.rasenganSource = null;
    this.rasenganGain = null;
    this.isRasenganPlaying = false;
  }

  playChidori() {
    if (!this.initialized || !this.ctx || this.isMuted || !this.chidoriBuffer) return;
    if (this.isChidoriPlaying) return;

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.chidoriBuffer;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1.0, this.ctx.currentTime + 0.08);

      source.connect(gain);
      gain.connect(this.masterGain);
      source.start(0);

      this.chidoriSource = source;
      this.chidoriGain = gain;
      this.isChidoriPlaying = true;
    } catch (e) {
      console.error('Chidori audio play error:', e);
    }
  }

  stopChidori() {
    if (!this.isChidoriPlaying || !this.chidoriGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.chidoriGain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      const src = this.chidoriSource;
      setTimeout(() => {
        try { src.stop(); src.disconnect(); } catch (_) {}
      }, 110);
    } catch (_) {}
    this.chidoriSource = null;
    this.chidoriGain = null;
    this.isChidoriPlaying = false;
  }

  triggerClash() {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (this._lastClash && (now - this._lastClash < 0.2)) return;
    this._lastClash = now;

    try {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (_) {}
  }

  // Authentic Anime Kage Bunshin (Shadow Clone) Smoke Poof + Chakra Burst Sound
  playShadowClone() {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    try {
      // 1. Resonant Sub-Bass Chakra Impact Thump
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.38);

      oscGain.gain.setValueAtTime(0.85, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.42);

      // 2. Explosive Resonant Anime Smoke Poof (White noise swept through resonant bandpass)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.42);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1900, now);
      filter.frequency.exponentialRampToValueAtTime(240, now + 0.38);
      filter.Q.setValueAtTime(3.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1.0, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.42);

      // 3. Anime Chakra Chime Harmonic Shimmer
      [880, 1174, 1568].forEach((freq, idx) => {
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, now + 0.02);
        chimeGain.gain.setValueAtTime(0.18 / (idx + 1), now + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        chime.connect(chimeGain);
        chimeGain.connect(this.masterGain);
        chime.start(now + 0.02);
        chime.stop(now + 0.46);
      });
    } catch (e) {
      console.error('Shadow clone audio error:', e);
    }
  }

  // Anime Smoke Puff for Clone Dispersal
  playDispel() {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.25);
      filter.Q.setValueAtTime(2.6, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.65, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.28);
    } catch (_) {}
  }
}

export const shinobiAudio = new ShinobiAudioEngine();
