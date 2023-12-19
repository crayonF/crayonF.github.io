const elemCard = document.querySelector('div.card');
const page1 = document.querySelector('div.page1');
const page2 = document.querySelector('div.page2');
const elemClickIcon = document.querySelector('span.click-icon');

elemCard.addEventListener('click', function() {
  elemCard.classList.toggle('is-opened');
  elemClickIcon.classList.toggle('is-hidden');
});

setTimeout(() => {
  page1.classList.toggle('page1-hidden')
}, 3000)


setTimeout(() => {
  page2.classList.toggle('page2-hidden')
}, 6000)