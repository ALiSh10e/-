/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService, StudentProgress } from './services/storageService';
import { offlineAudioService } from './services/audioService';
import { GRADES_DATA } from './data/curriculumData';
import { Header, AppTab } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { LessonsView } from './components/LessonsView';
import { StoriesView } from './components/StoriesView';
import { LetterLibraryView } from './components/LetterLibraryView';
import { InteractiveActivitiesView } from './components/InteractiveActivitiesView';
import { AudioLabView } from './components/AudioLabView';
import { ParentDashboardView } from './components/ParentDashboardView';
import { Award, Heart, X, BookOpen, BookmarkCheck, PenTool, Gamepad2, Mic, Users, Code } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => StorageService.loadProgress());
  const [activeTab, setActiveTab] = useState<AppTab>('lessons');
  const [newBadgeNotification, setNewBadgeNotification] = useState<string | null>(null);

  useEffect(() => {
    // Sync sound state on initial load
    offlineAudioService.setMuted(!progress.soundEnabled);
  }, [progress.soundEnabled]);

  const handleToggleSound = () => {
    const updated = { ...progress, soundEnabled: !progress.soundEnabled };
    offlineAudioService.setMuted(!updated.soundEnabled);
    if (updated.soundEnabled) {
      offlineAudioService.playCorrectSound();
    }
    StorageService.saveProgress(updated);
    setProgress(updated);
  };

  const handleSelectGrade = (gradeId: number) => {
    const updated = StorageService.setGrade(gradeId);
    setProgress(updated);
  };

  const handleProgressUpdate = (newProg: StudentProgress) => {
    setProgress(newProg);
  };

  const handleBadgeUnlocked = (badgeTitle: string) => {
    setNewBadgeNotification(badgeTitle);
    offlineAudioService.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const currentGrade = GRADES_DATA.find(g => g.id === progress.selectedGradeId) || GRADES_DATA[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden pb-20 sm:pb-0">
      {/* App Header */}
      <Header
        progress={progress}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleSound={handleToggleSound}
      />

      {/* Floating Badge Notification */}
      {newBadgeNotification && (
        <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-50 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center justify-between sm:justify-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 fill-amber-300 animate-bounce shrink-0" />
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-purple-200">🎉 مبارك! تم فتح وسام تشجيعي جديد:</div>
              <div className="text-sm sm:text-base font-black text-amber-200">«{newBadgeNotification}»</div>
            </div>
          </div>
          <button
            onClick={() => setNewBadgeNotification(null)}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container Optimized for Mobile & Desktop */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 w-full">
        {/* Grade Selection Card (shown in curriculum and games view) */}
        {(activeTab === 'lessons' || activeTab === 'games') && (
          <GradeSelector
            selectedGradeId={progress.selectedGradeId}
            progress={progress}
            onSelectGrade={handleSelectGrade}
          />
        )}

        {/* Tab 1: Lessons & Curriculum */}
        {activeTab === 'lessons' && (
          <LessonsView
            currentGrade={currentGrade}
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
            onBadgeUnlocked={handleBadgeUnlocked}
          />
        )}

        {/* Tab 2: 50 Stories Library per Grade (300 Stories) */}
        {activeTab === 'stories' && (
          <StoriesView
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
            onBadgeUnlocked={handleBadgeUnlocked}
          />
        )}

        {/* Tab 3: Alphabet Letters & Finger Tracing */}
        {activeTab === 'letters' && (
          <LetterLibraryView />
        )}

        {/* Tab 4: Interactive Activities & Games */}
        {activeTab === 'games' && (
          <InteractiveActivitiesView
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {/* Tab 5: Local Audio & Voice Self-Check Lab */}
        {activeTab === 'audioLab' && (
          <AudioLabView />
        )}

        {/* Tab 6: Parent & Student Dashboard with Badges Showcase */}
        {activeTab === 'parents' && (
          <ParentDashboardView
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </main>

      {/* Clean & Elegant App Footer with Prominent Community Initiative Credit */}
      <footer className="bg-slate-900 text-slate-300 text-xs pt-8 pb-16 sm:pb-8 border-t-2 border-emerald-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-4 text-center">
          {/* Main App Title in Footer */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="w-3 h-3 rounded-full bg-white"></span>
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="font-black text-white text-base sm:text-lg">تطبيق «أَقْرَأُهَا صَحّ» لتعليم العربية</span>
          </div>

          {/* Explicit Developer & Community Initiative Credit */}
          <div className="bg-slate-800/90 border border-slate-700/80 px-5 py-3 rounded-2xl shadow-sm max-w-xl mx-auto flex items-center justify-center gap-2.5 text-emerald-300 font-bold text-xs sm:text-sm">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />
            <span>تم التطوير بواسطة مبادرة مجتمعية م/ شوقي حسن الجعور</span>
          </div>

          <p className="text-slate-400 text-[11px] sm:text-xs max-w-md mx-auto leading-relaxed">
            مبادرة تعليمية تطوعية غير ربحية موجهة لتلاميذ مرحلة التعليم الأساسي لغرس إتقان القراءة والكتابة والإملاء والقواعد بلغة الضاد.
          </p>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Quick Navigation Bar (for screens < 640px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setActiveTab('lessons');
            offlineAudioService.playClickSound();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold min-h-[44px] transition-all ${
            activeTab === 'lessons' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>الدروس</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('stories');
            offlineAudioService.playClickSound();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold min-h-[44px] transition-all ${
            activeTab === 'stories' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-slate-500'
          }`}
        >
          <BookmarkCheck className="w-4 h-4 mb-0.5" />
          <span>القصص</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('letters');
            offlineAudioService.playClickSound();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold min-h-[44px] transition-all ${
            activeTab === 'letters' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-slate-500'
          }`}
        >
          <PenTool className="w-4 h-4 mb-0.5" />
          <span>الحروف</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('games');
            offlineAudioService.playClickSound();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold min-h-[44px] transition-all ${
            activeTab === 'games' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-slate-500'
          }`}
        >
          <Gamepad2 className="w-4 h-4 mb-0.5" />
          <span>الألعاب</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('parents');
            offlineAudioService.playClickSound();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold min-h-[44px] transition-all ${
            activeTab === 'parents' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-slate-500'
          }`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>الأوسمة</span>
        </button>
      </div>
    </div>
  );
}
