import { BADGES_LIST, BadgeDefinition } from '../data/badgesData';

export interface UnlockedBadgeInfo {
  id: string;
  unlockedAt: string;
}

export interface QuizResult {
  lessonId: string;
  bestScore: number;
  maxScore: number;
  percentage: number;
  fullMarks: boolean;
  attempts: number;
  completedAt: string;
}

export interface StudentProgress {
  selectedGradeId: number;
  completedLessons: string[];
  readStories: string[];
  quizResults: Record<string, QuizResult>;
  perfectQuizCount: number;
  totalScore: number;
  starsEarned: number;
  badges: string[]; // backward-compatible list of badge titles
  unlockedBadges: UnlockedBadgeInfo[];
  skillScores: {
    phonics: number;      // الوعي الصوتي
    reading: number;      // القراءة
    writing: number;      // الكتابة والتتبع
    grammar: number;      // القواعد والتراكيب
    spelling: number;     // الإملاء والظواهر اللغوية
  };
  attemptStats: {
    correctAttempts: number;
    wrongAttempts: number;
  };
  audioSpeechRate: number;
  soundEnabled: boolean;
  fontSize: 'normal' | 'large' | 'huge';
  lastUpdated: string;
}

const STORAGE_KEY = 'aqraha_sah_learning_progress_v3';

const DEFAULT_PROGRESS: StudentProgress = {
  selectedGradeId: 1,
  completedLessons: [],
  readStories: [],
  quizResults: {},
  perfectQuizCount: 0,
  totalScore: 0,
  starsEarned: 0,
  badges: ['الخطوة الأولى'],
  unlockedBadges: [{ id: 'first-step', unlockedAt: new Date().toISOString() }],
  skillScores: {
    phonics: 80,
    reading: 80,
    writing: 75,
    grammar: 75,
    spelling: 75
  },
  attemptStats: {
    correctAttempts: 0,
    wrongAttempts: 0
  },
  audioSpeechRate: 0.85,
  soundEnabled: true,
  fontSize: 'normal',
  lastUpdated: new Date().toISOString()
};

export class StorageService {
  public static loadProgress(): StudentProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('aqraha_sah_learning_progress_v2');
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          readStories: parsed.readStories || [],
          quizResults: parsed.quizResults || {},
          perfectQuizCount: parsed.perfectQuizCount || 0,
          unlockedBadges: parsed.unlockedBadges || [{ id: 'first-step', unlockedAt: new Date().toISOString() }]
        };
      }
    } catch {
      // Storage fallback
    }
    return DEFAULT_PROGRESS;
  }

  public static saveProgress(progress: StudentProgress): void {
    try {
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Storage fallback
    }
  }

  public static evaluateNewBadges(p: StudentProgress): string[] {
    const newlyUnlockedTitles: string[] = [];
    const totalAttempts = p.attemptStats.correctAttempts + p.attemptStats.wrongAttempts;
    const accuracy = totalAttempts > 0
      ? Math.round((p.attemptStats.correctAttempts / totalAttempts) * 100)
      : 100;

    const stats = {
      completedLessonsCount: p.completedLessons.length,
      totalScore: p.totalScore,
      starsEarned: p.starsEarned,
      storiesReadCount: p.readStories.length,
      accuracy,
      perfectQuizCount: p.perfectQuizCount || 0
    };

    BADGES_LIST.forEach((badge: BadgeDefinition) => {
      const isAlreadyUnlocked = p.unlockedBadges.some(b => b.id === badge.id);
      if (!isAlreadyUnlocked && badge.checkUnlocked(stats)) {
        p.unlockedBadges.push({
          id: badge.id,
          unlockedAt: new Date().toISOString()
        });
        if (!p.badges.includes(badge.title)) {
          p.badges.push(badge.title);
        }
        newlyUnlockedTitles.push(badge.title);
      }
    });

    return newlyUnlockedTitles;
  }

  public static markLessonComplete(lessonId: string, earnedScore: number = 25, earnedStars: number = 3): { progress: StudentProgress; newBadges: string[] } {
    const p = this.loadProgress();
    if (!p.completedLessons.includes(lessonId)) {
      p.completedLessons.push(lessonId);
      p.totalScore += earnedScore;
      p.starsEarned += earnedStars;
      p.attemptStats.correctAttempts += 1;
      p.skillScores.reading = Math.min(100, p.skillScores.reading + 2);
      p.skillScores.grammar = Math.min(100, p.skillScores.grammar + 2);
    }

    const newBadges = this.evaluateNewBadges(p);
    this.saveProgress(p);
    return { progress: p, newBadges };
  }

  public static recordQuizResult(
    lessonId: string,
    score: number,
    maxScore: number
  ): { progress: StudentProgress; newBadges: string[]; isFullMarks: boolean } {
    const p = this.loadProgress();
    const isFullMarks = score === maxScore && maxScore > 0;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const currentResult = p.quizResults[lessonId];
    const prevFullMarks = currentResult?.fullMarks || false;

    // Award points and stars for quiz completion
    const pointsGained = score * 10;
    p.totalScore += pointsGained;
    p.attemptStats.correctAttempts += score;
    p.attemptStats.wrongAttempts += Math.max(0, maxScore - score);

    if (isFullMarks) {
      p.starsEarned += 5; // Bonus 5 golden stars for full marks
      if (!prevFullMarks) {
        p.perfectQuizCount = (p.perfectQuizCount || 0) + 1;
      }
    } else {
      p.starsEarned += 2;
    }

    p.quizResults[lessonId] = {
      lessonId,
      bestScore: Math.max(currentResult?.bestScore || 0, score),
      maxScore,
      percentage: Math.max(currentResult?.percentage || 0, percentage),
      fullMarks: prevFullMarks || isFullMarks,
      attempts: (currentResult?.attempts || 0) + 1,
      completedAt: new Date().toISOString()
    };

    const newBadges = this.evaluateNewBadges(p);
    this.saveProgress(p);
    return { progress: p, newBadges, isFullMarks };
  }

  public static markStoryRead(storyId: string): { progress: StudentProgress; newBadges: string[] } {
    const p = this.loadProgress();
    if (!p.readStories.includes(storyId)) {
      p.readStories.push(storyId);
      p.totalScore += 15;
      p.starsEarned += 1;
      p.skillScores.reading = Math.min(100, p.skillScores.reading + 3);
    }

    const newBadges = this.evaluateNewBadges(p);
    this.saveProgress(p);
    return { progress: p, newBadges };
  }

  public static recordQuestionAttempt(isCorrect: boolean, category: keyof StudentProgress['skillScores'] = 'phonics'): StudentProgress {
    const p = this.loadProgress();
    if (isCorrect) {
      p.attemptStats.correctAttempts += 1;
      p.totalScore += 10;
      p.skillScores[category] = Math.min(100, p.skillScores[category] + 2);
    } else {
      p.attemptStats.wrongAttempts += 1;
    }
    this.evaluateNewBadges(p);
    this.saveProgress(p);
    return p;
  }

  public static setGrade(gradeId: number): StudentProgress {
    const p = this.loadProgress();
    p.selectedGradeId = gradeId;
    this.saveProgress(p);
    return p;
  }

  public static resetProgress(): StudentProgress {
    const fresh = { ...DEFAULT_PROGRESS, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}
