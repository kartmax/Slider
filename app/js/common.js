// import Swiper from './node_modules/swiper';

document.addEventListener('DOMContentLoaded', () => {

    // Modal
    MicroModal.init({
        openTrigger: 'data-micromodal-open',
        closeTrigger: 'data-micromodal-close',
        disableFocus: true,
        disabeScroll: true,
        awaitOpenAnimation: true,
        awaitCloseAnimation: true
    });

    // sliderIMg
    const swiperImg = new Swiper('.slider-img', {
        loop: false,
        // speed: 2400,
        parallax: true,
        pagination: {
            el: '.slider-pagination-count .total',
            type: 'custom',
            renderCustom: (swiper, current, total) => {
                let totalres = total >= 10 ? total : `0${total}`
                return totalres
            }
        }
    });
    
    // sliderText
    const swiperText = new Swiper('.slider-text', {
        loop: false,
        speed: 800,
        mousewill: {
            invert: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        breakpoints: {
            768: {
                speed: 2400
            }
        }
    });

    // synchronization sliderText with sliderImg
    swiperText.controller.control = swiperImg;

    // animation settings icon
    let gear = document.querySelector('.slider-gear');

    swiperText.on('slideNextTransitionStart', () => {
        gsap.to(gear, 2.8, {
            rotation: '+=40',
            ease: Power2.easeOut
        })
    })

    swiperText.on('slidePrevTransitionStart', () => {
        gsap.to(gear, 2.8, {
            rotation: '-=40',
            ease: Power2.easeOut
        })
    });


    // render and animation current
    let curnum = document.querySelector('.slider-pagination-count .current');
    let pagecur = document.querySelector('.slider-pagination-current');
    let numcur = document.querySelector('.slider-pagination-current__num')

    swiperText.on('slideChange', () => {
        let index = swiperText.realIndex + 1;
        index = index >= 10 ? index : `0${index}`

        gsap.to(curnum, 0.2, {
            force3D: true,
            y: -10,
            opacity: 0,
            ease: Power2.easeOut,
            onComplete: () => {
                gsap.to(curnum, .1, {
                    force3D: true,
                    y: 10
                }),
                curnum.innerHTML = index
            }
        });
        gsap.to(curnum, 0.2, {
            force3D: true,
            y: 0,
            opacity: 1,
            ease: Power2.easeOut,
            delay: .3
        });

        gsap.to(numcur, 0.5, {
            opacity: 0,
            ease: Power2.easeOut,
            onComplete: () => {
                gsap.to(numcur, 0.9, {
                    opacity: 1,
                    ease: Power2.easeOut,
                    delay: 0.1
                })
                numcur.innerHTML = index
            }
        })
    })

    // Cursor
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false ) {
        const body = document.querySelector('body');
        const cursor = document.getElementById('cursor');
        const links = document.getElementsByTagName('a');
    
        let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
    
        function mouseCoords(e) {
            mouseX = e.pageX;
            mouseY = e.pageY
        }
    
        gsap.to({}, .1, {
            repeat: -1,
            onRepeat: () => {
                posX += (mouseX - posX) / 1
                posY += (mouseY - posY) / 1
                gsap.set(cursor, {
                    css: {
                        left: posX,
                        top: posY
                    }
                })
            }
        })
    
        for(let i = 0; i < links.length; i++) {
            links[i].addEventListener('mouseover', () => {
                cursor.classList.add('active')
            });
            links[i].addEventListener('mouseout', () => {
                cursor.classList.remove('active')
            });
        }
    
        body.addEventListener('mousemove', (e) => {
            mouseCoords(e)
            cursor.classList.remove('hidden')
        })
    
        body.addEventListener('mouseout', () => {
            cursor.classList.add('hidden')
        })
    } else {
        cursor.style.display = 'none'
    }


})
