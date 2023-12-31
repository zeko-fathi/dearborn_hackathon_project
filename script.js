let recordedVideo = document.getElementById('recordedVideo');
let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let mediaRecorder;
let recordedChunks = [];
let mediaStream = null;
let youtubeVideo = document.getElementById('youtubeVideo1');
let player;
let timerInterval;
let startTime;
let isRunning = false;
let bestTimeString = "00:00:00";
let i = 0;

let imageContainer1 = document.getElementById("selectedValue1");
let imageContainer2 = document.getElementById("selectedValue2");

// Create an img element
let img = document.createElement("img");

function show() {
  let x = window.location.search;
  if (/tree/gi.test(x)) {
    // Set the src attribute of the img element to the image file path
    img.src = "tree.jpg";
    img.alt = "tree photo";
  }
  else if (/cobra/gi.test(x)) {
    // Set the src attribute of the img element to the image file path
    img.src = "cobra.jpg";
    img.alt = "cobra photo";
  }
  else if (/warrior/gi.test(x)) {
    // Set the src attribute of the img element to the image file path
    img.src = "warrior.jpg";
    img.alt = "warrior photo";
  }
  else if (/shoulderstand/gi.test(x)) {
    // Set the src attribute of the img element to the image file path
    img.src = "shoulderstand.jpg";
    img.alt = "shoulderstand photo";
  }
  img.style = "height: 500px";
  // Append the img element to the div
  imageContainer1.appendChild(img);
  imageContainer2.appendChild(img);
};

show();


//if user click start it will record the video
startButton.addEventListener('click', function () {
  startButton.disabled = true;
  stopButton.disabled = false;

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(function (stream) {
    stream.getAudioTracks().forEach(track => {
      track.enabled = false;
    });

    cameraStream.srcObject = stream;
    mediaStream = stream;
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function () {
      let blob = new Blob(recordedChunks, { type: 'video/webm' });
      let videoURL = URL.createObjectURL(blob);
      recordedVideo.src = videoURL;
    };

    mediaRecorder.start();
    document.getElementById("video_recording").innerHTML = "Video Recording \(Video is being recorded\).";
  })
  .catch(function (error) {
    console.error('Error accessing the camera and microphone:', error);
  });
});

//if the user click stop, the recording will stop and show the video that the user displayed
stopButton.addEventListener('click', function () {
  startButton.disabled = false;
  stopButton.disabled = true;
  mediaRecorder.stop();
  mediaStream.getTracks().forEach(track => track.stop());
  mediaStream = null;
  document.getElementById("video_recording").innerHTML = "Video Recording \(Video recording ends\).";
  document.getElementById("status").innerHTML = "Recording completed.";
  if (bestTimeString < timeString) {
    bestTimeString = timeString;
    document.getElementById("show_besy_time").innerText = "Best: " + bestTimeString;
  }
});

function updateClock() {
  let currentTime = new Date();
  let elapsedTime = new Date(currentTime - startTime);
  let hours = elapsedTime.getUTCHours();
  let minutes = elapsedTime.getUTCMinutes();
  let seconds = elapsedTime.getUTCSeconds();

  let timeString = padNumber(hours) + ":" + padNumber(minutes) + ":" + padNumber(seconds);
  document.getElementById("show_use_time").innerText = "Pose Time: " + timeString;
}

function startTimer() {
  setTimeout(() => { document.getElementById("video_recording").innerHTML = "Video Recording \(Video is being recorded\)."; }, 2000);
  if (!isRunning) {
    isRunning = true;
    startTime = new Date();
    timerInterval = setInterval(updateClock, 1000);
  }
}

function stopTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
  }
}

function padNumber(number) {
  return (number < 10) ? "0" + number : number;
}


startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
