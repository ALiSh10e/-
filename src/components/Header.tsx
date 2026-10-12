import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, PenTool, Gamepad2, Mic, Users, Award, BookmarkCheck, Heart } from 'lucide-react';
import { StudentProgress } from '../services/storageService';
import { offlineAudioService } from '../services/audioService';

export type AppTab = 'lessons' | 'stories' | 'letters' | 'games' | 'audioLab' | 'parents';

interface HeaderProps {
  progress: StudentProgress;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  onTabChange,
  onToggleSound
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Community Initiative Top Mini-Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-slate-900 to-emerald-950 text-white text-[10px] sm:text-xs py-1 px-3 text-center flex items-center justify-center gap-1.5 border-b border-emerald-600/30">
        <Heart className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0 animate-pulse" />
        <span className="font-semibold text-emerald-100">
          تم التطوير بواسطة مبادرة مجتمعية م/ شوقي حسن الجعور
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-xs border-2 border-emerald-400 shrink-0">
              صَحّ
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                  أَقْرَأُهَا صَحّ
                </h1>
                <span className="text-[9px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 shrink-0">
                  تعلّم العربية
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden xs:block">
                الصفوف 1-6 • قراءة، كتابة، إملاء، وقواعد
              </p>
            </div>
          </div>

          {/* Gamification Stats & Controls (Mobile Optimized) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Badges Badge */}
            <button
              onClick={() => {
                onTabChange('parents');
                offlineAudioService.playClickSound();
              }}
              className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 sm:px-2.5 py-1 rounded-xl text-purple-900 text-[11px] sm:text-xs font-bold transition-all min-h-[36px] active:scale-95"
              title="عرض الأوسمة المكتسبة"
            >
              <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>{progress.unlockedBadges?.length || 1}</span>
              <span className="text-[10px] text-purple-500 font-normal hidden sm:inline">أوسمة</span>
            </button>

            {/* Stars */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 sm:px-2.5 py-1 rounded-xl text-amber-900 text-[11px] sm:text-xs font-bold min-h-[36px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
              <span>{progress.starsEarned}</span>
              <span className="text-[10px] text-amber-600 font-normal hidden md:inline">نجمة</span>
            </div>

            {/* Points / Score */}
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-1 rounded-xl text-emerald-900 text-[11px] sm:text-xs font-bold min-h-[36px]">
              <span className="text-emerald-600 font-black text-xs">⭐</span>
              <span>{progress.totalScore}</span>
              <span className="text-[10px] text-emerald-600 font-normal hidden md:inline">نقطة</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                offlineAudioService.playClickSound();
              }}
              title={progress.soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
              className={`p-2 rounded-xl border transition-all min-h-[36px] min-w-[36px] flex items-center justify-center active:scale-95 ${
                progress.soundEnabled
                  ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                  : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              }`}
              aria-label="التحكم بالصوت"
            >
              {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Chips on Mobile & Tablet */}
        <nav className="flex items-center gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
          <button
            onClick={() => onTabChange('lessons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 min-h-[38px] active:scale-95 ${
              activeTab === 'lessons'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>الدروس والوحدات</span>
          </button>

          <button
            onClick={() => onTabChange('stories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 min-h-[38px] active:scale-95 ${
              activeTab === 'stories'
                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span>مكتبة القصص (300)</span>
          </button>

          <button
            onClick={() => onTabChange('letters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 min-h-[38px] active:scale-95 ${
              activeTab === 'letters'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>الحروف والتتبع</span>
          </button>

          <button
            onClick={() => onTabChange('games')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 min-h-[38px] active:scale-95 ${
              activeTab === 'games'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>الأنشطة والألعاب</span>
          </button>

          <button
            onClick={() => onTabChange('audioLab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 min-h-[38px] active:scale-95 ${
              activeTab === 'audioLab'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>مختبر النطق</span>
          </button>

          <button
            onClick={() => onTabChange('parents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 min-h-[38px] active:scale-95 ${
              activeTab === 'parents'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span>لوحة الأوسمة</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
