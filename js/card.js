const elemCard = document.querySelector('div.card');
const page1 = document.querySelector('div.page1');
const page3 = document.querySelector('div.page3');
const elemClickIcon = document.querySelector('span.click-icon');
const elemBodymovin = document.getElementById('bodymovin');
const nextButton = document.querySelector('.christmas-button')
var audio = document.getElementById('myAudio')
var playing = false
var currentPage = 1

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
// page1.classList.toggle('page1-hidden')
// page3.classList.toggle('page2-hidden')
function btnClick() {
  if (currentPage === 1) {
    page1.classList.toggle('page1-hidden')
    nextButton.classList.toggle('button-open')
    // nextButton.removeEventListener('click', btnClick, false)
    currentPage = 2
    talk()
  } else {
    inPage2()
    page3.classList.toggle('page2-hidden')
    nextButton.classList.toggle('button-open')
  }
}

const dateNum = document.querySelector('#date-num')
const dateNum1 = document.querySelector('#date-num1')
const dateNum2 = document.querySelector('#date-num2')
dateNum.textContent = Math.floor((new Date().getTime() - new Date('2023-8-14').getTime()) / 24 / 60 / 60 / 1000) + '天'
dateNum1.textContent = (new Date() - new Date('2023-8-14')) / 24 / 60 / 60 / 1000 + '天'
dateNum2.textContent = new Date('2023-8-14') + '天'


function inPage2() {
  MorphSVGPlugin.convertToPath("circle, rect, polygon, ellipse");
TweenMax.set("svg", { visibility: "visible" });
var snowBody = $("#bottom"),
buttons = $("#bottom_buttons path"),
arms = $("#right_arm, #left_arm "),
face = $("#face path"),
nose = $("#nose"),
ears = $("#ears"),
moon = $("#moon"),
stars = $("#stars path"),
text = $("#test path"),
sceneryFront = $("#GroundFront"),
sceneryBack = $("#GroundBack");
TweenMax.set(sceneryBack, { visibility: "hidden" });
TweenMax.set(sceneryFront, { visibility: "hidden" });
var masterTl = new TimelineMax({ paused: true });
var tl = new TimelineMax({ paused: true });
tl
  .fromTo(
    sceneryFront,
    1.5,
    { y: 500 },
    { y: 0, visibility: "visible" },
    "scenestart"
  )
  .fromTo(
    sceneryBack,
    1,
    { y: 500 },
    { y: 0, visibility: "visible" },
    "scenestart+=0.5"
  )
  //Trees
  .staggerFromTo(
    "#TreeGroup1 path",
    0.2,
    { y: 200, opacity: 0 },
    { y: 0, opacity: 1, ease: Back.easeOut.config(1) },
    0.15
  )
  .staggerFromTo(
    "#TreeGroup2 path",
    0.2,
    { y: 200, opacity: 0 },
    { y: 0, opacity: 1, ease: Back.easeOut.config(1) },
    0.15
  )
  // moon and the stars
  tl.fromTo(
    moon,
    3,
    { opacity: 0, y: -750 },
    { opacity: 1, y: 0, ease: Back.easeInOut },
    "scenestart-=1"
  )
  .staggerFromTo(
    stars,
    2.5,
    { opacity: 0, y: 600 },
    { opacity: 1, y: 0, ease: Back.easeInOut },
    0,
    "scenestart+=0.35"
  );
// Snowman
var snowManDropTl = new TimelineMax({ paused: true });
snowManDropTl.fromTo(
snowBody,
0.6,
{ opacity: 0, y: -500 },
{ opacity: 1, y: 0, ease: Power4.easeIn },
"drop"
)
.staggerFromTo(
  buttons,
  0.6,
  { opacity: 0, y: -500 },
  { opacity: 1, y: 0, ease: Power4.easeIn },
  0.1,
  "drop+=0.3"
)
.staggerFromTo(
  arms,
  0.6,
  { opacity: 0, y: -500 },
  { opacity: 1, y: 0, ease: Power4.easeIn },
  0.3,
  "drop+=0.4"
)
.fromTo(
  scarf,
  0.6,
  { opacity: 0, y: -500 },
  { opacity: 1, y: 0, ease: Power4.easeIn },
  "drop+=0.4"
)
.staggerFromTo(
  face,
  0.6,
  { opacity: 0, y: -500 },
  { opacity: 1, y: 0, ease: Power4.easeIn },
  0.1,
  "drop+=0.6"
)
.fromTo(
  nose,
  0.6,
  { opacity: 0, y: -500 },
  { opacity: 1, y: 0, ease: Power4.easeIn },
  "drop+=1"
)
.fromTo(
  ears,
  0.6,
  { opacity: 0, y: -500 },
  { opacity: 1, y: 0, ease: Power4.easeIn },
  "drop+=1.2"
);
textTl = new TimelineMax({ paused: false });
textTl
.fromTo(
  "#LetterM",
  0.75,
  { drawSVG: "0%" },
  { drawSVG: "100%", opacity: 1, ease: Linear.easeInOut },
  "DrawText"
)
.staggerFromTo(
  "#err path",
  0.25,
  { drawSVG: "0%" },
  { drawSVG: "100%", opacity: 1, ease: Linear.easeInOut },
  0.25,
  "DrawText+=0.70"
)
.staggerFromTo(
  "#ych path",
  0.5,
  { drawSVG: "0%" },
  { drawSVG: "100%", opacity: 1, ease: Linear.easeInOut },
  0.25
)
.fromTo(
  "#LetterR",
  0.25,
  { drawSVG: "0%" },
  { drawSVG: "100%", opacity: 1, ease: Linear.easeInOut }
)
.staggerFromTo(
  "#I path",
  0.1,
  { drawSVG: "0%" },
  { drawSVG: "100%", opacity: 1, ease: Linear.easeInOut },
  0.1
)
.staggerFromTo(
  "#stmas path",
  0.5,
  { drawSVG: "0%" },
  { drawSVG: "100%", opacity: 1, ease: Linear.easeInOut },
  0.25
)

masterTl
.add(tl.play(), "animationStart")
.add(snowManDropTl.play(), "animationStart+=2.4")
.add(textTl.timeScale(1), "startSnow+=0.5");
masterTl.play();
masterTl.timeScale(1);

}