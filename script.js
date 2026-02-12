document.addEventListener('DOMContentLoaded', () => {
    
    // --- Features Section Interactive Logic ---
    const featureBtns = document.querySelectorAll('.feature-btn');
    const featureVideos = document.querySelectorAll('.feature-video');

    function setActiveFeature(targetId) {
        // 1. Remove active class from all buttons and videos
        featureBtns.forEach(btn => btn.classList.remove('active'));
        featureVideos.forEach(video => video.classList.remove('active'));

        // 2. Find the specific button clicked/hovered
        const currentBtn = document.querySelector(`[data-target="${targetId}"]`);
        // 3. Find the corresponding video
        const currentVideo = document.getElementById(targetId);

        // 4. Add active class to the current selection
        if (currentBtn && currentVideo) {
            currentBtn.classList.add('active');
            currentVideo.classList.add('active');
            // Optional: Restart the video so it plays from the beginning when selected
            currentVideo.currentTime = 0; 
            currentVideo.play();
        }
    }

    // Add Event Listeners for both Hover (mouseover) and Click
    featureBtns.forEach(btn => {
        const targetId = btn.getAttribute('data-target');

        btn.addEventListener('mouseover', () => {
            setActiveFeature(targetId);
        });

        // Click needed for mobile users where hover doesn't exist
        btn.addEventListener('click', () => {
             setActiveFeature(targetId);
        });
    });
});

// --- RSVP DEMO LOGIC ---
const textScript = `Welcome to Wordleach. Read faster, maximize your recall, and find amazing articles and essays out there. This app is simple, it's designed to help you. No ads, no subscriptions, no data tracking, no BS. Should I keep talking? No seriously, why are you still reading? Do you want to do a reading test or something? Fine, here's me bumping it up to 600 WPM already. Are you happy? Reading pretty fast? This is faster than the average PhD graduate reads, so I'd say you're doing pretty good. RSVP does have its pros and its cons: You might read several hundred words and find you struggle to recall it. Through my time using it- And I use it often- I've found I've gotten better and better at remembering what I read. In just a couple days I felt my memory and conversational skills improve, and I can't help but attribute it to this. I just bumped it up to 900 WPM. I'm just making things up as I go along now, because you probably won't even remember what I'm saying. RSVP is an excellent tool for Sometimes I cover myself in dirt and pretend I'm a carrot reading. An exercise I recommend is simply reading at the pace you enjoy, and still have the ability to recall things. It might be tempting to jump straight to 600 WPM, but that's pointless unless you're just trying to show off to your friends. I more like the idea of a slow improvement: Start at 250 and choose something from our article section. I personally love "The Egg". Ask yourself after a minute: Am I processing what I'm reading? If it's too easy, well bump it up then, and keep going! I'm so proud of this app, for more than just reading fast, but also learning, brain exercises, and finding articles and essays, which are vastly underread and you can find more on tetw.com. I find it suspicious you're still reading, considering only a superhuman could have the ability to still be reading this fast at 1000 words per minute. Are you a superhuman? I didn't think so. Anyways, what are you waiting for? Go click download.`;

const words = textScript.split(/\s+/);
let currentIndex = 0;
let isPlaying = false;
let timer = null;
let currentWPM = 250; 

const wordLeft = document.getElementById('word-left');
const wordCenter = document.getElementById('word-center');
const wordRight = document.getElementById('word-right');
const playBtn = document.getElementById('play-pause-btn');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');

function getParts(word) {
    const centerIndex = Math.floor((word.length - 1) / 2);
    return {
        left: word.substring(0, centerIndex),
        center: word[centerIndex],
        right: word.substring(centerIndex + 1)
    };
}

function renderWord() {
    // Safety check: Stop if we run out of words
    if (currentIndex >= words.length) {
        stopReader();
        currentIndex = 0; 
        return;
    }

    const word = words[currentIndex];
    const nextWord = words[currentIndex + 1] || ""; // Safety for last word

    // 1. Check for Speed Triggers
    // FIX: We only update the VARIABLE (currentWPM), we don't call the function.
    // This prevents the timer from being cleared twice.
    if (word === "600" && nextWord === "WPM") {
        currentWPM = 600;
    } else if (word === "900" && nextWord === "WPM") {
        currentWPM = 900;
    } else if (word === "100000") {
        currentWPM = 1000;
    } else if (word === "10000") {
        currentWPM = 250;
    }

    // 2. Render the word
    const parts = getParts(word);
    wordLeft.textContent = parts.left;
    wordCenter.textContent = parts.center;
    wordRight.textContent = parts.right;

    // 3. Punctuation Logic
    let multiplier = 1;
    if (/[.?]/.test(word)) {
        multiplier = 2.5; // Longer pause for sentences
    } else if (/[,\-]/.test(word)) {
        multiplier = 1.8; // Medium pause for commas
    }

    currentIndex++;

    // 4. Reset the Timer
    // This single block now handles BOTH speed changes and punctuation delays.
    if (isPlaying) {
        clearInterval(timer);
        // We use the NEW currentWPM here immediately
        const msPerWord = 60000 / currentWPM;
        timer = setInterval(renderWord, msPerWord * multiplier);
    }
}

function togglePlay() {
    if (isPlaying) stopReader();
    else startReader();
}

function startReader() {
    isPlaying = true;
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
    timer = setInterval(renderWord, 60000 / currentWPM);
}

function stopReader() {
    isPlaying = false;
    clearInterval(timer);
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
}

if(playBtn) playBtn.addEventListener('click', togglePlay);