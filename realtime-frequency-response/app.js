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

  analyser.fftSize = 256;
  bufferSize = analyser.frequencyBinCount;
  buffer = new Uint8Array(bufferSize);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawFrequencyResponse();
}

init();

function drawFrequencyResponse() {
  let width = canvas.width;
  let height = canvas.height;

  analyser.getByteFrequencyData(buffer);

  let barWidth = width / bufferSize;
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, width, height);

  for (let i = 0; i < bufferSize; i++) {
    let barHeight = (buffer[i] / 255) * height;
    canvasContext.fillStyle = `red`;

    canvasContext.fillRect(
      i * barWidth,
      height - barHeight,
      barWidth - 2,
      barHeight
    );
  }

  requestAnimationFrame(drawFrequencyResponse);
}
