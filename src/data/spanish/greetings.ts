// src/data/spanish/greetings.ts

// ═══════════════════════════════════════
// 🇪🇸 التحيات والتعارف - Museo Guggenheim Bilbao
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1 → A1.1
// المرجع: Plan Curricular - Funciones 1.1 (Saludar y presentarse)
// 15 تعبير = 3 مجموعات × 5 تعابير
// مناسب للأطفال 6-7 سنوات
// الدرس: es-guggenheim-greetings
// ربط ثقافي: متحف Guggenheim - رمز التواصل والفن الحديث
// ═══════════════════════════════════════

export interface SpanishGreeting {
  word: string;          // Hola
  wordAr: string;        // مرحبا
  emoji: string;         // 👋
  imageName: string;     // hola
  context: 'Saludo' | 'Despedida' | 'Presentación' | 'Cortesía';
  contextAr: 'تحية' | 'وداع' | 'تعارف' | 'مجاملة';
  contextEmoji: string;  // ☀️ / 🌙 / 🤝
  timeOfDay: 'Siempre' | 'Mañana' | 'Tarde' | 'Noche';
  timeOfDayAr: 'دائماً' | 'صباحاً' | 'مساءً' | 'ليلاً';
  // المحادثة
  conversationA: string;   // ¡Hola!
  conversationB: string;   // ¡Hola! ¿Cómo estás?
  conversationAr: string;  // مرحبا! - مرحبا! كيف حالك؟
  formality: 'Formal' | 'Informal' | 'Ambos';
  formalityAr: 'رسمي' | 'غير رسمي' | 'الاثنين';
  color: string;
  gradient: [string, string];
}

