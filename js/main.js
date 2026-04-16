
// hambac
(function () {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // zavri menu po kliknuti
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
})();


// odpopocet nevim jesatli funkcni co a jak jeste kouknout
(function () {
    const timer = document.getElementById('timer');
    if (!timer) return;

    const targetDate = new Date('2026-06-01T10:00:00');

    function updateCountdown() {
        const diff = targetDate - new Date();
        if (diff <= 0) {
            timer.textContent = '🎉 Výstava právě začala!';
            return;
        }
        const days    = Math.floor(diff / 86400000);
        const hours   = String(Math.floor((diff / 3600000) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        timer.textContent = days + ' dní · ' + hours + ':' + minutes + ':' + seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();




// carousel
(function () {
    const slidesEl = document.querySelector('.carousel .slides');
    if (!slidesEl) return;

    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');
    const dotsEl  = document.querySelector('.carousel-dots');
    const slideCount = slidesEl.children.length;
    let index = 0;

    // vytvoř tečky
    if (dotsEl) {
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', function () { goTo(i); });
            dotsEl.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsEl) return;
        dotsEl.querySelectorAll('.carousel-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === index);
        });
    }

    function goTo(n) {
        index = (n + slideCount) % slideCount;
        slidesEl.style.transform = 'translateX(-' + (index * 100) + '%)';
        updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

    // automatické přepínání každých 5 sekund
    setInterval(function () { goTo(index + 1); }, 5000);
})();


// ===== 5. FAQ ROZBALENÍ =====
(function () {
    document.querySelectorAll('.faq-item').forEach(function (item) {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');
        if (!question || !answer) return;
        question.addEventListener('click', function () {
            item.classList.toggle('open');
            answer.classList.toggle('open');
        });
    });
})();


// stin pri scrollu
(function () {
    const header = document.querySelector('header.sticky-nav');
    if (!header) return;
    window.addEventListener('scroll', function () {
        header.style.boxShadow = window.scrollY > 50
            ? '0 8px 24px rgba(0,0,0,0.25)'
            : '0 2px 8px rgba(0,0,0,0.12)';
    });
})();
