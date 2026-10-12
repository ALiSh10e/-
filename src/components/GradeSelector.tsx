import React from 'react';
import { GRADES_DATA, Grade } from '../data/curriculumData';
import { StudentProgress } from '../services/storageService';
import { offlineAudioService } from '../services/audioService';
import { CheckCircle2, ChevronLeft } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            اختر الصف الدراسي للمرحلة الابتدائية
          </h2>
          <p className="text-xs text-slate-500">
            المحتوى متدرج من الصف الأول حتى السادس مع مفردات وتطبيقات من البيئة والتراث اليمني
          </p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          الدروس المكتملة إجمالاً: <span className="font-bold text-slate-800">{progress.completedLessons.length}</span> درس
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
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
              className={`flex flex-col text-right p-3 rounded-xl border-2 transition-all relative group text-slate-800 ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-200/60'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  الصف {grade.id}
                </span>
                {completedCount > 0 && completedCount === gradeLessonsCount ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ChevronLeft className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-900 mb-1 leading-snug">
                {grade.name}
              </h3>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2 flex-1">
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
    </div>
  );
};
