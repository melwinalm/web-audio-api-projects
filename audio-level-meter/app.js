let dBValue = document.getElementById("dBValue");

let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");

let audioContext;
let analyser;
let buffer;
let bufferSize;

async function init() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const source = audioContext.createMediaStreamSource(stream);

  analyser = audioContext.createAnalyser();

  source.connect(analyser);

  analyser.fftSize = 2048;
  bufferSize = analyser.frequencyBinCount;
  buffer = new Uint8Array(bufferSize);

  draw();
}

init();

function draw() {
  let width = canvas.width;
  let height = canvas.height;
  canvasContext.clearRect(0, 0, width, height);

  analyser.getByteFrequencyData(buffer);

  const rootMeanSquare = Math.sqrt(
    buffer.reduce((sum, value) => sum + Math.pow(value, 2), 0) / bufferSize
  );

  const decibels = 20 * Math.log10(rootMeanSquare);
  const actualDecibels = Math.max(0, decibels);

  dBValue.textContent = actualDecibels.toFixed(1) + " dB";

  let x = 0;
  let barHeight = height * (actualDecibels / 100);
  let y = height - barHeight;

  canvasContext.fillStyle = "grey";
  canvasContext.fillRect(x, 0, width, height);

  const gradient = canvasContext.createLinearGradient(0, height, 0, 0);
  gradient.addColorStop(0, "green");
  gradient.addColorStop(0.3, "yellow");
  gradient.addColorStop(0.6, "orange");
  gradient.addColorStop(0.8, "red");

  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(x, y, width, barHeight);

  requestAnimationFrame(draw);
}
