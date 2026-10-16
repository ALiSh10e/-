import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Tv,
  Presentation,
  Award,
  BookOpen,
  PenTool,
  Gamepad2,
  Mic,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  Heart,
  Smartphone,
  Star,
  Check,
  Zap,
  Volume1,
  Info,
  FileText,
  FolderDown
} from 'lucide-react';
import { offlineAudioService } from '../services/audioService';
import { AppTab } from './Header';
import confetti from 'canvas-confetti';

interface PresentationVideoViewProps {
  onNavigateTab: (tab: AppTab) => void;
}

interface VideoScene {
  id: number;
  title: string;
  subtitle: string;
  narration: string;
  durationSeconds: number;
  targetTab: AppTab;
  accentColor: string;
  bgGradient: string;
  badge: string;
  icon: React.ReactNode;
  highlights: string[];
}

export const PresentationVideoView: React.FC<PresentationVideoViewProps> = ({ onNavigateTab }) => {
  const [mode, setMode] = useState<'video' | 'slides' | 'about'>('video');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [isSpeakingNarration, setIsSpeakingNarration] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  // Scenes list for the automated Video Walkthrough
  const SCENES: VideoScene[] = [
    {
      id: 1,
      title: "مرحباً بكم في تطبيق «أَقْرَأُهَا صَحّ»",
      subtitle: "المبادرة المجتمعية التطوعية لتعلّم وإتقان لغة الضاد",
      narration: "أهلاً ومرحباً بكم في تطبيق أقرأها صح، المبادرة المجتمعية التعليمية الرائدة بإشراف المهندس شوقي حسن الجعور. صُمم هذا التطبيق خصيصاً لتمكين تلاميذ المرحلة الابتدائية من الصف الأول إلى السادس من إتقان القراءة والكتابة والنطق الفصيح بطريقة تفاعلية وممتعة تعمل بالكامل دون الحاجة إلى إنترنت.",
      durationSeconds: 14,
      targetTab: 'letters',
      accentColor: 'from-emerald-600 to-teal-700',
      bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
      badge: "مبادرة مجتمعية م/ شوقي الجعور",
      icon: <Heart className="w-8 h-8 text-rose-400 fill-rose-400 animate-pulse" />,
      highlights: [
        "تطبيق تعليمي تفاعلي مجاني 100% وغير ربحي",
        "يعمل محلياً بالكامل دون الحاجة لاتصال بالإنترنت",
        "تغطية شاملة لمقررات اللغة العربية للصفوف من 1 إلى 6",
        "تصميم طفولي بهيج وجذاب يراعي أحدث المعايير التربوية"
      ]
    },
    {
      id: 2,
      title: "ركن الحروف الهجائية والتتبع التفاعلي",
      subtitle: "رسم الحروف بالأصابع مع نطق الحركات والكلمات",
      narration: "تبدأ الرحلة التعليمية الماتعة بركن الحروف الهجائية الثري. هنا يتدرب الطفل على رسم كل حرف بيده وأصابعه على لوحة الرسم التفاعلية، مع الاستماع للنطق الصوتي الفصيح للحرف بالحركات الثلاث: الفتحة والضمة والكسرة، بالإضافة إلى أمثلة مصورة وكلمات نموذجية.",
      durationSeconds: 15,
      targetTab: 'letters',
      accentColor: 'from-sky-600 to-blue-700',
      bgGradient: 'from-sky-950 via-slate-900 to-slate-950',
      badge: "تتبع الأصابع + نطق فصيح",
      icon: <PenTool className="w-8 h-8 text-sky-400 animate-bounce" />,
      highlights: [
        "28 حرفاً هجائياً مع أشكال الحرف (أول، وسط، وآخر الكلمة)",
        "لوحة رسم وتتبع حسّي حركي بألوان وأحجام فراشي متعددة",
        "نطق صوتي فصيح للحروف بالحركات القصيرة (ـَ ، ـُ ، ـِ)",
        "كلمات مصورة لكل حرف مع إمكانية الاستماع الفوري"
      ]
    },
    {
      id: 3,
      title: "المنهج الدراسي والـ 30 نشاطاً لكل درس",
      subtitle: "تغطية منهجية متكاملة لجميع صفوف المرحلة الابتدائية",
      narration: "يغطي التطبيق كافة جوانب تعليم اللغة العربية عبر وحدات دراسية مدروسة لجميع الصفوف من الأول حتى السادس. ويتميز الدرس الواحد باحتوائه على أكثر من ثلاثين درساً ونشاطاً فرعياً يجمع بين القراءة الإجهادية، والتهجئة، وتمييز المدود والتاءات، مع مؤشرات بصرية تشجع الطفل على الإنجاز.",
      durationSeconds: 16,
      targetTab: 'lessons',
      accentColor: 'from-amber-600 to-orange-700',
      bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
      badge: "+30 نشاطاً فرعياً لكل درس",
      icon: <BookOpen className="w-8 h-8 text-amber-400" />,
      highlights: [
        "مناهج الصفوف الستة مصنفة حسب الفصل والوحدة الدراسية",
        "أكثر من 30 تدريباً ونشاطاً نوعياً لكل درس تعليمي",
        "تدريبات على التمييز السمعي، الشدة، والتنوين، واللام الشمسية والقمرية",
        "شريط تقدم ديناميكي يرصد إنجاز التلميذ لحظة بلحظة"
      ]
    },
    {
      id: 4,
      title: "نظام الاختبارات التقييمية ومنظومة الأوسمة",
      subtitle: "قياس الفهم ومنح أوسمة ذهبية استثنائية عند العلامة الكاملة",
      narration: "لترسيخ المعرفة، يخوض التلميذ بعد كل درس اختباراً تقييمياً ذكياً متعدد الأسئلة، مع إمكانية قراءة الأسئلة صوتياً. وعند تحقيق الدرجة الكاملة مئة بالمئة، يُمنح التلميذ وساماً تشجيعياً خاصاً وتُطلق احتفالية مبهجة لتعزيز ثقته بنفسه واستمراره في التعلم.",
      durationSeconds: 15,
      targetTab: 'lessons',
      accentColor: 'from-purple-600 to-indigo-700',
      bgGradient: 'from-purple-950 via-slate-900 to-slate-950',
      badge: "نظام تقييم ذكي + أوسمة فخرية",
      icon: <Award className="w-8 h-8 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />,
      highlights: [
        "اختبارات تقييمية (Quizzes) تتبع كل درس لقياس مستوى الفهم",
        "إمكانية الاستماع لنص السؤال والخيارات صوتياً لدعم التعلم السمعي",
        "منح أوسمة الشرف الذهبية عند الحصول على الدرجة الكاملة 100%",
        "احتفالية بصرية وصوتية محفزة فور فتح كل وسام جديد"
      ]
    },
    {
      id: 5,
      title: "مكتبة القصص القرائية الكبرى (300 قصة)",
      subtitle: "50 قصة هادفة وممتعة لكل صف دراسي مع قارئ صوتي متزامن",
      narration: "يحتوي التطبيق على أكبر مكتبة قصصية للأطفال تضم ثلاثمائة قصة شيقة؛ خمسون قصة مخصصة لكل صف دراسي. القصص مزودة بنطق صوتي متقن يمكن إيقافه وتشغيله، بالإضافة إلى أسئلة الفهم الاستيعابي والقيم الأخلاقية وميزة تكبير الخط للقراءة المريحة.",
      durationSeconds: 16,
      targetTab: 'stories',
      accentColor: 'from-emerald-600 to-green-700',
      bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
      badge: "300 قصة مدعومة صوتياً",
      icon: <Sparkles className="w-8 h-8 text-emerald-300" />,
      highlights: [
        "300 قصة متدرجة لغوياً وقيمياً (50 قصة لكل صف من 1 إلى 6)",
        "قراءة صوتية فصيحة مع إمكانية الاستماع للقصة كاملة وتكرارها",
        "أسئلة فهم قرائي ذكية بعد كل قصة لاختبار الاستيعاب",
        "أدوات تحكم سهلة في حجم النص والتبديل السريع بين الصفوف"
      ]
    },
    {
      id: 6,
      title: "الأنشطة التفاعلية ومختبر النطق الصوتي",
      subtitle: "التعلم باللعب وتدريب مخارج الحروف الصائتة والصامتة",
      narration: "يتضمن التطبيق ألعاباً تعليمية تفاعلية كلعبة الذاكرة اللغوية ومطابقة الحركات والكلمات، إلى جانب مختبر النطق الصوتي الذاتي الذي يُمكّن التلميذ من الاستماع لأي كلمة والتدرب على نطقها الصحيح ومقارنة صوته بمخارج الحروف الفصيحة.",
      durationSeconds: 15,
      targetTab: 'games',
      accentColor: 'from-indigo-600 to-violet-700',
      bgGradient: 'from-indigo-950 via-slate-900 to-slate-950',
      badge: "ألعاب ذكاء + مختبر نطق",
      icon: <Gamepad2 className="w-8 h-8 text-indigo-400" />,
      highlights: [
        "ألعاب مطابقة الحروف والكلمات وتحديات الذاكرة البصرية",
        "مختبر النطق للتحقق الذاتي من مخارج الحروف والمدود",
        "مؤثرات صوتية محفزة للأطفال تدعم التغذية الراجعة الإيجابية",
        "بيئة تعليمية خالية تماماً من الإعلانات والمشتتات"
      ]
    },
    {
      id: 7,
      title: "لوحة ولي الأمر وبناء تطبيق الأندرويد",
      subtitle: "متابعة التقدم التربوي وملف سير العمل البرمجي لبناء APK",
      narration: "وفي الختام، توفر لوحة ولي الأمر تقريراً دقيقاً عن عدد النجوم، والأوسمة، والدروس المكتملة، مع إمكانية تصفير أو حفظ التقدم. كما يتضمن التطبيق ملف سير عمل متكامل لبناء وتصدير التطبيق كملف أندرويد حقيقي بصيغة إي بي كي ليعمل على جميع الهواتف المحمولة واللوحية.",
      durationSeconds: 16,
      targetTab: 'parents',
      accentColor: 'from-slate-700 to-slate-900',
      bgGradient: 'from-slate-900 via-slate-950 to-black',
      badge: "جاهز للأندرويد APK + لوحة متابعة",
      icon: <Smartphone className="w-8 h-8 text-emerald-400" />,
      highlights: [
        "لوحة متابعة لولي الأمر والمعلم ترصد بدقة إنجازات الطفل والأوسمة",
        "ملف سير عمل GitHub Actions لبناء وتصدير ملف APK حقيقي",
        "أيقونة رسمية احترافية معتمدة للتطبيق وواجهات متوافقة مع الجوال",
        "إهداء من مبادرة م/ شوقي حسن الجعور المجتمعية لخدمة أبنائنا"
      ]
    }
  ];

  // Slides data for Presentation Mode
  const SLIDES = [
    {
      id: 1,
      title: "تطبيق «أَقْرَأُهَا صَحّ» لتعليم اللغة العربية",
      subtitle: "عرض تقديمي شامل لملامح ومكونات المبادرة التعليمية",
      category: "بطاقة التعريف",
      content: [
        "مبادرة مجتمعية تطوعية غير ربحية موجهة لتلاميذ مرحلة التعليم الأساسي (الصفوف 1-6).",
        "إشراف وتطوير: م/ شوقي حسن الجعور، بهدف ترسيخ إتقان القراءة والكتابة والنطق الفصيح.",
        "تطبيق يعمل بالكامل دون الحاجة إلى إنترنت (Offline-First)، آمناً تماماً وخالياً من الإعلانات.",
        "متوافق مع الهواتف الذكية، الأجهزة اللوحية، وشاشات العرض المدرسية وأجهزة أندرويد."
      ],
      icon: <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />,
      color: "emerald"
    },
    {
      id: 2,
      title: "الرؤية والأهداف التربوية للمشروع",
      subtitle: "غرس محبة لغة الضاد وبناء الثقة اللغوية لدى الناشئة",
      category: "الأهداف التربوية",
      content: [
        "معالجة صعوبات القراءة والتهجئة المبكرة بطرق حسية وبصرية وسمعية تفاعلية.",
        "توفير بيئة تعليمية محفزة تجمع بين المتعة والمنهجية المدرسية الدقيقة.",
        "تمكين التلميذ من التعلم الذاتي المستقل مع توفير أدوات متابعة واضحة لولي الأمر والمعلم.",
        "إتاحة المحتوى التعليمي عالي الجودة لكافة التلاميذ مجاناً وفي كل الظروف."
      ],
      icon: <Sparkles className="w-12 h-12 text-amber-500" />,
      color: "amber"
    },
    {
      id: 3,
      title: "الركن الأول: مكتبة الحروف والتتبع التفاعلي",
      subtitle: "التعلم الحسي الحركي لرسم الحركات والكلمات",
      category: "الأساسيات الهجائية",
      content: [
        "جميع الحروف الهجائية الـ 28 مع مواضعها في الكلمة (أول، وسط، آخر).",
        "لوحة رسم تفاعلية ترشد التلميذ لرسم الحرف بيده وأصابعه بدقة مع مسح وتعديل.",
        "نطق صوتي فصيح للحرف بالحركات القصيرة (الفتحة، الضمة، الكسرة).",
        "كلمات تدريبية مصورة لكل حرف مع إمكانية الاستماع الفوري عند النقر."
      ],
      icon: <PenTool className="w-12 h-12 text-sky-500" />,
      color: "sky"
    },
    {
      id: 4,
      title: "الركن الثاني: الدروس المنهجية الممتدة (+30 نشاطاً)",
      subtitle: "مناهج الصفوف 1 إلى 6 بأكثر من 30 تمريناً لكل درس",
      category: "المناهج الدراسية",
      content: [
        "مناهج دراسية متدرجة تغطي الصفوف من الأول إلى السادس بالتفصيل.",
        "كل درس يحتوي على أكثر من ثلاثين نشاطاً فرعياً وتدريباً تفاعلياً متنوعاً.",
        "تمارين متخصصة في: المدود، التنوين، الشدة، اللام الشمسية واللام القمرية، والإملاء.",
        "مؤشرات تقدم ذكية تسجل إنجازات التلميذ لحظة بلحظة وتشجعه على الاستمرار."
      ],
      icon: <BookOpen className="w-12 h-12 text-emerald-500" />,
      color: "emerald"
    },
    {
      id: 5,
      title: "الركن الثالث: محرك الاختبارات التقييمية (Quizzes) والأوسمة",
      subtitle: "نظام قياس فوري مع تكريم التلميذ بالدرجة الكاملة",
      category: "التقويم والتعزيز",
      content: [
        "اختبارات تقييمية ذكية ترافق كل درس للتأكد من استيعاب المفاهيم اللغوية.",
        "دعم كامل للقراءة الصوتية لنصوص الأسئلة والخيارات لمساعدة التلاميذ الصغار.",
        "منح أوسمة ذهبية تذكارية فورية عند حصول التلميذ على الدرجة الكاملة 100%.",
        "احتفالية تشجيعية بمؤثرات صوتية ومفرقعات ألوان تحفز التلميذ على التكرار والتفوق."
      ],
      icon: <Award className="w-12 h-12 text-purple-500" />,
      color: "purple"
    },
    {
      id: 6,
      title: "الركن الرابع: مكتبة القصص القرائية الكبرى (300 قصة)",
      subtitle: "50 قصة هادفة وممتعة لكل صف دراسي بصوت فصيح",
      category: "الإثراء القرائي",
      content: [
        "مكتبة ضخمة تضم 300 قصة تعليمية وتربوية قيّمة (50 قصة لكل صف من 1 إلى 6).",
        "ميزة الاستماع الصوتي الفصيح للنص كاملاً بصوت نقي متسلسل.",
        "أسئلة فهم واستيعاب تلي كل قصة لتعميق التفكير النقدي والقيم الأخلاقية.",
        "إمكانية التحكم بحجم الخط وتبديل الصفوف بكل سهولة وسلاسة."
      ],
      icon: <Sparkles className="w-12 h-12 text-indigo-500" />,
      color: "indigo"
    },
    {
      id: 7,
      title: "الركن الخامس: الأنشطة ومختبر النطق والتحقق الصوتي",
      subtitle: "التعلم باللعب واختبار النطق الذاتي للتلميذ",
      category: "المهارات الشفوية واللعب",
      content: [
        "ألعاب لغوية هادفة مثل مطابقة الكلمات بالحروف وبطاقات الذاكرة المعجمية.",
        "مختبر النطق الصوتي الذي يتيح نطق أي كلمة بالتشكيل والاستماع إليها فوراً.",
        "ميزة التدريب الصوتي ومقارنة نطق التلميذ بالمخارج الصوتية الصحيحة.",
        "تعزيز المتعة البصرية وتفاعل الأطفال مع الرسوم والأيقونات الجذابة."
      ],
      icon: <Gamepad2 className="w-12 h-12 text-amber-500" />,
      color: "amber"
    },
    {
      id: 8,
      title: "لوحة المتابعة والتحفيز المستمر",
      subtitle: "متابعة إنجازات التلميذ خطوة بخطوة وتعزيز ثقته بنفسه",
      category: "المتابعة والتحفيز",
      content: [
        "لوحة واضحة لولي الأمر والمعلم ترصد نسبة إنجاز كل درس وقصة وتدريب بدقة.",
        "سجل تفاعلي للأوسمة والنقاط والنجوم المحفزة لتعزيز الإيجابية لدى التلميذ.",
        "واجهات هادئة ومريحة خالية من أي مشتتات أو إعلانات لتوفير بيئة تعليمية آمنة ومريحة.",
        "إمكانية إعادة التدريبات والأنشطة في أي وقت لمزيد من الإتقان والطلاقة اللغوية."
      ],
      icon: <Users className="w-12 h-12 text-teal-500" />,
      color: "teal"
    }
  ];

  const currentScene = SCENES[currentSceneIndex];
  const currentSlide = SLIDES[currentSlideIndex];

  // Stop narration and speech
  const stopNarration = () => {
    offlineAudioService.stopSpeaking();
    setIsSpeakingNarration(false);
  };

  // Play narration for the current scene
  const playCurrentSceneNarration = async (scene = currentScene) => {
    if (isAudioMuted) return;
    stopNarration();
    setIsSpeakingNarration(true);
    await offlineAudioService.speakArabic(scene.narration, 0.88, true);
    setIsSpeakingNarration(false);
  };

  // Play narration for the current slide
  const playCurrentSlideNarration = async (slide = currentSlide) => {
    if (isAudioMuted) return;
    stopNarration();
    setIsSpeakingNarration(true);
    const textToSpeak = `${slide.title}. ${slide.subtitle}. النقاط الرئيسية: ${slide.content.join('. ')}`;
    await offlineAudioService.speakArabic(textToSpeak, 0.88, true);
    setIsSpeakingNarration(false);
  };

  // Handle Play / Pause for the Video Walkthrough
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopNarration();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    } else {
      setIsPlaying(true);
      offlineAudioService.playClickSound();
      playCurrentSceneNarration();
    }
  };

  // Advance to next scene
  const nextScene = () => {
    stopNarration();
    if (currentSceneIndex < SCENES.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setSceneProgress(0);
    } else {
      // Reached the end
      setIsPlaying(false);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  // Back to previous scene
  const prevScene = () => {
    stopNarration();
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setSceneProgress(0);
    }
  };

  // When scene changes, if isPlaying is active, narrate and schedule next
  useEffect(() => {
    if (mode !== 'video') return;

    if (isPlaying) {
      playCurrentSceneNarration(SCENES[currentSceneIndex]);

      // Progress bar interval
      const durationMs = (SCENES[currentSceneIndex].durationSeconds * 1000) / playbackSpeed;
      const stepMs = 100;
      let elapsed = 0;

      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = setInterval(() => {
        elapsed += stepMs;
        setSceneProgress(Math.min(100, (elapsed / durationMs) * 100));
      }, stepMs);

      // Auto advance timer
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (currentSceneIndex < SCENES.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
          setSceneProgress(0);
        } else {
          setIsPlaying(false);
          setSceneProgress(100);
          offlineAudioService.playFanfare();
          confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
        }
      }, durationMs);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentSceneIndex, isPlaying, playbackSpeed, mode]);

  // Clean up when switching modes or unmounting
  useEffect(() => {
    return () => {
      stopNarration();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`space-y-6 transition-all ${
        isFullscreen ? 'p-6 bg-slate-950 text-white min-h-screen overflow-y-auto' : ''
      }`}
    >
      {/* Top Banner & Mode Switcher */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-400 to-teal-500 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-300 font-black text-xl sm:text-2xl">
              صَحّ
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                مرئي وناطق باللغة العربية
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                مبادرة م/ شوقي حسن الجعور
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              قائمة «حَوْلَ التَّطْبِيق» – العرض التقديمي وفيديو الشرح
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              شرح تفصيلي لتطبيق «أَقْرَأُهَا صَحّ» من البداية إلى النهاية مع ملف العرض التقديمي المستقل
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 shrink-0 w-full md:w-auto justify-center flex-wrap">
          <button
            onClick={() => {
              setMode('video');
              stopNarration();
              offlineAudioService.playClickSound();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'video'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Tv className="w-4 h-4 text-amber-300" />
            <span>الفيديو الناطق</span>
          </button>

          <button
            onClick={() => {
              setMode('slides');
              setIsPlaying(false);
              stopNarration();
              offlineAudioService.playClickSound();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'slides'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Presentation className="w-4 h-4 text-emerald-200" />
            <span>شرائح العرض</span>
          </button>

          <button
            onClick={() => {
              setMode('about');
              setIsPlaying(false);
              stopNarration();
              offlineAudioService.playClickSound();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'about'
                ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Info className="w-4 h-4 text-sky-200" />
            <span>عن المبادرة والملفات المستقلة</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODE 1: INTERACTIVE ARABIC VIDEO WALKTHROUGH */}
      {/* ========================================== */}
      {mode === 'video' && (
        <div className="space-y-4">
          {/* Main Video Screen Container (16:9 Aspect Ratio) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950 aspect-[16/9] min-h-[340px] sm:min-h-[460px] flex flex-col justify-between p-4 sm:p-8 text-white select-none">
            {/* Background Ambient Glow & Visual Elements */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} opacity-95 transition-all duration-700`}
            />

            {/* Subtle Animated Geometry/Particles */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
              <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-500 blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-500 blur-3xl animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500 blur-3xl opacity-30" />
            </div>

            {/* Video Header: Chapter Indicator & Badge */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase bg-red-600/90 text-white px-2.5 py-1 rounded-full shadow-xs">
                  المشهد {currentSceneIndex + 1} من {SCENES.length}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-300 hidden sm:inline">
                  {currentScene.badge}
                </span>
              </div>

              {/* Direct Jump to App Feature Button */}
              <button
                onClick={() => {
                  stopNarration();
                  onNavigateTab(currentScene.targetTab);
                }}
                className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 transition-all text-amber-200 hover:text-white"
              >
                <span>جرّب هذا الركن في التطبيق</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Center Stage: Interactive Scene Animation & UI Simulation */}
            <div className="relative z-10 my-auto py-2 sm:py-4 flex flex-col md:flex-row items-center gap-6 justify-between">
              {/* Left Column: Scene Text & Highlights */}
              <div className="flex-1 space-y-3 sm:space-y-4 max-w-xl text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-amber-300 text-xs font-bold">
                  {currentScene.icon}
                  <span>{currentScene.subtitle}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                  {currentScene.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {currentScene.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 text-xs sm:text-sm text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual Simulated Mockup Device Frame */}
              <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-72 lg:w-80">
                <div className="w-full bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-700/80 shadow-2xl relative">
                  {/* Miniature App Screen Simulation */}
                  <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">أَقْرَأُهَا صَحّ</span>
                    </div>

                    {/* Scene Specific Live Animation */}
                    {currentSceneIndex === 0 && (
                      <div className="text-center py-4 space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl font-black text-white shadow-lg animate-bounce">
                          صَحّ
                        </div>
                        <div className="text-xs font-bold text-amber-300">مرحباً بكم يا أبطال العربية!</div>
                        <div className="text-[10px] text-slate-400">الصفوف 1 - 6 • بدون إنترنت</div>
                      </div>
                    )}

                    {currentSceneIndex === 1 && (
                      <div className="text-center py-2 space-y-2">
                        <div className="text-3xl font-black text-sky-300 bg-sky-950/60 py-2 rounded-xl border border-sky-500/40">
                          بَ • بُ • بِ
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-300 font-bold">
                          <span>بَابٌ 🚪</span>
                          <span className="mx-1">•</span>
                          <span>بُرْتُقَالٌ 🍊</span>
                        </div>
                        <div className="text-[10px] text-slate-400">تتبع ذكي بالأصابع على الشاشة</div>
                      </div>
                    )}

                    {currentSceneIndex === 2 && (
                      <div className="py-2 space-y-1.5 text-right">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                          <span>الدرس 1: نشيد الوطن</span>
                          <span className="text-[10px] bg-amber-500/20 px-1.5 rounded">30 نشاطاً</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full w-4/5 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-3 gap-1 pt-1">
                          <div className="text-[9px] bg-slate-700/80 p-1 rounded text-center text-slate-300">المدود ⭐</div>
                          <div className="text-[9px] bg-slate-700/80 p-1 rounded text-center text-slate-300">الشدة ✨</div>
                          <div className="text-[9px] bg-slate-700/80 p-1 rounded text-center text-slate-300">التهجئة 📚</div>
                        </div>
                      </div>
                    )}

                    {currentSceneIndex === 3 && (
                      <div className="py-2 space-y-2 text-center">
                        <div className="text-xs font-bold text-purple-300">سؤال الاختبار التقييمي:</div>
                        <div className="bg-purple-950/70 p-2 rounded-lg text-[11px] font-bold text-white border border-purple-500/30">
                          ما هو الحرف الممدود في كلمة «كِتَاب»؟
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                            إجابة صحيحة 100% 🏅
                          </span>
                        </div>
                      </div>
                    )}

                    {currentSceneIndex === 4 && (
                      <div className="py-2 space-y-1 text-center">
                        <div className="text-2xl">📚📖✨</div>
                        <div className="text-xs font-bold text-emerald-300">قصة: الأمانة والنحلة النشيطة</div>
                        <div className="text-[10px] text-slate-300 bg-slate-900/80 p-1.5 rounded">
                          «في بستانِ الزّهورِ، كانَتِ النّحْلَةُ تَعْمَلُ بنشاطٍ...»
                        </div>
                        <div className="text-[9px] text-amber-300 font-bold">قراءة صوتية فصيحة متزامنة 🔊</div>
                      </div>
                    )}

                    {currentSceneIndex === 5 && (
                      <div className="py-2 space-y-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Mic className="w-5 h-5 text-rose-400 animate-pulse" />
                          <div className="h-6 flex items-center gap-0.5">
                            <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce" />
                            <span className="w-1 h-5 bg-indigo-300 rounded-full animate-bounce delay-100" />
                            <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                            <span className="w-1 h-6 bg-indigo-200 rounded-full animate-bounce" />
                          </div>
                        </div>
                        <div className="text-xs font-bold text-indigo-200">مختبر النطق الذاتي: قُمْ بِالنُّطْقِ</div>
                        <div className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 py-1 rounded">
                          درجة التطابق الصوتي: 100% ممتاز! ⭐
                        </div>
                      </div>
                    )}

                    {currentSceneIndex === 6 && (
                      <div className="py-2 space-y-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>18 وساماً فخرياً مفتوحاً</span>
                        </div>
                        <div className="bg-slate-700/80 p-1.5 rounded text-[10px] text-emerald-300 font-bold flex items-center justify-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>جاهز للتثبيت كملف Android APK</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Video Subtitles / Spoken Narration Bar */}
            <div className="relative z-10 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 my-2 text-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-[11px] text-amber-300 font-bold">
                {isSpeakingNarration ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>جاري القراءة الصوتية الفصيحة...</span>
                  </>
                ) : (
                  <>
                    <Volume1 className="w-4 h-4 text-slate-400" />
                    <span>النص الصوتي للراوي:</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-base font-semibold text-slate-100 leading-relaxed max-w-3xl mx-auto">
                {currentScene.narration}
              </p>
            </div>

            {/* Video Player Controls & Timeline */}
            <div className="relative z-10 space-y-2.5 pt-2">
              {/* Interactive Timeline Bar */}
              <div className="relative flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  {Math.round((sceneProgress / 100) * currentScene.durationSeconds)}s
                </span>

                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = (clickX / rect.width) * 100;
                    setSceneProgress(pct);
                  }}
                  className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden cursor-pointer relative group"
                >
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full transition-all duration-100 rounded-full"
                    style={{ width: `${sceneProgress}%` }}
                  />
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  {currentScene.durationSeconds}s
                </span>
              </div>

              {/* Main Player Control Buttons */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Left Controls: Previous, Play/Pause, Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevScene}
                    disabled={currentSceneIndex === 0}
                    title="المشهد السابق"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <SkipForward className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95 ${
                      isPlaying
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white ring-4 ring-emerald-500/30'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-slate-950" />
                        <span>إيقاف مؤقت</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>تشغيل الفيديو</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={nextScene}
                    disabled={currentSceneIndex === SCENES.length - 1}
                    title="المشهد التالي"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <SkipBack className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={() => {
                      setSceneProgress(0);
                      playCurrentSceneNarration();
                    }}
                    title="إعادة تشغيل هذا المشهد"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-slate-300 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Controls: Audio Mute, Speed, Fullscreen */}
                <div className="flex items-center gap-2">
                  {/* Speed Selector */}
                  <div className="flex items-center bg-white/10 rounded-xl p-1 text-[11px] font-bold">
                    <button
                      onClick={() => setPlaybackSpeed(1)}
                      className={`px-2 py-0.5 rounded-lg ${
                        playbackSpeed === 1 ? 'bg-emerald-500 text-white' : 'text-slate-300'
                      }`}
                    >
                      1x
                    </button>
                    <button
                      onClick={() => setPlaybackSpeed(1.25)}
                      className={`px-2 py-0.5 rounded-lg ${
                        playbackSpeed === 1.25 ? 'bg-emerald-500 text-white' : 'text-slate-300'
                      }`}
                    >
                      1.25x
                    </button>
                    <button
                      onClick={() => setPlaybackSpeed(1.5)}
                      className={`px-2 py-0.5 rounded-lg ${
                        playbackSpeed === 1.5 ? 'bg-emerald-500 text-white' : 'text-slate-300'
                      }`}
                    >
                      1.5x
                    </button>
                  </div>

                  {/* Audio Narration Toggle */}
                  <button
                    onClick={() => {
                      if (isAudioMuted) {
                        setIsAudioMuted(false);
                        playCurrentSceneNarration();
                      } else {
                        setIsAudioMuted(true);
                        stopNarration();
                      }
                    }}
                    title={isAudioMuted ? "تشغيل صوت الراوي" : "كتم صوت الراوي"}
                    className={`p-2 rounded-xl transition-all ${
                      isAudioMuted
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/10 text-emerald-400 hover:bg-white/20'
                    }`}
                  >
                    {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    title="ملء الشاشة"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Navigation Selector Grid */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span>فصول ومشاهد الفيديو التعريفي (7 مشاهد)</span>
                <span className="text-[11px] font-normal text-slate-500">انقر على أي مشهد للانتقال إليه مباشرة</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setCurrentSceneIndex(idx);
                    setSceneProgress(0);
                    offlineAudioService.playClickSound();
                    if (isPlaying) {
                      playCurrentSceneNarration(scene);
                    }
                  }}
                  className={`text-right p-3 rounded-2xl border transition-all text-xs font-bold flex items-start gap-2.5 ${
                    currentSceneIndex === idx
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm ring-2 ring-emerald-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 ${
                      currentSceneIndex === idx
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-black">{scene.title}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{scene.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODE 2: PROFESSIONAL SLIDE DECK PRESENTATION */}
      {/* ========================================== */}
      {mode === 'slides' && (
        <div className="space-y-4">
          {/* Active Slide Display Canvas */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 min-h-[460px] flex flex-col justify-between relative">
            {/* Top Bar of Slide */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-black">
                  الشريحة {currentSlideIndex + 1} من {SLIDES.length}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  {currentSlide.category}
                </span>
              </div>

              {/* Slide Narration Trigger */}
              <button
                onClick={() => playCurrentSlideNarration()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-xs"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>{isSpeakingNarration ? "جاري الشرح الصوتي..." : "استمع لشرح الشريحة"}</span>
              </button>
            </div>

            {/* Slide Body Content */}
            <div className="my-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                  {currentSlide.icon}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    {currentSlide.title}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-slate-500 mt-1">
                    {currentSlide.subtitle}
                  </p>
                </div>
              </div>

              {/* Content Bullet Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {currentSlide.content.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Footer Navigation */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  stopNarration();
                  if (currentSlideIndex > 0) {
                    setCurrentSlideIndex(prev => prev - 1);
                    offlineAudioService.playClickSound();
                  }
                }}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-slate-700 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الشريحة السابقة</span>
              </button>

              {/* Slide Progress Dots */}
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      stopNarration();
                      setCurrentSlideIndex(i);
                      offlineAudioService.playClickSound();
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSlideIndex === i ? 'w-8 bg-emerald-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  stopNarration();
                  if (currentSlideIndex < SLIDES.length - 1) {
                    setCurrentSlideIndex(prev => prev + 1);
                    offlineAudioService.playClickSound();
                  } else {
                    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
                  }
                }}
                disabled={currentSlideIndex === SLIDES.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-white shadow-md transition-all"
              >
                <span>الشريحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable / Downloadable Presentation Deck Summary Button */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-5 shadow-sm border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-right">
              <Printer className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <div className="text-sm font-black text-white">طباعة وتصدير العرض التقديمي (PDF/Print)</div>
                <div className="text-xs text-slate-300">
                  يمكنك طباعة أو حفظ جميع الشرائح كملف مرجعي للمدارس والأنشطة الصفية
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="/about-app-presentation.html"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح العرض كملف مستقل</span>
              </a>

              <button
                onClick={() => {
                  offlineAudioService.playClickSound();
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all shrink-0 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة العرض الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODE 3: ABOUT APP & STANDALONE EXTERNAL FILES */}
      {/* ========================================== */}
      {mode === 'about' && (
        <div className="space-y-6">
          {/* Initiative Hero Card */}
          <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-xl overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-emerald-300 shrink-0">
                  صَحّ
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black mb-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>مبادرة مجتمعية تطوعية غير ربحية</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    تطبيق «أَقْرَأُهَا صَحّ» لتعليم العربية
                  </h3>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">
                    إشراف وتطوير: م/ شوقي حسن الجعور
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/about-app-presentation.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح العرض بملف مستقل</span>
                </a>

                <a
                  href="/about-app-presentation.html"
                  download="about-app-presentation.html"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل ملف العرض (HTML)</span>
                </a>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-6">
              مشروع «أَقْرَأُهَا صَحّ» هو وقف تعليمي رقمي تفاعلي صُمم خصيصاً لمساعدة تلاميذ وتلميذات المرحلة الابتدائية (الصفوف من 1 إلى 6) على التمكن التام من مهارات القراءة والكتابة والنطق السليم للغة الضاد، والتغلب على مشكلات التعثر القرائي والإملائي من خلال محاكاة حسية بصرية وصوتية متقنة تعمل محلياً بنسبة 100% دون الحاجة إلى إنترنت.
            </p>
          </div>

          {/* Standalone External Files Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <FolderDown className="w-6 h-6 text-emerald-600" />
                  <span>الملفات الخارجية المستقلة المتضمنة في المشروع</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  ملفات جاهزة ومستقلة تماماً يمكنك استخدامها وتشغيلها خارج المنصة في أي وقت
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File 1: Standalone HTML Presentation */}
              <div className="bg-slate-50 rounded-2xl p-5 border-2 border-emerald-200 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                    <Tv className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h5 className="font-black text-base text-slate-900">
                    ملف العرض التقديمي المستقل (HTML)
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ملف HTML واحد شامل ومستقل تماماً يحتوي على فيديو الشرح الناطق والشرائح الثمانية والقراءة الصوتية ودعم الطباعة المباشرة.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    /public/about-app-presentation.html
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="/about-app-presentation.html"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                  >
                    فتح العرض كملف مستقل
                  </a>
                  <a
                    href="/about-app-presentation.html"
                    download="about-app-presentation.html"
                    className="px-3 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
                    title="تنزيل الملف"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* File 2: Markdown Full Documentation */}
              <div className="bg-slate-50 rounded-2xl p-5 border-2 border-amber-200 hover:border-amber-400 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <h5 className="font-black text-base text-slate-900">
                    دليل العرض والسيناريو الشامل (Markdown)
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ملف توثيق مكتمل بصيغة Markdown في جذر المشروع، يتضمن نصوص سيناريو الفيديو السبعة وجداول الشرائح الثمانية كاملة.
                  </p>
                  <div className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    /ABOUT_APP_PRESENTATION.md
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/ABOUT_APP_PRESENTATION.md"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 shadow-xs"
                  >
                    استعراض نص السيناريو والدليل
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Stats Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mb-0.5">6</div>
              <div className="text-xs font-bold text-slate-700">صفوف دراسية</div>
              <div className="text-[10px] text-slate-400">الصفوف 1 - 6</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-sky-600 mb-0.5">28</div>
              <div className="text-xs font-bold text-slate-700">حرفاً هجائياً</div>
              <div className="text-[10px] text-slate-400">تتبع ونطق فصيح</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-amber-600 mb-0.5">+30</div>
              <div className="text-xs font-bold text-slate-700">نشاطاً لكل درس</div>
              <div className="text-[10px] text-slate-400">تدريبات متدرجة</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 mb-0.5">300</div>
              <div className="text-xs font-bold text-slate-700">قصة صوتية</div>
              <div className="text-[10px] text-slate-400">50 قصة لكل صف</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-purple-600 mb-0.5">18</div>
              <div className="text-xs font-bold text-slate-700">وساماً ذهبياً</div>
              <div className="text-[10px] text-slate-400">تحفيز للعلامة 100%</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-rose-600 mb-0.5">100%</div>
              <div className="text-xs font-bold text-slate-700">بدون إنترنت</div>
              <div className="text-[10px] text-slate-400">آمن وخالٍ من الإعلانات</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