export interface SpanishGreetingGroup {
  greetings: SpanishGreeting[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_GREETINGS: SpanishGreeting[] = [
  // ═══════════════════════════════════════
  // ☀️ المجموعة الأولى: تحيات أساسية (Saludos Básicos)
  // ═══════════════════════════════════════
  {
    word: 'Hola',
    wordAr: 'مرحبا',
    emoji: '👋',
    imageName: 'hola',
    context: 'Saludo',
    contextAr: 'تحية',
    contextEmoji: '👋',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: '¡Hola!',
    conversationB: '¡Hola! ¿Cómo estás?',
    conversationAr: 'مرحبا! - مرحبا! كيف حالك؟',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    word: 'Adiós',
    wordAr: 'وداعا',
    emoji: '👋',
    imageName: 'adios',
    context: 'Despedida',
    contextAr: 'وداع',
    contextEmoji: '🚪',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: '¡Adiós!',
    conversationB: '¡Adiós, hasta luego!',
    conversationAr: 'وداعا! - وداعا، إلى اللقاء!',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    word: 'Buenos días',
    wordAr: 'صباح الخير',
    emoji: '☀️',
    imageName: 'buenos-dias',
    context: 'Saludo',
    contextAr: 'تحية',
    contextEmoji: '🌅',
    timeOfDay: 'Mañana',
    timeOfDayAr: 'صباحاً',
    conversationA: '¡Buenos días!',
    conversationB: '¡Buenos días! ¿Qué tal?',
    conversationAr: 'صباح الخير! - صباح الخير! إزيك؟',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    word: 'Buenas tardes',
    wordAr: 'مساء الخير',
    emoji: '🌅',
    imageName: 'buenas-tardes',
    context: 'Saludo',
    contextAr: 'تحية',
    contextEmoji: '🌇',
    timeOfDay: 'Tarde',
    timeOfDayAr: 'مساءً',
    conversationA: '¡Buenas tardes!',
    conversationB: '¡Buenas tardes, señora!',
    conversationAr: 'مساء الخير! - مساء الخير يا سيدتي!',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    word: 'Buenas noches',
    wordAr: 'تصبح على خير',
    emoji: '🌙',
    imageName: 'buenas-noches',
    context: 'Saludo',
    contextAr: 'تحية',
    contextEmoji: '⭐',
    timeOfDay: 'Noche',
    timeOfDayAr: 'ليلاً',
    conversationA: '¡Buenas noches!',
    conversationB: '¡Buenas noches, dulces sueños!',
    conversationAr: 'تصبح على خير! - تصبح على خير، أحلام سعيدة!',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },

  // ═══════════════════════════════════════
  // 🤝 المجموعة الثانية: التعارف (Presentaciones)
  // ═══════════════════════════════════════
  {
    word: 'Me llamo',
    wordAr: 'اسمي',
    emoji: '🙋',
    imageName: 'me-llamo',
    context: 'Presentación',
    contextAr: 'تعارف',
    contextEmoji: '🪪',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: 'Me llamo Carlos',
    conversationB: '¡Mucho gusto, Carlos!',
    conversationAr: 'اسمي كارلوس - تشرفت يا كارلوس!',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1E40AF'],
  },
  {
    word: '¿Cómo te llamas?',
    wordAr: 'ما اسمك؟',
    emoji: '❓',
    imageName: 'como-te-llamas',
    context: 'Presentación',
    contextAr: 'تعارف',
    contextEmoji: '🤔',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: '¿Cómo te llamas?',
    conversationB: 'Me llamo Ana',
    conversationAr: 'ما اسمك؟ - اسمي آنا',
    formality: 'Informal',
    formalityAr: 'غير رسمي',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    word: 'Mucho gusto',
    wordAr: 'تشرفت بمعرفتك',
    emoji: '🤝',
    imageName: 'mucho-gusto',
    context: 'Presentación',
    contextAr: 'تعارف',
    contextEmoji: '🤝',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: 'Mucho gusto',
    conversationB: 'El gusto es mío',
    conversationAr: 'تشرفت - الشرف لي',
    formality: 'Formal',
    formalityAr: 'رسمي',
    color: '#16A34A',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    word: 'Encantado',
    wordAr: 'سعدت بلقائك',
    emoji: '😊',
    imageName: 'encantado',
    context: 'Presentación',
    contextAr: 'تعارف',
    contextEmoji: '♂️',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: 'Encantado de conocerte',
    conversationB: '¡Igualmente!',
    conversationAr: 'سعدت بلقائك (مذكر) - وأنا كذلك!',
    formality: 'Formal',
    formalityAr: 'رسمي',
    color: '#0891B2',
    gradient: ['#06B6D4', '#155E75'],
  },
  {
    word: 'Encantada',
    wordAr: 'سعدت بلقائك',
    emoji: '😊',
    imageName: 'encantada',
    context: 'Presentación',
    contextAr: 'تعارف',
    contextEmoji: '♀️',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: 'Encantada de conocerte',
    conversationB: '¡Igualmente!',
    conversationAr: 'سعدت بلقائك (مؤنث) - وأنا كذلك!',
    formality: 'Formal',
    formalityAr: 'رسمي',
    color: '#DB2777',
    gradient: ['#EC4899', '#9F1239'],
  },

  // ═══════════════════════════════════════
  // 💬 المجموعة الثالثة: العبارات اليومية (Frases Cotidianas)
  // ═══════════════════════════════════════
  {
    word: '¿Cómo estás?',
    wordAr: 'كيف حالك؟',
    emoji: '🤔',
    imageName: 'como-estas',
    context: 'Cortesía',
    contextAr: 'مجاملة',
    contextEmoji: '💭',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: '¿Cómo estás?',
    conversationB: '¡Muy bien, gracias!',
    conversationAr: 'كيف حالك؟ - بخير جداً، شكراً!',
    formality: 'Informal',
    formalityAr: 'غير رسمي',
    color: '#F472B6',
    gradient: ['#FBA4D4', '#BE185D'],
  },
  {
    word: 'Muy bien',
    wordAr: 'بخير جداً',
    emoji: '😄',
    imageName: 'muy-bien',
    context: 'Cortesía',
    contextAr: 'مجاملة',
    contextEmoji: '✨',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: '¿Cómo estás?',
    conversationB: 'Muy bien, ¿y tú?',
    conversationAr: 'كيف حالك؟ - بخير، وإنت؟',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#10B981',
    gradient: ['#34D399', '#047857'],
  },
  {
    word: 'Gracias',
    wordAr: 'شكرا',
    emoji: '🙏',
    imageName: 'gracias',
    context: 'Cortesía',
    contextAr: 'مجاملة',
    contextEmoji: '💖',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: '¡Gracias!',
    conversationB: 'De nada',
    conversationAr: 'شكراً! - عفواً',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    word: 'Por favor',
    wordAr: 'من فضلك',
    emoji: '🙇',
    imageName: 'por-favor',
    context: 'Cortesía',
    contextAr: 'مجاملة',
    contextEmoji: '✋',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: 'Agua, por favor',
    conversationB: '¡Aquí tienes!',
    conversationAr: 'مياه من فضلك - تفضل!',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    word: 'De nada',
    wordAr: 'عفوا',
    emoji: '😊',
    imageName: 'de-nada',
    context: 'Cortesía',
    contextAr: 'مجاملة',
    contextEmoji: '💝',
    timeOfDay: 'Siempre',
    timeOfDayAr: 'دائماً',
    conversationA: '¡Gracias por todo!',
    conversationB: 'De nada, es un placer',
    conversationAr: 'شكراً على كل شيء! - عفواً، سعادتي',
    formality: 'Ambos',
    formalityAr: 'الاثنين',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
];

export const SPANISH_GREETING_GROUPS: SpanishGreetingGroup[] = [
  {
    greetings: SPANISH_GREETINGS.slice(0, 5),
    title: 'تحيات أساسية',
    titleEs: 'Grupo 1: Saludos Básicos',
    groupId: 0,
  },
  {
    greetings: SPANISH_GREETINGS.slice(5, 10),
    title: 'التعارف',
    titleEs: 'Grupo 2: Presentaciones',
    groupId: 1,
  },
  {
    greetings: SPANISH_GREETINGS.slice(10, 15),
    title: 'العبارات اليومية',
    titleEs: 'Grupo 3: Frases Cotidianas',
    groupId: 2,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة
// ═══════════════════════════════════════
export const DARK_SPANISH_GREETING_COLORS: Record<string, string> = {
  '#F59E0B': '#78350F',
  '#EC4899': '#831843',
  '#FCD34D': '#78350F',
  '#F97316': '#7C2D12',
  '#7C3AED': '#4C1D95',
  '#3B82F6': '#1E3A8A',
  '#06B6D4': '#164E63',
  '#16A34A': '#14532D',
  '#0891B2': '#164E63',
  '#DB2777': '#831843',
  '#F472B6': '#9F1239',
  '#10B981': '#064E3B',
  '#DC2626': '#7F1D1D',
};

export function getDarkSpanishGreetingColor(originalColor: string): string {
  return DARK_SPANISH_GREETING_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

export function getSpanishGreetingByWord(word: string): SpanishGreeting | undefined {
  return SPANISH_GREETINGS.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

/**
 * توليد اختيارات عشوائية للتحيات (للمرحلة الأولى Listen)
 */
export function generateSpanishGreetingChoices(
  correctWord: string,
  count: number = 3
): SpanishGreeting[] {
  const correctGreeting = getSpanishGreetingByWord(correctWord);
  if (!correctGreeting) return [];

  const allGreetings = SPANISH_GREETINGS.filter((g) => g.word !== correctWord);
  const shuffled = allGreetings.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctGreeting];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * مقارنة كلمتين مع تجاهل الحروف الكبيرة/الصغيرة وعلامات الاستفهام
 */
export function compareSpanishGreetingWords(input: string, target: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[¿?¡!]/g, '')  // إزالة علامات الاستفهام والتعجب
      .replace(/\s+/g, ' ')     // توحيد المسافات
      .trim();

  return normalize(input) === normalize(target);
}

// ═══════════════════════════════════════
// 📊 ثوابت الدرس
// ═══════════════════════════════════════
export const TOTAL_SPANISH_GREETINGS = SPANISH_GREETINGS.length; // 15
export const TOTAL_SPANISH_GREETING_GROUPS = SPANISH_GREETING_GROUPS.length; // 3
export const PHASES_PER_SPANISH_GREETING = 3; // listen + write + speak
export const TOTAL_ANSWERS_PER_SPANISH_GREETINGS_LESSON =
  TOTAL_SPANISH_GREETINGS * PHASES_PER_SPANISH_GREETING; // 45