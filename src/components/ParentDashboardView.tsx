import React, { useState } from 'react';
import { StudentProgress, StorageService } from '../services/storageService';
import { BADGES_LIST, BadgeDefinition } from '../data/badgesData';
import { offlineAudioService } from '../services/audioService';
import {
  Users,
  Award,
  Sparkles,
  RotateCcw,
  Download,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  BookOpen,
  Check,
  Lock,
  Unlock,
  Star,
  BookmarkCheck,
  Trophy,
  Crown
} from 'lucide-react';

interface ParentDashboardViewProps {
  progress: StudentProgress;
  onProgressUpdate: (p: StudentProgress) => void;
}

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({
  progress,
  onProgressUpdate
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleReset = () => {
    const fresh = StorageService.resetProgress();
    onProgressUpdate(fresh);
    setShowResetConfirm(false);
    offlineAudioService.playClickSound();
  };

  const handleExportData = () => {
    const report = {
      app: "أقرأها صح – تعلّم العربية",
      version: "1.3.0",
      exportDate: new Date().toLocaleDateString('ar-YE'),
      completedLessonsCount: progress.completedLessons.length,
      readStoriesCount: progress.readStories.length,
      perfectQuizCount: progress.perfectQuizCount || 0,
      quizResults: progress.quizResults || {},
      totalScore: progress.totalScore,
      starsEarned: progress.starsEarned,
      badges: progress.badges,
      unlockedBadges: progress.unlockedBadges,
      skillScores: progress.skillScores,
      stats: progress.attemptStats
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_إنجاز_أقرأها_صح_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  const totalAttempts = progress.attemptStats.correctAttempts + progress.attemptStats.wrongAttempts;
  const accuracy = totalAttempts > 0
    ? Math.round((progress.attemptStats.correctAttempts / totalAttempts) * 100)
    : 100;

  const unlockedCount = progress.unlockedBadges?.length || 1;
  const quizResultsList = Object.values(progress.quizResults || {});
  const perfectQuizzes = progress.perfectQuizCount || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-emerald-500">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black">
              لوحة المتابعة وتتبع الاختبارات التقييمية
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            ملخص دقيق لإنجازات التلميذ، نتائج الاختبارات التقييمية، والأوسمة المكتسبة لنيل العلامة الكاملة.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">الأوسمة المحققة:</span>
            <span className="text-xs font-bold text-amber-300">{unlockedCount} من {BADGES_LIST.length} وساماً</span>
          </div>
        </div>
      </div>

      {/* Main Metrics Cards (Responsive Mobile-Friendly Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Full Mark Quizzes Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-4 rounded-2xl border-2 border-amber-300 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 mb-1">
            <Trophy className="w-4 h-4 text-amber-700 fill-amber-500" />
            <span className="text-xs font-black">العلامة الكاملة</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-950 block">
            {perfectQuizzes}
          </span>
          <span className="text-[11px] text-amber-800 font-medium">اختبارات بنتيجة 100%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Sparkles className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-bold">النجوم</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {progress.starsEarned}
          </span>
          <span className="text-[11px] text-slate-400">مكافآت الإتقان</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-bold">مجموع النقاط</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {progress.totalScore}
          </span>
          <span className="text-[11px] text-slate-400">نقاط المعرفة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-sky-600 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold">الدروس المنجزة</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {progress.completedLessons.length}
          </span>
          <span className="text-[11px] text-slate-400">درس تفاعلي (32 نشاطاً)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span className="text-xs font-bold">القصص المقروءة</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {progress.readStories?.length || 0}
          </span>
          <span className="text-[11px] text-slate-400">قصة مكتملة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold">دقة الإجابات</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {accuracy}%
          </span>
          <span className="text-[11px] text-slate-400">{progress.attemptStats.correctAttempts} محاولة صحيحة</span>
        </div>
      </div>

      {/* Evaluative Quizzes Tracker Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                سجل نتائج الاختبارات التقييمية (Quizzes Tracker)
              </h3>
              <p className="text-xs text-slate-500">
                متابعة الدرجات والنسب المئوية ومكافآت العلامة الكاملة لكل درس.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 block">
              {quizResultsList.length} اختبارات منجزة
            </span>
            <span className="text-[11px] font-black text-amber-700">
              {perfectQuizzes} علامة كاملة 100%
            </span>
          </div>
        </div>

        {quizResultsList.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <span>لم يخض التلميذ أي اختبار تقييمي بعد. خُض الاختبار بعد كل درس للحصول على أوسمة العلامة الكاملة!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {quizResultsList.map((q, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  q.fullMarks
                    ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-bold text-slate-900">درس #{q.lessonId}</span>
                    {q.fullMarks && (
                      <span className="bg-amber-400 text-amber-950 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                        <Trophy className="w-3 h-3 fill-current" />
                        100% كاملة
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    النتيجة: {q.bestScore} من {q.maxScore} • {q.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400">المحاولات: {q.attempts}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-base font-black ${q.fullMarks ? 'text-amber-700' : 'text-slate-700'}`}>
                    {q.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges & Rewards Showcase (الأوسمة والمكافآت التفاعلية) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                لوحة الأوسمة والمكافآت التقديرية (Badges Showcase)
              </h3>
              <p className="text-xs text-slate-500">
                أكمل الدروس والأنشطة الـ 32 ونل 100% في الاختبارات لفتح جميع الأوسمة!
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            {unlockedCount} / {BADGES_LIST.length} وساماً
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {BADGES_LIST.map((badge: BadgeDefinition) => {
            const unlockedInfo = progress.unlockedBadges?.find(b => b.id === badge.id);
            const isUnlocked = !!unlockedInfo || progress.badges?.includes(badge.title);
            const isQuizBadge = badge.category === 'quiz';

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 relative ${
                  isUnlocked
                    ? isQuizBadge
                      ? 'border-amber-400 bg-gradient-to-br from-amber-100/70 via-amber-50 to-amber-100/40 shadow-xs ring-1 ring-amber-300'
                      : 'border-amber-400 bg-gradient-to-br from-amber-50/80 to-amber-100/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                {/* Badge Icon Medal */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
                  isUnlocked
                    ? isQuizBadge
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-300'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-300'
                    : 'bg-slate-200 text-slate-400 border-slate-300'
                }`}>
                  {isUnlocked ? (
                    isQuizBadge ? <Trophy className="w-6 h-6 fill-amber-200 text-amber-900" /> : <Award className="w-6 h-6 fill-amber-200" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        محقق
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-md">
                        مغلق
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-2">
                    {badge.description}
                  </p>

                  <div className="text-[10px] text-amber-800 bg-white/80 p-1.5 rounded-lg border border-amber-100 flex items-center gap-1">
                    <span className="font-bold">المطلوب:</span>
                    <span className="truncate">{badge.requirement}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings & Export Progress Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">
            إعدادات وتقرير الإنجاز
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800">تصدير تقرير الإنجاز الكامل</h4>
            <p className="text-xs text-slate-500">احفظ بطاقة إنجاز تقدم التلميذ مع درجات الاختبارات التقييمية</p>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-300 min-h-[42px] active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>تصدير التقرير (JSON)</span>
          </button>
        </div>

        {exportNotice && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تم تصدير تقرير الإنجاز بنجاح إلى ملف التنزيلات.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-red-600">إعادة تعيين التقدم</h4>
            <p className="text-xs text-slate-500">مسح نتائج الأسئلة والنقاط والاختبارات لبدء دورة جديدة للطفل</p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-200 min-h-[42px] active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة ضبط النتائج</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              هل أنت متأكد من إعادة ضبط النتائج والأوسمة؟
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              سيتم تصفير النقاط والنجوم ونتائج الاختبارات التقييمية والأوسمة المكتسبة وإرجاع التطبيق للحالة الابتدائية.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 min-h-[42px]"
              >
                إلغاء الأمر
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 min-h-[42px]"
              >
                نعم، ابدأ من جديد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
