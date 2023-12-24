
    const body = document.querySelector('body');
    const chat = document.querySelector('.chat');
    const santa = document.querySelector('.santa');
    const snowFace = document.querySelector('.face');
    const deer = document.querySelector('.deer');
    const gift = document.querySelector('.gift');
    const popup = document.querySelector('.popup');
    const popupResult = document.querySelector('.popup-result');
    const popupCta = document.querySelector('.popup-cta');
    const closeBtn = document.querySelector('.close-btn');
    let slot1, slot2, slot3;

    const talk = () => {
      setTimeout(() => {
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('🔔哦嚯嚯嚯~🔔').go();
      }, 1000);


      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('尹琪小朋友你好呀~').go();
      }, 3000);

      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('我是你们的圣诞老人爷爷~').go();
        santa.textContent = '💁‍♂️';
        snowFace.style.left = '1px';
        snowFace.style.top = '0px';
      }, 6000);

      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('有小朋友为你许下了圣诞愿望~').go();
        // santa.textContent = '🤷‍♂️';
        santa.textContent = '🙋‍♂️';
        snowFace.style.left = '';
        snowFace.style.top = '';
      }, 9000);

      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('希望你能够身体健康，天天开心😀').go();
        santa.textContent = '💁‍♂️';
        snowFace.style.left = '1px';
      }, 12000);


      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('没错，我来帮他实现愿望了🎁').go();
        santa.textContent = '🙋‍♂️';
        snowFace.style.left = '';
      }, 15000);

      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('他还托我给你一个小相册📷，点击图片会有他说的话哦🤫').go();
        const ablum = document.querySelector('.demo-wrapper')
        ablum.style.opacity = 1
      }, 18000);

    }
    const lastImg = document.querySelector('.last-img')
    let io = new IntersectionObserver(observes => {
      console.log(observes)
      observes.forEach(item => {
        if (item.isIntersecting) {
          // nextButton.classList.toggle('button-open')
          setTimeout(() => {
            deer.classList.add('is-active');
          }, 7000);
          io.disconnect()
        }
      })
    })
    io.observe(lastImg)

    const openGift = () => {
      gift.textContent = '';
      popup.classList.add('is-active');
      slot();
    };
    function randomNum(min, max){ var randNum = Math.floor(Math.random()*(max-min+1)) + min; return randNum; }
    const time = randomNum(2000, 4000);
    const slot = () => {
      setTimeout(() => {
        slot1.autoplay.stop();
        setTimeout(() => {
          slot2.autoplay.stop();
        }, 500);
        setTimeout(() => {
          slot3.autoplay.stop();
          setTimeout(() => {
            popupCta.addEventListener('click', replay);
            setText()
          }, 200)
        }, 800);
      }, time);
    }

    let index = 0
    const replay = () => {
      index++
        if (index === 3) {
          popupResult.textContent = '就知道你会再摇'
        } else if (index === 4) {
          popupResult.textContent = '不许耍赖皮'
        } else if (index === 5) {
          popupResult.textContent = '第六次了，还摇'
        } else if (index === 6) {
          popupResult.textContent = '再摇你是猪🐖'
        }
      slot1.autoplay.start();
      setTimeout(() => {
        slot2.autoplay.start();
      }, 500);
      setTimeout(() => {
        slot3.autoplay.start();
      }, 1000);
      setTimeout(() => {
        slot1.autoplay.stop();
        setTimeout(() => {
          slot2.autoplay.stop();
        }, 500);
        setTimeout(() => {
          slot3.autoplay.stop();
          setTimeout(() => {
            setText()
          }, 200);
        }, 800);
      }, time);
    }

    const setText = () => {
      const s1 = document.querySelector('.slot1 .swiper-slide-active').textContent;
      const s2 = document.querySelector('.slot2 .swiper-slide-active').textContent;
      const s3 = document.querySelector('.slot3 .swiper-slide-active').textContent;
      if(s1 === s2 && s2 === s3) {
        popupResult.textContent = '尊嘟假嘟?'
      } else if (s1 === s2 || s1 === s3 || s2 === s3) { 
        popupResult.textContent = '差一点，可惜'
      }else {
        popupResult.textContent = '啥都没有'
      }
    }

    const closeGift = () => {
      popup.classList.remove('is-active');
      lastTalk();
    };

    closeBtn.addEventListener('click', closeGift);

    const lastTalk = () => {
      gift.textContent = '';
      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('🔔哦嚯嚯嚯~， 圣诞爷爷要走啦🔔').go();
        santa.textContent = '🙆‍♂️';
      }, 1000);
      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('尹琪小朋友你的愿望实现了，未来的你会开心快乐，平平安安').go();
        santa.textContent = '🙋‍♂️';
      }, 3000);
      setTimeout(() => {
        chat.textContent = '';
        new TypeIt(chat, {
          speed: 50,
          waitUntilVisible: true,
        }).type('goodbye ~').go();
      }, 6000);
      setTimeout(() => {
        body.classList.add('is-end');
        nextButton.classList.toggle('button-open')
      }, 8000);
    };

    // talk();
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