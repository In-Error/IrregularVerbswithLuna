// Firebase уже инициализирован в index.html
const database = window.database;

// === СПИСОК УЧЕНИКОВ ===
const students = [
  { id: "alina", name: "Alina", avatar: "avatars/alina.png" },
  { id: "artem", name: "Artem", avatar: "avatars/artem.png" },
  { id: "nastia-che", name: "Nastia Che", avatar: "avatars/nastia-che.png" },
  { id: "nastia-s", name: "Nastia S", avatar: "avatars/nastia-s.png" },
  { id: "natasha", name: "Natasha", avatar: "avatars/natasha.png" },
  { id: "rita", name: "Rita", avatar: "avatars/rita.png" },
  { id: "sv", name: "SV", avatar: "avatars/sv.png" },
  { id: "vika", name: "Vika", avatar: "avatars/vika.png" }
];

// === ПОЛНЫЙ СПИСОК ГЛАГОЛОВ (132) ===
const verbs = [
  { base: "arise", past: "arose", participle: "arisen", ru: "возникать", image: "https://picsum.photos/200/150?random=1" },
  { base: "awake", past: "awoke", participle: "awoken", ru: "просыпаться", image: "https://picsum.photos/200/150?random=2" },
  { base: "be", past: "was were", participle: "been", ru: "быть", image: "https://picsum.photos/200/150?random=3" },
  { base: "bear", past: "bore", participle: "borne", ru: "нести", image: "https://picsum.photos/200/150?random=4" },
  { base: "beat", past: "beat", participle: "beaten", ru: "бить", image: "https://picsum.photos/200/150?random=5" },
  { base: "become", past: "became", participle: "become", ru: "становиться", image: "https://picsum.photos/200/150?random=6" },
  { base: "begin", past: "began", participle: "begun", ru: "начинать", image: "https://picsum.photos/200/150?random=7" },
  { base: "bend", past: "bent", participle: "bent", ru: "гнуть", image: "https://picsum.photos/200/150?random=8" },
  { base: "bet", past: "bet", participle: "bet", ru: "ставить (ставку)", image: "https://picsum.photos/200/150?random=9" },
  { base: "bind", past: "bound", participle: "bound", ru: "связывать", image: "https://picsum.photos/200/150?random=10" },
  { base: "bite", past: "bit", participle: "bitten", ru: "кусать", image: "https://picsum.photos/200/150?random=11" },
  { base: "bleed", past: "bled", participle: "bled", ru: "кровоточить", image: "https://picsum.photos/200/150?random=12" },
  { base: "blow", past: "blew", participle: "blown", ru: "дуть", image: "https://picsum.photos/200/150?random=13" },
  { base: "break", past: "broke", participle: "broken", ru: "ломать", image: "https://picsum.photos/200/150?random=14" },
  { base: "breed", past: "bred", participle: "bred", ru: "разводить", image: "https://picsum.photos/200/150?random=15" },
  { base: "bring", past: "brought", participle: "brought", ru: "приносить", image: "https://picsum.photos/200/150?random=16" },
  { base: "broadcast", past: "broadcast", participle: "broadcast", ru: "транслировать", image: "https://picsum.photos/200/150?random=17" },
  { base: "build", past: "built", participle: "built", ru: "строить", image: "https://picsum.photos/200/150?random=18" },
  { base: "burn", past: "burnt", participle: "burnt", ru: "жечь", image: "https://picsum.photos/200/150?random=19" },
  { base: "burst", past: "burst", participle: "burst", ru: "взрываться", image: "https://picsum.photos/200/150?random=20" },
  { base: "buy", past: "bought", participle: "bought", ru: "покупать", image: "https://picsum.photos/200/150?random=21" },
  { base: "catch", past: "caught", participle: "caught", ru: "ловить", image: "https://picsum.photos/200/150?random=22" },
  { base: "choose", past: "chose", participle: "chosen", ru: "выбирать", image: "https://picsum.photos/200/150?random=23" },
  { base: "cling", past: "clung", participle: "clung", ru: "цепляться", image: "https://picsum.photos/200/150?random=24" },
  { base: "come", past: "came", participle: "come", ru: "приходить", image: "https://picsum.photos/200/150?random=25" },
  { base: "cost", past: "cost", participle: "cost", ru: "стоить", image: "https://picsum.photos/200/150?random=26" },
  { base: "creep", past: "crept", participle: "crept", ru: "красться", image: "https://picsum.photos/200/150?random=27" },
  { base: "cut", past: "cut", participle: "cut", ru: "резать", image: "https://picsum.photos/200/150?random=28" },
  { base: "deal", past: "dealt", participle: "dealt", ru: "иметь дело", image: "https://picsum.photos/200/150?random=29" },
  { base: "dig", past: "dug", participle: "dug", ru: "копать", image: "https://picsum.photos/200/150?random=30" },
  { base: "do", past: "did", participle: "done", ru: "делать", image: "https://picsum.photos/200/150?random=31" },
  { base: "draw", past: "drew", participle: "drawn", ru: "рисовать", image: "https://picsum.photos/200/150?random=32" },
  { base: "dream", past: "dreamt", participle: "dreamt", ru: "мечтать", image: "https://picsum.photos/200/150?random=33" },
  { base: "drink", past: "drank", participle: "drunk", ru: "пить", image: "https://picsum.photos/200/150?random=34" },
  { base: "drive", past: "drove", participle: "driven", ru: "водить", image: "https://picsum.photos/200/150?random=35" },
  { base: "eat", past: "ate", participle: "eaten", ru: "есть", image: "https://picsum.photos/200/150?random=36" },
  { base: "fall", past: "fell", participle: "fallen", ru: "падать", image: "https://picsum.photos/200/150?random=37" },
  { base: "feed", past: "fed", participle: "fed", ru: "кормить", image: "https://picsum.photos/200/150?random=38" },
  { base: "feel", past: "felt", participle: "felt", ru: "чувствовать", image: "https://picsum.photos/200/150?random=39" },
  { base: "fight", past: "fought", participle: "fought", ru: "драться", image: "https://picsum.photos/200/150?random=40" },
  { base: "find", past: "found", participle: "found", ru: "находить", image: "https://picsum.photos/200/150?random=41" },
  { base: "fly", past: "flew", participle: "flown", ru: "летать", image: "https://picsum.photos/200/150?random=42" },
  { base: "forbid", past: "forbade", participle: "forbidden", ru: "запрещать", image: "https://picsum.photos/200/150?random=43" },
  { base: "forget", past: "forgot", participle: "forgotten", ru: "забывать", image: "https://picsum.photos/200/150?random=44" },
  { base: "forgive", past: "forgave", participle: "forgiven", ru: "прощать", image: "https://picsum.photos/200/150?random=45" },
  { base: "freeze", past: "froze", participle: "frozen", ru: "замерзать", image: "https://picsum.photos/200/150?random=46" },
  { base: "get", past: "got", participle: "got gotten", ru: "получать", image: "https://picsum.photos/200/150?random=47" },
  { base: "give", past: "gave", participle: "given", ru: "давать", image: "https://picsum.photos/200/150?random=48" },
  { base: "go", past: "went", participle: "gone", ru: "идти", image: "https://picsum.photos/200/150?random=49" },
  { base: "grow", past: "grew", participle: "grown", ru: "расти", image: "https://picsum.photos/200/150?random=50" },
  { base: "hang", past: "hung", participle: "hung", ru: "вешать", image: "https://picsum.photos/200/150?random=51" },
  { base: "have", past: "had", participle: "had", ru: "иметь", image: "https://picsum.photos/200/150?random=52" },
  { base: "hear", past: "heard", participle: "heard", ru: "слышать", image: "https://picsum.photos/200/150?random=53" },
  { base: "hide", past: "hid", participle: "hidden", ru: "прятать", image: "https://picsum.photos/200/150?random=54" },
  { base: "hit", past: "hit", participle: "hit", ru: "ударять", image: "https://picsum.photos/200/150?random=55" },
  { base: "hold", past: "held", participle: "held", ru: "держать", image: "https://picsum.photos/200/150?random=56" },
  { base: "hurt", past: "hurt", participle: "hurt", ru: "причинять боль", image: "https://picsum.photos/200/150?random=57" },
  { base: "keep", past: "kept", participle: "kept", ru: "сохранять", image: "https://picsum.photos/200/150?random=58" },
  { base: "kneel", past: "knelt", participle: "knelt", ru: "стоять на коленях", image: "https://picsum.photos/200/150?random=59" },
  { base: "know", past: "knew", participle: "known", ru: "знать", image: "https://picsum.photos/200/150?random=60" },
  { base: "lay", past: "laid", participle: "laid", ru: "класть", image: "https://picsum.photos/200/150?random=61" },
  { base: "lead", past: "led", participle: "led", ru: "вести", image: "https://picsum.photos/200/150?random=62" },
  { base: "lean", past: "leant", participle: "leant", ru: "наклоняться", image: "https://picsum.photos/200/150?random=63" },
  { base: "learn", past: "learnt", participle: "learnt", ru: "учить", image: "https://picsum.photos/200/150?random=64" },
  { base: "leave", past: "left", participle: "left", ru: "уходить", image: "https://picsum.photos/200/150?random=65" },
  { base: "lend", past: "lent", participle: "lent", ru: "одалживать", image: "https://picsum.photos/200/150?random=66" },
  { base: "let", past: "let", participle: "let", ru: "позволять", image: "https://picsum.photos/200/150?random=67" },
  { base: "lie", past: "lay", participle: "lain", ru: "лежать", image: "https://picsum.photos/200/150?random=68" },
  { base: "light", past: "lit", participle: "lit", ru: "зажигать", image: "https://picsum.photos/200/150?random=69" },
  { base: "lose", past: "lost", participle: "lost", ru: "терять", image: "https://picsum.photos/200/150?random=70" },
  { base: "make", past: "made", participle: "made", ru: "делать", image: "https://picsum.photos/200/150?random=71" },
  { base: "mean", past: "meant", participle: "meant", ru: "значить", image: "https://picsum.photos/200/150?random=72" },
  { base: "meet", past: "met", participle: "met", ru: "встречать", image: "https://picsum.photos/200/150?random=73" },
  { base: "pay", past: "paid", participle: "paid", ru: "платить", image: "https://picsum.photos/200/150?random=74" },
  { base: "put", past: "put", participle: "put", ru: "класть", image: "https://picsum.photos/200/150?random=75" },
  { base: "read", past: "read", participle: "read", ru: "читать", image: "https://picsum.photos/200/150?random=76" },
  { base: "ride", past: "rode", participle: "ridden", ru: "ездить верхом", image: "https://picsum.photos/200/150?random=77" },
  { base: "ring", past: "rang", participle: "rung", ru: "звонить", image: "https://picsum.photos/200/150?random=78" },
  { base: "rise", past: "rose", participle: "risen", ru: "подниматься", image: "https://picsum.photos/200/150?random=79" },
  { base: "run", past: "ran", participle: "run", ru: "бежать", image: "https://picsum.photos/200/150?random=80" },
  { base: "say", past: "said", participle: "said", ru: "говорить", image: "https://picsum.photos/200/150?random=81" },
  { base: "see", past: "saw", participle: "seen", ru: "видеть", image: "https://picsum.photos/200/150?random=82" },
  { base: "seek", past: "sought", participle: "sought", ru: "искать", image: "https://picsum.photos/200/150?random=83" },
  { base: "sell", past: "sold", participle: "sold", ru: "продавать", image: "https://picsum.photos/200/150?random=84" },
  { base: "send", past: "sent", participle: "sent", ru: "посылать", image: "https://picsum.photos/200/150?random=85" },
  { base: "set", past: "set", participle: "set", ru: "устанавливать", image: "https://picsum.photos/200/150?random=86" },
  { base: "shake", past: "shook", participle: "shaken", ru: "трясти", image: "https://picsum.photos/200/150?random=87" },
  { base: "shine", past: "shone", participle: "shone", ru: "светить", image: "https://picsum.photos/200/150?random=88" },
  { base: "shoot", past: "shot", participle: "shot", ru: "стрелять", image: "https://picsum.photos/200/150?random=89" },
  { base: "show", past: "showed", participle: "shown", ru: "показывать", image: "https://picsum.photos/200/150?random=90" },
  { base: "shrink", past: "shrank", participle: "shrunk", ru: "сжиматься", image: "https://picsum.photos/200/150?random=91" },
  { base: "shut", past: "shut", participle: "shut", ru: "закрывать", image: "https://picsum.photos/200/150?random=92" },
  { base: "sing", past: "sang", participle: "sung", ru: "петь", image: "https://picsum.photos/200/150?random=93" },
  { base: "sink", past: "sank", participle: "sunk", ru: "тонуть", image: "https://picsum.photos/200/150?random=94" },
  { base: "sit", past: "sat", participle: "sat", ru: "сидеть", image: "https://picsum.photos/200/150?random=95" },
  { base: "sleep", past: "slept", participle: "slept", ru: "спать", image: "https://picsum.photos/200/150?random=96" },
  { base: "slide", past: "slid", participle: "slid", ru: "скользить", image: "https://picsum.photos/200/150?random=97" },
  { base: "smell", past: "smelt", participle: "smelt", ru: "пахнуть", image: "https://picsum.photos/200/150?random=98" },
  { base: "speak", past: "spoke", participle: "spoken", ru: "говорить", image: "https://picsum.photos/200/150?random=99" },
  { base: "spell", past: "spelt", participle: "spelt", ru: "писать по буквам", image: "https://picsum.photos/200/150?random=100" },
  { base: "spend", past: "spent", participle: "spent", ru: "тратить", image: "https://picsum.photos/200/150?random=101" },
  { base: "spill", past: "spilt", participle: "spilt", ru: "проливать", image: "https://picsum.photos/200/150?random=102" },
  { base: "spin", past: "spun", participle: "spun", ru: "крутить", image: "https://picsum.photos/200/150?random=103" },
  { base: "spread", past: "spread", participle: "spread", ru: "распространять", image: "https://picsum.photos/200/150?random=104" },
  { base: "stand", past: "stood", participle: "stood", ru: "стоять", image: "https://picsum.photos/200/150?random=105" },
  { base: "steal", past: "stole", participle: "stolen", ru: "красть", image: "https://picsum.photos/200/150?random=106" },
  { base: "stick", past: "stuck", participle: "stuck", ru: "приклеивать", image: "https://picsum.photos/200/150?random=107" },
  { base: "sting", past: "stung", participle: "stung", ru: "жалить", image: "https://picsum.photos/200/150?random=108" },
  { base: "stink", past: "stank", participle: "stunk", ru: "вонять", image: "https://picsum.photos/200/150?random=109" },
  { base: "strike", past: "struck", participle: "struck", ru: "бить", image: "https://picsum.photos/200/150?random=110" },
  { base: "swear", past: "swore", participle: "sworn", ru: "клясться", image: "https://picsum.photos/200/150?random=111" },
  { base: "sweep", past: "swept", participle: "swept", ru: "подметать", image: "https://picsum.photos/200/150?random=112" },
  { base: "swim", past: "swam", participle: "swum", ru: "плавать", image: "https://picsum.photos/200/150?random=113" },
  { base: "swing", past: "swung", participle: "swung", ru: "качаться", image: "https://picsum.photos/200/150?random=114" },
  { base: "take", past: "took", participle: "taken", ru: "брать", image: "https://picsum.photos/200/150?random=115" },
  { base: "teach", past: "taught", participle: "taught", ru: "учить", image: "https://picsum.photos/200/150?random=116" },
  { base: "tear", past: "tore", participle: "torn", ru: "рвать", image: "https://picsum.photos/200/150?random=117" },
  { base: "tell", past: "told", participle: "told", ru: "рассказывать", image: "https://picsum.photos/200/150?random=118" },
  { base: "think", past: "thought", participle: "thought", ru: "думать", image: "https://picsum.photos/200/150?random=119" },
  { base: "throw", past: "threw", participle: "thrown", ru: "бросать", image: "https://picsum.photos/200/150?random=120" },
  { base: "understand", past: "understood", participle: "understood", ru: "понимать", image: "https://picsum.photos/200/150?random=121" },
  { base: "wake", past: "woke", participle: "woken", ru: "будить", image: "https://picsum.photos/200/150?random=122" },
  { base: "wear", past: "wore", participle: "worn", ru: "носить (одежду)", image: "https://picsum.photos/200/150?random=123" },
  { base: "weep", past: "wept", participle: "wept", ru: "плакать", image: "https://picsum.photos/200/150?random=124" },
  { base: "win", past: "won", participle: "won", ru: "выигрывать", image: "https://picsum.photos/200/150?random=125" },
  { base: "wind", past: "wound", participle: "wound", ru: "заводить (часы)", image: "https://picsum.photos/200/150?random=126" },
  { base: "write", past: "wrote", participle: "written", ru: "писать", image: "https://picsum.photos/200/150?random=127" },
  // Дополнительные
  { base: "abide", past: "abode", participle: "abided", ru: "терпеть", image: "https://picsum.photos/200/150?random=128" },
  { base: "alight", past: "alit", participle: "alit", ru: "сходить", image: "https://picsum.photos/200/150?random=129" },
  { base: "beseech", past: "besought", participle: "besought", ru: "умолять", image: "https://picsum.photos/200/150?random=130" },
  { base: "cleave", past: "clove", participle: "cloven", ru: "раскалывать", image: "https://picsum.photos/200/150?random=131" },
  { base: "strive", past: "strove", participle: "striven", ru: "стремиться", image: "https://picsum.photos/200/150?random=132" }
];

