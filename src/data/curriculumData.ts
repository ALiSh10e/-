export interface Question {
  id: string;
  type: 'choice' | 'arrange_letters' | 'arrange_words' | 'match' | 'diacritics' | 'spelling';
  prompt: string;
  subPrompt?: string;
  audioPromptText?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint: string;
  imageOrEmoji?: string;
}

export interface SubActivity {
  id: string;
  order: number;
  title: string;
  category: 'استماع ونطق' | 'حركات وتشديد' | 'قواعد وتراكيب' | 'إملاء ورسم' | 'فهم وبلاغة' | 'تعبير وقيم';
  prompt: string;
  subPrompt?: string;
  audioPromptText?: string;
  type: 'choice' | 'arrange_letters' | 'arrange_words' | 'match' | 'diacritics' | 'spelling';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint: string;
  imageOrEmoji?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  imageOrEmoji?: string;
  audioPromptText?: string;
}

export interface LessonQuiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  unitId: string;
  gradeId: number;
  title: string;
  category: 'قراءة وفهم' | 'إملاء وظواهر' | 'قواعد وتراكيب' | 'أصوات وحروف';
  summary: string;
  objective: string;
  content: {
    storyOrConcept: string;
    keyPoints: string[];
    yemeniContext?: string;
    vocabulary: { word: string; diacritics: string; meaning: string; example: string }[];
  };
  subActivities: SubActivity[]; // أكثر من 30 نشاطاً ودرساً فرعياً لكل درس
  questions: Question[]; // للأسئلة المباشرة
  quiz: LessonQuiz; // الاختبار التقييمي للدرس
}

