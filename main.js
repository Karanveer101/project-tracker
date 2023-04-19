window.onload = function () {
  const formWrapper = document.getElementById('formWrapper');
  const countdownWrapper = document.getElementById('countdownWrapper');
  const submitBtn = document.getElementById('submit');
  const courseName = document.getElementById('courseName');
  const projectName = document.getElementById('projectName');
  const timeLeft = document.getElementById('timeLeft');
  const startBtn = document.getElementById('startBtn');
  const hours = document.getElementById('hours');
  const minutes = document.getElementById('minutes');
  const timeUp = document.getElementById('timeUp');
  const progressBar = document.getElementById('progressBar');
  const endBtn = document.getElementById('endBtn');
  const errorMessage = document.getElementById('errorMessage');
  const projectNameInput = document.getElementById('name');
  const pauseBtn = document.getElementById('pauseBtn');
  const estimateWrapper = document.getElementById('estimateWrapper');

  let seconds = parseInt('00');
  let countdownInterval;

  //function for the submit form

  function submit(e) {
    e.preventDefault();

    //form validation
    if (!projectNameInput.value && !minutes.value && !hours.value) {
      errorMessage.innerHTML =
        '* Please provide a project name and estimated time';
      return;
    } else if (!projectNameInput.value) {
      errorMessage.innerHTML = '* Please provide a project name';
      return;
    } else if (
      (!hours.value && !minutes.value) ||
      (hours.value == 0 && minutes.value == 0)
    ) {
      errorMessage.innerHTML =
        '* Please provide a valid estimated time. Ensure both values are not 0, negative or left blank.';
      return;
    } else if (parseInt(hours.value) < 0 || parseInt(minutes.value) < 0) {
      errorMessage.innerHTML = '* Time cannot be less than 0';
      console.log(errorMessage);
      return;
    }

    //hide form after submit and show countdown
    const selectedCourse = document.getElementById('course').value;
    formWrapper.style.display = 'none';
    countdownWrapper.style.display = 'flex';
    courseName.innerHTML = `Course: ${selectedCourse}`;
    projectName.innerHTML = `Project: ${projectNameInput.value}`;
    console.log(typeof hours.value);

    //display the time submitted by the user
    if (hours.value == 0) {
      timeLeft.innerHTML = `Time left: ${
        minutes.value < 10 ? `0${minutes.value}` : minutes.value
      }m : ${seconds}s`;
    } else {
      timeLeft.innerHTML = `Time left: ${
        hours.value < 10 ? `0${hours.value}` : hours.value
      }h : ${
        minutes.value < 10 ? `0${minutes.value}` : minutes.value
      }m : ${seconds}s`;
    }
  }

  //function that handles countdown
  let endTime;
  let distance;
  let remainingTime;
  let duration;

  function updateCountdown() {
    let hour = hours.value;
    let minute = minutes.value;
    duration = hour * 3600 + minute * 60 + seconds;
    if (!remainingTime) {
      endTime =
        new Date().getTime() +
        hour * 3600 * 1000 +
        minute * 60 * 1000 +
        seconds * 1000;
    } else {
      endTime = new Date().getTime() + remainingTime;
    }

    //Countdown timer method
    countdownInterval = setInterval(function () {
      const now = new Date().getTime();

      distance = endTime - now;
      remainingTime = distance;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const hours = Math.floor(distance / (1000 * 60 * 60));
      console.log(seconds);
      //display countdown timer
      if (hours == 0 && minutes == 0) {
        timeLeft.innerHTML = `Time remaining: ${
          seconds < 10 ? `0${seconds}` : seconds
        }s`;
      } else if (hours == 0) {
        timeLeft.innerHTML = `Time remaining: ${
          minutes < 10 ? `0${minutes}` : minutes
        }m : ${seconds < 10 ? `0${seconds}` : seconds}s`;
      } else if (minutes < 0) {
        timeLeft.innerHTML = `Overtime: ${minutes}m : ${seconds}s`;
      } else if (seconds < 0) {
        timeLeft.innerHTML = `Overtime: ${seconds}s`;
      } else {
        timeLeft.innerHTML = `Time remaining: ${
          hours < 10 ? `0${hours}` : hours
        }h : ${minutes < 10 ? `0${minutes}` : minutes}m : ${
          seconds < 10 ? `0${seconds}` : seconds
        }s`;
      }

      //when timer reaches 0
      if (distance < 1000) {
        console.log(distance);

        timeUp.innerHTML = 'Time is up!!';
      }
    }, 1000);

    //update progress bar
    //animation changes progress bar from green to red
    progressBar.style.animation = `progressBar ${duration}s linear`;
  }

  //pause button function

  function pause() {
    clearInterval(countdownInterval);
    progressBar.style.animationPlayState = 'paused';
  }

  //end timer function

  function endTimer() {
    const estimatedTime = document.getElementById('estimatedTime');
    const actualTime = document.getElementById('actualTime');
    const difference = document.getElementById('difference');
    clearInterval(countdownInterval);
    progressBar.style.animationPlayState = 'paused';
    estimateWrapper.style.display = 'block';

    //hour, minute, second text
    let hourText;
    let minuteText;
    let secondText;
    if (hours.value == 1) {
      hourText = 'hour';
    } else {
      hourText = 'hours';
    }

    if (minutes.value == 1) {
      minuteText = 'minute';
    } else {
      minuteText = 'minutes';
    }

    if (seconds == 1) {
      secondText = 'second';
    } else {
      secondText = 'seconds';
    }

    //get estimated time
    if (hours.value == 0) {
      estimatedTime.innerHTML = `Your estimated time to complete project ${projectNameInput.value} was ${minutes.value} ${minuteText}.`;
    } else if (minutes.value == 0) {
      estimatedTime.innerHTML = `Your estimated time to complete project ${projectNameInput.value} was ${hours.value} ${hourText}.`;
    } else {
      estimatedTime.innerHTML = `Your estimated time to complete project ${projectNameInput.value} was ${hours.value} ${hourText} and ${minutes.value} ${minuteText}.`;
    }

    //get actual time it took to complete the project
    //calculate actual time taken in seconds
    const totalSeconds = duration - Math.floor(distance / 1000);
    console.log(totalSeconds, duration, distance);

    const actualMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const actualHours = Math.floor(totalSeconds / 3600);

    //logic to display actual time
    if (totalSeconds < 60) {
      actualTime.innerHTML = `The actual time taken to complete project ${
        projectNameInput.value
      } is ${
        totalSeconds == 0 ? `${totalSeconds} second` : `${totalSeconds} seconds`
      }.`;
    } else if (totalSeconds < 3600) {
      actualTime.innerHTML = `The actual time taken to complete project ${
        projectNameInput.value
      } is ${
        actualMinutes == 1
          ? `${actualMinutes} minute and ${remainingSeconds} seconds`
          : `${actualMinutes} minutes and ${remainingSeconds} seconds`
      }.`;
    } else {
      actualTime.innerHTML = `The actual time taken to complete project ${
        projectNameInput.value
      } is ${
        actualHours == 1
          ? `${actualHours} hour`
          : `${actualHours} hours and ${actualMinutes} minutes.`
      }.`;
    }

    //get the difference
    const distanceTotalSeconds = Math.floor(distance / 1000);
    const distanceMinutes = Math.floor(distanceTotalSeconds / 60);
    const distanceSeconds = distanceTotalSeconds % 60;
    const distanceHours = Math.floor(distanceTotalSeconds / 3600);

    //logic to display time remaining or time overspent
    if (distanceTotalSeconds < 60 && distanceTotalSeconds > 0) {
      difference.innerHTML = `You had ${distanceSeconds} seconds remaining.`;
    } else if (distanceTotalSeconds > 3600) {
      difference.innerHTML = `you had ${
        distanceHours == 1 ? `${distanceHours} hour` : `${distanceHours} hours`
      }, ${distanceMinutes % 60} minutes, and ${distanceSeconds} remaining.`;
    } else if (distanceTotalSeconds > 60) {
      difference.innerHTML = `you had ${
        distanceMinutes == 1
          ? `${distanceMinutes} minute`
          : `${distanceMinutes} minutes`
      } and ${distanceSeconds} seconds remaining.`;
    } else if (distanceTotalSeconds < 0 && distanceTotalSeconds > -60) {
      difference.innerHTML = `You overspent ${Math.abs(
        distanceSeconds
      )} seconds on this project.`;
    } else if (distanceTotalSeconds < -3600) {
      difference.innerHTML = `you overspent ${
        distanceHours == -1
          ? `${Math.abs(distanceHours)} hour`
          : `${Math.abs(distanceHours)} hours`
      }, ${Math.abs(distanceMinutes % 60)} minutes, and ${Math.abs(
        distanceSeconds
      )} on this project.`;
    } else if (distanceTotalSeconds < -60) {
      difference.innerHTML = `you overspent ${
        distanceMinutes == -1
          ? `${Math.abs(distanceMinutes)} minute`
          : `${Math.abs(distanceMinutes)} minutes`
      } and ${Math.abs(distanceSeconds)} seconds on this project.`;
    }
  }

  //event listeners
  submitBtn.addEventListener('click', submit);
  startBtn.addEventListener('click', updateCountdown);
  endBtn.addEventListener('click', endTimer);
  pauseBtn.addEventListener('click', pause);
};
