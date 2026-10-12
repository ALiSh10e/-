import React, { useState, useEffect } from 'react';
import { Grade, Lesson, SubActivity, QuizQuestion } from '../data/curriculumData';
import { StudentProgress, StorageService } from '../services/storageService';
import { offlineAudioService } from '../services/audioService';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle,
  Play,
  Volume2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Award,
  Trophy,
  Star,
  CheckCircle2,
  Layers,
  GraduationCap
} from 'lucide-react';

interface LessonsViewProps {
  currentGrade: Grade;
  progress: StudentProgress;
  onProgressUpdate: (newProgress: StudentProgress) => void;
  onBadgeUnlocked?: (badgeTitle: string) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  currentGrade,
  progress,
  onProgressUpdate,
  onBadgeUnlocked
}) => {
  // Activity Modal State
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedArrangement, setSelectedArrangement] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showQuickGrid, setShowQuickGrid] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  // Quiz Modal State
  const [activeQuizLesson, setActiveQuizLesson] = useState<Lesson | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
  const [isQuizQuestionChecked, setIsQuizQuestionChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<string | null>(null);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);

  useEffect(() => {
    const unsub = offlineAudioService.subscribeSpeakingChange((speaking) => {
      setIsAudioSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  // -------------------------------------------------------------
  // Lesson Activities Handlers
  // -------------------------------------------------------------
  const startActivities = (lesson: Lesson, startIndex = 0) => {
    setActiveLesson(lesson);
    setActiveActivityIndex(startIndex);
    setSelectedOption(null);
    setSelectedArrangement([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowQuickGrid(false);
    offlineAudioService.playClickSound();
  };

  const closeActivities = () => {
    setActiveLesson(null);
    offlineAudioService.stopSpeaking();
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
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

  const checkActivityAnswer = (currentAct: SubActivity) => {
    let correct = false;

    if (currentAct.type === 'choice' || currentAct.type === 'match' || currentAct.type === 'diacritics' || currentAct.type === 'spelling') {
      correct = selectedOption === currentAct.correctAnswer;
    } else if (currentAct.type === 'arrange_letters' || currentAct.type === 'arrange_words') {
      const correctArr = currentAct.correctAnswer as string[];
      correct =
        selectedArrangement.length === correctArr.length &&
        selectedArrangement.every((val, idx) => val === correctArr[idx]);
    }

    setIsAnswerChecked(true);
    setIsCorrect(correct);

    const updated = StorageService.recordQuestionAttempt(correct, 'phonics');
    onProgressUpdate(updated);

    if (correct) {
      if (!completedActivities.includes(currentAct.id)) {
        setCompletedActivities(prev => [...prev, currentAct.id]);
      }
      offlineAudioService.playCorrectSound();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      offlineAudioService.playHintSound();
    }
  };

  const nextActivity = () => {
    if (!activeLesson) return;
    offlineAudioService.playClickSound();
    if (activeActivityIndex + 1 < activeLesson.subActivities.length) {
      setActiveActivityIndex(prev => prev + 1);
      setSelectedOption(null);
      setSelectedArrangement([]);
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Finished all activities!
      offlineAudioService.playFanfare();
      const { progress: newProg } = StorageService.markLessonComplete(activeLesson.id, 30, 3);
      onProgressUpdate(newProg);
      // Automatically prompt to take Evaluative Quiz!
      startQuiz(activeLesson);
      closeActivities();
    }
  };

  const prevActivity = () => {
    if (activeActivityIndex > 0) {
      setActiveActivityIndex(prev => prev - 1);
      setSelectedOption(null);
      setSelectedArrangement([]);
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setShowHint(false);
      offlineAudioService.playClickSound();
    }
  };

  // -------------------------------------------------------------
  // Evaluative Quiz Handlers
  // -------------------------------------------------------------
  const startQuiz = (lesson: Lesson) => {
    setActiveQuizLesson(lesson);
    setQuizQuestionIndex(0);
    setQuizSelectedOption(null);
    setQuizAnswers({});
    setIsQuizQuestionChecked(false);
    setQuizScore(0);
    setIsQuizFinished(false);
    setNewlyUnlockedBadge(null);
    offlineAudioService.playClickSound();
  };

  const closeQuiz = () => {
    setActiveQuizLesson(null);
    offlineAudioService.stopSpeaking();
  };

  const handleQuizOptionSelect = (option: string) => {
    if (isQuizQuestionChecked) return;
    setQuizSelectedOption(option);
    offlineAudioService.playClickSound();
  };

  const checkQuizQuestion = (question: QuizQuestion) => {
    const isAnsCorrect = quizSelectedOption === question.correctAnswer;
    setIsQuizQuestionChecked(true);

    const newScore = isAnsCorrect ? quizScore + 1 : quizScore;
    setQuizScore(newScore);

    setQuizAnswers(prev => ({
      ...prev,
      [quizQuestionIndex]: {
        selected: quizSelectedOption || '',
        isCorrect: isAnsCorrect
      }
    }));

    if (isAnsCorrect) {
      offlineAudioService.playCorrectSound();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      offlineAudioService.playHintSound();
    }
  };

  const nextQuizQuestion = () => {
    if (!activeQuizLesson) return;
    offlineAudioService.playClickSound();
    const totalQ = activeQuizLesson.quiz.questions.length;

    if (quizQuestionIndex + 1 < totalQ) {
      setQuizQuestionIndex(prev => prev + 1);
      setQuizSelectedOption(null);
      setIsQuizQuestionChecked(false);
    } else {
      // Quiz Finished!
      setIsQuizFinished(true);
      const isFull = quizScore === totalQ;

      const { progress: updated, newBadges, isFullMarks } = StorageService.recordQuizResult(
        activeQuizLesson.id,
        quizScore,
        totalQ
      );
      onProgressUpdate(updated);

      if (isFull || isFullMarks) {
        offlineAudioService.playFanfare();
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      }

      if (newBadges.length > 0) {
        setNewlyUnlockedBadge(newBadges[0]);
        if (onBadgeUnlocked) {
          newBadges.forEach(title => onBadgeUnlocked(title));
        }
      }
    }
  };

  const getCategoryBadgeClass = (category: Lesson['category']) => {
    switch (category) {
      case 'أصوات وحروف':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'إملاء وظواهر':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'قواعد وتراكيب':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'قراءة وفهم':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Grade Banner Mobile-First */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-md font-bold inline-block">
              {currentGrade.name}
            </span>
            <span className="text-[11px] bg-amber-500/80 px-2 py-0.5 rounded-md font-bold text-amber-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>32 نشاطاً ودرساً فرعياً لكل درس</span>
            </span>
            <span className="text-[11px] bg-emerald-500/80 px-2 py-0.5 rounded-md font-bold text-white flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-300" />
              <span>اختبار تقييمي معتمد (Quizzes)</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black leading-snug">{currentGrade.title}</h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {currentGrade.levelDescription}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 text-center border border-white/20 shrink-0 self-stretch sm:self-auto flex sm:flex-col items-center justify-between sm:justify-center">
          <span className="text-xs text-amber-100 font-medium">مجموع الدروس:</span>
          <span className="text-xl sm:text-2xl font-black">
            {currentGrade.units.reduce((acc, u) => acc + u.lessons.length, 0)}
          </span>
          <span className="text-[11px] text-amber-200 sm:block hidden">دروس رئيسية</span>
        </div>
      </div>

      {/* Units & Lessons List */}
      <div className="space-y-4 sm:space-y-6">
        {currentGrade.units.map(unit => (
          <div key={unit.id} className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 shadow-xs">
            {/* Unit Header */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-4 pb-2.5 sm:pb-3 border-b border-slate-100">
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 text-sm sm:text-lg leading-tight truncate">
                  {unit.title}
                </h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{unit.description}</p>
              </div>
              <span className="text-[11px] text-slate-400 font-bold shrink-0 bg-slate-100 px-2.5 py-1 rounded-lg">
                {unit.lessons.length} دروس
              </span>
            </div>

            {/* Responsive Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {unit.lessons.map(lesson => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const quizResult = progress.quizResults[lesson.id];
                const hasFullMarks = quizResult?.fullMarks;

                return (
                  <div
                    key={lesson.id}
                    className={`rounded-2xl p-3.5 sm:p-4 border transition-all flex flex-col justify-between ${
                      hasFullMarks
                        ? 'border-amber-300 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 shadow-xs ring-1 ring-amber-200'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/60 hover:border-amber-300 hover:bg-amber-50/20'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(lesson.category)} truncate`}>
                          {lesson.category}
                        </span>

                        <span className="text-[10px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200">
                          {lesson.subActivities.length} نشاطاً فرعياً
                        </span>

                        {hasFullMarks ? (
                          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 px-2.5 py-0.5 rounded-full font-black border border-amber-400 shadow-2xs">
                            <Trophy className="w-3.5 h-3.5 text-amber-800 fill-amber-700" />
                            العلامة الكاملة 100%
                          </span>
                        ) : quizResult ? (
                          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            نتيجة الاختبار: {quizResult.percentage}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                            الاختبار متاح
                          </span>
                        )}
                      </div>

                      {/* Title & Summary */}
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 leading-snug">
                        {lesson.title}
                      </h4>

                      <p className="text-xs text-slate-600 mb-2.5 leading-relaxed line-clamp-2">
                        {lesson.summary}
                      </p>

                      {/* Educational Objective */}
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100 mb-3">
                        <span className="font-bold text-amber-800">الهدف: </span>
                        <span>{lesson.objective}</span>
                      </div>
                    </div>

                    {/* Footer Actions: Activities + Quiz Buttons */}
                    <div className="pt-2.5 border-t border-slate-200/60 mt-1 flex flex-col xs:flex-row items-center justify-between gap-2">
                      <button
                        onClick={() => startActivities(lesson)}
                        className={`w-full xs:w-auto flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[42px] active:scale-95 shadow-2xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>الأنشطة (32 نشاطاً)</span>
                      </button>

                      <button
                        onClick={() => startQuiz(lesson)}
                        className={`w-full xs:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[42px] active:scale-95 border-2 ${
                          hasFullMarks
                            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-400 hover:border-amber-500'
                        }`}
                        title="خوض الاختبار التقييمي للدرس للحصول على العلامة الكاملة"
                      >
                        <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>الاختبار التقييمي</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================= */}
      {/* 32 Sub-Activities Interactive Player Modal */}
      {/* ============================================================= */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Top Header */}
            <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between border-b-2 border-amber-500 shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-base leading-tight truncate">
                    {activeLesson.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-300">
                    <span>النشاط {activeActivityIndex + 1} من {activeLesson.subActivities.length}</span>
                    <span>•</span>
                    <span className="text-amber-400">{activeLesson.subActivities[activeActivityIndex]?.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Switch to Quiz Button */}
                <button
                  onClick={() => {
                    startQuiz(activeLesson);
                    closeActivities();
                  }}
                  className="hidden xs:flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all shadow-xs"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>الاختبار</span>
                </button>

                <button
                  onClick={closeActivities}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center active:scale-90"
                  aria-label="إغلاق الأنشطة"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Activities Switcher / Quick Grid Toggle Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs shrink-0">
              <button
                onClick={() => setShowQuickGrid(!showQuickGrid)}
                className="flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>فهرس الـ 32 نشاطاً {showQuickGrid ? '▲' : '▼'}</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>المكتمل: </span>
                <span className="font-black text-emerald-700">{completedActivities.length} / 32</span>
              </div>
            </div>

            {/* Quick Grid Drawer (numbers 1 to 32) */}
            {showQuickGrid && (
              <div className="bg-slate-50 p-3 border-b border-slate-200 max-h-48 overflow-y-auto animate-in slide-in-from-top-2">
                <div className="grid grid-cols-8 gap-1.5 text-center">
                  {activeLesson.subActivities.map((act, idx) => {
                    const isCurrent = idx === activeActivityIndex;
                    const isDone = completedActivities.includes(act.id);
                    return (
                      <button
                        key={act.id}
                        onClick={() => {
                          setActiveActivityIndex(idx);
                          setSelectedOption(null);
                          setSelectedArrangement([]);
                          setIsAnswerChecked(false);
                          setIsCorrect(false);
                          setShowHint(false);
                          setShowQuickGrid(false);
                        }}
                        className={`py-1 rounded-lg text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                            : isDone
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Body: Active Activity Question */}
            <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 overscroll-contain">
              {activeLesson.subActivities[activeActivityIndex] && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
                  {/* Activity Sub-Header */}
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                    <span className="font-bold text-amber-700">
                      {activeLesson.subActivities[activeActivityIndex].title}
                    </span>
                    <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                      {activeLesson.subActivities[activeActivityIndex].category}
                    </span>
                  </div>

                  {/* Prompt & Audio Pronounce */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm sm:text-lg font-bold text-slate-900 leading-snug">
                        {activeLesson.subActivities[activeActivityIndex].prompt}
                      </h4>
                      {activeLesson.subActivities[activeActivityIndex].imageOrEmoji && (
                        <span className="text-3xl block my-1">
                          {activeLesson.subActivities[activeActivityIndex].imageOrEmoji}
                        </span>
                      )}
                    </div>

                    {activeLesson.subActivities[activeActivityIndex].audioPromptText && (
                      <button
                        onClick={() => {
                          const text = activeLesson.subActivities[activeActivityIndex].audioPromptText!;
                          if (isAudioSpeaking) {
                            offlineAudioService.stopSpeaking();
                          } else {
                            offlineAudioService.speakArabic(text);
                          }
                        }}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border shrink-0 min-h-[40px] transition-all active:scale-95 ${
                          isAudioSpeaking
                            ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs ring-2 ring-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                        }`}
                        title="استمع إلى النطق"
                      >
                        <Volume2 className={`w-3.5 h-3.5 text-amber-600 ${isAudioSpeaking ? 'animate-pulse scale-110' : ''}`} />
                        <span className="font-bold">{isAudioSpeaking ? 'يتم النطق...' : 'استمع'}</span>
                      </button>
                    )}
                  </div>

                  {/* Multiple Choice Options */}
                  {activeLesson.subActivities[activeActivityIndex].options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                      {activeLesson.subActivities[activeActivityIndex].options?.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            disabled={isAnswerChecked}
                            className={`text-right p-3.5 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-between min-h-[48px] active:scale-98 ${
                              isSelected
                                ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                                : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <span>{option}</span>
                            {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Feedback */}
                  {isAnswerChecked && (
                    <div
                      className={`p-3.5 sm:p-4 rounded-xl border-2 animate-in fade-in duration-200 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold mb-1 text-xs sm:text-sm">
                        {isCorrect ? (
                          <>
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>أحسنت! إجابة صحيحة وممتازة 🌟</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>محاولة طيبة! راجع التوضيح وحاول مجدداً 💡</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed">
                        {activeLesson.subActivities[activeActivityIndex].explanation}
                      </p>
                    </div>
                  )}

                  {/* Hint */}
                  {showHint && !isAnswerChecked && (
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-950 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">تلميح ذكي:</span>
                        <span>{activeLesson.subActivities[activeActivityIndex].hint}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Bottom Bar */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevActivity}
                  disabled={activeActivityIndex === 0}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 min-h-[42px] min-w-[42px] flex items-center justify-center active:scale-95"
                  title="النشاط السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-slate-600 hover:text-amber-700 flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 min-h-[42px] active:scale-95"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'إخفاء' : 'تلميح'}</span>
                </button>
              </div>

              <div>
                {!isAnswerChecked ? (
                  <button
                    onClick={() => checkActivityAnswer(activeLesson.subActivities[activeActivityIndex])}
                    disabled={!selectedOption}
                    className="bg-amber-600 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-amber-700 transition-all shadow-xs min-h-[44px] active:scale-95"
                  >
                    تحقق من الإجابة
                  </button>
                ) : (
                  <button
                    onClick={nextActivity}
                    className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 min-h-[44px] active:scale-95"
                  >
                    <span>
                      {activeActivityIndex + 1 < activeLesson.subActivities.length ? 'النشاط التالي' : 'الانتقال للاختبار التقييمي'}
                    </span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* Evaluative Quiz Modal (Quizzes with Full Mark Badge System) */}
      {/* ============================================================= */}
      {activeQuizLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-400 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Quiz Header */}
            <div className="p-4 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between border-b-2 border-amber-300 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Trophy className="w-5 h-5 fill-amber-900" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-sm sm:text-base leading-tight truncate">
                    {activeQuizLesson.quiz.title}
                  </h3>
                  <span className="text-[11px] text-amber-200">
                    5 أسئلة تقييمية • 100% الدرجة الكاملة للأوسمة
                  </span>
                </div>
              </div>

              <button
                onClick={closeQuiz}
                className="p-2 rounded-xl bg-amber-900/40 text-amber-100 hover:text-white hover:bg-amber-900/80 shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center active:scale-90"
                aria-label="إغلاق الاختبار"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Quiz Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
              {!isQuizFinished ? (
                <>
                  {/* Question Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>السؤال {quizQuestionIndex + 1} من {activeQuizLesson.quiz.questions.length}</span>
                      <span className="text-amber-700 font-black">النقاط: {quizScore} / {activeQuizLesson.quiz.questions.length}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
                        style={{
                          width: `${((quizQuestionIndex + 1) / activeQuizLesson.quiz.questions.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Active Question */}
                  {activeQuizLesson.quiz.questions[quizQuestionIndex] && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                          {activeQuizLesson.quiz.questions[quizQuestionIndex].prompt}
                        </h4>
                        <button
                          onClick={() => offlineAudioService.speakArabic(activeQuizLesson.quiz.questions[quizQuestionIndex].prompt)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border shrink-0 min-h-[36px] transition-all active:scale-95 ${
                            isAudioSpeaking
                              ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                          title="استمع للسؤال"
                        >
                          <Volume2 className={`w-3.5 h-3.5 text-amber-600 ${isAudioSpeaking ? 'animate-pulse' : ''}`} />
                          <span className="font-bold">{isAudioSpeaking ? 'استماع...' : 'استمع'}</span>
                        </button>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {activeQuizLesson.quiz.questions[quizQuestionIndex].options.map((option, idx) => {
                          const isSelected = quizSelectedOption === option;
                          const isChecked = isQuizQuestionChecked;
                          const isCorrectOption = option === activeQuizLesson.quiz.questions[quizQuestionIndex].correctAnswer;

                          let btnStyle = 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800';
                          if (isSelected) btnStyle = 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs';
                          if (isChecked && isCorrectOption) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                          if (isChecked && isSelected && !isCorrectOption) btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';

                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuizOptionSelect(option)}
                              disabled={isQuizQuestionChecked}
                              className={`text-right p-3.5 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-between min-h-[48px] active:scale-98 ${btnStyle}`}
                            >
                              <span>{option}</span>
                              {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Immediate Explanation */}
                      {isQuizQuestionChecked && (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 animate-in fade-in">
                          <span className="font-bold text-slate-800 block">التوضيح التعليمي:</span>
                          <p className="text-slate-600 leading-relaxed">
                            {activeQuizLesson.quiz.questions[quizQuestionIndex].explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Quiz Final Score & Celebration Screen */
                <div className="text-center py-6 px-3 space-y-4">
                  {quizScore === activeQuizLesson.quiz.questions.length ? (
                    <div className="w-20 h-20 bg-amber-100 border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md animate-bounce">
                      🏆
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                      🌟
                    </div>
                  )}

                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                      {quizScore === activeQuizLesson.quiz.questions.length
                        ? '🎉 مبارك! حققت العلامة الكاملة (100%)'
                        : 'أحسنت! أتممت الاختبار بنجاح'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                      {quizScore === activeQuizLesson.quiz.questions.length
                        ? 'إنجاز باهر! لقد أجبت عن جميع الأسئلة بصحة تامة ونلت وسام العلامة الكاملة والنجوم الذهبية.'
                        : 'نتيجة ممتازة! يمكنك دائماً إعادة الاختبار لتحقيق العلامة الكاملة 100% وفتح وسام التفوق.'}
                    </p>
                  </div>

                  {/* Score Card */}
                  <div className="flex items-center justify-center gap-3 py-2">
                    <div className="bg-amber-50 border-2 border-amber-300 px-5 py-3 rounded-2xl text-center">
                      <span className="block text-2xl font-black text-amber-800">
                        {quizScore} / {activeQuizLesson.quiz.questions.length}
                      </span>
                      <span className="text-[11px] font-bold text-amber-700">الدرجة النهائية</span>
                    </div>

                    <div className="bg-emerald-50 border-2 border-emerald-300 px-5 py-3 rounded-2xl text-center">
                      <span className="block text-2xl font-black text-emerald-800">
                        {Math.round((quizScore / activeQuizLesson.quiz.questions.length) * 100)}%
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">النسبة المئوية</span>
                    </div>
                  </div>

                  {/* Unlocked Badges Notice */}
                  {newlyUnlockedBadge && (
                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-center gap-3 animate-in zoom-in-95 border-2 border-amber-300">
                      <Award className="w-6 h-6 text-amber-300 fill-amber-300 shrink-0" />
                      <div className="text-right">
                        <span className="text-[11px] text-purple-200 block font-medium">مبارك! فزت بوسام جديد:</span>
                        <span className="text-sm sm:text-base font-black text-amber-200">«{newlyUnlockedBadge}»</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-center gap-2.5">
                    <button
                      onClick={closeQuiz}
                      className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-slate-800 min-h-[44px] active:scale-95"
                    >
                      العودة للدروس
                    </button>
                    <button
                      onClick={() => startQuiz(activeQuizLesson)}
                      className="bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-amber-700 min-h-[44px] active:scale-95 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>إعادة الاختبار</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Sticky Footer */}
            {!isQuizFinished && (
              <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
                <span className="text-xs text-slate-500">
                  اختر الإجابة ثم اضغط «تأكيد الإجابة»
                </span>

                <div>
                  {!isQuizQuestionChecked ? (
                    <button
                      onClick={() => checkQuizQuestion(activeQuizLesson.quiz.questions[quizQuestionIndex])}
                      disabled={!quizSelectedOption}
                      className="bg-amber-600 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-amber-700 transition-all shadow-xs min-h-[44px] active:scale-95"
                    >
                      تأكيد الإجابة
                    </button>
                  ) : (
                    <button
                      onClick={nextQuizQuestion}
                      className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 min-h-[44px] active:scale-95"
                    >
                      <span>
                        {quizQuestionIndex + 1 < activeQuizLesson.quiz.questions.length ? 'السؤال التالي' : 'عرض النتيجة النهائية'}
                      </span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
