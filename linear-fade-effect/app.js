let loadButton = document.getElementById("loadButton");
let linearFadeButton = document.getElementById("linearFadeButton");

let audioContext;

let audioBuffer1, audioBuffer2;
let gain1Node, gain2Node;
let source1, source2;

const FADE_DURATION = 4;

loadButton.addEventListener("click", async () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  audioBuffer1 = await loadAudio("source1.mp3");
  audioBuffer2 = await loadAudio("source2.mp3");

  alert("Audio files loaded successfully");
});

async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  return audioBuffer;
}

linearFadeButton.addEventListener("click", () => {
  if (!audioBuffer1 || !audioBuffer2) {
    alert("Please load audio");
    return;
  }

  gainNode1 = audioContext.createGain();
  gainNode1.gain.value = 1;

  gainNode2 = audioContext.createGain();
  gainNode2.gain.value = 0;

  source1 = audioContext.createBufferSource();
  source1.buffer = audioBuffer1;
  source1.connect(gainNode1).connect(audioContext.destination);
  source1.start();

  source2 = audioContext.createBufferSource();
  source2.buffer = audioBuffer2;
  source2.connect(gainNode2).connect(audioContext.destination);

  const currentTime = audioContext.currentTime;
  const source1Duration = audioBuffer1.duration;

  const fadeStartTime = currentTime + source1Duration - FADE_DURATION;
  const fadeEndTime = fadeStartTime + FADE_DURATION;

  gainNode1.gain.setValueAtTime(1, fadeStartTime);
  gainNode1.gain.linearRampToValueAtTime(0, fadeEndTime);

  gainNode2.gain.setValueAtTime(0, fadeStartTime);
  gainNode2.gain.linearRampToValueAtTime(1, fadeEndTime);

  source2.start(fadeStartTime);
});
