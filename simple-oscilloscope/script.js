let powerButton = document.getElementById("powerButton");
let waveformType = document.getElementById("waveformType");
let frequencySelector = document.getElementById("frequencySelector");
let gainSelector = document.getElementById("gainSelector");

let canvas = document.getElementById("canvas");
let waveform = canvas.getContext("2d");

let isPowerredOn;
let audioContext;
let oscillatorNode;
let gainNode;
let analyserNode;
let buffer;
let bufferSize;

function init(){
  isPowerredOn = false;
  audioContext = new AudioContext();
  oscillatorNode;
  
  gainNode = new GainNode(audioContext, {
    gain: 1
  });
  
  analyserNode = new AnalyserNode(audioContext, {
    smoothingTimeConstant: 1,
    fftSize: 2048
  });

  bufferSize = analyserNode.frequencyBinCount;
  
  buffer = new Uint8Array(bufferSize);
  
  // Canvas initial setup
  canvas.width = window.innerWidth;
  canvas.height = "300";
  waveform.fillStyle = "#19B5C2";
  waveform.fillRect(0, 0, canvas.width, canvas.height);
  waveform.strokeStyle = "#A3FFFE";
  waveform.lineWidth = "3";
}

init();

// On Power button cick
powerButton.addEventListener("click", function(){
  isPowerredOn = !isPowerredOn;
  let powerLed = document.getElementById("powerLed");
  if(isPowerredOn){
    powerLed.classList.add("powered-on");
  }
  else{
    powerLed.classList.remove("powered-on");
  }

  if(isPowerredOn){
    oscillatorNode = new OscillatorNode(audioContext, {
			type: waveformType.value,
			frequency: frequencySelector.value
		});
		oscillatorNode.connect(gainNode);
		gainNode.connect(analyserNode);
		analyserNode.connect(audioContext.destination);
		oscillatorNode.start();
		drawWaveform();
  }
  else{
    if(oscillatorNode){
      oscillatorNode.stop();
    }
  }
});

// On Frequency change
frequencySelector.addEventListener("change", function(event){
  let freq = event.target.value;
  document.getElementById("selectedFreq").textContent = freq;

  if(oscillatorNode && isPowerredOn){
    oscillatorNode.frequency.value = freq;
  }

});

// On Oscillator type change
waveformType.addEventListener("change", function(event){
  let type = event.target.value;

  if(oscillatorNode && isPowerredOn){
    oscillatorNode.type = type;
  }
});

// On Gain change
gainSelector.addEventListener("change", function(event){
  let gain = event.target.value;
  document.getElementById("selectedGain").textContent = gain;

  if(oscillatorNode && isPowerredOn){
    gainNode.gain.value = gain;
  }
});

// Draw waveform on the canvas
function drawWaveform () {
  requestAnimationFrame(drawWaveform);

	analyserNode.getByteTimeDomainData(buffer);
	segmentWidth = canvas.width / bufferSize;
	waveform.fillRect(0, 0, canvas.width, canvas.height);
	waveform.beginPath();
	if (isPowerredOn) {
		for (let i = 0; i < bufferSize; i++) {
			let x = i * segmentWidth;
      let y = (buffer[i] / 128.0) * (canvas.height/2);
			waveform.lineTo(x, y);
		}
	}
	waveform.stroke();
};