let canvasOriginal = document.getElementById("canvasOriginal");
let contextOriginal = canvasOriginal.getContext("2d");

let canvasFiltered = document.getElementById("canvasFiltered");
let contextFiltered = canvasFiltered.getContext("2d");

let cutoffFrequency = document.getElementById("cutoffFrequency");

let audioContext;
let analyserOriginal;
let analyserFiltered;
let filter;

let bufferSize;
let bufferOriginal;
let bufferFiltered;

async function init() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const source = audioContext.createMediaStreamSource(stream);

  analyserOriginal = audioContext.createAnalyser();
  analyserFiltered = audioContext.createAnalyser();

  source.connect(analyserOriginal);

  filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;

  source.connect(filter);
  filter.connect(analyserFiltered);
  filter.connect(audioContext.destination);

  analyserOriginal.fftSize = 2048;
  analyserFiltered.fftSize = 2048;

  bufferSize = analyserOriginal.frequencyBinCount;
  bufferOriginal = new Uint8Array(bufferSize);
  bufferFiltered = new Uint8Array(bufferSize);

  canvasOriginal.width = window.innerWidth;
  canvasOriginal.height = 200;
  canvasFiltered.width = window.innerWidth;
  canvasFiltered.height = 200;

  draw(canvasOriginal, contextOriginal, analyserOriginal, bufferOriginal);
  draw(canvasFiltered, contextFiltered, analyserFiltered, bufferFiltered);
}

init();

cutoffFrequency.addEventListener("change", (event) => {
  filter.frequency.value = event.target.value;
});

function draw(canvas, canvasContext, analyser, buffer) {
  let width = canvas.width;
  let height = canvas.height;
  let bufferSize = buffer.length;

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

  requestAnimationFrame(function () {
    draw(canvas, canvasContext, analyser, buffer);
  });
}
