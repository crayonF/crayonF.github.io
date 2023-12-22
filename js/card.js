const elemCard = document.querySelector('div.card');
const page1 = document.querySelector('div.page1');
const page3 = document.querySelector('div.page3');
const elemClickIcon = document.querySelector('span.click-icon');
const elemBodymovin = document.getElementById('bodymovin');
const nextButton = document.querySelector('.christmas-button')
var audio = document.getElementById('myAudio')
var playing = false

elemCard.addEventListener('click', function() {
  elemCard.classList.toggle('is-opened');
  elemClickIcon.classList.toggle('is-hidden');
  nextButton.classList.toggle('button-open')
  nextButton.addEventListener('click', btnClick, false)
  if (typeof katongAnim === 'undefined') {
    window.katongAnim = bodymovin.loadAnimation(params);
    elemBodymovin.classList.toggle('bodymovin-open');
    audio.play()
    playing = true
    elemBodymovin.addEventListener('click', () => {
      katongAnim.togglePause()
      if (playing) {
        audio.pause()
        playing = false
      } else {
        audio.play()
        playing = true
      }
    })
  }
});

function btnClick(event) {
  page1.classList.toggle('page1-hidden')
  nextButton.classList.toggle('button-open')
  nextButton.removeEventListener('click', btnClick, false)
}


// setTimeout(() => {
//   page1.classList.toggle('page1-hidden')
// }, 3000)


// setTimeout(() => {
//   page2.classList.toggle('page2-hidden')
// }, 6000)