// === ФИЛЬТРЫ ===
const lessCommonList = ["arise","awake","bear","bend","bet","bleed","breed","broadcast","deal","kneel","mow","overtake","sew","stink","strike"];
const advancedList = ["bind","burst","cling","creep","grind","saw","shed","sow","spit","swell","weep","wind"];

const commonVerbs = verbs.filter(v => !lessCommonList.includes(v.base) && !advancedList.includes(v.base));
const commonParts = [];
for (let i = 0; i < 5; i++) {
  commonParts[i] = commonVerbs.slice(i * 21, (i + 1) * 21);
}

const verbGroups = {
  common1: { verbs: commonParts[0], name: "Common (part 1)" },
  common2: { verbs: commonParts[1], name: "Common (part 2)" },
  common3: { verbs: commonParts[2], name: "Common (part 3)" },
  common4: { verbs: commonParts[3], name: "Common (part 4)" },
  common5: { verbs: commonParts[4], name: "Common (part 5)" },
  lessCommon: { verbs: verbs.filter(v => lessCommonList.includes(v.base)), name: "Less Common (15 verbs)" },
  advanced: { verbs: verbs.filter(v => advancedList.includes(v.base)), name: "Advanced (12 verbs)" },
  all: { verbs: verbs, name: "All (132 verbs)" }
};

