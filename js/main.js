
// ===== 1. HAMBURGER MENU =====
(function() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu   = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // menu se zavre po kliknuti na odkaz
    // 
    navMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            // zavreni menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
})();


// odpocet
(function() {
    
    const timer = document.getElementById('timer');
    if (!timer) return; 

    // cas vystavy
    const targetDate = new Date('2026-06-01T10:00:00');

    function updateCountdown() {
        const now  = new Date();       
        const diff = targetDate - now;  

        // az zacne
        if (diff <= 0) {
            timer.textContent = '🎉 Výstava právě začala!';
            return; 
        }

       
        const days = Math.floor(diff / 1000 / 60 / 60 / 24);
        //dve cifry
        const hours = String(Math.floor((diff / 1000 / 60 / 60) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

        
        timer.textContent = days + ' dní · ' + hours + ':' + minutes + ':' + seconds;
    }

    updateCountdown(); 
    setInterval(updateCountdown, 1000); //kazda sekunda 
})();


// ===== 3. CAROUSEL =====
(function() {
    const slides = document.querySelector('.carousel .slides');
    if (!slides) return; 

    const prevBtn = document.querySelector('.carousel-button.prev'); // buttony
    const nextBtn = document.querySelector('.carousel-button.next'); // buttony
    let index  = 0;                        
    const slideCount = slides.children.length;  

    function update() {
        slides.style.transform = 'translateX(-' + (index * 100) + '%)';
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            index = (index - 1 + slideCount) % slideCount;
            update();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            index = (index + 1) % slideCount;
            update();
        });
    }
})();


// ===== 4. FAQ =====
// Ukazani odpovedi faq
(function() {
    document.querySelectorAll('.faq-item').forEach(function(item) {
        const question = item.querySelector('.faq-question'); // otazka
        const answer = item.querySelector('.faq-answer');   // odpoved

        if (!question || !answer) return;

        
        question.addEventListener('click', function() {
            item.classList.toggle('open');
            answer.classList.toggle('open');
        });
    });
})();


// ===== 5. KONTROLA DATUMU =====
(function() {
    // najdi formular
    const form = document.getElementById('reservation-form');
    if (!form) return; 

    // Přidej posluchač události 'submit' (odeslání formuláře)
    form.addEventListener('submit', function(event) {
        const dateInput = form.querySelector('input[name="date"]'); // Pole pro datum
        if (!dateInput) return;

        // formatovani datumu
        const today = new Date().toISOString().split('T')[0];

        // datum v minulosti
        if (dateInput.value < today) {
            event.preventDefault();
            alert('Prosím vyberte budoucí datum.');
            dateInput.focus();
        }
    });
})();


// ===== 6. SMOOTH SCROLL =====
// 
(function() {
    // najdi vsechny # odkazy
    document.querySelectorAll('header nav a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 

            //najde prvek presune se na nej
            document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
})();


// ===== shadows menu pri scrollu =====
(function() {
    const header = document.querySelector('header.sticky-nav');
    if (!header) return;

    // kontrola delky scrollu
    window.addEventListener('scroll', function() {
        // kdyz odscrollujes 50 pixelu, tak se stin zmeni na silnejsi, jinak bude slabsi
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';  // stiny pri scrollu
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
})();
