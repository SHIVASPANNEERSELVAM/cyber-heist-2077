// ============================================================
// Cyber Heist 2077 — Audio Service
// Procedural Web Audio API Synthesizer
// ============================================================

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isPlayingBGM: boolean = false;
  private bgmInterval: number | null = null;
  private step: number = 0;

  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;
  private masterVolume: number = 1.0;
  private isMuted: boolean = false;

  // Initialize the AudioContext on first user interaction
  public init() {
    if (this.ctx) return;
    
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
      this.masterGain.connect(this.ctx.destination);
      
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);
      
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public setVolumes(music: number, sfx: number, master: number = 1, isMuted: boolean = false) {
    this.musicVolume = (music == null || isNaN(Number(music))) ? 0.5 : Number(music);
    this.sfxVolume = (sfx == null || isNaN(Number(sfx))) ? 0.8 : Number(sfx);
    this.masterVolume = (master == null || isNaN(Number(master))) ? 1 : Number(master);
    this.isMuted = isMuted;
    
    const time = this.ctx ? this.ctx.currentTime : 0;
    
    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(time);
      this.musicGain.gain.setValueAtTime(this.musicVolume, time);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.cancelScheduledValues(time);
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, time);
    }
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(time);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, time);
    }
  }

  // ============================================================
  // MUSIC SYNTHESIS (Cyberpunk Bassline)
  // ============================================================
  public playBGM() {
    if (!this.ctx || this.isPlayingBGM) return;
    
    // Ensure context is resumed
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlayingBGM = true;
    this.step = 0;

    // A simple synthwave bassline pattern (minor pentatonic scale)
    const pattern = [55.00, 55.00, 65.41, 55.00, 73.42, 65.41, 55.00, 49.00]; 
    const tempo = 130; // BPM
    const stepTime = (60 / tempo) / 2; // 8th notes

    const playNote = () => {
      if (!this.isPlayingBGM || !this.ctx || !this.musicGain) return;
      
      const freq = pattern[this.step % pattern.length];
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Filter for that muffled bass synth sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.05);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + stepTime - 0.05);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + stepTime - 0.02);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      
      osc.start();
      osc.stop(this.ctx.currentTime + stepTime);
      
      this.step++;
      this.bgmInterval = window.setTimeout(playNote, stepTime * 1000);
    };

    playNote();
  }

  public stopBGM() {
    this.isPlayingBGM = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // ============================================================
  // SOUND EFFECTS
  // ============================================================
  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.5, slideFreq?: number) {
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playUIHover() {
    this.playTone(400, 'sine', 0.05, 0.2);
  }

  public playUIClick() {
    this.playTone(800, 'square', 0.1, 0.3, 1200);
  }

  public playDash() {
    // Noise-like swoosh using high frequency slide down
    this.playTone(1200, 'sawtooth', 0.3, 0.4, 200);
  }

  public playDamage() {
    this.playTone(150, 'sawtooth', 0.4, 0.6, 50);
  }

  public playInteract() {
    this.playTone(900, 'sine', 0.15, 0.4, 1200);
  }

  public playHackingTick() {
    this.playTone(1200, 'square', 0.05, 0.1);
  }

  public playHackingSuccess() {
    this.playTone(600, 'sine', 0.1, 0.4, 800);
    setTimeout(() => this.playTone(800, 'sine', 0.3, 0.4, 1200), 100);
  }

  public playHackingFail() {
    this.playTone(300, 'sawtooth', 0.1, 0.5, 200);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.4, 0.5, 100), 150);
  }

  public playAlarm() {
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Two-tone siren
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

export const audioService = new AudioService();
