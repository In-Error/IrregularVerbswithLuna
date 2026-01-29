// === КОНФИГУРАЦИЯ FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyB5TnXXY9uPWZ9e89gFTyCgJJzHQeyIGw4",
  authDomain: "irregularverbswithluna.firebaseapp.com",
  projectId: "irregularverbswithluna",
  storageBucket: "irregularverbswithluna.firebasestorage.app",
  messagingSenderId: "395410317673",
  appId: "1:395410317673:web:681edb6be923c789ddff8",
  measurementId: "G-06KGGB85GJ"
};

// Инициализация Firebase (только один раз!)
firebase.initializeApp(firebaseConfig);

// Глобальные ссылки — ТОЛЬКО Firestore, НЕ Realtime Database
const auth = firebase.auth();
const db = firebase.firestore(); // ← ВАЖНО: не database, а firestore

// Полный список глаголов с URL картинок
const verbs = [
  {base:"arise", past:"arose", participle:"arisen", ru:"возникать", image: "https://picsum.photos/200/150?random=1"},
  {base:"awake", past:"awoke", participle:"awoken", ru:"просыпаться", image: "https://picsum.photos/200/150?random=2"},
  {base:"be", past:"was were", participle:"been", ru:"быть", image: "https://picsum.photos/200/150?random=3"},
  // ... остальные глаголы (до 132) — оставьте как есть
  {base:"write", past:"wrote", participle:"written", ru:"писать", image: "https://picsum.photos/200/150?random=132"}
];

// Фильтруем common глаголы
const lessCommonList = ["arise","awake","bear","bend","bet","bleed","breed","broadcast","deal","kneel","mow","overtake","sew","stink","strike"];
const advancedList = ["bind","burst","cling","creep","grind","saw","shed","sow","spit","swell","weep","wind"];
const commonVerbs = verbs.filter(v => !lessCommonList.includes(v.base) && !advancedList.includes(v.base));

// Делим common на 5 частей
const commonParts = [];
for (let i = 0; i < 5; i++) {
  commonParts[i] = commonVerbs.slice(i * 21, (i + 1) * 21);
}

// Группы глаголов
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

// Сообщения для модальных окон
const allCorrectMessages = [
  "Wow, cool! Jump to the next training!",
  "Yay! The next training is calling you - go, go, go!",
  "Great! Run to the next one, superhero!",
  "Nice! The next training is waiting - don't be lazy!",
  "Hooray! Show the next training who's the boss!",
  "Awesome! One more training and you'll be a star!",
  "Good job! Next level - let's go!",
  "Wow! The next training can't wait for you!"
];

const notAllCorrectMessages = [
  "Almost there! Next time you'll be the champion!",
  "Good try! You're getting better and better!",
  "Nice work! A little more practice - and you'll smash it!",
  "You're awesome anyway! Try again and win next time!",
  "So close! One more go and you'll get it!",
  "Don't worry! Even superheroes train a lot!",
  "Great effort! The top score is waiting for you!",
  "Keep going! Every try makes you stronger!"
];

// Достижения
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