// === СООБЩЕНИЯ ДЛЯ МОДАЛЬНЫХ ОКОН ===
const allCorrectMessages = [
  "Wow, cool! Jump to the next training!",
  "Yay! The next training is calling you - go, go, go!",
  "Great! Run to the next one, superhero!",
  "Nice! The next training is waiting - don’t be lazy!",
  "Hooray! Show the next training who’s the boss!",
  "Awesome! One more training and you’ll be a star!",
  "Good job! Next level - let’s go!",
  "Wow! The next training can’t wait for you!"
];

const notAllCorrectMessages = [
  "Almost there! Next time you’ll be the champion!",
  "Good try! You’re getting better and better!",
  "Nice work! A little more practice - and you’ll smash it!",
  "You’re awesome anyway! Try again and win next time!",
  "So close! One more go and you’ll get it!",
  "Don’t worry! Even superheroes train a lot!",
  "Great effort! The top score is waiting for you!",
  "Keep going! Every try makes you stronger!"
];

// === ДОСТИЖЕНИЯ ===
const achievements = {
  novice: { name: "Novice", description: "Complete your first game.", icon: "🌟" },
  master_common1: { name: "Master Common 1", description: "100% correct in Common (part 1).", icon: "🥇" },
  master_common2: { name: "Master Common 2", description: "100% correct in Common (part 2).", icon: "🥇" },
  master_common3: { name: "Master Common 3", description: "100% correct in Common (part 3).", icon: "🥇" },
  master_common4: { name: "Master Common 4", description: "100% correct in Common (part 4).", icon: "🥇" },
  master_common5: { name: "Master Common 5", description: "100% correct in Common (part 5).", icon: "🥇" },
  master_lessCommon: { name: "Master Less Common", description: "100% correct in Less Common.", icon: "🏆" },
  master_advanced: { name: "Master Advanced", description: "100% correct in Advanced.", icon: "🏅" },
  ultimate_champion: { name: "Ultimate Champion", description: "100% correct in All verbs.", icon: "👑" },
};

