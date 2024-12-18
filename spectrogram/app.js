let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");

let audioContext;
let analyser;
let bufferSize;
let buffer;

async function init() {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  let source = audioContext.createMediaStreamSource(stream);

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  bufferSize = analyser.frequencyBinCount;
  buffer = new Uint8Array(bufferSize);

  source.connect(analyser);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasContext.fillStyle = getColor(0);
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  draw();
}

init();

function draw() {
  let width = canvas.width;
  let height = canvas.height;

  analyser.getByteFrequencyData(buffer);

  canvasContext.drawImage(canvas, -5, 0, width, height);

  for (let i = 0; i < bufferSize; i++) {
    canvasContext.fillStyle = getColor(buffer[i]);

    let x = width - 5;
    let barHeight = height / bufferSize;
    let y = (i / bufferSize) * height;

    canvasContext.fillRect(x, height - y, 5, barHeight);
  }

  requestAnimationFrame(draw);
}

function getColor(value) {
  const hue = Math.round(240 - (value * 240) / 255);
  return `hsl(${hue}, 100%, 50%)`;
}