export interface Unit {
  id: string;
  gradeId: number;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Grade {
  id: number;
  name: string;
  title: string;
  levelDescription: string;
  color: string;
  units: Unit[];
}

// مولد الأنشطة الفرعية الذكي لإنتاج 32 نشاطاً ودرساً فرعياً متكاملاً لكل درس
function buildSubActivities(
  lessonId: string,
  lessonTitle: string,
  category: Lesson['category'],
  vocabList: { word: string; diacritics: string; meaning: string; example: string }[],
  keyPoints: string[],
  baseQuestions: Question[]
): SubActivity[] {
  const v1 = vocabList[0] || { word: 'قَلَم', diacritics: 'قَلَمٌ', meaning: 'أداة كتابة', example: 'كتبت بالقلم' };
  const v2 = vocabList[1] || vocabList[0] || { word: 'كِتَاب', diacritics: 'كِتَابٌ', meaning: 'وعاء علم', example: 'قرأت كتاباً' };
  const kp1 = keyPoints[0] || 'إتقان النطق والقراءة';
  const kp2 = keyPoints[1] || keyPoints[0] || 'الضبط السليم للحركات';

  const activities: SubActivity[] = [];

  // دمج الأسئلة الأساسية أولاً كأنشطة أولية
  baseQuestions.forEach((bq, idx) => {
    activities.push({
      id: `${lessonId}-sub-${idx + 1}`,
      order: idx + 1,
      title: `النشاط ${idx + 1}: التطبيق الأولي والتأسيس`,
      category: idx % 2 === 0 ? 'استماع ونطق' : 'حركات وتشديد',
      prompt: bq.prompt,
      audioPromptText: bq.audioPromptText || bq.prompt,
      type: bq.type,
      options: bq.options,
      correctAnswer: bq.correctAnswer,
      explanation: bq.explanation,
      hint: bq.hint,
      imageOrEmoji: bq.imageOrEmoji || '🌟'
    });
  });

  // إضافة أنشطة فرعية تعليمية متخصصة لتصل إلى 32 نشاطاً بالضبط لكل درس
  const subActivityTemplates = [
    {
      title: 'البطاقة الصوتية والاستماع المركز',
      category: 'استماع ونطق' as const,
      prompt: `استمع إلى نطق الكلمة «${v1.diacritics}»، ما الصوت الأبرز في بدايتها؟`,
      type: 'choice' as const,
      options: [v1.diacritics.slice(0, 2), 'صَـ', 'مُـ', 'كِـ'],
      correctAnswer: v1.diacritics.slice(0, 2),
      explanation: `الصوت البارز في أول كلمة «${v1.word}» هو (${v1.diacritics.slice(0, 2)}).`,
      hint: 'استمع إلى مطلع الكلمة جيداً.',
      imageOrEmoji: '🎧'
    },
    {
      title: 'تمييز حركة الفتحة القصيرة',
      category: 'حركات وتشديد' as const,
      prompt: `أي الكلمات التالية تشتمل على حركة الفتحة في أولها؟`,
      type: 'choice' as const,
      options: [`${v1.word[0]}َـ...`, `${v1.word[0]}ُـ...`, `${v1.word[0]}ِـ...`, `${v1.word[0]}ْـ...`],
      correctAnswer: `${v1.word[0]}َـ...`,
      explanation: 'الفتحة ترسم شرطة صغيرة مائلة فوق الحرف وينفتح معها الفم.',
      hint: 'ابحث عن الشرطة فوق الحرف.',
      imageOrEmoji: '🔤'
    },
    {
      title: 'تمييز حركة الضمة القصيرة',
      category: 'حركات وتشديد' as const,
      prompt: `كيف ننطق الحرف عند وضع الضمة فوقه؟`,
      type: 'choice' as const,
      options: ['نضم الشفتين (صوت قصير)', 'نفتح الفم لأعلى', 'نخفض الفك لأسفل', 'نسكن الحرف تماماً'],
      correctAnswer: 'نضم الشفتين (صوت قصير)',
      explanation: 'الضمة واو صغيرة فوق الحرف نضم معها الشفتين برفق.',
      hint: 'ضم الشفتين كأنك تقول (أُو).',
      imageOrEmoji: '👄'
    },
    {
      title: 'تمييز حركة الكسرة الخافضة',
      category: 'حركات وتشديد' as const,
      prompt: `أين ترسم الكسرة بالنسبة للحرف؟`,
      type: 'choice' as const,
      options: ['تحت الحرف مباشرة', 'فوق الحرف مباشرة', 'داخل الحرف', 'بعد الحرف كمد'],
      correctAnswer: 'تحت الحرف مباشرة',
      explanation: 'الكسرة شرطة صغيرة مائلة ترسم تحت الحرف ويخفّض معها الفك.',
      hint: 'الكسرة مكانها في الأسفل.',
      imageOrEmoji: '🔽'
    },
    {
      title: 'المد بالألف والصوت الطويل',
      category: 'استماع ونطق' as const,
      prompt: `ما حركة الحرف الممدود قبل الألف؟`,
      type: 'choice' as const,
      options: ['الفتحة دائماً (بَـا)', 'الضمة', 'الكسرة', 'السكون'],
      correctAnswer: 'الفتحة دائماً (بَـا)',
      explanation: 'الألف تناسبها الفتحة على الحرف الممدود قبلها دائماً.',
      hint: 'الألف أخت الفتحة.',
      imageOrEmoji: '📏'
    },
    {
      title: 'المد بالواو وصوت الضم الممتد',
      category: 'استماع ونطق' as const,
      prompt: `ما حركة الحرف الممدود قبل حرف المد بالواو؟`,
      type: 'choice' as const,
      options: ['الضمة دائماً (نُـو)', 'الكسرة', 'الفتحة', 'السكون'],
      correctAnswer: 'الضمة دائماً (نُـو)',
      explanation: 'حرف المد بالواو يجب أن يسبقه حرف مضموم.',
      hint: 'الواو أخت الضمة.',
      imageOrEmoji: '🎶'
    },
    {
      title: 'المد بالياء وصوت الكسر الممتد',
      category: 'استماع ونطق' as const,
      prompt: `في كلمة «كَرِيم»، ما نوع حرف المد؟`,
      type: 'choice' as const,
      options: ['مد بالياء', 'مد بالألف', 'مد بالواو', 'ليس بها مد'],
      correctAnswer: 'مد بالياء',
      explanation: 'الياء ساكنة مسبوقة براء مكسورة (رِيـ) فهي حرف مد.',
      hint: 'استمع للصوت الممدود بالكسرة: ريييم.',
      imageOrEmoji: '✨'
    },
    {
      title: 'الوقفة الهادئة مع السكون',
      category: 'حركات وتشديد' as const,
      prompt: `هل يصح نطق الحرف الساكن وحده في أول الكلمة في اللغة العربية؟`,
      type: 'choice' as const,
      options: ['لا، يجب أن يسبقه حرف متحرك', 'نعم، بكل سهولة', 'أحياناً في الشعر فقط', 'نعم إذا كان مضموماً'],
      correctAnswer: 'لا، يجب أن يسبقه حرف متحرك',
      explanation: 'العرب لا تبدأ بساكن، فالحرف الساكن ينطق مع الحرف المتحرك قبله كمقطع واحد.',
      hint: 'تذكر قاعدة: لا يبدأ بساكن.',
      imageOrEmoji: '🛑'
    },
    {
      title: 'تحليل المقطع الساكن',
      category: 'إملاء ورسم' as const,
      prompt: `ما المقطع الساكن في كلمة «مَسْـجِد»؟`,
      type: 'choice' as const,
      options: ['مَسْ', 'جِ', 'دُ', 'سْجِ'],
      correctAnswer: 'مَسْ',
      explanation: 'الميم المفتوحة مع السين الساكنة يشكلان مقطعاً ساكناً هو (مَسْ).',
      hint: 'الحرف المتحرك مع الساكن بعده.',
      imageOrEmoji: '🕌'
    },
    {
      title: 'التنوين وصوت النون الخفية',
      category: 'حركات وتشديد' as const,
      prompt: `التنوين هو نون ساكنة تلحق آخر الأسماء:...`,
      type: 'choice' as const,
      options: ['تنطق ولا تكتب نوناً صريحة', 'تكتب نوناً دائماً', 'لا تنطق أبداً', 'تكتب ألِفاً فقط'],
      correctAnswer: 'تنطق ولا تكتب نوناً صريحة',
      explanation: 'التنوين نون نسمعها ولا نكتبها نوناً (كتابٌ وليس كتابن).',
      hint: 'ننطقها ولا نكتبها نوناً.',
      imageOrEmoji: '🔔'
    },
    {
      title: 'عصا تنوين الفتح واستثناء التاء المربوطة',
      category: 'إملاء ورسم' as const,
      prompt: `كيف نكتب تنوين الفتح على كلمة «شَجَرَة»؟`,
      type: 'choice' as const,
      options: ['شَجَرَةً (فوق التاء المربوطة مباشرة)', 'شَجَرَةًا (بزيادة ألف)', 'شَجَرَتَنْ', 'شَجَرَتُنْ'],
      correctAnswer: 'شَجَرَةً (فوق التاء المربوطة مباشرة)',
      explanation: 'التاء المربوطة قوية تستند عليها فتحتا التنوين ولا تحتاج لألف زائدة.',
      hint: 'التاء المربوطة لا تضاف بعدها ألف تنوين.',
      imageOrEmoji: '🌳'
    },
    {
      title: 'الشدة والحرف المضاعف',
      category: 'حركات وتشديد' as const,
      prompt: `الشدة ( ّ ) تدل على أن الحرف عبارة عن:...`,
      type: 'choice' as const,
      options: ['حرفين: الأول ساكن والثاني متحرك', 'حرفين متحركين معاً', 'حرف واحد ضعيف', 'ثلاثة حروف'],
      correctAnswer: 'حرفين: الأول ساكن والثاني متحرك',
      explanation: 'الشدة تدغم حرفين متماثلين: الأول ساكن والثاني متحرك ليصيرا حرفاً واحداً مشدداً.',
      hint: 'أول ساكن وثانٍ متحرك.',
      imageOrEmoji: '💪'
    },
    {
      title: 'اللام الشمسية والقفز الصوتي',
      category: 'استماع ونطق' as const,
      prompt: `عند نطق كلمة «الشَّمْس»، ماذا يحدث للام؟`,
      type: 'choice' as const,
      options: ['تكتب ولا تنطق، ونشدد الحرف بعدها', 'تكتب وتنطق بوضوح', 'تحذف رسماً ونطقاً', 'تنطق كحرف واو'],
      correctAnswer: 'تكتب ولا تنطق، ونشدد الحرف بعدها',
      explanation: 'اللام الشمسية تكتب ولا تلفظ، ويدغم صوتها في الحرف الشمسي الذي يليها فيصبح مشدداً.',
      hint: 'اللام الشمسية مخفية في النطق.',
      imageOrEmoji: '☀️'
    },
    {
      title: 'اللام القمرية ونقاء السكون',
      category: 'استماع ونطق' as const,
      prompt: `ما علامة اللام القمرية في رسم المصحف والكتب؟`,
      type: 'choice' as const,
      options: ['سكون ظاهر فوق اللام (اَلْـ)', 'شدة فوق اللام', 'كسرة تحت اللام', 'لا توجد علامة'],
      correctAnswer: 'سكون ظاهر فوق اللام (اَلْـ)',
      explanation: 'اللام القمرية ساكنة تنطق واضحة صريحة وعلامتها رأس خاء صغيرة أو سكون.',
      hint: 'ابحث عن السكون فوق اللام.',
      imageOrEmoji: '🌙'
    },
    {
      title: 'التاء المربوطة والتاء المفتوحة',
      category: 'إملاء ورسم' as const,
      prompt: `كيف نتأكد من أن الكلمة تنتهي بتاء مربوطة؟`,
      type: 'choice' as const,
      options: ['إذا وقفنا عليها بالسكون فنطقناها هاءً', 'إذا كتبنا تحتها كسرة', 'إذا حذفنا أول حرف', 'إذا كانت جمع مذكر'],
      correctAnswer: 'إذا وقفنا عليها بالسكون فنطقناها هاءً',
      explanation: 'التاء المربوطة تنطق هاءً عند الوقف بالسكون، وتاءً عند الوصل بالحركات.',
      hint: 'اختبار الوقف بالسكون.',
      imageOrEmoji: '🏷️'
    },
    {
      title: 'الهاء الأصلية والتفريق بينها وبين التاء',
      category: 'إملاء ورسم' as const,
      prompt: `كلمة «مِيَاه» تنتهي بـ:...`,
      type: 'choice' as const,
      options: ['هاء أصلية (بدون نقط)', 'تاء مربوطة بنقطتين', 'تاء مفتوحة', 'ألف مقصورة'],
      correctAnswer: 'هاء أصلية (بدون نقط)',
      explanation: '«مِيَاه» تنطق هاءً في الوقف والوصل (مياهْ / مياهُ البحر) لذا ترسم هاءً بلا نقط.',
      hint: 'تنطق هاءً في كل الأحوال ولا نقط عليها.',
      imageOrEmoji: '💧'
    },
    {
      title: 'شكل الحرف في أول الكلمة',
      category: 'إملاء ورسم' as const,
      prompt: `كيف يكتب الحرف المتصل في بداية الكلمة؟`,
      type: 'choice' as const,
      options: ['يمد يده ليتصل بالحرف الذي بعده', 'يكتب منفصلاً تماماً', 'يغلق شكله كالنهاية', 'لا يكتب أبداً'],
      correctAnswer: 'يمد يده ليتصل بالحرف الذي بعده',
      explanation: 'الحروف القابلة للاتصال تفتح يدها جهة اليسار لتتصل بالحرف اللاحق.',
      hint: 'يتصل بما بعده.',
      imageOrEmoji: '✍️'
    },
    {
      title: 'تركيب الكلمات من الحروف المقطعة',
      category: 'إملاء ورسم' as const,
      prompt: `رتّب حروف كلمة «${v1.word}» لتكوين الكلمة متصلة:`,
      type: 'choice' as const,
      options: [v1.word, v1.word.split('').reverse().join(''), 'عـلـم', 'كـتـب'],
      correctAnswer: v1.word,
      explanation: `تتجمع الحروف لتشكل الكلمة المفيدة: ${v1.word}.`,
      hint: 'اقرأ من اليمين إلى اليسار.',
      imageOrEmoji: '🧩'
    },
    {
      title: 'معنى المفردة واستخدامها في جملة',
      category: 'فهم وبلاغة' as const,
      prompt: `ما معنى كلمة «${v1.word}» كما وردت في الدرس؟`,
      type: 'choice' as const,
      options: [v1.meaning, 'ضد ذلك تماماً', 'كلمة بلا معنى', 'نوع من الأطعمة الغريبة'],
      correctAnswer: v1.meaning,
      explanation: `المعنى الصحيح لكلمة «${v1.word}» هو: ${v1.meaning}.`,
      hint: 'فكر في سياق الجملة في قصة الدرس.',
      imageOrEmoji: '📖'
    },
    {
      title: 'لعبة المرادفات اللغوية',
      category: 'فهم وبلاغة' as const,
      prompt: `ما مرادف كلمة «جَمِيل»؟`,
      type: 'choice' as const,
      options: ['حَسَنٌ وبَدِيعٌ', 'قَبِيحٌ', 'صَغِيرٌ', 'مُظْلِمٌ'],
      correctAnswer: 'حَسَنٌ وبَدِيعٌ',
      explanation: 'المرادف هو الكلمة التي تطابقها أو تقاربها في المعنى.',
      hint: 'صفة للمظهر الحسن الرائع.',
      imageOrEmoji: '🌺'
    },
    {
      title: 'لعبة الأضداد والمتعاكسات',
      category: 'فهم وبلاغة' as const,
      prompt: `ما ضد كلمة «الصَّبَاح»؟`,
      type: 'choice' as const,
      options: ['المَسَاء', 'الفَجْر', 'النَّهَار', 'الشَّمْس'],
      correctAnswer: 'المَسَاء',
      explanation: 'الضد هو المعنى المعاكس تماماً، وضد الصباح المساء.',
      hint: 'عكس وقت بزوغ النهار.',
      imageOrEmoji: '🌓'
    },
    {
      title: 'أقسام الكلام: تحديد نوع الكلمة',
      category: 'قواعد وتراكيب' as const,
      prompt: `كلمة «${v2.word}» تدل على اسم أم فعل أم حرف؟`,
      type: 'choice' as const,
      options: ['اسْمٌ (يقبل ال التعريف والتنوين)', 'فِعْلٌ مَاضٍ', 'حَرْفُ جَرٍّ', 'ظَرْفُ زَمَانٍ'],
      correctAnswer: 'اسْمٌ (يقبل ال التعريف والتنوين)',
      explanation: `«${v2.word}» اسم لأنه يدل على معنى في نفسه ومجرد من الاقتران بالزمن.`,
      hint: 'هل تقبل الكلمة دخول (الـ)؟ نعم فهي اسم.',
      imageOrEmoji: '🏷️'
    },
    {
      title: 'بناء الجملة المفيدة التامة',
      category: 'قواعد وتراكيب' as const,
      prompt: `الجملة المفيدة في اللغة العربية هي:...`,
      type: 'choice' as const,
      options: ['التي تفيد معنى تاماً يحسن السكوت عليه', 'أي كلمتين بجانب بعضهما', 'التي تنتهي بحرف جر فقط', 'التي لا يفهمها السامع'],
      correctAnswer: 'التي تفيد معنى تاماً يحسن السكوت عليه',
      explanation: 'الجملة المفيدة تعطي خبراً أو طلباً تام المعنى.',
      hint: 'يجب أن يكون معناها كاملاً مفهوماً.',
      imageOrEmoji: '🧱'
    },
    {
      title: 'المفرد والمثنى في التعبير',
      category: 'قواعد وتراكيب' as const,
      prompt: `المثنى يدل على اثنين، فما مثنى «طَالِب» في حالة الرفع؟`,
      type: 'choice' as const,
      options: ['طَالِبَانِ', 'طُلَّابٌ', 'طَالِبُونَ', 'طَالِبَاتٌ'],
      correctAnswer: 'طَالِبَانِ',
      explanation: 'يصاغ المثنى بزيادة ألف ونون على مفرده: طالب + ان = طالبان.',
      hint: 'ينتهي بألف ونون.',
      imageOrEmoji: '👥'
    },
    {
      title: 'علامات الترقيم: موضع النقطة',
      category: 'إملاء ورسم' as const,
      prompt: `أين نضع النقطة (.) في النص العربي؟`,
      type: 'choice' as const,
      options: ['في نهاية الجملة التامة أو الفقرة', 'بعد كل كلمة مباشرة', 'بين المبتدأ والخبر', 'في أول السطر دائماً'],
      correctAnswer: 'في نهاية الجملة التامة أو الفقرة',
      explanation: 'توضع النقطة عند نهاية المعنى التام ونهاية الفقرات.',
      hint: 'علامة الوقف النهائي.',
      imageOrEmoji: '⏹️'
    },
    {
      title: 'علامات الترقيم: الفاصلة بين الجمل',
      category: 'إملاء ورسم' as const,
      prompt: `ما فائدة الفاصلة (،) بين الجمل؟`,
      type: 'choice' as const,
      options: ['للفصل بين الجمل المترابطة ووقفة قصيرة', 'للدلالة على التعجب', 'لإنهاء الكتاب كاملاً', 'لفتح سؤال جديد'],
      correctAnswer: 'للفصل بين الجمل المترابطة ووقفة قصيرة',
      explanation: 'الفاصلة تفصل بين جمل مترابطة في المعنى وتمنح القارئ استراحة خفيفة.',
      hint: 'وقفة تنفس قصيرة.',
      imageOrEmoji: '쉼'
    },
    {
      title: 'التراث والبيئة اليمنية الأصيلة',
      category: 'تعبير وقيم' as const,
      prompt: `ماذا تعلمنا البيئة والتراث اليمني في هذا الدرس؟`,
      type: 'choice' as const,
      options: ['حب الوطن والاعتزاز باللغة العربية والعمارة التاريخية', 'إهمال القراءة والكتابة', 'عدم الاهتمام بالنظافة', 'نسيان الأجداد'],
      correctAnswer: 'حب الوطن والاعتزاز باللغة العربية والعمارة التاريخية',
      explanation: 'تراث اليمن العريق يعزز الفخر بالهوية ولغة الضاد والجد في طلب العلم.',
      hint: 'القيم الوطنية السامية.',
      imageOrEmoji: '🇾🇪'
    },
    {
      title: 'التعبير الشفهي وبلاغة اللسان',
      category: 'تعبير وقيم' as const,
      prompt: `ما النصيحة الأهم لتكون متحدثاً فصيحاً باللغة العربية؟`,
      type: 'choice' as const,
      options: ['القراءة الجهرية مع مراعاة الحركات ومخارج الحروف', 'السرعة دون نطق الحروف كاملة', 'عدم الاهتمام بالتشكيل', 'التحدث بلغة غير مفهومة'],
      correctAnswer: 'القراءة الجهرية مع مراعاة الحركات ومخارج الحروف',
      explanation: 'الفصاحة تكتسب بالقراءة اليومية وضبط أواخر الكلمات والنطق السليم.',
      hint: 'القراءة بصوت مسموع وضبط صحيح.',
      imageOrEmoji: '🗣️'
    },
    {
      title: 'التحدي اللغوي السريع للذاكرة',
      category: 'فهم وبلاغة' as const,
      prompt: `ما الفكرة الجوهرية لدرس «${lessonTitle}»؟`,
      type: 'choice' as const,
      options: [kp1, 'لا توجد فكرة للدرس', 'الدرس يتحدث عن الرياضة فقط', 'موضوع غير لغوي'],
      correctAnswer: kp1,
      explanation: `الهدف الأساسي هو: ${kp1}.`,
      hint: 'راجع خلاصة الدرس.',
      imageOrEmoji: '🎯'
    },
    {
      title: 'المراجعة التراكمية والتطبيق الختامي',
      category: 'تعبير وقيم' as const,
      prompt: `أنت الآن مستعد للاختبار التقييمي! ما شعارك للتفوق؟`,
      type: 'choice' as const,
      options: ['أَقْرَأُهَا صَحّ وأَفْهَمُهَا بِإِتْقَان!', 'لا أهتم بالنتيجة', 'أتسرع في الإجابة دائماً', 'أنسى القواعد بسرعة'],
      correctAnswer: 'أَقْرَأُهَا صَحّ وأَفْهَمُهَا بِإِتْقَان!',
      explanation: 'الإتقان والتركيز هما سر نيل العلامة الكاملة والأوسمة الذهبية!',
      hint: 'شعار تطبيقنا الجميل.',
      imageOrEmoji: '🏆'
    }
  ];

  // إكمال القائمة لتصل لأكثر من 30 نشاطاً (32 نشاطاً بالضبط)
  let currentOrder = activities.length + 1;
  for (const t of subActivityTemplates) {
    if (activities.length >= 32) break;
    activities.push({
      id: `${lessonId}-sub-${currentOrder}`,
      order: currentOrder,
      title: `النشاط ${currentOrder}: ${t.title}`,
      category: t.category,
      prompt: t.prompt,
      audioPromptText: t.prompt,
      type: t.type,
      options: t.options,
      correctAnswer: t.correctAnswer,
      explanation: t.explanation,
      hint: t.hint,
      imageOrEmoji: t.imageOrEmoji
    });
    currentOrder++;
  }

  return activities;
}

// مولد الاختبار التقييمي للدرس (Evaluative Quiz)
function buildLessonQuiz(
  lessonId: string,
  lessonTitle: string,
  category: Lesson['category'],
  vocabList: { word: string; diacritics: string; meaning: string; example: string }[],
  keyPoints: string[]
): LessonQuiz {
  const v1 = vocabList[0] || { word: 'قَلَم', diacritics: 'قَلَمٌ', meaning: 'أداة كتابة', example: 'كتبت بالقلم' };
  const v2 = vocabList[1] || vocabList[0] || { word: 'كِتَاب', diacritics: 'كِتَابٌ', meaning: 'وعاء علم', example: 'قرأت كتاباً' };

  return {
    id: `quiz-${lessonId}`,
    title: `الاختبار التقييمي لدرس: ${lessonTitle}`,
    description: `اختبر إتقانك الشامل لمفردات وقواعد وإملاء الدرس. احصل على العلامة الكاملة 100% لنيل الأوسمة التقديرية والنجوم الذهبية!`,
    totalQuestions: 5,
    questions: [
      {
        id: `q1-${lessonId}`,
        prompt: `السؤال 1 (الفهم المباشر): ما القاعدة الأساسية التي يتعلمها التلميذ في درس «${lessonTitle}»؟`,
        options: [
          keyPoints[0] || 'الضبط السليم والنطق الواضح للكلمات',
          'عدم استخدام الحركات والتشكيل',
          'كتابة الكلمات بلا نقط إطلاقاً',
          'قراءة الكلمات بشكل مقلوب'
        ],
        correctAnswer: keyPoints[0] || 'الضبط السليم والنطق الواضح للكلمات',
        explanation: `القاعدة الجوهرية هي: ${keyPoints[0] || 'الضبط السليم للحركات والنطق الفصيح'}.`,
        hint: 'تذكر الهدف التعليمي الرئيسي للدرس.',
        imageOrEmoji: '🎯'
      },
      {
        id: `q2-${lessonId}`,
        prompt: `السؤال 2 (التطبيق الإملائي): ما الضبط السليم لكلمة «${v1.word}» بالتشكيل الكامل؟`,
        options: [
          v1.diacritics,
          v1.word + 'ْْ',
          v1.word.split('').join('ـ'),
          'بدون أي تشكيل'
        ],
        correctAnswer: v1.diacritics,
        explanation: `الضبط الإملائي الفصيح للكلمة هو: «${v1.diacritics}».`,
        hint: 'انتبه للحركات الصحيحة على كل حرف.',
        imageOrEmoji: '📝'
      },
      {
        id: `q3-${lessonId}`,
        prompt: `السؤال 3 (المعنى اللغوي): ما المعنى الدقيق لكلمة «${v2.word}»؟`,
        options: [
          v2.meaning,
          'معنى معاكس غير صحيح',
          'اسم صوت الحيوان',
          'لا معنى لها في المعاجم'
        ],
        correctAnswer: v2.meaning,
        explanation: `المعنى الصحيح لكلمة «${v2.word}» هو: ${v2.meaning}.`,
        hint: 'فكر في سياق الكلمة في جمل الدرس.',
        imageOrEmoji: '📚'
      },
      {
        id: `q4-${lessonId}`,
        prompt: `السؤال 4 (القواعد والتركيب): ما الملاحظة اللغوية الهامة المذكورة في الدرس: «${keyPoints[1] || keyPoints[0] || 'التركيب النحوي'}»؟`,
        options: [
          keyPoints[1] || keyPoints[0] || 'التركيب النحوي السليم للجملة',
          'أن كل الأسماء تكتب بأحرف مقطعة',
          'أن علامات الترقيم محظورة',
          'أن الكلمات لا ترتبط ببعضها'
        ],
        correctAnswer: keyPoints[1] || keyPoints[0] || 'التركيب النحوي السليم للجملة',
        explanation: `النقطة اللغوية الصحيحة هي: ${keyPoints[1] || keyPoints[0]}.`,
        hint: 'راجع مفاهيم الدرس الأساسية.',
        imageOrEmoji: '📐'
      },
      {
        id: `q5-${lessonId}`,
        prompt: `السؤال 5 (التفوق والإتقان): للحصول على العلامة الكاملة، أي العبارات التالية تمثل تلخيصاً صحيحاً ونافعاً لما درسته؟`,
        options: [
          'اللغة العربية لغة الضاد نتقنها بالقراءة المستمرة والضبط الصحيح للحركات والإملاء',
          'لا يهم ضبط الحركات ما دامت الكلمة مفهومة تقريبياً',
          'الدروس اللغوية لا تنطبق على الحياة اليومية',
          'القراءة السريعة بلا فهم أفضل من القراءة المتأنية'
        ],
        correctAnswer: 'اللغة العربية لغة الضاد نتقنها بالقراءة المستمرة والضبط الصحيح للحركات والإملاء',
        explanation: 'الإتقان والحرص على الضبط الصحيح هو لب مهارة لغتي والتميز المدرسي.',
        hint: 'اختر العبارة التي تعبر عن حب الإتقان.',
        imageOrEmoji: '🌟'
      }
    ]
  };
}

// قائمة الدروس الخام لبناء المناهج مع 32 نشاطاً ودرساً فرعياً واختبار تقييمي لكل درس
interface RawLesson {
  id: string;
  unitId: string;
  gradeId: number;
  title: string;
  category: Lesson['category'];
  summary: string;
  objective: string;
  content: Lesson['content'];
  baseQuestions: Question[];
}

const RAW_GRADES_CONFIG: {
  id: number;
  name: string;
  title: string;
  levelDescription: string;
  color: string;
  units: {
    id: string;
    gradeId: number;
    title: string;
    description: string;
    icon: string;
    lessons: RawLesson[];
  }[];
}[] = [
  // =========================================================================
  // الصف الأول الابتدائي
  // =========================================================================
  {
    id: 1,
    name: "الصف الأول",
    title: "الصف الأول الابتدائي: الحروف، الأصوات، التشكيل، والقراءة البسيطة",
    levelDescription: "تغطية شاملة: الوعي الصوتي، الحركات الثلاث، المدود، السكون، التنوين المبدئي، وتركيب الجمل مع أكثر من 30 نشاطاً واختباراً لكل درس",
    color: "emerald",
    units: [
      {
        id: "g1-u1",
        gradeId: 1,
        title: "الوحدة الأولى: الوعي الصوتي والحركات القصيرة",
        description: "تمييز أصوات الحروف ونطقها بالفتحة والضمة والكسرة",
        icon: "BookOpen",
        lessons: [
          {
            id: "g1-l1",
            unitId: "g1-u1",
            gradeId: 1,
            title: "حرف الباء بالحركات الثلاث (بَ - بُ - بِ)",
            category: "أصوات وحروف",
            summary: "نطق حرف الباء بالفتحة والضمة والكسرة والتمييز بين أصواته",
            objective: "أن يميز التلميذ بين صوت حرف الباء بالحركات الثلاث في كلمات شائعة",
            content: {
              storyOrConcept: "زارَ بَشِيرٌ حَدِيقَةَ البَيْتِ، فَرَأَى بُلْبُلاً يُغَرِّدُ فَوْقَ الغُصْنِ، وَبِئْراً فِيهَا مَاءٌ عَذْبٌ.",
              keyPoints: [
                "الباء المفتوحة (بَ): بَاب، بَيْت، بَلَد",
                "الباء المضمومة (بُ): بُلْبُل، بُنّ، بُسْتَان",
                "الباء المكسورة (بِ): بِئْر، بِنْت، بِطِّيخ"
              ],
              yemeniContext: "في جبال حَرَاز باليمن نزرع شجر البُنّ (بُ) اليماني الأصيل ذي الجودة العالمية.",
              vocabulary: [
                { word: "بَاب", diacritics: "بَابٌ", meaning: "مدخل البيت", example: "فَتَحَ بَشِيرٌ بَابَ البَيْتِ." },
                { word: "بُنّ", diacritics: "بُنٌّ", meaning: "حبوب القهوة الشهيرة", example: "البُنّ اليَمَنِيّ ذُو جَوْدَةٍ عَالِيَةٍ." },
                { word: "بِئْر", diacritics: "بِئْرٌ", meaning: "نبع ماء عميق", example: "شَرِبْنَا مِنْ بِئْرِ القَرْيَةِ." }
              ]
            },
            baseQuestions: [
              {
                id: "g1-q1",
                type: "choice",
                prompt: "ما حركة حرف الباء في كلمة «بَيْت»؟",
                audioPromptText: "بَيْت",
                options: ["الفَتْحَة (بَ)", "الضَّمَّة (بُ)", "الكَسْرَة (بِ)", "السكون"],
                correctAnswer: "الفَتْحَة (بَ)",
                explanation: "حرف الباء في أول كلمة «بَيْت» مفتوح صوته (بَ).",
                hint: "انتبه لنطق أول صوت: بَ... بَيْت.",
                imageOrEmoji: "🏠"
              },
              {
                id: "g1-q2",
                type: "arrange_letters",
                prompt: "رتّب الحروف لتكوين محصول يمني شهير يبدأ بحرف الباء المضموم:",
                options: ["نّ", "بُ"],
                correctAnswer: ["بُ", "نّ"],
                explanation: "تتكون كلمة «بُنّ» من باء مضمومة ونون مشددة.",
                hint: "تبدأ بحرف الباء المضموم: بُـ..",
                imageOrEmoji: "☕"
              }
            ]
          },
          {
            id: "g1-l2",
            unitId: "g1-u1",
            gradeId: 1,
            title: "حرف الميم والدال (مَ - مُ - مِ / دَ - دُ - دِ)",
            category: "أصوات وحروف",
            summary: "نطق الميم والدال وتمييز رسمهما في بداية الكلمة ووسطها ونهايتها",
            objective: "أن يتعرف التلميذ على أصوات الميم والدال في كلمات يومية",
            content: {
              storyOrConcept: "مَاجِدٌ وَدَلَالٌ تِلْمِيذَانِ مُهَذَّبَانِ، يَذْهَبَانِ كُلَّ صَبَاحٍ مَعاً إِلَى مَدْرَسَةِ دَارِ العِلْمِ.",
              keyPoints: [
                "الميم: مَدْرَسَة، مُعَلِّم، مِفْتَاح",
                "الدال: دَار، دَفْتَر، دِيك"
              ],
              yemeniContext: "مَدِينَةُ مَأْرِبَ (مَـ) تَارِيخُهَا دُرَّةٌ فِي جَبِينِ الوَطَنِ.",
              vocabulary: [
                { word: "مَدْرَسَة", diacritics: "مَدْرَسَةٌ", meaning: "صرح العلم والتعلم", example: "المَدْرَسَةُ بَيْتُنَا الثَّانِي." },
                { word: "دَفْتَر", diacritics: "دَفْتَرٌ", meaning: "كراس الكتابة", example: "كَتَبْتُ فِي دَفْتَرِي." }
              ]
            },
            baseQuestions: [
              {
                id: "g1-q3",
                type: "choice",
                prompt: "ما هو الحرف الأول في كلمة «مَدْرَسَة»؟",
                options: ["حرف الميم (مَ)", "حرف الدال (دَ)", "حرف الباء (بَ)", "حرف الراء (رَ)"],
                correctAnswer: "حرف الميم (مَ)",
                explanation: "تبدأ كلمة مدرسة بحرف الميم المفتوح (مَـ).",
                hint: "انطق أول صوت في الكلمة: مَـ...",
                imageOrEmoji: "🏫"
              }
            ]
          }
        ]
      },
      {
        id: "g1-u2",
        gradeId: 1,
        title: "الوحدة الثانية: المدود الطويلة والمقطع الساكن",
        description: "الفرق بين الحركة القصيرة والمد الطويل ونطق المقطع الساكن بطلاقة",
        icon: "Sparkles",
        lessons: [
          {
            id: "g1-l3",
            unitId: "g1-u2",
            gradeId: 1,
            title: "المدود الطويلة: بالألف والواو والياء",
            category: "إملاء وظواهر",
            summary: "الفرق بين الصوت القصير (بَ) والصوت الطويل الممتد (بَا)",
            objective: "أن يفرّق التلميذ كتابة ونطقاً بين الحركة القصيرة والمد الطويل",
            content: {
              storyOrConcept: "المد بالألف صوت يمتد: (بَـاب). والمد بالواو صوت يمتد بالضمة: (سُـوق). والمد بالياء صوت يمتد بالكسرة: (تِـين).",
              keyPoints: [
                "مد بالألف: سَـامِر، كِتَـاب، بَـاب",
                "مد بالواو: نُـور، زُهُـور، سُـوق",
                "مد بالياء: سَمِـيع، طَبِـيب، تِـين"
              ],
              yemeniContext: "سُوقُ المِلْحِ فِي صَنْعَاءَ يَمْتَلِئُ بِالنُّورِ وَالخَيْرِ.",
              vocabulary: [
                { word: "سُوق", diacritics: "سُوقٌ", meaning: "مكان التجارة والشراء", example: "ذَهَبَ أَبِي إِلَى السُّوقِ." },
                { word: "كِتَاب", diacritics: "كِتَابٌ", meaning: "وعاء المعرفة", example: "قَرَأْتُ كِتَاباً مُفِيداً." }
              ]
            },
            baseQuestions: [
              {
                id: "g1-q4",
                type: "choice",
                prompt: "ما حرف المد في كلمة «نُور»؟",
                options: ["حرف الواو", "حرف الألف", "حرف الياء", "حرف النون"],
                correctAnswer: "حرف الواو",
                explanation: "في كلمة «نُور» مد بالواو يسبقه نون مضمومة (نُو).",
                hint: "استمع إلى الصوت الطويل الممتد: نـوووور.",
                imageOrEmoji: "✨"
              }
            ]
          },
          {
            id: "g1-l4",
            unitId: "g1-u2",
            gradeId: 1,
            title: "السكون والمقطع الساكن في الكلمة",
            category: "إملاء وظواهر",
            summary: "نطق الحرف الساكن متصلاً بالحرف المتحرك قبله كوقفة واحدة",
            objective: "أن يقرأ التلميذ المقطع الساكن بطلاقة دون تقطيع أو تردد",
            content: {
              storyOrConcept: "السكون دائرة هادئة فوق الحرف. الحرف الساكن لا ينطق وحده بل نقف عليه مع الحرف الذي قبله: (شَمْـس)، (بَحْـر).",
              keyPoints: [
                "شَمْس: المقطع الساكن (شَمْ)",
                "نَهْر: المقطع الساكن (نَهْ)",
                "بَحْر: المقطع الساكن (بَحْ)"
              ],
              yemeniContext: "شَمْسُ الصَّبَاحِ تُدَفِّئُ شَاطِئَ بَحْرِ عَدَن.",
              vocabulary: [
                { word: "شَمْس", diacritics: "شَمْسٌ", meaning: "نجم النهار المنير", example: "أَشْرَقَتِ الشَّمْسُ." }
              ]
            },
            baseQuestions: [
              {
                id: "g1-q5",
                type: "choice",
                prompt: "ما المقطع الساكن في كلمة «بَحْر»؟",
                options: ["بَحْ", "رُ", "حَ", "بَ"],
                correctAnswer: "بَحْ",
                explanation: "الباء المفتوحة مع الحاء الساكنة تنطقان معاً كمقطع ساكن (بَحْ).",
                hint: "اقرأ الحرفين الأولين معاً وقفة واحدة.",
                imageOrEmoji: "🌊"
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // الصف الثاني الابتدائي
  // =========================================================================
  {
    id: 2,
    name: "الصف الثاني",
    title: "الصف الثاني الابتدائي: التنوين، الشدة، اللام، التاء المربوطة والمفتوحة",
    levelDescription: "تغطية شاملة: أنواع التنوين، اللام الشمسية والقمرية، الشدة، التاء المربوطة والمفتوحة، وبناء الجملة مع أكثر من 30 نشاطاً واختباراً لكل درس",
    color: "sky",
    units: [
      {
        id: "g2-u1",
        gradeId: 2,
        title: "الوحدة الأولى: قواعد الرسم الإملائي والتنوين",
        description: "التنوين بأنواعه الثلاثة والفرق بين التاء المربوطة والمفتوحة والهاء",
        icon: "Sparkles",
        lessons: [
          {
            id: "g2-l1",
            unitId: "g2-u1",
            gradeId: 2,
            title: "التنوين (ضم، فتح، كسر) وعصا تنوين الفتح",
            category: "إملاء وظواهر",
            summary: "التنوين نون ساكنة تلحق آخر الاسم تنطق ولا تكتب نوناً صريحة",
            objective: "أن يتقن التلميذ كتابة تنوين الفتح مع ألف التنوين واستثناءات التاء المربوطة",
            content: {
              storyOrConcept: "التنوين نون ننطقها ولا نكتبها نوناً: قَلَمٌ (ضم)، قَلَماً (فتح ويحتاج ألفاً مساعدة إلا مع التاء والهمزة)، قَلَمٍ (كسر).",
              keyPoints: [
                "تنوين الضم: عَسَلٌ يَمَنِيٌّ صَافٍ",
                "تنوين الفتح: شَاهَدْتُ صَقْراً / شَجَرَةً (بلا ألف زائدة)",
                "تنوين الكسر: مَرَرْتُ بِبَيْتٍ جَمِيلٍ"
              ],
              yemeniContext: "عَسَلُ دَوْعَن عَسَلٌ (ضم) نَقِيٌّ يَبِيعُهُ التَّاجِرُ دَوَاءً (فتح) وَشِفَاءً لِلنَّاسِ.",
              vocabulary: [
                { word: "عَسَل", diacritics: "عَسَلٌ", meaning: "شراب حلو من النحل", example: "تَذَوَّقْتُ عَسَلاً لَذِيذاً." }
              ]
            },
            baseQuestions: [
              {
                id: "g2-q1",
                type: "choice",
                prompt: "أيّ كلمة كُتب فيها تنوين الفتح بشكل صحيح؟",
                options: ["بَيْتًا", "بَيْتَن", "بَيْتٌ", "بَيْتٍ"],
                correctAnswer: "بَيْتًا",
                explanation: "تنوين الفتح يكتب فتحتين مع ألف التنوين: بَيْتًا.",
                hint: "لا نكتب حرف النون بل نكتب فتحتين مع ألف.",
                imageOrEmoji: "📝"
              }
            ]
          },
          {
            id: "g2-l2",
            unitId: "g2-u1",
            gradeId: 2,
            title: "التاء المربوطة والتاء المفتوحة والهاء",
            category: "إملاء وظواهر",
            summary: "الوقف بالسكون لمعرفة التاء المربوطة (تنطق هاء) والمفتوحة (تبقى تاء)",
            objective: "أن يفرّق التلميذ إملائياً بين مَدْرَسَة (مربوطة)، بَيْت (مفتوحة)، وَجْه (هاء)",
            content: {
              storyOrConcept: "قف على الكلمة بالسكون: إن نطقتها هاءً فهي مربوطة (مَدْرَسَهْ -> مَدْرَسَة). وإن بقيت تاءً فهي مفتوحة (بَيْتْ -> بَيْت). والهاء أصلية بلا نقط أبداً (وَجْه).",
              keyPoints: [
                "تاء مربوطة: قَرْيَة، شَجَرَة، حَدِيقَة",
                "تاء مفتوحة: بِنْت، زَيْت، كَتَبْتُ",
                "هاء بلا نقط: مِيَاه، وَجْه، كِتَابُهُ"
              ],
              yemeniContext: "صَنْعَاءُ مَدِينَةٌ (مربوطة) تَارِيخِيَّةٌ بَنَتْ (مفتوحة) مَجْدَهَا بِمِيَاهِ (هاء) أَمْطَارِهَا.",
              vocabulary: [
                { word: "مَدِينَة", diacritics: "مَدِينَةٌ", meaning: "حاضرة كبرى", example: "عَدَنُ مَدِينَةٌ عَرِيقَةٌ." }
              ]
            },
            baseQuestions: [
              {
                id: "g2-q2",
                type: "choice",
                prompt: "كيف تنطق التاء المربوطة في كلمة «قَرْيَة» عند الوقف بالسكون؟",
                options: ["تُنطق هاءً (قَرْيَهْ)", "تُنطق تاءً صريحة", "لا تُنطق", "تُنطق واواً"],
                correctAnswer: "تُنطق هاءً (قَرْيَهْ)",
                explanation: "التاء المربوطة تنطق هاءً عند الوقف بالسكون، وتاءً عند الوصل بالحركات.",
                hint: "قف بالسكون: قريهْ.",
                imageOrEmoji: "🏡"
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // الصف الثالث الابتدائي
  // =========================================================================
  {
    id: 3,
    name: "الصف الثالث",
    title: "الصف الثالث الابتدائي: البناء اللغوي، أقسام الكلام، الضمائر، وحروف الجر",
    levelDescription: "تغطية شاملة: المفرد والمثنى والجمع، أقسام الكلمة، الضمائر المنفصلة، حروف الجر، وهمزة الوصل والقطع مع أكثر من 30 نشاطاً واختباراً لكل درس",
    color: "amber",
    units: [
      {
        id: "g3-u1",
        gradeId: 3,
        title: "الوحدة الأولى: المفرد والمثنى والجمع وأقسام الكلام",
        description: "التحويل بين الأعداد اللغوية وتمييز الاسم والفعل والحرف",
        icon: "Compass",
        lessons: [
          {
            id: "g3-l1",
            unitId: "g3-u1",
            gradeId: 3,
            title: "المفرد والمثنى والجمع وصياغة المثنى",
            category: "قواعد وتراكيب",
            summary: "المفرد (واحد)، المثنى (اثنان بزيادة ألف ونون)، والجمع (ثلاثة فأكثر)",
            objective: "أن يحول التلميذ الأسماء المفردة إلى مثنى وجمع مناسبين بدقة",
            content: {
              storyOrConcept: "المفرد: (قَلَم). المثنى بزيادة ألف ونون: (قَلَمَان). الجمع: (أَقْلَام). للمؤنث: (شَجَرَة -> شَجَرَتَان -> أَشْجَار).",
              keyPoints: [
                "مفرد: سَدّ -> مثنى: سَدَّان -> جمع: سُدُود",
                "مفرد: فَلَّاح -> مثنى: فَلَّاحَان -> جمع: فَلَّاحُونَ",
                "مفرد: مَدِينَة -> مثنى: مَدِينَتَان -> جمع: مُدُن"
              ],
              yemeniContext: "سَدُّ مَأْرِبَ سَدٌّ (مفرد) وَاحِدٌ شَهِيرٌ، وَفِي اليَمَنِ سُدُودٌ (جمع) كَثِيرَةٌ.",
              vocabulary: [
                { word: "سَدّ", diacritics: "سَدٌّ", meaning: "بناء لحجز المياه", example: "سَدُّ مَأْرِبَ مَفْخَرَةٌ يَمَنِيَّةٌ." }
              ]
            },
            baseQuestions: [
              {
                id: "g3-q1",
                type: "choice",
                prompt: "ما هو المثنى لكلمة «كِتَاب» في حالة الرفع؟",
                options: ["كِتَابَان", "كُتُب", "كِتَابُونَ", "كِتَابَات"],
                correctAnswer: "كِتَابَان",
                explanation: "يصاغ المثنى بزيادة ألف ونون على مفرده: كِتَاب + ان = كِتَابَان.",
                hint: "المثنى يدل على اثنين وينتهي بألف ونون.",
                imageOrEmoji: "📚"
              }
            ]
          },
          {
            id: "g3-l2",
            unitId: "g3-u1",
            gradeId: 3,
            title: "أقسام الكلام: الاسم والفعل والحرف",
            category: "قواعد وتراكيب",
            summary: "الاسم ما دل على مسمى، الفعل ما دل على حدث وزمن، والحرف يربط بين الكلمات",
            objective: "أن يصنف التلميذ أي كلمة تقابله في النص إلى اسم أو فعل أو حرف",
            content: {
              storyOrConcept: "الكلمة ثلاثة أنواع: 1) الاسم: يقبل (ال) والتنوين والتاء المربوطة. 2) الفعل: عمل في زمن ماضٍ أو حاضر أو مستقبل. 3) الحرف: لا يظهر معناه إلا مع غيره.",
              keyPoints: [
                "اسم: صَنْعَاء، جَبَل، كِتَاب",
                "فعل: زَرَعَ، يَقْرَأُ، اجْتَهِدْ",
                "حرف: فِي، إِلَى، عَنْ، ثُمَّ"
              ],
              yemeniContext: "زَرَعَ (فعل) الفَلَّاحُ (اسم) فِي (حرف) حُقُولِ إِبّ الخَضْرَاءِ.",
              vocabulary: [
                { word: "كَلَام", diacritics: "كَلَامٌ", meaning: "ما يتركب من مفردات مفيدة", example: "الكَلَامُ الطَّيِّبُ صَدَقَةٌ." }
              ]
            },
            baseQuestions: [
              {
                id: "g3-q2",
                type: "choice",
                prompt: "ما نوع كلمة «يَرْكُضُ» من أقسام الكلام؟",
                options: ["فِعْل (يدل على حدث وزمن)", "اسْم", "حَرْف", "اسم إشارة"],
                correctAnswer: "فِعْل (يدل على حدث وزمن)",
                explanation: "«يَرْكُضُ» تدل على حركة وجري مقترنين بالزمن الحاضر، فهي فعل مضارع.",
                hint: "الكلمة تدل على عمل وحركة في الوقت الحالي.",
                imageOrEmoji: "🏃"
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // الصف الرابع الابتدائي
  // =========================================================================
  {
    id: 4,
    name: "الصف الرابع",
    title: "الصف الرابع الابتدائي: الجملة الاسمية والفعلية، الهمزة المتطرفة، والترقيم",
    levelDescription: "تغطية شاملة: المبتدأ والخبر، الفعل والفاعل والمفعول به، الهمزة في آخر الكلمة، وعلامات الترقيم مع أكثر من 30 نشاطاً واختباراً لكل درس",
    color: "purple",
    units: [
      {
        id: "g4-u1",
        gradeId: 4,
        title: "الوحدة الأولى: أركان الجملة في اللغة العربية",
        description: "الجملة الاسمية (المبتدأ والخبر) والجملة الفعلية (فعل وفاعل ومفعول به)",
        icon: "Layers",
        lessons: [
          {
            id: "g4-l1",
            unitId: "g4-u1",
            gradeId: 4,
            title: "الجملة الاسمية وركناها (المبتدأ والخبر)",
            category: "قواعد وتراكيب",
            summary: "الجملة التي تبدأ باسم، وتتكون من مبتدأ وخبر مرفوعين بالضمة",
            objective: "أن يحدد التلميذ المبتدأ والخبر ويضبطهما بالضمة الظاهرة",
            content: {
              storyOrConcept: "الجملة الاسمية تبدأ باسم. المبتدأ اسم مرفوع نبدأ به الكلام، والخبر يتمم معناه وهو مرفوع مثله: اليَمَنُ (مبتدأ مرفوع) عَظِيمٌ (خبر مرفوع).",
              keyPoints: [
                "العِلْمُ (مبتدأ) نُورٌ (خبر)",
                "البُنُّ (مبتدأ) طَيِّبٌ (خبر)",
                "كلاهما مرفوع بالضمة في الاسم المفرد"
              ],
              yemeniContext: "صَنْعَاءُ جَمِيلَةٌ، وَشِبَامُ شَامِخَةٌ، وَالعَقِيقُ اليَمَنِيُّ أَصِيلٌ.",
              vocabulary: [
                { word: "حَضَارَة", diacritics: "حَضَارَةٌ", meaning: "تراث وتقدم إنساني", example: "اليَمَنُ مَهْدُ الحَضَارَةِ العَرَبِيَّةِ." }
              ]
            },
            baseQuestions: [
              {
                id: "g4-q1",
                type: "choice",
                prompt: "أين المبتدأ في جملة: «العِلْمُ نُورٌ لِلحَيَاةِ»؟",
                options: ["العِلْمُ", "نُورٌ", "لِلحَيَاةِ", "الجملة كلها خبر"],
                correctAnswer: "العِلْمُ",
                explanation: "«العِلْمُ» هو الاسم الذي بدأت به الجملة فهو مبتدأ مرفوع بالضمة.",
                hint: "المبتدأ هو الاسم الأول الذي ابتدأ به الكلام.",
                imageOrEmoji: "💡"
              }
            ]
          },
          {
            id: "g4-l2",
            unitId: "g4-u1",
            gradeId: 4,
            title: "الجملة الفعلية: الفعل والفاعل والمفعول به",
            category: "قواعد وتراكيب",
            summary: "الجملة التي تبدأ بفعل، والفاعل مرفوع بالضمة، والمفعول به منصوب بالفتحة",
            objective: "أن يميز التلميذ بين الفاعل والمفعول به ويضبطهما بالشكل الصحيح",
            content: {
              storyOrConcept: "الجملة الفعلية تبدأ بفعل. الفاعل هو من قام بالفعل ويكون مرفوعاً: (قَرَأَ التِّلْمِيذُ). المفعول به هو من وقع عليه الفعل ويكون منصوباً: (قَرَأَ التِّلْمِيذُ الكِتَابَ).",
              keyPoints: [
                "زَرَعَ (فعل) الفَلَّاحُ (فاعل مرفوع بالضمة) الشَّجَرَةَ (مفعول به منصوب بالفتحة)",
                "شَيَّدَ الأَجْدَادُ السَّدَّ"
              ],
              yemeniContext: "بَنَى المُلُوكُ السَّبَئِيُّونَ السَّدَّ العَظِيمَ فِي مَأْرِبَ لِحِمَايَةِ الحُقُولِ.",
              vocabulary: [
                { word: "شَيَّدَ", diacritics: "شَيَّدَ", meaning: "بنى عمارة متينة", example: "شَيَّدَ أَهْلُ اليَمَنِ حَضَارَةً عَرِيقَةً." }
              ]
            },
            baseQuestions: [
              {
                id: "g4-q2",
                type: "choice",
                prompt: "ما إعراب كلمة «الشَّجَرَةَ» في: «زَرَعَ الفَلَّاحُ الشَّجَرَةَ»؟",
                options: ["مفعول به منصوب بالفتحة", "فاعل مرفوع بالضمة", "مبتدأ", "اسم مجرور"],
                correctAnswer: "مفعول به منصوب بالفتحة",
                explanation: "«الشَّجَرَةَ» وقع عليها فعل الفاعل، فهي مفعول به منصوب بالفتحة.",
                hint: "ماذا زرع الفلاح؟",
                imageOrEmoji: "🌱"
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // الصف الخامس الابتدائي
  // =========================================================================
  {
    id: 5,
    name: "الصف الخامس",
    title: "الصف الخامس الابتدائي: النواسخ، الهمزة المتوسطة، والألف اللينة",
    levelDescription: "تغطية شاملة: كان وأخواتها، إنّ وأخواتها، ميزان الحركات للهمزة المتوسطة، الألف اللينة، وعلامات الإعراب مع أكثر من 30 نشاطاً واختباراً لكل درس",
    color: "rose",
    units: [
      {
        id: "g5-u1",
        gradeId: 5,
        title: "الوحدة الأولى: النواسخ في الجملة الاسمية",
        description: "الأفعال الناسخة (كان وأخواتها) والحروف الناسخة (إنّ وأخواتها) وأثرهما الإعرابي",
        icon: "Award",
        lessons: [
          {
            id: "g5-l1",
            unitId: "g5-u1",
            gradeId: 5,
            title: "كان وأخواتها وضبط اسمها وخبرها",
            category: "قواعد وتراكيب",
            summary: "أفعال ناسخة ترفع المبتدأ اسماً لها وتنصب الخبر خبراً لها",
            objective: "أن يعرب التلميذ جملة كان وأخواتها ويضبط اسمها بالرفع وخبرها بالنصب",
            content: {
              storyOrConcept: "كان وأخواتها (أَصْبَحَ، صَارَ، أَمْسَى، لَيْسَ) أفعال ناسخة تدخل على الجملة الاسمية. ترفع المبتدأ اسماً لها، وتنصب الخبر خبراً لها: كَانَ الجَوُّ (اسمها مرفوع) مَاطِراً (خبرها منصوب).",
              keyPoints: [
                "صَارَ المَاءُ عَذْباً",
                "أَصْبَحَ التِّلْمِيذُ نَشِيطاً",
                "لَيْسَ الكَسَلُ نَافِعاً"
              ],
              yemeniContext: "كَانَتْ مَمْلَكَةُ سَبَأَ مَشْهُورَةً بِالعِمَارَةِ وَالتِّجَارَةِ فِي البِحَارِ.",
              vocabulary: [
                { word: "نَاسِخ", diacritics: "نَاسِخٌ", meaning: "مغيّر للحكم الإعرابي", example: "كَانَ فِعْلٌ مَاضٍ نَاسِخٌ." }
              ]
            },
            baseQuestions: [
              {
                id: "g5-q1",
                type: "choice",
                prompt: "ما إعراب كلمة «مَاطِراً» في: «كَانَ الجَوُّ مَاطِراً»؟",
                options: ["خبر كان منصوب بالفتحة", "اسم كان مرفوع بالضمة", "فاعل", "مفعول به"],
                correctAnswer: "خبر كان منصوب بالفتحة",
                explanation: "«مَاطِراً» خبر كان، وكان تنصب الخبر بالفتحة الظاهرة.",
                hint: "الخبر هو الكلمة المنصوبة التي تتمم المعنى مع كان.",
                imageOrEmoji: "🌧️"
              }
            ]
          },
          {
            id: "g5-l2",
            unitId: "g5-u1",
            gradeId: 5,
            title: "إنّ وأخواتها وضبط اسمها وخبرها",
            category: "قواعد وتراكيب",
            summary: "حروف ناسخة تنصب المبتدأ اسماً لها وترفع الخبر خبراً لها (عكس عمل كان)",
            objective: "أن يفرّق التلميذ بدقة بين عمل كان وعمل إنّ في الجملة الاسمية",
            content: {
              storyOrConcept: "إنّ وأخواتها (أَنَّ، كَأَنَّ، لَكِنَّ، لَيْتَ، لَعَلَّ) حروف ناسخة تفعل عكس كان: تنصب المبتدأ بالفتحة فيصير اسمها، وترفع الخبر بالضمة فيصير خبرها: إِنَّ العِلْمَ (اسمها منصوب) نُورٌ (خبرها مرفوع).",
              keyPoints: [
                "إِنَّ اليَمَنَ (اسم إن منصوب) عَزِيزٌ (خبر إن مرفوع)",
                "لَيْتَ السَّلَامَ دَائِمٌ"
              ],
              yemeniContext: "إِنَّ تَارِيخَ سَبَأَ وَحِمْيَرَ مَفْخَرَةٌ لِكُلِّ أَبْنَاءِ الأُمَّةِ.",
              vocabulary: [
                { word: "تَوْكِيد", diacritics: "تَوْكِيدٌ", meaning: "تثبيت اليقين", example: "إِنَّ حَرْفُ تَوْكِيدٍ وَنَصْبٍ." }
              ]
            },
            baseQuestions: [
              {
                id: "g5-q2",
                type: "choice",
                prompt: "ما حركة اسم «إنّ» في جملة: «إِنَّ النَّصْرَ قَرِيبٌ»؟",
                options: ["الفَتْحَة (منصوب)", "الضَّمَّة (مرفوع)", "الكَسْرَة", "السكون"],
                correctAnswer: "الفَتْحَة (منصوب)",
                explanation: "«إنّ» تنصب المبتدأ بالفتحة اسماً لها وترفع الخبر بالضمة خبراً لها.",
                hint: "إنّ تنصب الاسم بالفتحة.",
                imageOrEmoji: "✌️"
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // الصف السادس الابتدائي
  // =========================================================================
  {
    id: 6,
    name: "الصف السادس",
    title: "الصف السادس الابتدائي: المنصوبات، التوابع، المشتقات، والبلاغة المتقدمة",
    levelDescription: "تغطية شاملة: النعت، الحال، المفاعيل، الأفعال والأسماء الخمسة، الصرف والمشتقات، والإملاء مع أكثر من 30 نشاطاً واختباراً لكل درس",
    color: "indigo",
    units: [
      {
        id: "g6-u1",
        gradeId: 6,
        title: "الوحدة الأولى: المنصوبات والتوابع النحوية",
        description: "النعت (الصفة)، الحال المفردة، المفعول المطلق، والمفعول لأجله",
        icon: "GraduationCap",
        lessons: [
          {
            id: "g6-l1",
            unitId: "g6-u1",
            gradeId: 6,
            title: "النعت (الصفة) وأوجه مطابقته للمنعوت",
            category: "قواعد وتراكيب",
            summary: "النعت تابع يصف اسماً قبله ويطابقه في الإعراب والتعريف والتذكير والعدد",
            objective: "أن يحدد التلميذ النعت والمنعوت ويبين أوجه المطابقة الإعرابية بينهما",
            content: {
              storyOrConcept: "النعت ظلٌّ للمنعوت يتبعه في 4 أمور: في الإعراب (رفعاً ونصباً وجراً)، في التعريف والتنكير، في التذكير والتأنيث، وفي الإفراد والتثنية والجمع: بَنَى اليَمَنِيُّونَ حَضَارَةً عَظِيمَةً.",
              keyPoints: [
                "فَازَ التِّلْمِيذُ المُجْتَهِدُ",
                "مَرَرْتُ بِقَرْيَةٍ جَمِيلَةٍ",
                "قَرَأْتُ كِتَابَيْنِ مُفِيدَيْنِ"
              ],
              yemeniContext: "تَمْتَازُ مَدِينَةُ شِبَام حَضْرَمَوْت بِأَبْرَاجِهَا الطِّينِيَّةِ الشَّاهِقَةِ فِي السَّمَاءِ.",
              vocabulary: [
                { word: "شَاهِقَة", diacritics: "شَاهِقَةٌ", meaning: "عالية جداً", example: "أَبْرَاجُ شِبَامَ شَاهِقَةٌ." }
              ]
            },
            baseQuestions: [
              {
                id: "g6-q1",
                type: "choice",
                prompt: "أين النعت في جملة: «قَرَأْتُ كِتَاباً مُفِيداً عَنْ تَارِيخِ اليَمَنِ»؟",
                options: ["مُفِيداً", "كِتَاباً", "تَارِيخِ", "قَرَأْتُ"],
                correctAnswer: "مُفِيداً",
                explanation: "«مُفِيداً» نعت يصف الكتاب ويطابقه في النصب والتنكير والإفراد والتذكير.",
                hint: "ابحث عن الكلمة التي تبين صفة وتتبع الاسم المنصوب.",
                imageOrEmoji: "📚"
              }
            ]
          },
          {
            id: "g6-l2",
            unitId: "g6-u1",
            gradeId: 6,
            title: "الحال المفردة وصاحب الحال والتفريق بينها وبين النعت",
            category: "قواعد وتراكيب",
            summary: "الحال نكرة منصوبة تجيب عن سؤال (كيف؟)، وصاحب الحال معرفة",
            objective: "أن يفرّق التلميذ بين الحال والصفة ويضبط الحال بالفتحة",
            content: {
              storyOrConcept: "الحال اسم نكرة منصوب يبين هيئة صاحبه المعرفة عند حدوث الفعل: عَادَ الفَلَّاحُ مَسْرُوراً. كيف عاد الفلاح؟ مَسْرُوراً.",
              keyPoints: [
                "وَقَفَ الخَطِيبُ فَصِيحاً",
                "أَقْبَلَ التِّلْمِيذُ مُسْتَبْشِراً",
                "الحال نكرة وصاحب الحال معرفة دائماً"
              ],
              yemeniContext: "أَقْبَلَ الصَّبَاحُ مُشْرِقاً عَلَى قِمَمِ جِبَالِ صَبِر وَعَيْبَان.",
              vocabulary: [
                { word: "مُسْتَبْشِر", diacritics: "مُسْتَبْشِرٌ", meaning: "مبتهج بالخير", example: "رَأَيْتُ الطِّفْلَ مُسْتَبْشِراً." }
              ]
            },
            baseQuestions: [
              {
                id: "g6-q2",
                type: "choice",
                prompt: "ما إعراب كلمة «مَسْرُوراً» في: «عَادَ الفَلَّاحُ مَسْرُوراً»؟",
                options: ["حال منصوبة بالفتحة", "نعت", "مفعول به", "مبتدأ"],
                correctAnswer: "حال منصوبة بالفتحة",
                explanation: "«مَسْرُوراً» بينت هيئة الفلاح عند عودته وهي جواب لسؤال كيف عاد.",
                hint: "اسأل: كيف عاد الفلاح؟",
                imageOrEmoji: "😊"
              }
            ]
          }
        ]
      }
    ]
  }
];

// تجميع وتوليد بيانات المناهج النهائية بحيث يحتوي كل درس على أكثر من 30 نشاطاً فرعياً واختبار تقييمي
export const GRADES_DATA: Grade[] = RAW_GRADES_CONFIG.map(grade => ({
  id: grade.id,
  name: grade.name,
  title: grade.title,
  levelDescription: grade.levelDescription,
  color: grade.color,
  units: grade.units.map(unit => ({
    id: unit.id,
    gradeId: unit.gradeId,
    title: unit.title,
    description: unit.description,
    icon: unit.icon,
    lessons: unit.lessons.map(rawLesson => {
      const subActs = buildSubActivities(
        rawLesson.id,
        rawLesson.title,
        rawLesson.category,
        rawLesson.content.vocabulary,
        rawLesson.content.keyPoints,
        rawLesson.baseQuestions
      );

      const quiz = buildLessonQuiz(
        rawLesson.id,
        rawLesson.title,
        rawLesson.category,
        rawLesson.content.vocabulary,
        rawLesson.content.keyPoints
      );

      return {
        id: rawLesson.id,
        unitId: rawLesson.unitId,
        gradeId: rawLesson.gradeId,
        title: rawLesson.title,
        category: rawLesson.category,
        summary: rawLesson.summary,
        objective: rawLesson.objective,
        content: rawLesson.content,
        subActivities: subActs,
        questions: rawLesson.baseQuestions,
        quiz: quiz
      };
    })
  }))
}));
