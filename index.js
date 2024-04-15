const match = document.getElementById('match');
let isLit = false;

match.addEventListener('click', toggleMatch);

window.addEventListener('DOMContentLoaded', () => {
  const threshold = 80;
  const oneLevel = 20;
  const twoLevel = 40;
  const threeLevel = 60;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const volume = array.reduce((a, b) => a + b, 0) / array.length;

        if (volume > threshold && isLit) {
          toggleMatch();
        } else {
          const flame = document.getElementById('flame');
          if (flame) {
            if (volume > oneLevel) {
              flame.style.height = '40px';
            } else if (volume > twoLevel) {
              flame.style.height = '50px';
            } else if (volume > threeLevel) {
              flame.style.height = '70px';
            } else {
              flame.style.height = '90px';
            }
          }
        }
      };
    })
    .catch(err => {
      console.error('Ошибка при доступе к микрофону:', err);
    });
});

function toggleMatch() {
  isLit = !isLit;
  const match = document.getElementById('match');
  if (isLit) {
    match.innerHTML = '<div id="flame"></div>';
  } else {
    match.innerHTML = '';
  }
}
