const stairsPerLevel = 10;
let currentLevel = 1;
let currentStairs = 0;
let insanity = 0;

const levelDisplay = document.getElementById('level');
const insanityDisplay = document.getElementById('insanity');
const stairCountDisplay = document.getElementById('stair-count');
const stairsTotalDisplay = document.getElementById('stairs-total');
const staircase = document.getElementById('staircase');
const message = document.getElementById('message');
const climbButton = document.getElementById('climb-button');
const phonkButton = document.getElementById('phonk-button');
const resetButton = document.getElementById('reset-button');

let audioContext = null;
let phonkPlaying = false;
let phonkSchedulerId = null;
let noiseBuffer = null;

function createStaircase() {
  staircase.innerHTML = '';

  for (let i = 1; i <= stairsPerLevel; i++) {
    const step = document.createElement('div');
    step.className = 'step';

    const label = document.createElement('span');
    label.className = 'step-label';
    label.textContent = `Step ${i}`;
    step.appendChild(label);

    staircase.appendChild(step);
  }
}

function updateDisplay() {
  levelDisplay.textContent = currentLevel;
  insanityDisplay.textContent = insanity;
  stairCountDisplay.textContent = currentStairs;
  stairsTotalDisplay.textContent = stairsPerLevel;

  const currentStepIndex = Math.min(currentStairs, stairsPerLevel - 1);

  Array.from(staircase.children).forEach((step, index) => {
    step.classList.toggle('completed', index < currentStairs);
    step.innerHTML = '';

    const label = document.createElement('span');
    label.className = 'step-label';
    label.textContent = `Step ${index + 1}`;
    step.appendChild(label);

    if (index === currentStepIndex) {
      const player = document.createElement('div');
      player.className = 'player';
      player.innerHTML = 'Subaru<br><span>🌀</span>';
      step.appendChild(player);
    }
  });
}

function initAudio() {
  if (audioContext) {
    return;
  }

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * 1, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.25;
  }
  noiseBuffer = buffer;
}

function playNoise(time, duration, volume, filterFreq) {
  if (!audioContext) return;

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = audioContext.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = filterFreq;

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  noise.start(time);
  noise.stop(time + duration);
}

function playKick(time) {
  if (!audioContext) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.2);

  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start(time);
  osc.stop(time + 0.25);
}

function playSnare(time) {
  playNoise(time, 0.12, 0.15, 1200);
}

function playHat(time) {
  playNoise(time, 0.08, 0.08, 3000);
}

function playChord(time) {
  if (!audioContext) return;

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.05, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;

  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();

  osc1.type = 'triangle';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(110, time);
  osc2.frequency.setValueAtTime(220, time);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.9);
  osc2.stop(time + 0.9);
}

function schedulePhonk() {
  if (!audioContext || phonkSchedulerId !== null) return;

  let step = 0;
  phonkSchedulerId = window.setInterval(() => {
    const now = audioContext.currentTime;
    const time = now + 0.02;

    if (step % 4 === 0) {
      playKick(time);
      playChord(time);
    }
    if (step % 4 === 2) {
      playSnare(time);
    }
    if (step % 2 === 0) {
      playHat(time);
    }

    step += 1;
    if (step >= 16) {
      step = 0;
    }
  }, 180);
}

function startPhonk() {
  initAudio();
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  phonkPlaying = true;
  phonkButton.textContent = 'Pause Phonk';
  schedulePhonk();
  message.textContent = 'Phonk is playing. Subaru climbs with a beat.';
}

function stopPhonk() {
  phonkPlaying = false;
  phonkButton.textContent = 'Play Phonk';
  message.textContent = 'Phonk paused. Climb in silence or resume the beat.';

  if (phonkSchedulerId !== null) {
    window.clearInterval(phonkSchedulerId);
    phonkSchedulerId = null;
  }
}

function togglePhonk() {
  if (!phonkPlaying) {
    startPhonk();
  } else {
    stopPhonk();
  }
}

function climbStair() {
  if (currentStairs >= stairsPerLevel) {
    return;
  }

  if (!audioContext) {
    initAudio();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  const gained = getInsanityGain();
  currentStairs += 1;
  insanity += gained;
  message.textContent = `You climbed a stair and gained ${gained} insanity. Keep going!`;
  updateDisplay();

  if (currentStairs === stairsPerLevel) {
    message.textContent = `Level ${currentLevel} complete! Prepare for the next level...`;
    climbButton.disabled = true;

    setTimeout(() => {
      currentLevel += 1;
      currentStairs = 0;
      message.textContent = `Welcome to level ${currentLevel}. The stairs are more sussy now!`;
      climbButton.disabled = false;
      updateDisplay();
    }, 1200);
  }
}

function resetGame() {
  currentLevel = 1;
  currentStairs = 0;
  insanity = 0;
  message.textContent = 'The game has been reset. Climb again!';
  climbButton.disabled = false;
  updateDisplay();
}

climbButton.addEventListener('click', () => {
  climbStair();
  if (!phonkPlaying) {
    startPhonk();
  }
});
phonkButton.addEventListener('click', togglePhonk);
resetButton.addEventListener('click', resetGame);

createStaircase();
updateDisplay();
