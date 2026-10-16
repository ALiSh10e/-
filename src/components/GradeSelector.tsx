import React, { useState } from 'react';
import { GRADES_DATA, Grade } from '../data/curriculumData';
import { StudentProgress } from '../services/storageService';
import { offlineAudioService } from '../services/audioService';
import { CheckCircle2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

interface GradeSelectorProps {
  selectedGradeId: number;
  progress: StudentProgress;
  onSelectGrade: (gradeId: number) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGradeId,
  progress,
  onSelectGrade
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const selectedGrade = GRADES_DATA.find(g => g.id === selectedGradeId) || GRADES_DATA[0];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-xs mb-4 sm:mb-6 transition-all">
      {/* Sleek Compact Row: Grade Chips + Active Info + Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Active Grade Title & Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg shrink-0">
                الصف {selectedGrade.id}
              </span>
              <h2 className="font-black text-slate-900 text-sm sm:text-base truncate">
                {selectedGrade.name}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 hidden sm:block">
              {selectedGrade.levelDescription}
            </p>
          </div>
        </div>

        {/* Center: Compact Quick Grade Chips (1 to 6) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {GRADES_DATA.map((grade: Grade) => {
            const isSelected = grade.id === selectedGradeId;
            const gradeLessonsCount = grade.units.reduce((acc, u) => acc + u.lessons.length, 0);
            const completedCount = grade.units.reduce((acc, u) => {
              return acc + u.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
            }, 0);
            const isAllDone = completedCount > 0 && completedCount === gradeLessonsCount;

            return (
              <button
                key={grade.id}
                onClick={() => {
                  onSelectGrade(grade.id);
                  offlineAudioService.playClickSound();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[38px] active:scale-95 border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={`${grade.name} (${completedCount}/${gradeLessonsCount} درس مكتمل)`}
              >
                <span>الصف {grade.id}</span>
                {isAllDone ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-emerald-600'}`} />
                ) : (
                  <span className={`text-[10px] px-1 py-0.2 rounded-md ${
                    isSelected ? 'bg-amber-700 text-amber-100' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {completedCount}/{gradeLessonsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Toggle Full Details Button */}
        <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
          <div className="text-[11px] text-slate-500 font-medium lg:hidden">
            المنجز: <span className="font-bold text-slate-800">{progress.completedLessons.length}</span> درس
          </div>
          <button
            onClick={() => {
              setShowFullDetails(!showFullDetails);
              offlineAudioService.playClickSound();
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 shrink-0"
            title="عرض أو إخفاء تفاصيل الصفوف الكاملة"
          >
            <span>{showFullDetails ? 'إخفاء التفاصيل' : 'تفاصيل الصفوف'}</span>
            {showFullDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Optional Expanded Grade Cards Grid */}
      {showFullDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3.5 mt-3 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
          {GRADES_DATA.map((grade: Grade) => {
            const isSelected = grade.id === selectedGradeId;
            const gradeLessonsCount = grade.units.reduce((acc, u) => acc + u.lessons.length, 0);
            const completedCount = grade.units.reduce((acc, u) => {
              return acc + u.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
            }, 0);

            return (
              <button
                key={grade.id}
                onClick={() => {
                  onSelectGrade(grade.id);
                  offlineAudioService.playClickSound();
                }}
                className={`flex flex-col text-right p-3 rounded-xl border-2 transition-all relative text-slate-800 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-200'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    الصف {grade.id}
                  </span>
                  {completedCount > 0 && completedCount === gradeLessonsCount && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-1 leading-snug">
                  {grade.name}
                </h3>

                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2 flex-1">
                  {grade.levelDescription}
                </p>

                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span>الإنجاز:</span>
                  <span className="font-bold text-slate-700">{completedCount}/{gradeLessonsCount}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
