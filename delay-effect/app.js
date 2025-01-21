let startButton = document.getElementById("startButton");
let delayTime = document.getElementById("delayTime");

let audioContext;
let audioBuffer;
let source;
let delay;

startButton.addEventListener("click", async () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const response = await fetch("sample.mp3");
  const arrayBuffer = await response.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  delay = audioContext.createDelay(5);
  delay.delayTime.value = 1;

  source.connect(delay);
  delay.connect(audioContext.destination);
  source.connect(audioContext.destination);

  source.start();
});

delayTime.addEventListener("change", (event) => {
  let time = event.target.value;
  delay.delayTime.setValueAtTime(time, audioContext.currentTime);
});
