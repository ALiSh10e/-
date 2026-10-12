export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'starter' | 'lessons' | 'reading' | 'grammar' | 'spelling' | 'mastery' | 'quiz';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  checkUnlocked: (stats: {
    completedLessonsCount: number;
    totalScore: number;
    starsEarned: number;
    storiesReadCount: number;
    accuracy: number;
    perfectQuizCount?: number;
  }) => boolean;
}

export const BADGES_LIST: BadgeDefinition[] = [
  {
    id: 'first-step',
    title: 'الخطوة الأولى',
    description: 'إكمال أول درس بنجاح وبداية رحلة التعلّم الممتعة',
    icon: 'Footprints',
    category: 'starter',
    rarity: 'common',
    requirement: 'إكمال درس واحد',
    checkUnlocked: (s) => s.completedLessonsCount >= 1
  },
  {
    id: 'perfect-score',
    title: 'العلامة الكاملة',
    description: 'الحصول على الدرجة الكاملة 100% في الاختبار التقييمي لأحد الدروس',
    icon: 'Trophy',
    category: 'quiz',
    rarity: 'rare',
    requirement: 'نيل 100% في اختبار تقييمي',
    checkUnlocked: (s) => (s.perfectQuizCount || 0) >= 1
  },
  {
    id: 'young-genius',
    title: 'العبقري الصغير',
    description: 'تحقيق الدرجة الكاملة 100% في 3 اختبارات تقييمية متتالية أو متفرقة',
    icon: 'Sparkles',
    category: 'quiz',
    rarity: 'epic',
    requirement: 'نيل 100% في 3 اختبارات تقييمية',
    checkUnlocked: (s) => (s.perfectQuizCount || 0) >= 3
  },
  {
    id: 'quiz-champion',
    title: 'بطل الاختبارات',
    description: 'التفوق المبهر وإحراز العلامة الكاملة في 5 اختبارات تقييمية',
    icon: 'Award',
    category: 'quiz',
    rarity: 'epic',
    requirement: 'نيل 100% في 5 اختبارات تقييمية',
    checkUnlocked: (s) => (s.perfectQuizCount || 0) >= 5
  },
  {
    id: 'mastery-crown',
    title: 'تاج الإتقان الذهبي',
    description: 'الحصول على العلامة الكاملة في 10 اختبارات تقييمية والتتويج بلقب نجم الإتقان',
    icon: 'Crown',
    category: 'quiz',
    rarity: 'legendary',
    requirement: 'نيل 100% في 10 اختبارات تقييمية',
    checkUnlocked: (s) => (s.perfectQuizCount || 0) >= 10
  },
  {
    id: 'letter-hero',
    title: 'بطل الحروف',
    description: 'إتقان نطق وأشكال حروف الهجاء بالحركات',
    icon: 'Sparkles',
    category: 'spelling',
    rarity: 'common',
    requirement: 'إكمال 3 دروس في الحركات والحروف',
    checkUnlocked: (s) => s.completedLessonsCount >= 3
  },
  {
    id: 'young-reader',
    title: 'القارئ الصغير',
    description: 'قراءة أول 5 قصص قصيرة وفهم معانيها',
    icon: 'BookOpen',
    category: 'reading',
    rarity: 'rare',
    requirement: 'قراءة 5 قصص قصيرة',
    checkUnlocked: (s) => s.storiesReadCount >= 5
  },
  {
    id: 'story-explorer',
    title: 'مستكشف الحكايات',
    description: 'قراءة 15 قصة تعليمية والغوص في التراث العربي',
    icon: 'Compass',
    category: 'reading',
    rarity: 'rare',
    requirement: 'قراءة 15 قصة قصيرة',
    checkUnlocked: (s) => s.storiesReadCount >= 15
  },
  {
    id: 'star-collector',
    title: 'جامع النجوم الذهبية',
    description: 'جمع 20 نجمة تفوق من خلال الإجابات الصحيحة',
    icon: 'Star',
    category: 'mastery',
    rarity: 'rare',
    requirement: 'جمع 20 نجمة',
    checkUnlocked: (s) => s.starsEarned >= 20
  },
  {
    id: 'grammar-master',
    title: 'حكيم القواعد',
    description: 'إتقان المبتدأ والخبر والجملة الفعلية والنواسخ',
    icon: 'Award',
    category: 'grammar',
    rarity: 'epic',
    requirement: 'إكمال 6 دروس والحصول على 150 نقطة',
    checkUnlocked: (s) => s.completedLessonsCount >= 6 && s.totalScore >= 150
  },
  {
    id: 'spelling-champion',
    title: 'فارس الإملاء',
    description: 'إتقان الهمزات والتاء المربوطة والتنوين بلا أخطاء',
    icon: 'ShieldCheck',
    category: 'spelling',
    rarity: 'epic',
    requirement: 'دقة إجابات تتجاوز 85% مع إكمال 8 دروس',
    checkUnlocked: (s) => s.completedLessonsCount >= 8 && s.accuracy >= 85
  },
  {
    id: 'yemen-heritage-scholar',
    title: 'علاّمة التراث اليماني',
    description: 'التعرف على معالم ومفردات اليمن من صنعاء إلى شبام ومأرب',
    icon: 'Crown',
    category: 'mastery',
    rarity: 'epic',
    requirement: 'قراءة 30 قصة تعليمية',
    checkUnlocked: (s) => s.storiesReadCount >= 30
  },
  {
    id: 'grand-linguist',
    title: 'سفير لغة الضاد',
    description: 'الوصول إلى قمة التفوق اللغوي في القراءة والإملاء والنحو',
    icon: 'Trophy',
    category: 'mastery',
    rarity: 'legendary',
    requirement: 'إكمال 12 درساً وجمع 300 نقطة و 50 قصة',
    checkUnlocked: (s) => s.completedLessonsCount >= 12 && s.totalScore >= 300 && s.storiesReadCount >= 50
  }
];