// === ОСНОВНОЙ КЛАСС ===
class VerbsTrainer {
  constructor() {
    this.currentStudentId = null;
    this.userData = null;
    this.currentVerbGroupKey = null;
    this.verbs = [];
    this.currentIndex = 0;
    this.timeLeft = 30; 
    this.timer = null;
    this.results = [];
    this.gameStartTime = null;
    this.britishVoice = null;
    this.initializeSpeechSynthesis();
    this.showStudentSelect();
  }

  initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = () => {
        const voices = speechSynthesis.getVoices();
        this.britishVoice = voices.find(voice => voice.lang === 'en-GB' || (voice.lang.startsWith('en-') && voice.name.includes('UK')));
        if (!this.britishVoice) {
          this.britishVoice = voices.find(voice => voice.lang.startsWith('en-'));
        }
      };
      speechSynthesis.getVoices();
    }
  }

  showStudentSelect() {
    const container = document.getElementById("mainContainer");
    let html = `<h1>Выберите ученика</h1><div class="student-list">`;
    students.forEach(student => {
      html += `
        <div class="student-item" onclick="trainer.selectStudent('${student.id}')">
          <img src="${student.avatar}" alt="${student.name}" class="student-avatar" onerror="this.src='https://via.placeholder.com/100'">
          <div class="student-name">${student.name}</div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }

  async selectStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    this.currentStudentId = studentId;
    this.currentStudentName = student.name;
    this.currentStudentAvatar = student.avatar;

    try {
      const snapshot = await database.ref('students/' + studentId).once('value');
      this.userData = snapshot.val() || {
        nickname: student.name,
        avatarUrl: student.avatar,
        records: [],
        achievements: {},
        totalGames: 0,
        totalCorrect: 0
      };
      this.showMainScreen();
    } catch (error) {
      console.error("Error loading student ", error);
      this.userData = {
        nickname: student.name,
        avatarUrl: student.avatar,
        records: [],
        achievements: {},
        totalGames: 0,
        totalCorrect: 0
      };
      this.showMainScreen();
    }
  }

  async saveUserData() {
    if (!this.currentStudentId) return;
    try {
      await database.ref('students/' + this.currentStudentId).set(this.userData);
    } catch (error) {
      console.error("Error saving student ", error);
    }
  }

  showMainScreen() {
    // КРИТИЧЕСКИ ВАЖНО: сбросить состояние игры при возврате в главное меню
    this.currentVerbGroupKey = null;
    this.verbs = [];
    this.results = [];
    this.currentIndex = 0;
    clearInterval(this.timer);
    this.timeLeft = 30;

    const lastVerbGroupKey = localStorage.getItem('lastVerbGroupKey') || 'common1';
    const container = document.getElementById("mainContainer");
    
    container.innerHTML = `
      <div class="user-profile">
        <img src="${this.userData.avatarUrl}" alt="Avatar" class="user-avatar" 
             onerror="this.src='https://via.placeholder.com/100'">
        <div class="user-info">
          <div class="user-nickname">${this.userData.nickname}</div>
          <div>Games: ${this.userData.totalGames || 0}</div>
          <div>Correct answers: ${this.userData.totalCorrect || 0}</div>
        </div>
      </div>
      
      <h1>Irregular Verbs Trainer</h1>
      
      <div class="form-group">
        <label for="verbGroup">Verb Group:</label>
        <select id="verbGroup">
          ${Object.keys(verbGroups).map(key => 
            `<option value="${key}" ${key === lastVerbGroupKey ? 'selected' : ''}>
              ${verbGroups[key].name}
            </option>`
          ).join('')}
        </select>
      </div>
      
      <button class="btn" id="startBtn">Start Game</button>
      <button class="btn" id="backToStudentsBtn" style="background: #f44336; margin-left: 10px;">Back to List</button>
      
      ${this.getAchievementsHTML()}
    `;

    // Добавляем слушатели ПОСЛЕ того, как HTML добавлен в DOM
    setTimeout(() => {
      document.getElementById("startBtn").addEventListener("click", () => {
        const selectedGroup = document.getElementById("verbGroup").value;
        localStorage.setItem('lastVerbGroupKey', selectedGroup);
        this.startGame(selectedGroup);
      });

      document.getElementById("backToStudentsBtn").addEventListener("click", () => {
        // Также сбрасываем состояние при возврате к списку учеников
        this.currentVerbGroupKey = null;
        this.verbs = [];
        this.results = [];
        this.currentIndex = 0;
        clearInterval(this.timer);
        this.showStudentSelect();
      });
    }, 0);
  }

  sstartGame(groupKey) {
    // КРИТИЧЕСКИ ВАЖНО: сбросить состояние
    this.currentVerbGroupKey = groupKey;
    this.verbs = [...verbGroups[groupKey].verbs];
    this.results = []; // ← очищаем результаты
    this.currentIndex = 0; // ← сбрасываем индекс
    this.timeLeft = 30; // ← ДОБАВЛЯЕМ ЭТУ СТРОКУ!
    clearInterval(this.timer); // ← ДОБАВЛЯЕМ ЭТУ СТРОКУ!
    
    this.shuffleVerbs();
    this.gameStartTime = Date.now();

    document.getElementById("mainContainer").innerHTML = `
      <div class="user-profile">
        <img src="${this.userData.avatarUrl}" alt="Avatar" class="user-avatar"
             onerror="this.src='https://via.placeholder.com/100'">
        <div class="user-info">
          <div class="user-nickname">${this.userData.nickname}</div>
        </div>
      </div>
      
      <h1>Hi, ${this.userData.nickname}!</h1>
      <div class="timer">Time left: <span id="timer">30</span> sec</div>
      
      <div class="verb-container">
        <div id="verbImageContainer"></div>
        <div class="verb" id="verb"></div>
      </div>
      
      <div class="translation" id="translation"></div>
      <div class="inputs">
        <input type="text" class="input-box" id="pastSimple" placeholder="Past Simple" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <input type="text" class="input-box" id="pastParticiple" placeholder="Past Participle" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
      </div>
      <p class="result" id="result"></p>
    `;

    document.getElementById("pastSimple").addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("pastParticiple").focus();
    });
    
    document.getElementById("pastParticiple").addEventListener("keydown", e => {
      if (e.key === "Enter") this.checkAnswer();
    });

    this.loadVerb();
  }

  shuffleVerbs() {
    for (let i = this.verbs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.verbs[i], this.verbs[j]] = [this.verbs[j], this.verbs[i]];
    }
  }

  loadVerb() {
    const currentVerb = this.verbs[this.currentIndex];
    const verbElement = document.getElementById("verb");
    const translationElement = document.getElementById("translation");
    const imageContainer = document.getElementById("verbImageContainer");
    
    verbElement.textContent = currentVerb.base.toUpperCase();
    translationElement.textContent = currentVerb.ru;
    
    if (currentVerb.image) {
      imageContainer.innerHTML = `<img src="${currentVerb.image}" alt="${currentVerb.base}" 
                                    class="verb-image"
                                    onerror="this.style.display='none'">`;
    } else {
      imageContainer.innerHTML = '';
    }
    
    document.getElementById("pastSimple").value = "";
    document.getElementById("pastParticiple").value = "";
    document.getElementById("result").textContent = "";
    document.getElementById("pastSimple").focus();
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timer);
    this.timeLeft = 30;
    document.getElementById("timer").textContent = this.timeLeft;
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      document.getElementById("timer").textContent = this.timeLeft;
      
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.showResults();
      }
    }, 1000);
  }

  checkAnswer() {
  const psInput = document.getElementById("pastSimple").value.trim().toLowerCase();
  const ppInput = document.getElementById("pastParticiple").value.trim().toLowerCase();
  const currentVerb = this.verbs[this.currentIndex];

  // Защита от undefined
  if (!currentVerb) {
    this.showResults();
    return;
  }

  const isPsCorrect = this.checkForm(psInput, currentVerb.past);
  const isPpCorrect = this.checkForm(ppInput, currentVerb.participle);
  const isCorrect = isPsCorrect && isPpCorrect;

  // Сохраняем результат ТОЛЬКО если глагол существует
  this.saveResult(isCorrect);

  if (isCorrect) {
    this.currentIndex++;
    if (this.currentIndex < this.verbs.length) {
      this.loadVerb();
    } else {
      const correctAnswers = this.results.filter(r => r.correct).length;
      if (correctAnswers === this.verbs.length) {
        this.showCompletionModal(true, true);
      } else {
        this.showCompletionModal(false, true);
      }
    }
  } else {
    this.showCompletionModal(false, true);
  }
}

  checkForm(input, correctForms) {
    const formsArray = correctForms.toLowerCase().split(' ').map(f => f.trim());
    if (correctForms.toLowerCase().includes(' ')) {
      formsArray.push(correctForms.toLowerCase());
    }
    return formsArray.includes(input);
  }

  saveResult(correct) {
    const currentVerb = this.verbs[this.currentIndex];
    this.results.push({
      verb: currentVerb.base,
      correct: correct,
      yourPs: document.getElementById("pastSimple").value.trim() || "-",
      yourPp: document.getElementById("pastParticiple").value.trim() || "-",
      correctPs: currentVerb.past,
      correctPp: currentVerb.participle,
      ru: currentVerb.ru,
      image: currentVerb.image
    });
  }

  showCompletionModal(allCorrectForMessage, showResultsAfterConfirm) {
    clearInterval(this.timer);
    const messages = allCorrectForMessage ? allCorrectMessages : notAllCorrectMessages;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalOkBtn = document.getElementById("modalOkBtn");

    modalMessage.textContent = randomMessage;
    modal.style.display = "flex";

    const closeModal = () => {
      modal.style.display = "none";
      if (showResultsAfterConfirm) {
        this.showResults();
      } else {
        this.loadVerb();
      }
    };

    modalOkBtn.onclick = closeModal;
    const keyHandler = (e) => {
      if (e.key === "Enter") closeModal();
    };
    document.addEventListener("keydown", keyHandler);
  }

  async showResults() {
    clearInterval(this.timer);
    const total = this.verbs.length;
    const correct = this.results.filter(r => r.correct).length;
    const percent = Math.round((correct / total) * 100) || 0;
    const now = new Date();
    const gameEndTime = Date.now();
    const timeTakenMs = gameEndTime - this.gameStartTime;
    
    const minutes = Math.floor(timeTakenMs / 60000);
    const seconds = ((timeTakenMs % 60000) / 1000).toFixed(0);
    const formattedTime = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
    const gameTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    this.userData.totalGames = (this.userData.totalGames || 0) + 1;
    this.userData.totalCorrect = (this.userData.totalCorrect || 0) + correct;
    
    this.userData.records.push({
      correct,
      total,
      percent,
      date: now.toLocaleDateString(),
      gameTime: gameTime,
      time: formattedTime,
      group: verbGroups[this.currentVerbGroupKey].name
    });

    this.checkAchievements(correct, total);
    await this.saveUserData();

    let html = `
      <div class="user-profile">
        <img src="${this.userData.avatarUrl}" alt="Avatar" class="user-avatar"
             onerror="this.src='https://via.placeholder.com/100'">
        <div class="user-info">
          <div class="user-nickname">${this.userData.nickname}</div>
        </div>
      </div>
      
      <h1 class="results-header">Results</h1>
      <div class="stats">
        <p class="player-name">Player: ${this.userData.nickname}</p>
        <p class="answered-count">You answered: ${this.results.length} verbs</p>
        <p class="correct-answers">Correct answers: <span class="correct-number">${correct}</span>/<span class="total-number">${total}</span></p>
        <p class="success-rate">Success rate: ${percent}%</p>
        <p>Time Taken: ${formattedTime}</p>
      </div>
      <div class="table-container">
        <table class="results-table">
          <thead>
            <tr>
              <th>Verb</th>
              <th>Image</th>
              <th>Your Past</th>
              <th>Your Part.</th>
              <th>Correct Past</th>
              <th>Correct Part.</th>
              <th>Translation</th>
            </tr>
          </thead>
          <tbody>
    `;

    this.results.forEach(r => {
      const psClass = this.checkForm(r.yourPs.toLowerCase(), r.correctPs) ? 'correct' : 'wrong';
      const ppClass = this.checkForm(r.yourPp.toLowerCase(), r.correctPp) ? 'correct' : 'wrong';
      
      const correctPsButtons = r.correctPs.split(' ').map(part => 
        `<button class="play-table-audio-btn" data-word="${part}"></button>`
      ).join('');
      
      const correctPpButtons = r.correctPp.split(' ').map(part => 
        `<button class="play-table-audio-btn" data-word="${part}"></button>`
      ).join('');

      html += `
        <tr>
          <td>${r.verb} <button class="play-table-audio-btn" data-word="${r.verb}"></button></td>
          <td>${r.image ? `<img src="${r.image}" alt="${r.verb}" style="width: 50px; height: 40px; object-fit: cover; border-radius: 5px;" onerror="this.style.display='none'">` : ''}</td>
          <td class="${psClass}">${r.yourPs}</td>
          <td class="${ppClass}">${r.yourPp}</td>
          <td>${r.correctPs} ${correctPsButtons}</td>
          <td>${r.correctPp} ${correctPpButtons}</td>
          <td>${r.ru}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
      <button class="restart-btn" id="mainMenuBtn">Main Menu</button>
      
      ${this.getAchievementsHTML()}
    `;

    document.getElementById("mainContainer").innerHTML = html;
    
    document.querySelectorAll('.play-table-audio-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const wordToSpeak = event.target.dataset.word;
        this.playSpeech(wordToSpeak);
      });
    });

    document.getElementById("mainMenuBtn").addEventListener("click", () => {
      this.showMainScreen();
    });

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  getAchievementsHTML() {
    const playerAchievements = this.userData ? (this.userData.achievements || {}) : {};
    let html = `
      <div class="achievements">
        <div class="achievements-title">My Achievements</div>
        <div class="achievement-list">
    `;
    for (const key in achievements) {
      const achievement = achievements[key];
      const isUnlocked = playerAchievements[key];
      html += `
        <div class="achievement-item ${isUnlocked ? 'unlocked' : ''}">
          <span class="achievement-icon">${achievement.icon}</span>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
      `;
    }
    html += `
        </div>
      </div>
    `;
    return html;
  }

  checkAchievements(correctAnswers, totalAnswers) {
    if (!this.userData) return;
    if (!this.userData.achievements.novice) {
      this.userData.achievements.novice = true;
      this.showAchievementNotification(achievements.novice.name, achievements.novice.icon);
    }
    if (correctAnswers === totalAnswers) {
      const groupAchievementKey = `master_${this.currentVerbGroupKey}`;
      if (achievements[groupAchievementKey] && !this.userData.achievements[groupAchievementKey]) {
        this.userData.achievements[groupAchievementKey] = true;
        this.showAchievementNotification(achievements[groupAchievementKey].name, achievements[groupAchievementKey].icon);
      }
    }
  }

  showAchievementNotification(name, icon) {
    const notificationContainer = document.getElementById('achievementNotificationContainer');
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'achievement-notification';
    notificationDiv.innerHTML = `<strong>${icon} Achievement Unlocked! ${icon}</strong><br>${name}`;
    notificationContainer.appendChild(notificationDiv);
    setTimeout(() => {
      notificationDiv.remove();
    }, 2500);
  }

  playSpeech(text) {
    if (!text || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    if (this.britishVoice) {
      utterance.voice = this.britishVoice;
    } else {
      utterance.lang = 'en-US';
    }
    speechSynthesis.speak(utterance);
  }
}

// === ЗАПУСК ===
let trainer;
document.addEventListener('DOMContentLoaded', () => {
  trainer = new VerbsTrainer();
});
