// Stopwatch variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 0;

// DOM elements
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapTimes = document.getElementById('lapTimes');
const noLapsMessage = document.getElementById('noLapsMessage');

// Format time display
function formatTime(timeInMilliseconds) {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = timeInMilliseconds % 1000;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}<span class="text-3xl">.${String(milliseconds).padStart(3, '0')}</span>`;
}

// Update the display
function updateDisplay() {
    display.innerHTML = formatTime(elapsedTime);
}

// Start the stopwatch
function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(function() {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = true;
        resetBtn.classList.remove('opacity-75');
        lapBtn.disabled = false;
        
        startBtn.classList.remove('animate-pulse');
        pauseBtn.classList.add('animate-pulse');
    }
}

// Pause the stopwatch
function pauseStopwatch() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        resetBtn.classList.add('opacity-100');
        
        pauseBtn.classList.remove('animate-pulse');
        startBtn.classList.add('animate-pulse');
    }
}

// Reset the stopwatch
function resetStopwatch() {
    if (!isRunning) {
        elapsedTime = 0;
        updateDisplay();
        resetBtn.disabled = true;
        lapBtn.disabled = true;
        lapTimes.innerHTML = '<p class="text-gray-500 text-center py-10" id="noLapsMessage">No lap times recorded yet</p>';
        noLapsMessage.style.display = 'block';
        lapCount = 0;
        
        // Reset button animation
        resetBtn.classList.add('animate-pulse');
        setTimeout(() => resetBtn.classList.remove('animate-pulse'), 1000);
    }
}

// Record lap time
function recordLap() {
    if (isRunning) {
        lapCount++;
        const lapTime = elapsedTime;
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-entry flex justify-between py-2 px-4 border-b border-gray-200 animate-slide-in';
        lapElement.innerHTML = `
            <span class="font-medium">Lap ${lapCount}</span>
            <span class="font-mono">${formatTime(lapTime)}</span>
        `;
        
        if (noLapsMessage) {
            noLapsMessage.style.display = 'none';
        }
        
        lapTimes.insertBefore(lapElement, lapTimes.firstChild);
        
        // Lap button animation
        lapBtn.classList.add('bg-indigo-600');
        setTimeout(() => lapBtn.classList.remove('bg-indigo-600'), 300);
    }
}

// Event listeners
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

// Initialize display
updateDisplay();

// Accessibility: Keyboard controls
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (isRunning) {
            pauseStopwatch();
        } else {
            startStopwatch();
        }
        e.preventDefault();
    } else if (e.code === 'KeyL' && !lapBtn.disabled) {
        recordLap();
    } else if (e.code === 'KeyR' && !resetBtn.disabled) {
        resetStopwatch();
    }
});