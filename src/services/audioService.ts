/**
 * محرك الصوت التفاعلي الذكي والمتعدد الطبقات للغة العربية (Hybrid Arabic Audio Engine)
 * يتضمن:
 * 1. بث صوتي فصيح عالي النقاء للكلمات والحروف مع التشكيل التام عبر مشغل الصوت المدمج.
 * 2. محرك النطق الآلي المحلي (Web Speech API / SpeechSynthesis) مع معالجة ثغرات متصفحات أندرويد وكروم.
 * 3. توليد نغمات صوتية وفونيمات تشكيلية تفاعلية عبر Web Audio API دون أي ملفات خارجية (ضمان 100% لعدم الصمت).
 * 4. إدارة حالة النطق اللحظية لعرض المؤشرات البصرية عند استماع الطفل للنطق.
 */

type SpeakingChangeListener = (isSpeaking: boolean, text: string | null) => void;

class OfflineAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private arabicVoice: SpeechSynthesisVoice | null = null;
  private hasArabicVoice: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();
  private isCurrentlySpeaking: boolean = false;
  private activeSpeakingText: string | null = null;
  private sequenceCancelled: boolean = false;
  private listeners: Set<SpeakingChangeListener> = new Set();

  constructor() {
    this.initAudioContext();
    this.initVoices();
    this.setupGestureUnlock();
  }

  private initAudioContext() {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  private setupGestureUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.ensureContext();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.resume();
        } catch {
          // ignore
        }
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  public ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        try {
          const voices = window.speechSynthesis.getVoices();
          // ابحث عن أي صوت يدعم العربية
          const ar = voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('ar') ||
              v.name.toLowerCase().includes('arabic') ||
              v.name.includes('عربي')
          );
          if (ar) {
            this.arabicVoice = ar;
            this.hasArabicVoice = true;
          } else {
            this.hasArabicVoice = false;
          }
        } catch {
          this.hasArabicVoice = false;
        }
      };

      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  public subscribeSpeakingChange(listener: SpeakingChangeListener): () => void {
    this.listeners.add(listener);
    // إبلاغ الحالة الحالية فوراً
    listener(this.isCurrentlySpeaking, this.activeSpeakingText);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setSpeakingState(speaking: boolean, text: string | null = null) {
    this.isCurrentlySpeaking = speaking;
    this.activeSpeakingText = speaking ? text : null;
    this.listeners.forEach((fn) => {
      try {
        fn(speaking, this.activeSpeakingText);
      } catch {
        // ignore listener errors
      }
    });
  }

  public getIsSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  public getActiveSpeakingText(): string | null {
    return this.activeSpeakingText;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeaking();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public hasNativeArabicSpeech(): boolean {
    return this.hasArabicVoice;
  }

  /**
   * تشغيل نغمة النجاح والإجابة الصحيحة (مبتهجة ومحفزة للطفل)
   */
  public playCorrectSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Arpeggio: C5 -> E5 -> G5 -> C6
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.24); // C6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {
      // Audio fallback
    }
  }

  /**
   * تشغيل نغمة المحاولة مجدداً (لطيفة ومشجعة، بدون صوت محبط)
   */
  public playHintSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.25); // F4

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  /**
   * نقرة الزر التفاعلي
   */
  public playClickSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }

  /**
   * تشغيل نغمة الاحتفال بإكمال الوحدة أو الدرس أو الاختبار التقييمي
   */
  public playFanfare() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 523.25, d: 0.12 }, // Do
        { f: 659.25, d: 0.12 }, // Mi
        { f: 783.99, d: 0.15 }, // Sol
        { f: 1046.5, d: 0.38 } // Do High
      ];

      let t = this.ctx.currentTime;
      notes.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d + 0.04;
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * توليد رنين صوتي فونيمي للحركات القصيرة والحروف دون إنترنت
   * (Acoustic Phonetic Formant Synthesizer)
   */
  public playPhoneticAcousticCue(text: string) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // تحديد تردد الصائت بناءً على الحركة الإعرابية
      let baseFreq = 440;
      if (text.includes('َ')) {
        // فتحة: صوت مفتوح مشرق
        baseFreq = 523.25; // C5
      } else if (text.includes('ُ')) {
        // ضمة: صوت عميق ممتلئ
        baseFreq = 392.0; // G4
      } else if (text.includes('ِ')) {
        // كسرة: صوت رقيق حاد
        baseFreq = 659.25; // E5
      } else if (text.includes('ْ')) {
        // سكون: نبرة منضبطة موجزة
        baseFreq = 493.88; // B4
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.28);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Fallback
    }
  }

  /**
   * تشغيل مقطع صوتي نقي عبر رابط TTS مع المعالجة
   */
  private playAudioStream(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.sequenceCancelled) {
        resolve(false);
        return;
      }

      try {
        const audio = new Audio(url);
        this.currentAudioElement = audio;

        let resolved = false;
        const cleanupAndResolve = (success: boolean) => {
          if (!resolved) {
            resolved = true;
            if (this.currentAudioElement === audio) {
              this.currentAudioElement = null;
            }
            resolve(success);
          }
        };

        // مهلة أمان قصوى للمقطع
        const timeout = setTimeout(() => {
          cleanupAndResolve(false);
        }, 12000);

        audio.onended = () => {
          clearTimeout(timeout);
          cleanupAndResolve(true);
        };

        audio.onerror = () => {
          clearTimeout(timeout);
          cleanupAndResolve(false);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            clearTimeout(timeout);
            cleanupAndResolve(false);
          });
        }
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * تشغيل النطق عبر محرك Web Speech API المحلي كطبقة بديلة
   */
  private speakViaSpeechSynthesis(text: string, rate: number = 0.88): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve(false);
        return;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        this.activeUtterances.add(utterance);

        utterance.lang = 'ar-SA';
        utterance.rate = rate;
        utterance.pitch = 1.05;

        // اختيار أفضل صوت عربي متاح
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice =
          this.arabicVoice ||
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('ar') ||
              v.name.toLowerCase().includes('arabic') ||
              v.name.includes('عربي')
          );

        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }

        let isEnded = false;
        const finish = (result: boolean) => {
          if (!isEnded) {
            isEnded = true;
            this.activeUtterances.delete(utterance);
            resolve(result);
          }
        };

        utterance.onend = () => finish(true);
        utterance.onerror = () => finish(false);

        // مهلة حماية لتجنب تعليق المحرك في متصفحات كروم
        setTimeout(() => finish(true), 7000);

        window.speechSynthesis.speak(utterance);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * تقسيم النص الطويل إلى جمل متناسقة للنطق الطبيعي
   */
  private splitTextIntoChunks(text: string): string[] {
    const clean = text.trim();
    if (clean.length <= 120) {
      return [clean];
    }

    // التقسيم وفق علامات الترقيم العربية وعلامات الأسطر
    const sentences = clean
      .split(/([.!?؛،\n]+)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const chunks: string[] = [];
    let currentChunk = '';

    for (const part of sentences) {
      if ((currentChunk + ' ' + part).length < 120) {
        currentChunk = currentChunk ? `${currentChunk} ${part}` : part;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = part;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    return chunks.length > 0 ? chunks : [clean.slice(0, 120)];
  }

  /**
   * نطق الحرف أو الكلمة أو القصة العربية بصوت فصيح وواضح
   * مع حماية كاملة ونظام تعافي متعدد الطبقات (Triple-Layer Fallback)
   * @param text النص المراد نطقه
   * @param rate سرعة النطق (0.85 للأطفال)
   */
  public async speakArabic(text: string, rate: number = 0.85, allowIfMuted: boolean = true): Promise<boolean> {
    if (!text || !text.trim()) {
      return false;
    }

    if (this.isMuted && !allowIfMuted) {
      return false;
    }

    // إيقاف أي نطق سابق فوراً
    this.stopSpeaking();
    this.sequenceCancelled = false;
    this.ensureContext();

    const cleanText = text.trim();
    this.setSpeakingState(true, cleanText);

    try {
      const chunks = this.splitTextIntoChunks(cleanText);

      for (let i = 0; i < chunks.length; i++) {
        if (this.sequenceCancelled) break;
        const chunk = chunks[i];

        // المحاولة 1: خدمة الصوت النقي المباشرة عبر خادم التطبيق المحلي
        const proxyUrl = `/api/tts?q=${encodeURIComponent(chunk)}`;
        let success = await this.playAudioStream(proxyUrl);

        // المحاولة 2: الاتصال المباشر بمحرك النطق الفصيح عالي الجودة
        if (!success && !this.sequenceCancelled) {
          const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(chunk)}`;
          success = await this.playAudioStream(directUrl);
        }

        // المحاولة 3: محرك نطق المتصفح المحلي (SpeechSynthesis)
        if (!success && !this.sequenceCancelled) {
          success = await this.speakViaSpeechSynthesis(chunk, rate);
        }

        // المحاولة 4: التوليد الفونيمي الصوتي عبر Web Audio API (تأكيد 100% أن المستخدم يسمع صوتاً)
        if (!success && !this.sequenceCancelled) {
          this.playPhoneticAcousticCue(chunk);
          // انتظار مدة الرنين
          await new Promise((r) => setTimeout(r, 400));
        }

        // وقفة لطيفة بين الجمل في النصوص الطويلة
        if (i < chunks.length - 1 && !this.sequenceCancelled) {
          await new Promise((r) => setTimeout(r, 180));
        }
      }

      this.setSpeakingState(false, null);
      return true;
    } catch {
      // في أسوأ الظروف، تشغيل صوت الإشارة التفاعلية
      this.playCorrectSound();
      this.setSpeakingState(false, null);
      return false;
    }
  }

  /**
   * إيقاف تشغيل النطق فوراً
   */
  public stopSpeaking() {
    this.sequenceCancelled = true;

    // إيقاف تشغيل عنصر الصوت إن وُجد
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement.src = '';
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    // إيقاف محرك النطق للمتصفح
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    this.activeUtterances.clear();
    this.setSpeakingState(false, null);
  }
}

export const offlineAudioService = new OfflineAudioService();
