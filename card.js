const elemCard = document.querySelector('div.card');
const elemClickIcon = document.querySelector('span.click-icon');

elemCard.addEventListener('click', function() {
  elemCard.classList.toggle('is-opened');
  elemClickIcon.classList.toggle('is-hidden');
});