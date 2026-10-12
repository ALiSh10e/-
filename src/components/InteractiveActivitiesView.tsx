import React, { useState, useEffect } from 'react';
import { offlineAudioService } from '../services/audioService';
import { StudentProgress, StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Volume2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  Trophy
} from 'lucide-react';

interface InteractiveActivitiesViewProps {
  progress: StudentProgress;
  onProgressUpdate: (p: StudentProgress) => void;
}

interface MiniGame {
  id: string;
  category: string;
  prompt: string;
  audioPrompt?: string;
  imageOrEmoji?: string;
  type: 'choice' | 'arrange_letters' | 'arrange_words';
  options: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint: string;
  yemeniFact: string;
}

const ACTIVITIES_LIST: MiniGame[] = [
  {
    id: 'act-1',
    category: 'الاستماع والتمييز الصوتي',
    prompt: 'استمع إلى الصوت بدقة، ثم اختر الكلمة التي سمعتها:',
    audioPrompt: 'صَنْعَاء',
    type: 'choice',
    options: ['سَنْعَاء', 'صَنْعَاء', 'شَنْعَاء', 'صَانِع'],
    correctAnswer: 'صَنْعَاء',
    explanation: 'تبدأ كلمة «صَنْعَاء» بحرف الصاد المفخم (صَـ) وليس السين المرققة.',
    hint: 'انتبه لصوت الصاد القوي المفخم في بداية الكلمة.',
    yemeniFact: 'صنعاء من أقدم مدن العالم المأهولة بالسكان وتلقب بمدينة سام.'
  },
  {
    id: 'act-2',
    category: 'مطابقة الصورة والرمز',
    prompt: 'شاهد الصورة، واختر الكلمة المطابقة التي تعبر عن هذا المحصول اليمني الأصيل:',
    imageOrEmoji: '☕',
    type: 'choice',
    options: ['بُنٌّ', 'تَمْرٌ', 'عِنَبٌ', 'شَايٌ'],
    correctAnswer: 'بُنٌّ',
    explanation: 'الصورة تعبر عن حبوب البن اليمني (بُـنّ) الشهير ذي الجودة العالمية.',
    hint: 'حبوب القهوة اليمانية المشهورة في جبال حراز وبني مطر.',
    yemeniFact: 'اليمن أول من صدّر القهوة إلى العالم عبر ميناء المخا التاريخي (Mocha).'
  },
  {
    id: 'act-3',
    category: 'تركيب الكلمات من الحروف',
    prompt: 'رتّب الحروف لتكوين اسم أقدم ناطحات سحاب طينية في العالم بحضرموت:',
    type: 'arrange_letters',
    options: ['م', 'شِ', 'بَ', 'ا'],
    correctAnswer: ['شِ', 'بَ', 'ا', 'م'],
    explanation: 'تتكون كلمة «شِبَام» من: شِ + بَ + ا + م.',
    hint: 'تبدأ بحرف الشين المكسور (شِـ).',
    yemeniFact: 'مدينة شبام حضرموت مبنية من الطين وتسمى مانهاتن الصحراء.'
  },
  {
    id: 'act-4',
    category: 'بناء الجمل والتراكيب',
    prompt: 'رتّب الكلمات لتكوين جملة اسمية صحيحة تصف تراث اليمن:',
    type: 'arrange_words',
    options: ['شَامِخٌ', 'اليَمَنِ', 'تَارِيخُ'],
    correctAnswer: ['تَارِيخُ', 'اليَمَنِ', 'شَامِخٌ'],
    explanation: 'الجملة الاسمية تبدأ بالمبتدأ (تاريخُ) ثم المضاف إليه (اليمنِ) ثم الخبر (شامخٌ).',
    hint: 'ابدأ بكلمة «تاريخُ».',
    yemeniFact: 'يمتلك اليمن تاريخاً يمتد لأكثر من ثلاثة آلاف عام قبل الميلاد.'
  },
  {
    id: 'act-5',
    category: 'الإملاء والحركات',
    prompt: 'اختر الضبط الإملائي الصحيح لكلمة تنتهي بتاء مربوطة تدل على الحكمة:',
    type: 'choice',
    options: ['حِكْمَة', 'حِكْمَت', 'حِكْمَهْ (بدون نقط)', 'حِكْمَا'],
    correctAnswer: 'حِكْمَة',
    explanation: 'تنتهي «حِكْمَة» بتاء مربوطة تنطق هاءً عند الوقف وتاءً عند الوصل، وتوضع عليها نقطتان.',
    hint: 'التاء المربوطة تنطق هاء عند الوقف (حكمة) وتوضع عليها نقطتان.',
    yemeniFact: 'ورد في الحديث النبوي الشريف: «الإيمان يمانٍ والحكمة يمانية».'
  }
];

