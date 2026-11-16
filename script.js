document.addEventListener('DOMContentLoaded', () => {
    const totalSteps = 6;
    const progressBar = document.getElementById('progress-bar');
    const stepIndicator = document.getElementById('step-indicator');

    // --- 1. NAVIGASI ANTAR-STEP ---
    window.nextStep = function(stepNumber) {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        
        const target = document.getElementById(`step-${stepNumber}`);
        if (target) target.classList.add('active');

        const progressPercent = (stepNumber / totalSteps) * 100;
        progressBar.style.width = `${progressPercent}%`;
        stepIndicator.textContent = `Langkah ${stepNumber} dari ${totalSteps}`;

        if (stepNumber === 5) {
            startTypingEffect();
        }
    };

    // --- 2. STEP 2: PILIHAN MOOD ---
    window.selectMood = function(moodType) {
        const moodTitle = document.getElementById('mood-title');
        const moodReply = document.getElementById('mood-reply');

        if (moodType === 'happy') {
            moodTitle.textContent = "Senang Dengarnya, Husnika! 😄";
            moodReply.innerHTML = "Semoga mood bagusmu awet seharian! Sekarang buka gembok pesan dengan menekan inisial namamu (<strong>H - I - S</strong>) secara berurutan.";
        } else if (moodType === 'tired') {
            moodTitle.textContent = "Semangat Terus Ya, Husnika! 💪";
            moodReply.innerHTML = "Jangan lupa istirahat ya. Biar makin semangat, buka gembok pesan ini dengan menekan inisial namamu (<strong>H - I - S</strong>) secara berurutan!";
        } else if (moodType === 'bored') {
            moodTitle.textContent = "Pas Banget Nih! ☕✨";
            moodReply.innerHTML = "Kebetulan halaman ini dibuat biar hari kamu nggak gabut lagi. Tekan urutan inisial namamu (<strong>H - I - S</strong>) buat lanjut!";
        } else {
            moodTitle.textContent = "Oke, Sip Husnika! 😌";
            moodReply.innerHTML = "Biar harimu makin berwarna, buka gembok pesan dengan menekan urutan inisial namamu (<strong>H - I - S</strong>) di bawah!";
        }

        nextStep(3);
    };

    // --- 3. STEP 3: MINI-GAME INISIAL H - I - S ---
    const targetSequence = ['H', 'I', 'S'];
    let currentSequence = [];

    window.checkInitial = function(letter, btnElement) {
        const expectedLetter = targetSequence[currentSequence.length];
        const keyStatus = document.getElementById('key-status');

        if (letter === expectedLetter) {
            currentSequence.push(letter);
            btnElement.classList.add('correct');
            btnElement.disabled = true;

            // Update tampilan urutan huruf
            const display = [
                currentSequence[0] || '_',
                currentSequence[1] || '_',
                currentSequence[2] || '_'
            ];
            keyStatus.textContent = `Urutan: ${display.join(' - ')}`;

            if (currentSequence.length === 3) {
                keyStatus.textContent = "Gembok Terbuka! 🔓✨";
                setTimeout(() => nextStep(4), 600);
            }
        } else {
            // Reset jika salah urutan
            keyStatus.textContent = "Ups, urutannya harus H - I - S! Coba lagi ya 😄";
            currentSequence = [];
            document.querySelectorAll('.key-btn').forEach(btn => {
                btn.classList.remove('correct');
                btn.disabled = false;
            });
        }
    };

    // --- 4. STEP 4: MINI-GAME KETUK BINTANG ---
    let starTaps = 0;
    window.tapStar = function() {
        starTaps++;
        const starBtn = document.getElementById('star-btn');
        const starCounter = document.getElementById('star-counter');

        starBtn.style.transform = `scale(${1 + starTaps * 0.16}) rotate(${starTaps * 25}deg)`;
        starCounter.textContent = `${starTaps} / 3 Energi Terkumpul`;

        if (starTaps >= 3) {
            setTimeout(() => nextStep(5), 450);
        }
    };

    // --- 5. STEP 5: EFEK MENGETIK PESAN ---
    const fullMessage = "Hai Husnika Ilma Sakina, sebenarnya aku udah lama ngerasa kalau kamu itu orangnya asik, ramah, dan seru diajak ngobrol. Rasanya bakal menyenangkan banget kalau kita bisa kenal lebih dekat dan sering bertukar cerita...";
    let typingStarted = false;

    function startTypingEffect() {
        if (typingStarted) return;
        typingStarted = true;

        const typingTextEl = document.getElementById('typing-text');
        const btnNext = document.getElementById('btn-to-step6');
        let index = 0;

        function typeChar() {
            if (index < fullMessage.length) {
                typingTextEl.textContent += fullMessage.charAt(index);
                index++;
                setTimeout(typeChar, 36);
            } else {
                btnNext.classList.remove('hidden');
            }
        }
        typeChar();
    }

    // --- 6. STEP 6: TOMBOL PENGHINDAR & PILIH AKTIVITAS ---
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const finalEmoji = document.getElementById('final-emoji');
    const finalQuestion = document.getElementById('final-question');
    const finalSubtext = document.getElementById('final-subtext');
    const decisionBtns = document.getElementById('decision-btns');
    const activityBox = document.getElementById('activity-box');

    const dodgeTexts = [
        "Yakin nih, Husnika? 😜",
        "Eits, tombolnya kabur! 🏃‍♂️",
        "Jangan pencet yang ini 🙈",
        "Klik yang ungu aja yuk! ✨",
        "Meleset terus wlee 😝"
    ];
    let dodgeCount = 0;
    let yesScale = 1;

    function dodgeButton() {
        btnNo.style.position = 'fixed';
        const maxX = window.innerWidth - btnNo.offsetWidth - 20;
        const maxY = window.innerHeight - btnNo.offsetHeight - 20;

        const randomX = Math.max(20, Math.floor(Math.random() * maxX));
        const randomY = Math.max(20, Math.floor(Math.random() * maxY));

        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;

        btnNo.textContent = dodgeTexts[dodgeCount % dodgeTexts.length];
        dodgeCount++;

        yesScale += 0.12;
        btnYes.style.transform = `scale(${yesScale})`;
    }

    btnNo.addEventListener('mouseover', dodgeButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeButton();
    });

    btnYes.addEventListener('click', () => {
        finalEmoji.textContent = "🥳🎉🤝";
        finalQuestion.textContent = "Asik! Resmi Jadi Teman Dekat Nih! ✨";
        finalSubtext.textContent = "Makasih banyak ya Husnika Ilma Sakina udah mau berteman lebih dekat!";
        
        btnNo.style.display = 'none';
        decisionBtns.classList.add('hidden');
        activityBox.classList.remove('hidden');
        stepIndicator.textContent = "Selesai ✨";

        startConfetti();
    });

    // Memilih aktivitas pertama & menyalin pesan otomatis
    window.chooseActivity = function(activity) {
        const resultCopy = document.getElementById('result-copy');
        const replyMessage = `Hai! Aku (Husnika) udah buka pesannya dan aku mau berteman lebih dekat. Yuk mulai dengan: ${activity}`;
        
        resultCopy.classList.remove('hidden');
        resultCopy.innerHTML = `<strong>Pilihan dicatat!</strong><br>Screenshot layar ini dan kirim ke aku ya, atau salin pesan ini:<br><em>"${replyMessage}"</em>`;
        
        // Salin otomatis ke clipboard jika browser mendukung
        if (navigator.clipboard) {
            navigator.clipboard.writeText(replyMessage).catch(() => {});
        }
    };

    // --- 7. EFEK CONFETTI ---
    function startConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#4f46e5', '#9333ea', '#ec4899', '#ffd700', '#00d2ff', '#10b981'];

        for (let i = 0; i < 140; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                p.y += p.speedY;
                p.x += p.speedX;
                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
            });
            requestAnimationFrame(draw);
        }
        draw();
    }
});