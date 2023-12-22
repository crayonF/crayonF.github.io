
    const body = document.querySelector('body');
    const chat = document.querySelector('.chat');
    const santa = document.querySelector('.santa');
    const snowFace = document.querySelector('.face');
    const deer = document.querySelector('.deer');
    const gift = document.querySelector('.gift');
    const popup = document.querySelector('.popup');
    const popupResult = document.querySelector('.popup-result');
    const popupCta = document.querySelector('.popup-cta');
    let slot1, slot2, slot3;

    const talk = () => {
      setTimeout(() => {
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('11').go();
      }, 2000);


      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('22').go();
      }, 4000);

      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('🔔33🔔').go();
      }, 6000);

      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('44?').go();
        santa.textContent = '🤷‍♂️';
      }, 8000);

      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('55').go();
        // santa.textContent = '💁‍♂️';
        // snowFace.style.left = '10px';
      }, 10000);


      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('66').go();
        santa.textContent = '🙋‍♂️';
        snowFace.style.left = '';
      }, 12000);

      setTimeout(() => {
        deer.classList.add('is-active');
      }, 14000);
    }

    const openGift = () => {
      gift.textContent = '';
      popup.classList.add('is-active');
      slot();
    };

    const slot = () => {
      function randomNum(min, max){ var randNum = Math.floor(Math.random()*(max-min+1)) + min; return randNum; }
      const time = randomNum(2000, 4000);
      
      setTimeout(() => {
        slot1.autoplay.stop();
        setTimeout(() => {
          slot2.autoplay.stop();
        }, 500);
        setTimeout(() => {
          slot3.autoplay.stop();
          setTimeout(() => {
            popupCta.addEventListener('click', closeGift);
            const s1 = document.querySelector('.slot1 .swiper-slide-active').textContent;
            const s2 = document.querySelector('.slot2 .swiper-slide-active').textContent;
            const s3 = document.querySelector('.slot3 .swiper-slide-active').textContent;
            if(s1 === s2 && s2 === s3) {
              popupResult.textContent = '77?'
            } else if (s1 === s2 || s1 === s3 || s2 === s3) { 
              popupResult.textContent = '88.'
            }else {
              popupResult.textContent = '999'
            }
          }, 1000)
        }, 800);
      }, time);
    }

    const closeGift = () => {
      popup.classList.remove('is-active');
      lastTalk();
    };

    const lastTalk = () => {
      gift.textContent = '';
      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('aaaa').go();
        santa.textContent = '🙆‍♂️';
      }, 1000);
      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('bbbb!').go();
        santa.textContent = '🙋‍♂️';
      }, 3000);
      
      setTimeout(() => {
        body.classList.add('is-end');
      }, 5000);
    };

    talk();
    gift.addEventListener('click', openGift);

    slot1 = new Swiper(".slot1", {
      direction: "vertical",
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
    });
    setTimeout(() => {
      slot2 = new Swiper(".slot2", {
        direction: "vertical",
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
      });
    }, 500);
    setTimeout(() => {
      slot3 = new Swiper(".slot3", {
        direction: "vertical",
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
      });
    }, 1000);