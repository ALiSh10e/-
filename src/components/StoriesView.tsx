import React, { useState, useEffect } from 'react';
import { ALL_STORIES, StoryItem } from '../data/storiesData';
import { StudentProgress, StorageService } from '../services/storageService';
import { offlineAudioService } from '../services/audioService';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  ChevronLeft,
  X,
  Sparkles,
  HelpCircle,
  Award,
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';

interface StoriesViewProps {
  progress: StudentProgress;
  onProgressUpdate: (p: StudentProgress) => void;
  onBadgeUnlocked?: (badgeTitle: string) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  progress,
  onProgressUpdate,
  onBadgeUnlocked
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState<number>(progress.selectedGradeId || 1);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = offlineAudioService.subscribeSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  const currentGradeStories = ALL_STORIES[selectedGradeId] || ALL_STORIES[1];

  const openStory = (story: StoryItem) => {
    setActiveStory(story);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    offlineAudioService.playClickSound();
  };

  const closeStory = () => {
    setActiveStory(null);
    offlineAudioService.stopSpeaking();
  };

  const checkAnswer = () => {
    if (!activeStory || !selectedAnswer) return;
    const correct = selectedAnswer === activeStory.comprehensionQuestion.answer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      offlineAudioService.playCorrectSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      // Mark as read and evaluate badges
      const { progress: updated, newBadges } = StorageService.markStoryRead(activeStory.id);
      onProgressUpdate(updated);
      if (newBadges.length > 0 && onBadgeUnlocked) {
        newBadges.forEach(title => onBadgeUnlocked(title));
      }
    } else {
      offlineAudioService.playHintSound();
    }
  };

  const fontSizeClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg sm:text-xl leading-loose',
    huge: 'text-xl sm:text-2xl leading-loose font-medium'
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-700 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-emerald-300" />
            <h2 className="text-xl sm:text-2xl font-black">
              مكتبة القصص القرائية القصيرة (50 قصة لكل مرحلة)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
            قصص تعليمية ثرية من واقع البيئة والتراث والقيم، تدمج فهم المقروء مع تدريبات القواعد والإملاء لتعزيز طلاقة اللسان.
          </p>
        </div>

        <div className="bg-emerald-800/80 border border-emerald-600/50 px-4 py-2.5 rounded-xl flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-amber-300" />
          <div className="text-right">
            <span className="text-[11px] text-emerald-200 block">القصص المقروءة:</span>
            <span className="text-sm font-black text-white">
              {progress.readStories.length} من {300} قصة
            </span>
          </div>
        </div>
      </div>

      {/* Grade Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[1, 2, 3, 4, 5, 6].map(gradeNum => {
          const isSelected = selectedGradeId === gradeNum;
          const readCountInGrade = (ALL_STORIES[gradeNum] || []).filter(s => progress.readStories.includes(s.id)).length;
          return (
            <button
              key={gradeNum}
              onClick={() => {
                setSelectedGradeId(gradeNum);
                offlineAudioService.playClickSound();
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border-2 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>الصف {gradeNum}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {readCountInGrade}/50
              </span>
            </button>
          );
        })}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {currentGradeStories.map(story => {
          const isRead = progress.readStories.includes(story.id);
          return (
            <div
              key={story.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isRead
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">
                    قصة #{story.storyNumber}
                  </span>
                  {isRead && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      مكتملة
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">
                  {story.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {story.content}
                </p>

                <div className="space-y-1 mb-3 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="text-slate-500">
                    <span className="font-bold text-slate-700">القيمة: </span>
                    {story.moral}
                  </div>
                  <div className="text-slate-500">
                    <span className="font-bold text-slate-700">القواعد: </span>
                    {story.grammarFocus}
                  </div>
                </div>
              </div>

              <button
                onClick={() => openStory(story)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isRead
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isRead ? 'إعادة قراءة القصة' : 'اقرأ القصة'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Story Reader Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    {activeStory.title}
                  </h3>
                  <span className="text-[11px] text-emerald-200">
                    الصف {activeStory.gradeId} • قصة رقم {activeStory.storyNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={closeStory}
                className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Controls Bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  if (isSpeaking) {
                    offlineAudioService.stopSpeaking();
                  } else {
                    offlineAudioService.speakArabic(activeStory.content);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-2xs active:scale-95 ${
                  isSpeaking
                    ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse scale-110' : ''}`} />
                <span>{isSpeaking ? 'إيقاف الاستماع ⏹️' : 'استمع للقصة كاملة 🔊'}</span>
              </button>

              <div className="flex items-center gap-1 text-slate-600">
                <span className="text-[11px] font-bold ml-1">حجم الخط:</span>
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 rounded text-xs ${fontSize === 'normal' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-200'}`}
                >
                  عادي
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 rounded text-xs ${fontSize === 'large' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-200'}`}
                >
                  كبير
                </button>
                <button
                  onClick={() => setFontSize('huge')}
                  className={`px-2 py-0.5 rounded text-xs ${fontSize === 'huge' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-200'}`}
                >
                  مكبّر
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {/* Story Content with Diacritics */}
              <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/70 shadow-2xs">
                <p className={`text-slate-900 ${fontSizeClasses[fontSize]}`}>
                  {activeStory.content}
                </p>
              </div>

              {/* Moral & Language Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-emerald-800 block mb-1">🌟 العبرة والقيمة:</span>
                  <span className="text-slate-600">{activeStory.moral}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-sky-800 block mb-1">📐 التركيز النحوي:</span>
                  <span className="text-slate-600">{activeStory.grammarFocus}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-purple-800 block mb-1">✍️ التركيز الإملائي:</span>
                  <span className="text-slate-600">{activeStory.spellingFocus}</span>
                </div>
              </div>

              {/* Comprehension Quiz */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>سؤال فهم المقروء لتأكيد الإنجاز:</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">
                  {activeStory.comprehensionQuestion.question}
                </h4>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {activeStory.comprehensionQuestion.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isAnswerChecked) {
                            setSelectedAnswer(opt);
                            offlineAudioService.playClickSound();
                          }
                        }}
                        disabled={isAnswerChecked}
                        className={`p-3 rounded-xl border-2 text-xs font-bold text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {isAnswerChecked && (
                  <div
                    className={`p-3 rounded-xl border text-xs animate-in fade-in ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="font-bold mb-0.5">
                      {isCorrect ? 'أحسنت! إجابة صحيحة وفهم عميق للقصة 🌟' : 'حاول مرة أخرى بروية 💡'}
                    </div>
                    <p>{activeStory.comprehensionQuestion.explanation}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {!isAnswerChecked ? (
                    <button
                      onClick={checkAnswer}
                      disabled={!selectedAnswer}
                      className="bg-emerald-600 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 transition-all shadow-xs"
                    >
                      تأكيد الإجابة وإكمال القصة
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {!isCorrect && (
                        <button
                          onClick={() => {
                            setSelectedAnswer(null);
                            setIsAnswerChecked(false);
                            setIsCorrect(false);
                          }}
                          className="text-xs text-amber-700 font-bold px-3 py-1.5 rounded-lg border border-amber-300 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>إعادة المحاولة</span>
                        </button>
                      )}
                      <button
                        onClick={closeStory}
                        className="bg-slate-900 text-white font-bold px-4 py-1.5 rounded-xl text-xs hover:bg-slate-800"
                      >
                        إغلاق والعودة
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