export const InteractiveActivitiesView: React.FC<InteractiveActivitiesViewProps> = ({
  onProgressUpdate
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedArrangement, setSelectedArrangement] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = offlineAudioService.subscribeSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  const currentGame = ACTIVITIES_LIST[currentIdx];

  const handleOptionClick = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(opt);
    offlineAudioService.playClickSound();
  };

  const handleArrangementClick = (item: string) => {
    if (isAnswerChecked) return;
    offlineAudioService.playClickSound();
    if (selectedArrangement.includes(item)) {
      setSelectedArrangement(selectedArrangement.filter(i => i !== item));
    } else {
      setSelectedArrangement([...selectedArrangement, item]);
    }
  };

  const checkAnswer = () => {
    let correct = false;

    if (currentGame.type === 'choice') {
      correct = selectedOption === currentGame.correctAnswer;
    } else {
      const correctArr = currentGame.correctAnswer as string[];
      correct =
        selectedArrangement.length === correctArr.length &&
        selectedArrangement.every((val, idx) => val === correctArr[idx]);
    }

    setIsAnswerChecked(true);
    setIsCorrect(correct);

    const updated = StorageService.recordQuestionAttempt(correct, 'grammar');
    onProgressUpdate(updated);

    if (correct) {
      setStreakCount(prev => prev + 1);
      offlineAudioService.playCorrectSound();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setStreakCount(0);
      offlineAudioService.playHintSound();
    }
  };

  const resetCurrentGame = () => {
    setSelectedOption(null);
    setSelectedArrangement([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const nextActivity = () => {
    resetCurrentGame();
    if (currentIdx + 1 < ACTIVITIES_LIST.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCurrentIdx(0);
    }
    offlineAudioService.playClickSound();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-600 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-black">
              ألعاب وأنشطة التحدي التفاعلية
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100">
            اختبارات سريعة، ترتيب حروف وكلمات، وتمييز أصوات من البيئة اليمنية مع تغذية راجعة فورية.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="bg-white/15 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-300" />
          <div>
            <span className="text-xs text-emerald-100 block">التتابع الصحيح:</span>
            <span className="text-lg font-black">{streakCount} إجابات متتالية</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
        {/* Top Info */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {currentGame.category}
          </span>
          <span className="text-xs font-bold text-slate-400">
            تحدي {currentIdx + 1} من {ACTIVITIES_LIST.length}
          </span>
        </div>

        {/* Prompt & Visual */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentGame.prompt}
          </h3>

          {currentGame.imageOrEmoji && (
            <div className="text-5xl text-center py-3 bg-slate-50 rounded-xl border border-slate-100">
              {currentGame.imageOrEmoji}
            </div>
          )}

          {currentGame.audioPrompt && (
            <div className="flex items-center justify-center py-2">
              <button
                onClick={() => {
                  if (isSpeaking) {
                    offlineAudioService.stopSpeaking();
                  } else {
                    offlineAudioService.speakArabic(currentGame.audioPrompt!);
                  }
                }}
                className={`flex items-center gap-2 font-bold px-5 py-3 rounded-xl shadow-xs transition-all text-sm active:scale-95 ${
                  isSpeaking
                    ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse scale-110' : ''}`} />
                <span>{isSpeaking ? 'يتم النطق الآن... 🔊' : 'انقر للاستماع إلى الصوت'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Interaction Area: Multiple Choice */}
        {currentGame.type === 'choice' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentGame.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isAnswerChecked}
                  className={`p-4 rounded-xl border-2 text-base font-bold transition-all text-right flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Interaction Area: Arrangement (Letters / Words) */}
        {(currentGame.type === 'arrange_letters' || currentGame.type === 'arrange_words') && (
          <div className="space-y-4 pt-2">
            <div className="min-h-16 p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 flex-wrap">
              {selectedArrangement.length === 0 ? (
                <span className="text-xs text-slate-400">انقر على الخيارات بالترتيب الصحيح لتكوين الإجابة</span>
              ) : (
                selectedArrangement.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleArrangementClick(item)}
                    disabled={isAnswerChecked}
                    className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-lg shadow-xs hover:bg-emerald-700 transition-all"
                  >
                    {item}
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              {currentGame.options.map((opt, idx) => {
                const isPicked = selectedArrangement.includes(opt);
                return (
                  <button
                    key={idx}
                    onClick={() => handleArrangementClick(opt)}
                    disabled={isAnswerChecked || isPicked}
                    className={`px-4 py-2.5 rounded-xl text-base font-bold border-2 transition-all ${
                      isPicked
                        ? 'opacity-40 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'border-slate-300 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {isAnswerChecked && (
          <div
            className={`p-4 rounded-xl border-2 animate-in fade-in duration-200 space-y-2 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-base">
              {isCorrect ? (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>إجابة ممتازة وبطلة! 🌟</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <span>محاولة طيبة، أعد المحاولة بهدوء 💡</span>
                </>
              )}
            </div>

            <p className="text-xs leading-relaxed">
              {currentGame.explanation}
            </p>

            <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-slate-700 font-medium">
              🇾🇪 <span className="font-bold">معلومة يمانية: </span>{currentGame.yemeniFact}
            </div>
          </div>
        )}

        {/* Hint Box */}
        {showHint && !isAnswerChecked && (
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-950 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">تلميح ذكي:</span>
              <span>{currentGame.hint}</span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {!isAnswerChecked ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showHint ? 'إخفاء التلميح' : 'تلميح'}</span>
              </button>
              {(selectedOption || selectedArrangement.length > 0) && (
                <button
                  onClick={resetCurrentGame}
                  className="text-xs text-slate-400 hover:text-slate-600 p-2 rounded-xl"
                  title="إلغاء الاختيار"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div>
              {!isCorrect && (
                <button
                  onClick={resetCurrentGame}
                  className="text-xs text-amber-700 font-bold hover:bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>محاولة مجدداً</span>
                </button>
              )}
            </div>
          )}

          <div>
            {!isAnswerChecked ? (
              <button
                onClick={checkAnswer}
                disabled={
                  (currentGame.type === 'choice' && !selectedOption) ||
                  ((currentGame.type === 'arrange_letters' || currentGame.type === 'arrange_words') &&
                    selectedArrangement.length === 0)
                }
                className="bg-emerald-600 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-all shadow-xs"
              >
                تحقق من الإجابة
              </button>
            ) : (
              <button
                onClick={nextActivity}
                className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>التحدي التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
