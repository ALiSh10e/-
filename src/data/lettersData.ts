export interface ArabicLetter {
  char: string;
  name: string;
  isolated: string;
  isolatedBadge?: string;
  initial: string;
  medial: string;
  final: string;
  vowels: {
    fatha: string;
    damma: string;
    kasra: string;
    sukoon: string;
  };
  sampleWords: {
    word: string;
    meaning: string;
    emoji: string;
    yemeniNote?: string;
  }[];
  audioPhoneticText: string;
  strokeInstructions: string[];
}

export const ARABIC_LETTERS: ArabicLetter[] = [
  {
    char: "أ",
    name: "الألف",
    isolated: "أ",
    initial: "أَ",
    medial: "ـأ",
    final: "ـا",
    vowels: { fatha: "أَ", damma: "أُ", kasra: "إِ", sukoon: "أْ" },
    sampleWords: [
      { word: "أَسَد", meaning: "ملك الغابة", emoji: "🦁" },
      { word: "إِبّ", meaning: "مدينة اللواء الأخضر الجميلة باليمن", emoji: "🌿", yemeniNote: "إب الخضراء جنة اليمن ومحافظة الشلالات" },
      { word: "أُمّ", meaning: "نبع الحنان", emoji: "👩" }
    ],
    audioPhoneticText: "أَلِف",
    strokeInstructions: ["ارسم خطاً عمودياً من الأعلى إلى الأسفل", "ارسم الهمزة نصف دائرة صغيرة فوقه مع خط مائل"]
  },
  {
    char: "ب",
    name: "الباء",
    isolated: "ب",
    initial: "بـ",
    medial: "ـبـ",
    final: "ـب",
    vowels: { fatha: "بَ", damma: "بُ", kasra: "بِ", sukoon: "بْ" },
    sampleWords: [
      { word: "بَاب", meaning: "مدخل الدار", emoji: "🚪" },
      { word: "بُنّ", meaning: "حبوب القهوة اليمانية الأصيلة", emoji: "☕", yemeniNote: "البن اليمني من أجود أنواع البن في العالم" },
      { word: "بَيْت", meaning: "المنزل الدافئ", emoji: "🏠" }
    ],
    audioPhoneticText: "بَاء",
    strokeInstructions: ["ارسم صحناً أفقياً من اليمين إلى اليسار", "ضع نقطة واحدة واضحة أسفل الصحن"]
  },
  {
    char: "ت",
    name: "التاء",
    isolated: "ت",
    initial: "تـ",
    medial: "ـتـ",
    final: "ـت",
    vowels: { fatha: "تَ", damma: "تُ", kasra: "تِ", sukoon: "تْ" },
    sampleWords: [
      { word: "تَمْر", meaning: "ثمار النخيل اللذيذة", emoji: "🌴" },
      { word: "تَعِزّ", meaning: "عاصمة الثقافة في اليمن وقِبلة الأدب", emoji: "🏰", yemeniNote: "تعز الحالمة وجبل صبر الأشم" },
      { word: "تُفَّاح", meaning: "فاكهة طيبة", emoji: "🍎" }
    ],
    audioPhoneticText: "تَاء",
    strokeInstructions: ["ارسم صحناً كصحن الباء", "ضع نقطتين متجاورتين فوق الصحن كعينين باسومتين"]
  },
  {
    char: "ث",
    name: "الثاء",
    isolated: "ث",
    initial: "ثـ",
    medial: "ـثـ",
    final: "ـث",
    vowels: { fatha: "ثَ", damma: "ثُ", kasra: "ثِ", sukoon: "ثْ" },
    sampleWords: [
      { word: "ثَعْلَب", meaning: "حيوان ذكي وسريع", emoji: "🦊" },
      { word: "ثَوْب", meaning: "لباس عربي تقليدي", emoji: "👔" },
      { word: "ثِمَار", meaning: "خيرات الأشجار", emoji: "🍇" }
    ],
    audioPhoneticText: "ثَاء",
    strokeInstructions: ["ارسم الصحن برقة", "ضع ثلاث نقاط في الأعلى تشكل مثلثاً صغيراً"]
  },
  {
    char: "ج",
    name: "الجيم",
    isolated: "ج",
    initial: "جـ",
    medial: "ـجـ",
    final: "ـج",
    vowels: { fatha: "جَ", damma: "جُ", kasra: "جِ", sukoon: "جْ" },
    sampleWords: [
      { word: "جَبَل", meaning: "مرتفع صخري شامخ", emoji: "⛰️" },
      { word: "جَمَل", meaning: "سفينة الصحراء الصبورة", emoji: "🐪" },
      { word: "جَنَّة", meaning: "بستان عامر بالخضرة والنعيم", emoji: "🌺" }
    ],
    audioPhoneticText: "جِيم",
    strokeInstructions: ["ارسم رأس الجيم بتموج مائل من اليسار لليمين", "انزل بنصف دائرة بطنية واسعة", "ضع نقطة في بطنه"]
  },
  {
    char: "ح",
    name: "الحاء",
    isolated: "ح",
    initial: "حـ",
    medial: "ـحـ",
    final: "ـح",
    vowels: { fatha: "حَ", damma: "حُ", kasra: "حِ", sukoon: "حْ" },
    sampleWords: [
      { word: "حِكْمَة", meaning: "رجاحة العقل وحسن التدبير", emoji: "💡", yemeniNote: "الإيمان يمانٍ والحكمة يمانية كما جاء في الأثر النبوي" },
      { word: "حَمَامَة", meaning: "طائر السلام الجميل", emoji: "🕊️" },
      { word: "حَقْل", meaning: "أرض الخير والزراعة", emoji: "🌾" }
    ],
    audioPhoneticText: "حَاء",
    strokeInstructions: ["مثل رأس الجيم تماماً ونصف دائرة بطنية", "الحاء نظيفة بلا نقاط في بطنها أو فوقها"]
  },
  {
    char: "خ",
    name: "الخاء",
    isolated: "خ",
    initial: "خـ",
    medial: "ـخـ",
    final: "ـخ",
    vowels: { fatha: "خَ", damma: "خُ", kasra: "خِ", sukoon: "خْ" },
    sampleWords: [
      { word: "خُبْز", meaning: "طعام أساسي طيب", emoji: "🍞" },
      { word: "خَيْر", meaning: "العطاء والنماء والإحسان", emoji: "✨" },
      { word: "خَيْمَة", meaning: "مأوى عربي أصيل", emoji: "⛺" }
    ],
    audioPhoneticText: "خَاء",
    strokeInstructions: ["رأس متموج وبطن واسع كالحاء", "نقطة واحدة تعلو رأسه كقبعة جميلة"]
  },
  {
    char: "د",
    name: "الدال",
    isolated: "د",
    initial: "د",
    medial: "ـد",
    final: "ـد",
    vowels: { fatha: "دَ", damma: "دُ", kasra: "دِ", sukoon: "دْ" },
    sampleWords: [
      { word: "دَار", meaning: "البيت والمسكن الآمن", emoji: "🏡" },
      { word: "دَفْتَر", meaning: "كراس الكتابة والدروس", emoji: "📒" },
      { word: "دَوْعَن", meaning: "وادي دوعن الشهير بالعسل الصافي في حضرموت", emoji: "🍯", yemeniNote: "عسل دوعن من أجود كنوز أرض اليمن" }
    ],
    audioPhoneticText: "دَال",
    strokeInstructions: ["انزل بزاوية مائلة ثم انعطف أفقياً على السطر كالقوس الصغير"]
  },
  {
    char: "ذ",
    name: "الذال",
    isolated: "ذ",
    initial: "ذ",
    medial: "ـذ",
    final: "ـذ",
    vowels: { fatha: "ذَ", damma: "ذُ", kasra: "ذِ", sukoon: "ذْ" },
    sampleWords: [
      { word: "ذَهَب", meaning: "معدن نفيس برّاق", emoji: "💍" },
      { word: "ذُرَة", meaning: "نبات حبوب يزرع في سهول ووديان اليمن", emoji: "🌽", yemeniNote: "الذرة الرفيعة والبيضاء طعام الخير بالقرى اليمنية" },
      { word: "ذِئْب", meaning: "حيوان شجاع", emoji: "🐺" }
    ],
    audioPhoneticText: "ذَال",
    strokeInstructions: ["ارسم شكل الدال المنحني بزاوية", "ضع نقطة فوق رأسه، وأخرج طرف لسانك عند النطق"]
  },
  {
    char: "ر",
    name: "الراء",
    isolated: "ر",
    initial: "ر",
    medial: "ـر",
    final: "ـر",
    vowels: { fatha: "رَ", damma: "رُ", kasra: "رِ", sukoon: "رْ" },
    sampleWords: [
      { word: "رَمْل", meaning: "حبات الصحراء الذهبية", emoji: "🏜️" },
      { word: "رُمَّان", meaning: "فاكهة لذيذة تشتهر بها صعدة في اليمن", emoji: "🍎", yemeniNote: "رمان صعدة اليمني مشهور بحلاوته الفائقة" },
      { word: "رَسْم", meaning: "فن التعبير بالألوان", emoji: "🎨" }
    ],
    audioPhoneticText: "رَاء",
    strokeInstructions: ["ابدأ بسن صغير فوق السطر ثم انزلَق بمنحنى كالهلال تحت السطر"]
  },
  {
    char: "ز",
    name: "الزاي",
    isolated: "ز",
    initial: "ز",
    medial: "ـز",
    final: "ـز",
    vowels: { fatha: "زَ", damma: "زُ", kasra: "زِ", sukoon: "زْ" },
    sampleWords: [
      { word: "زَبِيد", meaning: "مدينة تاريخية عريقة بالعلم ومنارة فكرية باليمن", emoji: "🏛️", yemeniNote: "زبيد مدينة التراث والعلماء باليمن" },
      { word: "زَيْتُون", meaning: "شجرة مباركة وثمر مفيد", emoji: "🫒" },
      { word: "زَهْرَة", meaning: "وردة فواحة العطر", emoji: "🌸" }
    ],
    audioPhoneticText: "زَاي",
    strokeInstructions: ["ارسم منحنى الراء المزحلق تحت السطر", "ضع نقطة مشرقة فوقه"]
  },
  {
    char: "س",
    name: "السين",
    isolated: "س",
    initial: "سـ",
    medial: "ـسـ",
    final: "ـس",
    vowels: { fatha: "سَ", damma: "سُ", kasra: "سِ", sukoon: "سْ" },
    sampleWords: [
      { word: "سَدّ", meaning: "بناء يحجز الماء كسد مأرب العظيم", emoji: "🌊", yemeniNote: "سد مأرب معجزة هندسية في تاريخ اليمن القديم" },
      { word: "سَمَاء", meaning: "الفضاء الصافي الواسع", emoji: "☁️" },
      { word: "سَفِينَة", meaning: "مركب يبحر في البحر", emoji: "🚢" }
    ],
    audioPhoneticText: "سِين",
    strokeInstructions: ["ارسم ثلاثة أسنان متقاربة صغيرة على السطر", "ثم انزل بكأس دائرية واسعة تحت السطر للأخير"]
  },
  {
    char: "ش",
    name: "الشين",
    isolated: "ش",
    initial: "شـ",
    medial: "ـشـ",
    final: "ـش",
    vowels: { fatha: "شَ", damma: "شُ", kasra: "شِ", sukoon: "شْ" },
    sampleWords: [
      { word: "شَمْس", meaning: "نجم النهار المنير والدافئ", emoji: "☀️" },
      { word: "شِبَام", meaning: "شِبام حضرموت أقدم ناطحات سحاب طينية بالعالم", emoji: "🏙️", yemeniNote: "شبام حضرموت جوهرة المعمار الطيني اليمني" },
      { word: "شَجَرَة", meaning: "نبتة مورقة ومثمرة", emoji: "🌳" }
    ],
    audioPhoneticText: "شِين",
    strokeInstructions: ["ارسم الأسنان الثلاثة كشكل السين", "ضع ثلاث نقاط فوقها كمثلث يضيء الحرف"]
  },
  {
    char: "ص",
    name: "الصاد",
    isolated: "ص",
    initial: "صـ",
    medial: "ـصـ",
    final: "ـص",
    vowels: { fatha: "صَ", damma: "صُ", kasra: "صِ", sukoon: "صْ" },
    sampleWords: [
      { word: "صَنْعَاء", meaning: "عاصمة اليمن التليدة ومدينة سام بن نوح", emoji: "🏰", yemeniNote: "صنعاء حوت كل فن وجمال بتراثها ومعمارها البديع" },
      { word: "صَقْر", meaning: "طائر جارح قوي ونبيل", emoji: "🦅" },
      { word: "صَبَاح", meaning: "أول النهار المشرق", emoji: "🌅" }
    ],
    audioPhoneticText: "صَاد",
    strokeInstructions: ["اصعد بمنحنى بيضاوي من السطر لليمين وأغلقه", "ارسم سناً صغيراً ملاصقاً ثم كأس الحرف الواسعة"]
  },
  {
    char: "ض",
    name: "الضاد",
    isolated: "ض",
    isolatedBadge: "لغة الضاد",
    initial: "ضـ",
    medial: "ـضـ",
    final: "ـض",
    vowels: { fatha: "ضَ", damma: "ضُ", kasra: "ضِ", sukoon: "ضْ" },
    sampleWords: [
      { word: "ضَوْء", meaning: "النور الكاشف للظلام", emoji: "💡" },
      { word: "ضَيْف", meaning: "الزائر الكريم الذي يحسن اليمنيون إكرامه", emoji: "🤝", yemeniNote: "كرم الضيافة سجية أصيلة في كل بيت يمني" },
      { word: "ضِفْدَع", meaning: "حيوان برمائي لطيف", emoji: "🐸" }
    ],
    audioPhoneticText: "ضَاد",
    strokeInstructions: ["ارسم جسم الصاد بالتمام مع سنه وكأسه", "ضع نقطة متميزة فوقه ليصير حرف لغة الضاد"]
  },
  {
    char: "ط",
    name: "الطاء",
    isolated: "ط",
    initial: "طـ",
    medial: "ـطـ",
    final: "ـط",
    vowels: { fatha: "طَ", damma: "طُ", kasra: "طِ", sukoon: "طْ" },
    sampleWords: [
      { word: "طَيْر", meaning: "طائر يسبح بجناحيه في الفضاء", emoji: "🐦" },
      { word: "طَرِيق", meaning: "سبيل السير والوصول", emoji: "🛣️" },
      { word: "طَبِيب", meaning: "يداوي العليل بعلم ورأفة", emoji: "🩺" }
    ],
    audioPhoneticText: "طَاء",
    strokeInstructions: ["ارسم البيضاوي كالصاد على السطر", "ارسم ألفاً قائمة تنزل على الطرف الأيمن من البيضاوي"]
  },
  {
    char: "ظ",
    name: "الظاء",
    isolated: "ظ",
    initial: "ظـ",
    medial: "ـظـ",
    final: "ـظ",
    vowels: { fatha: "ظَ", damma: "ظُ", kasra: "ظِ", sukoon: "ظْ" },
    sampleWords: [
      { word: "ظَبْي", meaning: "غزال رشيق يسكن البراري", emoji: "🦌" },
      { word: "ظِلّ", meaning: "الحماية من حرارة الشمس", emoji: "☂️" },
      { word: "ظَفَار", meaning: "عاصمة ملوك حمير التاريخية في اليمن", emoji: "👑", yemeniNote: "ظفار يريم عاصمة مملكة حمير اليمنية القديمة" }
    ],
    audioPhoneticText: "ظَاء",
    strokeInstructions: ["ارسم الطاء كاملة مع ألفها القائمة", "ضع نقطة بجوار الألف تميز حرف الظاء المفخم"]
  },
  {
    char: "ع",
    name: "العين",
    isolated: "ع",
    initial: "عـ",
    medial: "ـعـ",
    final: "ـع",
    vowels: { fatha: "عَ", damma: "عُ", kasra: "عِ", sukoon: "عْ" },
    sampleWords: [
      { word: "عَدَن", meaning: "عروس البحر الأحمر وثغر اليمن الباسم", emoji: "⚓", yemeniNote: "عدن مدينة الميناء العريق والتسامح الجميل" },
      { word: "عَقِيق", meaning: "حجر كريم نفيس تشتهر به جبال اليمن", emoji: "💎", yemeniNote: "العقيق اليماني الكبدي والرماني درة الأحجار الكريمة" },
      { word: "عَسَل", meaning: "شراب فيه شفاء للناس", emoji: "🍯" }
    ],
    audioPhoneticText: "عَيْن",
    strokeInstructions: ["ارسم نصف دائرة صغيرة كالهلال فوق السطر", "انزل بنصف دائرة بطنية كبيرة تحت السطر"]
  },
  {
    char: "غ",
    name: "الغين",
    isolated: "غ",
    initial: "غـ",
    medial: "ـغـ",
    final: "ـغ",
    vowels: { fatha: "غَ", damma: "غُ", kasra: "غِ", sukoon: "غْ" },
    sampleWords: [
      { word: "غُمْدَان", meaning: "قصر غمدان التاريخي العظيم في صنعاء", emoji: "🏰", yemeniNote: "قصر غمدان من أقدم القصور المعمارية في التاريخ" },
      { word: "غَيْث", meaning: "مطر غزير ينزل بالرحمة", emoji: "🌧️" },
      { word: "غَزَال", meaning: "حيوان لطيف خفيف الحركة", emoji: "🦌" }
    ],
    audioPhoneticText: "غَيْن",
    strokeInstructions: ["ارسم شكل العين بالتمام هلالاً وبطناً", "ضع نقطة فوق هلاله الصغير"]
  },
  {
    char: "ف",
    name: "الفاء",
    isolated: "ف",
    initial: "فـ",
    medial: "ـفـ",
    final: "ـف",
    vowels: { fatha: "فَ", damma: "فُ", kasra: "فِ", sukoon: "فْ" },
    sampleWords: [
      { word: "فَلَّاح", meaning: "المزارع الكادح الذي يعمر الأرض", emoji: "🧑‍🌾" },
      { word: "فِضَّة", meaning: "حلي فضية تقليدية تشتهر بها الحرف اليمنية", emoji: "🪙", yemeniNote: "صياغة الفضة اليمانية فن متوارث عبر الأجيال" },
      { word: "فَرَاشَة", meaning: "حشرة ملونة تطير بين الزهور", emoji: "🦋" }
    ],
    audioPhoneticText: "فَاء",
    strokeInstructions: ["ارسم دائرة صغيرة لها عنق قصير على السطر", "ثم مد صحناً أفقياً كالباء مع نقطة واحدة فوقه"]
  },
  {
    char: "ق",
    name: "القاف",
    isolated: "ق",
    initial: "قـ",
    medial: "ـقـ",
    final: "ـق",
    vowels: { fatha: "قَ", damma: "قُ", kasra: "قِ", sukoon: "قْ" },
    sampleWords: [
      { word: "قَمَر", meaning: "بدر مضيء في ليل السماء", emoji: "🌕" },
      { word: "قَلْعَة", meaning: "حصن منيع كقلعة القاهرة في تعز وصيرة في عدن", emoji: "🏯", yemeniNote: "قلاع اليمن الصامدة شواهد على عظمة البناء" },
      { word: "قَلَم", meaning: "أداة كتابة العلم والبيان", emoji: "✏️" }
    ],
    audioPhoneticText: "قَاف",
    strokeInstructions: ["ارسم الرأس الدائري المنحني", "انزل بكأس دائرية مقعرة تحت السطر مع نقطتين فوق الرأس"]
  },
  {
    char: "ك",
    name: "الكاف",
    isolated: "ك",
    initial: "كـ",
    medial: "ـكـ",
    final: "ـك",
    vowels: { fatha: "كَ", damma: "كُ", kasra: "كِ", sukoon: "كْ" },
    sampleWords: [
      { word: "كِتَاب", meaning: "خير جليس وصديق المعرفة", emoji: "📖" },
      { word: "كَوْكَبَان", meaning: "مدينة حصينة شاهقة فوق قمم الجبال باليمن", emoji: "🏔️", yemeniNote: "شبام كوكبان مدينة التاريخ الملتصقة بالسحاب" },
      { word: "كَرَم", meaning: "جود وسخاء النفس", emoji: "🎁" }
    ],
    audioPhoneticText: "كَاف",
    strokeInstructions: ["ارسم خطاً عمودياً طويلاً ثم مد القاعدة أفقياً مع انحناء خفيف", "ضع همزة كاف صغيرة (كاف مصغرة) في وسطه"]
  },
  {
    char: "ل",
    name: "اللام",
    isolated: "ل",
    initial: "لـ",
    medial: "ـلـ",
    final: "ـل",
    vowels: { fatha: "لَ", damma: "لُ", kasra: "لِ", sukoon: "لْ" },
    sampleWords: [
      { word: "لَوْحَة", meaning: "رسم بديع يعبر عن فكرة", emoji: "🖼️" },
      { word: "لَيْمُون", meaning: "ثمر حامض منعش", emoji: "🍋" },
      { word: "لُغَة", meaning: "لغتنا العربية الجميلة لسان الضاد", emoji: "🗣️" }
    ],
    audioPhoneticText: "لاَم",
    strokeInstructions: ["ارسم عصا قائمة مستقيمة من الأعلى", "ثم التف بنصف دائرة مجوفة تحت السطر ترتفع قليلاً"]
  },
  {
    char: "م",
    name: "الميم",
    isolated: "م",
    initial: "مـ",
    medial: "ـمـ",
    final: "ـم",
    vowels: { fatha: "مَ", damma: "مُ", kasra: "مِ", sukoon: "مْ" },
    sampleWords: [
      { word: "مَأْرِب", meaning: "أرض سبأ وملكة بلقيس وموطن الحضارة الأولى", emoji: "🏛️", yemeniNote: "مأرب عاصمة الحضارة السَّبَئِيَّة القديمة" },
      { word: "مَدْرَسَة", meaning: "صرح العلم والتربية والأمل", emoji: "🏫" },
      { word: "مَطَر", meaning: "ماء السماء المبارك الذي يروي المدرجات", emoji: "🌧️" }
    ],
    audioPhoneticText: "مِيم",
    strokeInstructions: ["ارسم دائرة صغيرة مفرغة على السطر", "ثم انزل بذيل مستقيم لأسفل تحت السطر"]
  },
  {
    char: "ن",
    name: "النون",
    isolated: "ن",
    initial: "نـ",
    medial: "ـنـ",
    final: "ـن",
    vowels: { fatha: "نَ", damma: "نُ", kasra: "نِ", sukoon: "نْ" },
    sampleWords: [
      { word: "نَخِيل", meaning: "أشجار باسقة تثمر أطيب الرطب بتِهامة والساحل", emoji: "🌴" },
      { word: "نُقُمْ", meaning: "جبل نقم الشامخ المطل على صنعاء الحبيبة", emoji: "⛰️", yemeniNote: "جبل نقم حارس صنعاء التليد" },
      { word: "نَهْر", meaning: "مجرى الماء العذب", emoji: "🌊" }
    ],
    audioPhoneticText: "نُون",
    strokeInstructions: ["ارسم صحناً عميقاً ينزل تحت السطر كهلال مستدير", "ضع نقطة واحدة تتوسط الصحن كالنجمة"]
  },
  {
    char: "ه",
    name: "الهاء",
    isolated: "ه",
    initial: "هـ",
    medial: "ـهـ",
    final: "ـه",
    vowels: { fatha: "هَ", damma: "هُ", kasra: "هِ", sukoon: "هْ" },
    sampleWords: [
      { word: "هِلاَل", meaning: "قمر أول الشهر وبداية النور", emoji: "🌙" },
      { word: "هَدِيَّة", meaning: "عطاء يدخل السرور في القلب", emoji: "🎁" },
      { word: "هَوَاء", meaning: "نسيم عليل يحيي النفوس", emoji: "💨" }
    ],
    audioPhoneticText: "هَاء",
    strokeInstructions: ["ارسم قوساً كبيراً ثم دائرة صغيرة في داخله ثم مد الحرف على السطر"]
  },
  {
    char: "و",
    name: "الواو",
    isolated: "و",
    initial: "و",
    medial: "ـو",
    final: "ـو",
    vowels: { fatha: "وَ", damma: "وُ", kasra: "وِ", sukoon: "وْ" },
    sampleWords: [
      { word: "وَطَن", meaning: "اليمن الغالي مهبط الحب والانتماء", emoji: "🇾🇪", yemeniNote: "حب الوطن من الإيمان والعمل لأجله شرف" },
      { word: "وَرْد", meaning: "زهور عطرة فواحة", emoji: "🌹" },
      { word: "وَادِي", meaning: "مجرى السيل الخصيب كوادي بنا ووادي حضرموت", emoji: "🏞️" }
    ],
    audioPhoneticText: "وَاو",
    strokeInstructions: ["ارسم رأساً دائرياً صغيراً فوق السطر", "ثم انزل بمنحنى الراء المزحلق تحت السطر"]
  },
  {
    char: "ي",
    name: "الياء",
    isolated: "ي",
    initial: "يـ",
    medial: "ـيـ",
    final: "ـي",
    vowels: { fatha: "يَ", damma: "يُ", kasra: "يِ", sukoon: "يْ" },
    sampleWords: [
      { word: "يَمَن", meaning: "اليمن السعيد بلاد الخير والبركة والعراقة", emoji: "🇾🇪", yemeniNote: "اليمن مهد العروبة وأصل الحضارات الإنسانية" },
      { word: "يَد", meaning: "يد العطاء والعمل والتعاون", emoji: "✋" },
      { word: "يَاسَمِين", meaning: "زهر أبيض شديد العبير", emoji: "🌼" }
    ],
    audioPhoneticText: "يَاء",
    strokeInstructions: ["ارسم رأساً مقوساً كالبطة", "ثم بطناً مقعراً أسفل السطر وضع نقطتين تحته في البداية والوسط"]
  }
];
