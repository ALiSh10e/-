import React, { useState, useRef, useEffect } from 'react';
import { ARABIC_LETTERS, ArabicLetter } from '../data/lettersData';
import { offlineAudioService } from '../services/audioService';
import { Volume2, RotateCcw, Sparkles, MapPin, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LetterLibraryView: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter>(ARABIC_LETTERS[1]); // الباء
  const [brushColor, setBrushColor] = useState('#0284C7'); // Sky blue
  const [brushSize, setBrushSize] = useState(14);
  const [isDrawing, setIsDrawing] = useState(false);
  const [playingText, setPlayingText] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const unsub = offlineAudioService.subscribeSpeakingChange((speaking, text) => {
      setPlayingText(speaking ? text : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    drawGuideLetter();
  }, [selectedLetter]);

  const drawGuideLetter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Guide grid line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(10, canvas.height * 0.72);
    ctx.lineTo(canvas.width - 10, canvas.height * 0.72);
    ctx.stroke();

    ctx.setLineDash([]);

    // Background guide letter for child to trace over
    ctx.font = 'bold 140px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(selectedLetter.char, canvas.width / 2, canvas.height * 0.52);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleFinishTracing = () => {
    offlineAudioService.playCorrectSound();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const colors = [
    { name: 'أزرق', hex: '#0284C7' },
    { name: 'أخضر', hex: '#16A34A' },
    { name: 'أحمر', hex: '#DC2626' },
    { name: 'برتقالي', hex: '#EA580C' },
    { name: 'بنفسجي', hex: '#9333EA' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner */}
      <div className="bg-sky-600 text-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-2xl font-black mb-1">
          مكتبة الحروف الهجائية والتتبع التفاعلي
        </h2>
        <p className="text-xs sm:text-sm text-sky-100">
          استمع إلى صوت كل حرف بحركاته، وتعرّف على أشكاله، ثم تتبع كتابته بيدك على اللوحة التفاعلية.
        </p>
      </div>

      {/* Letters Grid Optimized for Mobile */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 mb-2.5">
          اختر حرفاً من الحروف الثمانية والعشرين:
        </h3>
        <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-14 gap-1.5 sm:gap-2">
          {ARABIC_LETTERS.map(letter => {
            const isSelected = selectedLetter.char === letter.char;
            return (
              <button
                key={letter.char}
                onClick={() => {
                  setSelectedLetter(letter);
                  offlineAudioService.speakArabic(letter.audioPhoneticText);
                }}
                className={`h-10 sm:h-12 rounded-xl text-base sm:text-lg font-black transition-all flex items-center justify-center border-2 min-h-[40px] ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-sm ring-2 ring-sky-300'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300'
                }`}
              >
                {letter.char}
              </button>
            );
          })}
        </div>
      </div>

      {/* Details & Tracing Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Letter Info */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card: Big Letter Display */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center font-black text-4xl sm:text-5xl shadow-md border-2 border-sky-300 shrink-0">
                {selectedLetter.char}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-0.5">
                  حرف {selectedLetter.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  انقر للاستماع إلى النطق الفصيح
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (playingText === selectedLetter.audioPhoneticText) {
                  offlineAudioService.stopSpeaking();
                } else {
                  offlineAudioService.speakArabic(selectedLetter.audioPhoneticText);
                }
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0 min-h-[44px] active:scale-95 ${
                playingText === selectedLetter.audioPhoneticText
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${playingText === selectedLetter.audioPhoneticText ? 'animate-pulse scale-110' : ''}`} />
              <span>{playingText === selectedLetter.audioPhoneticText ? 'يتم النطق...' : 'نطق الحرف'}</span>
            </button>
          </div>

          {/* Letter Forms in Words */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
              أشكال حرف ({selectedLetter.char}) في مواقع الكلمة:
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xl sm:text-2xl font-black text-sky-700 block mb-0.5">
                  {selectedLetter.isolated}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold">منفصل</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xl sm:text-2xl font-black text-sky-700 block mb-0.5">
                  {selectedLetter.initial}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold">أول الكلمة</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xl sm:text-2xl font-black text-sky-700 block mb-0.5">
                  {selectedLetter.medial}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold">وسط الكلمة</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xl sm:text-2xl font-black text-sky-700 block mb-0.5">
                  {selectedLetter.final}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold">آخر الكلمة</span>
              </div>
            </div>
          </div>

          {/* Diacritics */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
              نطق الحرف مع الحركات والسكون:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => offlineAudioService.speakArabic(selectedLetter.vowels.fatha)}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all min-h-[44px] active:scale-95 ${
                  playingText === selectedLetter.vowels.fatha
                    ? 'bg-emerald-200 border-emerald-500 ring-2 ring-emerald-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black text-emerald-800 block mb-0.5">
                  {selectedLetter.vowels.fatha}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-emerald-900 block">
                  {playingText === selectedLetter.vowels.fatha ? '🔊 جاري النطق' : 'الفَتْحَة'}
                </span>
              </button>

              <button
                onClick={() => offlineAudioService.speakArabic(selectedLetter.vowels.damma)}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all min-h-[44px] active:scale-95 ${
                  playingText === selectedLetter.vowels.damma
                    ? 'bg-amber-200 border-amber-500 ring-2 ring-amber-300'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black text-amber-800 block mb-0.5">
                  {selectedLetter.vowels.damma}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-amber-900 block">
                  {playingText === selectedLetter.vowels.damma ? '🔊 جاري النطق' : 'الضَّمَّة'}
                </span>
              </button>

              <button
                onClick={() => offlineAudioService.speakArabic(selectedLetter.vowels.kasra)}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all min-h-[44px] active:scale-95 ${
                  playingText === selectedLetter.vowels.kasra
                    ? 'bg-purple-200 border-purple-500 ring-2 ring-purple-300'
                    : 'bg-purple-50 hover:bg-purple-100 border-purple-200'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black text-purple-800 block mb-0.5">
                  {selectedLetter.vowels.kasra}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-purple-900 block">
                  {playingText === selectedLetter.vowels.kasra ? '🔊 جاري النطق' : 'الكَسْرَة'}
                </span>
              </button>

              <button
                onClick={() => offlineAudioService.speakArabic(selectedLetter.vowels.sukoon)}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all min-h-[44px] active:scale-95 ${
                  playingText === selectedLetter.vowels.sukoon
                    ? 'bg-slate-300 border-slate-500 ring-2 ring-slate-400'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black text-slate-800 block mb-0.5">
                  {selectedLetter.vowels.sukoon}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 block">
                  {playingText === selectedLetter.vowels.sukoon ? '🔊 جاري النطق' : 'السُّكُون'}
                </span>
              </button>
            </div>
          </div>

          {/* Sample Words */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
              كلمات تبدأ أو تتضمن حرف ({selectedLetter.char}):
            </h4>
            <div className="space-y-2">
              {selectedLetter.sampleWords.map((wordItem, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl sm:text-3xl shrink-0">{wordItem.emoji}</span>
                    <div className="min-w-0">
                      <span className="text-base sm:text-lg font-black text-slate-900 block truncate">
                        {wordItem.word}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {wordItem.meaning}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (playingText === wordItem.word) {
                        offlineAudioService.stopSpeaking();
                      } else {
                        offlineAudioService.speakArabic(wordItem.word);
                      }
                    }}
                    className={`p-2 rounded-lg border shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center transition-all active:scale-95 ${
                      playingText === wordItem.word
                        ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-sky-50 hover:text-sky-700 text-slate-700'
                    }`}
                    title="استمع للكلمة"
                  >
                    <Volume2 className={`w-4 h-4 ${playingText === wordItem.word ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Responsive Finger Tracing Board */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-sky-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  لوحة رسم وتتبع الحرف
                </h4>
              </div>
              <button
                onClick={drawGuideLetter}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg min-h-[36px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح وإعادة</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              استخدم إصبعك لتتبع شكل حرف ({selectedLetter.char}) فوق الخط الاسترشادي:
            </p>

            {/* Responsive Touch-friendly Canvas Container */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl overflow-hidden relative touch-none select-none flex items-center justify-center p-1 w-full max-w-full mb-3">
              <canvas
                ref={canvasRef}
                width={320}
                height={260}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full max-w-full h-auto aspect-4/3 cursor-crosshair canvas-touch-none"
              />
            </div>

            {/* Stroke Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {/* Color Swatches */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">لون القلم:</span>
                <div className="flex items-center gap-2">
                  {colors.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setBrushColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform ${
                        brushColor === c.hex ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Size */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold">سمك القلم:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setBrushSize(8)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-bold min-h-[36px] ${brushSize === 8 ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                  >
                    رفيع
                  </button>
                  <button
                    onClick={() => setBrushSize(14)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-bold min-h-[36px] ${brushSize === 14 ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                  >
                    متوسط
                  </button>
                  <button
                    onClick={() => setBrushSize(22)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-bold min-h-[36px] ${brushSize === 22 ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                  >
                    عريض
                  </button>
                </div>
              </div>

              {/* Complete Tracing Button */}
              <button
                onClick={handleFinishTracing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>أتممت كتابة الحرف!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