class VerbsTrainer {
  constructor() {
    this.currentUser = null;
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
    this.initializeAuth();
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

  initializeAuth() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.loadUserData();
      } else {
        this.currentUser = null;
        this.userData = null;
        this.showAuthScreen();
      }
    });
  }

  async loadUserData() {
    try {
      const doc = await db.collection('users').doc(this.currentUser.uid).get();
      this.userData = doc.exists ? doc.data() : {
        nickname: this.currentUser.displayName || this.currentUser.email.split('@')[0],
        avatarUrl: this.currentUser.photoURL || 'https://via.placeholder.com/100',
        records: [],
        achievements: {},
        totalGames: 0,
        totalCorrect: 0
      };
      this.showMainScreen();
    } catch (error) {
      console.error("Error loading user data:", error);
      this.showMainScreen();
    }
  }

  async saveUserData() {
    if (!this.currentUser) return;
    try {
      await db.collection('users').doc(this.currentUser.uid).set(this.userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
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

  showAuthScreen() {
    const container = document.getElementById("mainContainer");
    container.innerHTML = `
      <h1>Irregular Verbs Trainer</h1>
      <div class="auth-section">
        <button class="btn" id="loginBtn">Login</button>
        <button class="btn" id="registerBtn">Register</button>
      </div>
    `;
    document.getElementById("loginBtn").addEventListener("click", () => alert("Login not implemented yet"));
    document.getElementById("registerBtn").addEventListener("click", () => alert("Registration not implemented yet"));
  }

  async logout() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  showMainScreen() {
    const lastVerbGroupKey = localStorage.getItem('lastVerbGroupKey') || 'common1';
    const container = document.getElementById("mainContainer");
    container.innerHTML = `
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
      <button class="btn" id="logoutBtn" style="background: #f44336; margin-left: 10px;">Logout</button>
    `;

    document.getElementById("startBtn").addEventListener("click", () => {
      const groupKey = document.getElementById("verbGroup").value;
      localStorage.setItem('lastVerbGroupKey', groupKey);
      this.startGame(groupKey);
    });

    document.getElementById("logoutBtn").addEventListener("click", () => this.logout());
  }

  startGame(groupKey) {
    this.currentVerbGroupKey = groupKey;
    this.verbs = [...verbGroups[groupKey].verbs];
    this.shuffleVerbs();
    this.currentIndex = 0;
    this.results = [];
    this.gameStartTime = Date.now();

    document.getElementById("mainContainer").innerHTML = `
      <h1>Let's Go!</h1>
      <div class="timer">Time left: <span id="timer">30</span> sec</div>
      <div class="verb-container">
        <div id="verbImageContainer"></div>
        <div class="verb" id="verb"></div>
      </div>
      <div class="translation" id="translation"></div>
      <div class="inputs">
        <input type="text" class="input-box" id="pastSimple" placeholder="Past Simple" autocomplete="off" />
        <input type="text" class="input-box" id="pastParticiple" placeholder="Past Participle" autocomplete="off" />
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
      imageContainer.innerHTML = `<img src="${currentVerb.image}" alt="${currentVerb.base}" class="verb-image" onerror="this.style.display='none'">`;
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

    const isPsCorrect = this.checkForm(psInput, currentVerb.past);
    const isPpCorrect = this.checkForm(ppInput, currentVerb.participle);
    const isCorrect = isPsCorrect && isPpCorrect;

    this.saveResult(isCorrect);
    
    if (isCorrect) {
      this.currentIndex++;
      if (this.currentIndex < this.verbs.length) {
        this.loadVerb();
      } else {
        const correctAnswers = this.results.filter(r => r.correct).length;
        this.showCompletionModal(correctAnswers === this.verbs.length, true);
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
      if (e.key === "Enter") {
        closeModal();
        modal.removeEventListener("keydown", keyHandler);
      }
    };

    modal.addEventListener("keydown", keyHandler);
    setTimeout(() => modalOkBtn.focus(), 100);
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

    this.userData.totalGames = (this.userData.totalGames || 0) + 1;
    this.userData.totalCorrect = (this.userData.totalCorrect || 0) + correct;
    
    this.userData.records = this.userData.records || [];
    this.userData.records.push({
      correct,
      total,
      percent,
      date: now.toLocaleDateString(),
      time: formattedTime,
      group: verbGroups[this.currentVerbGroupKey].name
    });

    this.checkAchievements(correct, total);
    await this.saveUserData();

    let html = `
      <h1 class="results-header">Results</h1>
      <div class="stats">
        <p class="answered-count">You answered: ${this.results.length} verbs</p>
        <p class="correct-answers">Correct answers: <span class="correct-number">${correct}</span>/<span class="total-number">${total}</span></p>
        <p class="success-rate">Success rate: ${percent}%</p>
        <p>Time Taken: ${formattedTime}</p>
      </div>
      <button class="restart-btn" id="restartBtn">Play Again</button>
      <button class="restart-btn" id="mainMenuBtn" style="background: #9c27b0; margin-left: 10px;">Main Menu</button>
    `;

    document.getElementById("mainContainer").innerHTML = html;
    
    document.getElementById("restartBtn").addEventListener("click", () => {
      this.startGame(this.currentVerbGroupKey);
    });

    document.getElementById("mainMenuBtn").addEventListener("click", () => {
      this.showMainScreen();
    });
  }

  checkAchievements(correctAnswers, totalAnswers) {
    if (!this.userData) return;
    this.userData.achievements = this.userData.achievements || {};

    if (!this.userData.achievements.novice) {
      this.userData.achievements.novice = true;
    }

    if (correctAnswers === totalAnswers) {
      const groupAchievementKey = `master_${this.currentVerbGroupKey}`;
      if (achievements[groupAchievementKey]) {
        this.userData.achievements[groupAchievementKey] = true;
      }
    }
  }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  const trainer = new VerbsTrainer();
});
