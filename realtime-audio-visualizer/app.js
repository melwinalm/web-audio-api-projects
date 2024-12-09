let startButton = document.getElementById("startButton");

let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");

let audioContext;
let analyser;
let buffer;
let bufferSize;

async function init() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();

  const source = audioContext.createMediaStreamSource(stream);

  analyser = audioContext.createAnalyser();

  source.connect(analyser);

  analyser.fftSize = 2048;
  bufferSize = analyser.frequencyBinCount;
  buffer = new Uint8Array(bufferSize);

  canvasContext.fillStyle = "black";
  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = "1";

  drawSignal();
}

init();

function drawSignal() {
  let width = canvas.width;
  let height = canvas.height;

  analyser.getByteTimeDomainData(buffer);

  let segmentWidth = canvas.width / bufferSize;
  canvasContext.fillRect(0, 0, width, height);
  canvasContext.beginPath();

  for (let i = 0; i < bufferSize; i++) {
    let x = i * segmentWidth;
    let y = (buffer[i] / 128.0) * (height / 2);
    canvasContext.lineTo(x, y);
  }

  canvasContext.stroke();

  requestAnimationFrame(drawSignal);
}
