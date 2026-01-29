// Firebase конфигурация - ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// Полный список глаголов с URL картинок
const verbs = [
    {base:"arise", past:"arose", participle:"arisen", ru:"возникать", image: "https://example.com/images/arise.jpg"},
    {base:"awake", past:"awoke", participle:"awoken", ru:"просыпаться", image: "https://example.com/images/awake.jpg"},
    {base:"be", past:"was were", participle:"been", ru:"быть", image: "https://example.com/images/be.jpg"},
    // ... добавьте остальные глаголы с изображениями
    // Для теста можно использовать временные URL:
    // {base:"write", past:"wrote", participle:"written", ru:"писать", image: "https://picsum.photos/200/150?random=1"}
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
            const snapshot = await database.ref('users/' + this.currentUser.uid).once('value');
            this.userData = snapshot.val() || {
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
            await database.ref('users/' + this.currentUser.uid).set(this.userData);
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }

    async uploadAvatar(file) {
        if (!this.currentUser || !file) return null;
        
        try {
            const storageRef = storage.ref();
            const avatarRef = storageRef.child(`avatars/${this.currentUser.uid}/${Date.now()}_${file.name}`);
            const snapshot = await avatarRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            await this.currentUser.updateProfile({
                photoURL: downloadURL
            });
            
            this.userData.avatarUrl = downloadURL;
            await this.saveUserData();
            
            return downloadURL;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            return null;
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
                <div class="auth-buttons">
                    <button class="btn" id="loginBtn">Login</button>
                    <button class="btn" id="registerBtn">Register</button>
                </div>
                
                <div id="loginForm" style="display: none;">
                    <div class="form-group">
                        <label for="loginEmail">Email:</label>
                        <input type="text" id="loginEmail" placeholder="your@email.com" />
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password:</label>
                        <input type="password" id="loginPassword" placeholder="Password" />
                    </div>
                    <button class="btn" id="submitLogin">Login</button>
                </div>
                
                <div id="registerForm" style="display: none;">
                    <div class="form-group">
                        <label for="registerEmail">Email:</label>
                        <input type="text" id="registerEmail" placeholder="your@email.com" />
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password:</label>
                        <input type="password" id="registerPassword" placeholder="Password (min 6 chars)" />
                    </div>
                    <div class="form-group">
                        <label for="registerNickname">Nickname:</label>
                        <input type="text" id="registerNickname" placeholder="Your nickname" />
                    </div>
                    <div class="upload-container">
                        <label for="avatarUpload">Avatar (optional):</label>
                        <input type="file" id="avatarUpload" accept="image/*" />
                        <img id="avatarPreview" class="upload-preview" src="" style="display: none;" />
                    </div>
                    <button class="btn" id="submitRegister">Register</button>
                </div>
            </div>
        `;

        // Обработчики кнопок
        document.getElementById("loginBtn").addEventListener("click", () => {
            document.getElementById("loginForm").style.display = "block";
            document.getElementById("registerForm").style.display = "none";
        });

        document.getElementById("registerBtn").addEventListener("click", () => {
            document.getElementById("registerForm").style.display = "block";
            document.getElementById("loginForm").style.display = "none";
        });

        document.getElementById("submitLogin").addEventListener("click", () => this.login());
        document.getElementById("submitRegister").addEventListener("click", () => this.register());
        
        // Предпросмотр аватара
        document.getElementById("avatarUpload").addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById("avatarPreview").src = e.target.result;
                    document.getElementById("avatarPreview").style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    async login() {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        
        if (!email || !password) {
            alert("Please enter email and password!");
            return;
        }
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    }

    async register() {
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value.trim();
        const nickname = document.getElementById("registerNickname").value.trim();
        const avatarFile = document.getElementById("avatarUpload").files[0];
        
        if (!email || !password || !nickname) {
            alert("Please fill all required fields!");
            return;
        }
        
        if (password.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }
        
        try {
            // Создаем пользователя
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Загружаем аватар если есть
            let avatarUrl = "";
            if (avatarFile) {
                avatarUrl = await this.uploadAvatar(avatarFile);
            }
            
            // Обновляем профиль
            await userCredential.user.updateProfile({
                displayName: nickname,
                photoURL: avatarUrl
            });
            
            // Создаем начальные данные пользователя
            this.userData = {
                nickname: nickname,
                avatarUrl: avatarUrl || 'https://via.placeholder.com/100',
                records: [],
                achievements: {},
                totalGames: 0,
                totalCorrect: 0
            };
            
            await this.saveUserData();
            
        } catch (error) {
            alert("Registration failed: " + error.message);
        }
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
            <button class="btn" id="editProfileBtn" style="background: #ff9800; margin-left: 10px;">Edit Profile</button>
            <button class="btn" id="logoutBtn" style="background: #f44336; margin-left: 10px;">Logout</button>
            
            ${this.getLeaderboardHTML()}
            ${this.getAchievementsHTML()}
        `;

        document.getElementById("startBtn").addEventListener("click", () => {
            const groupKey = document.getElementById("verbGroup").value;
            localStorage.setItem('lastVerbGroupKey', groupKey);
            this.startGame(groupKey);
        });

        document.getElementById("editProfileBtn").addEventListener("click", () => this.showEditProfileScreen());
        document.getElementById("logoutBtn").addEventListener("click", () => this.logout());
    }

    showEditProfileScreen() {
        const container = document.getElementById("mainContainer");
        
        container.innerHTML = `
            <h1>Edit Profile</h1>
            
            <div class="user-profile">
                <img id="editAvatarPreview" src="${this.userData.avatarUrl}" alt="Avatar" class="user-avatar"
                     onerror="this.src='https://via.placeholder.com/100'">
                <div class="user-info">
                    <div class="user-nickname">${this.userData.nickname}</div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="editNickname">Nickname:</label>
                <input type="text" id="editNickname" value="${this.userData.nickname}" />
            </div>
            
            <div class="upload-container">
                <label for="editAvatarUpload">Change Avatar:</label>
                <input type="file" id="editAvatarUpload" accept="image/*" />
            </div>
            
            <button class="btn" id="saveProfileBtn">Save Changes</button>
            <button class="btn" id="cancelEditBtn" style="background: #f44336; margin-left: 10px;">Cancel</button>
        `;

        // Предпросмотр аватара
        document.getElementById("editAvatarUpload").addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById("editAvatarPreview").src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById("saveProfileBtn").addEventListener("click", async () => {
            const nickname = document.getElementById("editNickname").value.trim();
            const avatarFile = document.getElementById("editAvatarUpload").files[0];
            
            if (!nickname) {
                alert("Nickname cannot be empty!");
                return;
            }
            
            try {
                // Обновляем никнейм
                this.userData.nickname = nickname;
                
                // Обновляем аватар если есть
                if (avatarFile) {
                    const avatarUrl = await this.uploadAvatar(avatarFile);
                    if (avatarUrl) {
                        this.userData.avatarUrl = avatarUrl;
                    }
                }
                
                // Обновляем профиль Firebase
                await this.currentUser.updateProfile({
                    displayName: nickname,
                    photoURL: this.userData.avatarUrl
                });
                
                await this.saveUserData();
                this.showMainScreen();
                
            } catch (error) {
                alert("Error updating profile: " + error.message);
            }
        });

        document.getElementById("cancelEditBtn").addEventListener("click", () => {
            this.showMainScreen();
        });
    }

    startGame(groupKey) {
        this.currentVerbGroupKey = groupKey;
        this.verbs = [...verbGroups[groupKey].verbs];
        this.shuffleVerbs();
        this.currentIndex = 0;
        this.results = [];
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
        
        // Показываем изображение глагола, если есть
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
        const gameTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        // Обновляем статистику пользователя
        this.userData.totalGames = (this.userData.totalGames || 0) + 1;
        this.userData.totalCorrect = (this.userData.totalCorrect || 0) + correct;
        
        // Добавляем запись о текущей игре
        this.userData.records.push({
            correct,
            total,
            percent,
            date: now.toLocaleDateString(),
            gameTime: gameTime,
            time: formattedTime,
            group: verbGroups[this.currentVerbGroupKey].name
        });

        // Проверяем достижения
        this.checkAchievements(correct, total);
        
        // Сохраняем данные пользователя
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
            <button class="restart-btn" id="restartBtn">Play Again</button>
            <button class="restart-btn" id="mainMenuBtn" style="background: #9c27b0; margin-left: 10px;">Main Menu</button>
            
            ${this.getLeaderboardHTML()}
            ${this.getAchievementsHTML()}
        `;

        document.getElementById("mainContainer").innerHTML = html;
        
        document.querySelectorAll('.play-table-audio-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const wordToSpeak = event.target.dataset.word;
                this.playSpeech(wordToSpeak);
            });
        });

        document.getElementById("restartBtn").addEventListener("click", () => {
            this.startGame(this.currentVerbGroupKey);
        });

        document.getElementById("mainMenuBtn").addEventListener("click", () => {
            this.showMainScreen();
        });

        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    }

    async getLeaderboardHTML() {
        try {
            const snapshot = await database.ref('users').once('value');
            const users = snapshot.val();
            const allScores = [];

            for (const userId in users) {
                const user = users[userId];
                const records = user.records || [];
                
                records.forEach(record => {
                    allScores.push({
                        name: user.nickname || 'Anonymous',
                        avatar: user.avatarUrl || 'https://via.placeholder.com/100',
                        correct: record.correct || 0,
                        total: record.total || 0,
                        percent: record.percent || 0,
                        date: record.date || 'N/A',
                        gameTime: record.gameTime || 'N/A',
                        time: record.time || 'N/A',
                        group: record.group || 'N/A'
                    });
                });
            }

            allScores.sort((a, b) => {
                if (b.percent !== a.percent) return b.percent - a.percent;
                if (b.correct !== a.correct) return b.correct - a.correct;
                
                const timeToSeconds = (timeStr) => {
                    if (timeStr === 'N/A') return Infinity;
                    const parts = timeStr.match(/(\d+)m\s*(\d+)s/);
                    if (parts) {
                        return parseInt(parts[1]) * 60 + parseInt(parts[2]);
                    }
                    return Infinity;
                };
                return timeToSeconds(a.time) - timeToSeconds(b.time);
            });

            let lbHtml = '<div class="leaderboard">';
            lbHtml += '<div class="leaderboard-title">LEADERBOARD</div>';
            
            if (allScores.length === 0) {
                lbHtml += '<p>No results yet.</p>';
            } else {
                lbHtml += '<ol>';
                allScores.slice(0, 10).forEach((p, index) => {
                    lbHtml += `
                        <li style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                            <span style="font-weight: bold; color: gold;">${index + 1}.</span>
                            <img src="${p.avatar}" alt="${p.name}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;"
                                 onerror="this.src='https://via.placeholder.com/30'">
                            <strong>${p.name}</strong> (${p.group}): ${p.correct}/${p.total} (${p.percent}%) — ${p.date} ${p.gameTime} (${p.time})
                        </li>
                    `;
                });
                lbHtml += '</ol>';
            }
            lbHtml += '</div>';
            
            return lbHtml;
            
        } catch (error) {
            console.error("Error loading leaderboard:", error);
            return '<div class="leaderboard"><p>Error loading leaderboard</p></div>';
        }
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

        let newAchievementUnlocked = false;

        if (!this.userData.achievements.novice) {
            this.userData.achievements.novice = true;
            this.showAchievementNotification(achievements.novice.name, achievements.novice.icon);
            newAchievementUnlocked = true;
        }

        if (correctAnswers === totalAnswers) {
            const groupAchievementKey = `master_${this.currentVerbGroupKey}`;
            if (achievements[groupAchievementKey] && !this.userData.achievements[groupAchievementKey]) {
                this.userData.achievements[groupAchievementKey] = true;
                this.showAchievementNotification(achievements[groupAchievementKey].name, achievements[groupAchievementKey].icon);
                newAchievementUnlocked = true;
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
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const trainer = new VerbsTrainer();
});
