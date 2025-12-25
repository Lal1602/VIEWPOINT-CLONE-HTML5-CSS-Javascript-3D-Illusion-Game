
export class AudioController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  
  // Zen Generator State
  private isPlaying: boolean = false;
  private chimeInterval: number = 0;
  
  // Scale: E Major Pentatonic
  private scale = [329.63, 369.99, 415.30, 493.88, 554.37, 659.25, 739.99, 987.77];

  constructor() {}

  private init() {
    if (this.ctx) return;
    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
    this.ctx = new AudioCtx();
    
    // Master Chain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.4;

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);
  }

  public async startZenMusic() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended') await this.ctx.resume();
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.createDrone();
    this.startWindChimes();
  }

  private createDrone() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [82.41, 123.47, 164.81]; // E2, B2, E3
    
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = i === 1 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      osc.detune.value = (Math.random() - 0.5) * 10;

      const lfo = this.ctx!.createOscillator();
      lfo.frequency.value = 0.05 + (Math.random() * 0.05);
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      gain.gain.value = 0.1;
      
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      lfo.start();
    });
  }

  private startWindChimes() {
    const scheduleNextNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      const delay = 2000 + Math.random() * 4000;
      this.chimeInterval = window.setTimeout(() => {
        this.playChime();
        scheduleNextNote();
      }, delay);
    };
    scheduleNextNote();
  }

  private playChime() {
    if (!this.ctx || !this.masterGain) return;

    const freq = this.scale[Math.floor(Math.random() * this.scale.length)];
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 4.0);

    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.4;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.3;
    
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.masterGain);

    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(delay);

    osc.start(time);
    osc.stop(time + 5.0);
  }

  public playMove() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended') this.ctx.resume();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.2);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(t + 0.2);
  }

  public playSnap() {
    if (!this.ctx || !this.masterGain) return;
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(40, t + 0.15);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(t + 0.2);
  }

  public playWin() {
    if (!this.ctx || !this.masterGain) return;

    const chord = [329.63, 415.30, 493.88, 659.25]; // E Major 7
    const t = this.ctx.currentTime;

    chord.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.5 + (i * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start();
        osc.stop(t + 3.5);
    });
  }

  public playFail() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // Dissonant Sawtooth
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.linearRampToValueAtTime(50, t + 0.3);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(t + 0.3);
  }
}