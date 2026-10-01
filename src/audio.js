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
}

export const shinobiAudio = new ShinobiAudioEngine();
