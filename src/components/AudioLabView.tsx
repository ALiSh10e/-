import React, { useState, useRef, useEffect } from 'react';
import { offlineAudioService } from '../services/audioService';
import { Mic, Square, RotateCcw, Volume2, AlertCircle, Sparkles, Music } from 'lucide-react';

interface PracticeItem {
  id: string;
  char: string;
  name: string;
  vocalization: string;
  word: string;
  meaning: string;
  phoneticHint: string;
}

const PHONETIC_ITEMS: PracticeItem[] = [
  {
    id: 'p-1',
    char: 'ص',
    name: 'الصاد المفخمة',
    vocalization: 'صَـ',
    word: 'صَنْعَاء',
    meaning: 'عاصمة اليمن التليدة',
    phoneticHint: 'حرف مفخم ومطبق، املأ فمك بالهواء عند نطقه مقارنة بالسين.'
  },
  {
    id: 'p-2',
    char: 'ض',
    name: 'الضاد (حرف لغة الضاد)',
    vocalization: 'ضَـ',
    word: 'ضَيْف',
    meaning: 'إكرام الضيف من شيم اليمنيين',
    phoneticHint: 'يخرج من إحدى حافتي اللسان مع الأضراس العليا.'
  },
  {
    id: 'p-3',
    char: 'ط',
    name: 'الطاء المفخمة',
    vocalization: 'طَـ',
    word: 'طَرِيق',
    meaning: 'السبيل الممهد',
    phoneticHint: 'حرف شديد ومفخم ومطبق، يختلف عن التاء المرققة.'
  },
  {
    id: 'p-4',
    char: 'ع',
    name: 'العين الحلقية',
    vocalization: 'عَـ',
    word: 'عَقِيق',
    meaning: 'حجر كريم يماني أصيل',
    phoneticHint: 'يخرج من وسط الحلق بنبرة واضحة ومميزة.'
  },
  {
    id: 'p-5',
    char: 'ق',
    name: 'القاف اللهوية',
    vocalization: 'قَـ',
    word: 'قَلْعَة',
    meaning: 'حصن صامد شامخ',
    phoneticHint: 'يخرج من أقصى اللسان مع الحنك اللحمي، صوته جهوري قوي.'
  },
  {
    id: 'p-6',
    char: 'ح',
    name: 'الحاء الحلقية',
    vocalization: 'حَـ',
    word: 'حِكْمَة',
    meaning: 'سداد الرأي والعقل',
    phoneticHint: 'يخرج من وسط الحلق بهمس خفيف ونقاء صافٍ بلا خشونة.'
  }
];

export const AudioLabView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<PracticeItem>(PHONETIC_ITEMS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSpeakingModel, setIsSpeakingModel] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = offlineAudioService.subscribeSpeakingChange((speaking) => {
      setIsSpeakingModel(speaking);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      offlineAudioService.stopSpeaking();
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  const stopRecordingCleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const startLocalRecording = async () => {
    setPermissionError(null);
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    audioChunksRef.current = [];
    setRecordingDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const updateMeter = () => {
          if (!analyserRef.current) return;
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        stream.getTracks().forEach(track => track.stop());
        stopRecordingCleanup();
        setIsRecording(false);
        offlineAudioService.playCorrectSound();
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 6) {
            stopLocalRecording();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error(err);
      setPermissionError('يرجى السماح بالوصول إلى الميكروفون لتسجيل صوتك الجميل ومقارنته بنطق الحرف.');
      setIsRecording(false);
    }
  };

  const stopLocalRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopRecordingCleanup();
  };

  const resetRecording = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setRecordingDuration(0);
    setVolumeLevel(0);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-purple-700 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-6 h-6 text-purple-300" />
            <h2 className="text-xl sm:text-2xl font-black">
              مختبر النطق والأصوات الفصيحة
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl">
            استمع إلى نطق الحرف والكلمة الفصيحة، ثم سجّل صوتك العذب واستمع إليه لترتقي بلسانك العربي الجميل!
          </p>
        </div>

        <div className="bg-purple-800/80 border border-purple-600/50 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs text-purple-200">
          <Music className="w-4 h-4 text-amber-300" />
          <span>تعلّم مخارج الحروف العربية</span>
        </div>
      </div>

      {/* Select Practice Sound */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          اختر صوتاً لتدريب مخارج الحروف:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PHONETIC_ITEMS.map(item => {
            const isSelected = selectedItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  resetRecording();
                  offlineAudioService.speakArabic(item.word);
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-sm ring-2 ring-purple-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <span className="text-3xl font-black block mb-1 text-purple-700">
                  {item.char}
                </span>
                <span className="text-xs font-bold block">{item.name}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">{item.word}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Training & Comparison Workbench */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
        {/* Selected Sound Details */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-5">
          <div className="w-20 h-20 bg-purple-100 text-purple-900 rounded-2xl flex items-center justify-center font-black text-5xl mx-auto shadow-inner border border-purple-200">
            {selectedItem.char}
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {selectedItem.word}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            المعنى: {selectedItem.meaning}
          </p>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 max-w-md mx-auto text-right">
            <span className="font-bold block mb-1">💡 إرشاد النطق والمخرج:</span>
            <span>{selectedItem.phoneticHint}</span>
          </div>
        </div>

        {/* Side-by-Side: Step 1 (Model Voice) vs Step 2 (Kid Voice) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: The Model Voice */}
          <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1">
                الخطوة الأولى: استمع للنموذج
              </span>
              <p className="text-xs text-slate-500">
                استمع إلى النطق العربي الفصيح للكلمة بصوت واضح وهادئ:
              </p>
            </div>

            <button
              onClick={() => {
                if (isSpeakingModel) {
                  offlineAudioService.stopSpeaking();
                } else {
                  offlineAudioService.speakArabic(selectedItem.word);
                }
              }}
              className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-all active:scale-95 ${
                isSpeakingModel
                  ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isSpeakingModel ? 'animate-pulse scale-110' : ''}`} />
              <span>{isSpeakingModel ? 'يتم النطق الفصيح الآن... 🔊' : `استمع إلى «${selectedItem.word}»`}</span>
            </button>
          </div>

          {/* Box 2: Kid Voice Recorder */}
          <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1">
                الخطوة الثانية: سجّل بصوتك واستمع
              </span>
              <p className="text-xs text-slate-500">
                انقر على الزر وقل الكلمة بصوتك ثم استمع إليها:
              </p>
            </div>

            {permissionError && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs flex items-start gap-1.5 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{permissionError}</span>
              </div>
            )}

            {!isRecording && !recordedAudioUrl && (
              <button
                onClick={startLocalRecording}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-all"
              >
                <Mic className="w-5 h-5" />
                <span>ابدأ التسجيل الصوتي</span>
              </button>
            )}

            {isRecording && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-red-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                    جارٍ التسجيل الآن...
                  </span>
                  <span>{recordingDuration} / 6 ثوانٍ</span>
                </div>

                {/* Live Volume Meter */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-75"
                    style={{ width: `${Math.max(10, volumeLevel)}%` }}
                  />
                </div>

                <button
                  onClick={stopLocalRecording}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>إيقاف التسجيل</span>
                </button>
              </div>
            )}

            {recordedAudioUrl && !isRecording && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <audio
                    src={recordedAudioUrl}
                    controls
                    className="w-full h-10 rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    تم تسجيل صوتك بنجاح!
                  </span>
                  <button
                    onClick={resetRecording}
                    className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 p-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>إعادة التسجيل</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
