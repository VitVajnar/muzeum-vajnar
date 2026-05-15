// ===== HAMBURGER MENU =====
// prepina zobrazeni mobilniho menu pri kliknuti na ikonu

var hamburger = document.getElementById('hamburger-btn');
var navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// zavri menu po kliknuti na odkaz uvnitr navigace
navMenu.querySelectorAll('a').forEach(function (odkaz) {
    odkaz.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});
// odpocet
// zobrazuje zbytek casu do zahajeni nove vystavy

var timer      = document.getElementById('timer');
var targetDate = new Date('2026-06-01T10:00:00');

function updateCountdown() {
    var diff = targetDate - new Date();
    if (diff <= 0) {
        timer.textContent = '🎉 Výstava právě začala!';
        return;
    }
    // prevod milisekund na dny, hodiny, minuty, sekundy
    var days = Math.floor(diff / 86400000);
    var hours = String(Math.floor((diff / 3600000) % 24)).padStart(2, '0');
    var minutes = String(Math.floor((diff / 60000)   % 60)).padStart(2, '0');
    var seconds = String(Math.floor((diff / 1000)    % 60)).padStart(2, '0');
    timer.textContent = days + ' dní · ' + hours + ':' + minutes + ':' + seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ===== NACTENI EXPOZIC Z CSV =====
// nacte soubor exhibits.csv a zobrazi karty v mrizce

var grid = document.getElementById('exhibit-grid');

async function nactiExpozice() {
    try {
        var odpoved = await fetch('data/exhibits.csv');
        var text = await odpoved.text();

        // rozdel na radky, odfiltruj prazdne, preskoc hlavicku
        var radky = text.trim().split('\n').filter(function (r) { return r.trim(); });

        grid.innerHTML = '';

        // zacni od indexu 1 - index 0 je hlavicka CSV
        for (var i = 1; i < radky.length; i++) {
            var sloupce = radky[i].split(',');
            var nazev = sloupce[0].trim();
            var popis = sloupce[1].trim();
            var kategorie = sloupce[2].trim();
            var obrazek = sloupce[3].trim();

            var karta = document.createElement('article');
            karta.className = 'card';

            var img = document.createElement('img');
            img.src = obrazek;
            img.alt = nazev;
            img.loading = 'lazy';
            img.onerror = function () { this.style.display = 'none'; };

            var obsah = document.createElement('div');
            obsah.className = 'card-content';
            obsah.innerHTML = '<h3>' + nazev + '</h3>'
                            + '<p>'  + popis + '</p>'
                            + '<span class="category-badge">' + kategorie + '</span>';

            karta.appendChild(img);
            karta.appendChild(obsah);
            grid.appendChild(karta);
        }
    } catch (err) {
        grid.innerHTML = '<p class="grid-loading">⚠️ ' + err.message + '</p>';
    }
}

nactiExpozice();


// ===== CAROUSEL =====
// posuvna galerie se sipkami a teckami

var slidesEl   = document.querySelector('.carousel .slides');
var prevBtn    = document.querySelector('.carousel-button.prev');
var nextBtn    = document.querySelector('.carousel-button.next');
var dotsEl     = document.querySelector('.carousel-dots');
var slideCount = slidesEl.children.length;
var aktualniSlide = 0;

// vytvor navigacni tecky podle poctu slidu
for (let i = 0; i < slideCount; i++) {
    var dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', function () { jdiNa(i); });
    dotsEl.appendChild(dot);
}

function aktualizujTecky() {
    dotsEl.querySelectorAll('.carousel-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === aktualniSlide);
    });
}

function jdiNa(n) {
    aktualniSlide = (n + slideCount) % slideCount;
    slidesEl.style.transform = 'translateX(-' + (aktualniSlide * 100) + '%)';
    aktualizujTecky();
}

prevBtn.addEventListener('click', function () { jdiNa(aktualniSlide - 1); });
nextBtn.addEventListener('click', function () { jdiNa(aktualniSlide + 1); });

// automaticke prepinani kazdych 5 sekund
setInterval(function () { jdiNa(aktualniSlide + 1); }, 5000);


//faq
// otevre nebo zavre odpoved po kliknuti na otazku

document.querySelectorAll('.faq-item').forEach(function (polozka) {
    polozka.querySelector('.faq-question').addEventListener('click', function () {
        polozka.classList.toggle('open');
        polozka.querySelector('.faq-answer').classList.toggle('open');
    });
});


// formular potvrzeni 
// 

var formular = document.getElementById('reservation-form');

formular.addEventListener('submit', function (event) {
    var datum   = formular.querySelector('[name="date"]').value;
    var cas     = formular.querySelector('[name="time"]').value;
    var pocet   = formular.querySelector('[name="people"]').value;
    var typ     = formular.querySelector('[name="type"]').value;
    var jmeno   = formular.querySelector('[name="name"]').value;
    var email   = formular.querySelector('[name="email"]').value;
    var telefon = formular.querySelector('[name="phone"]').value;

    var chyby = [];
    var dnes  = new Date().toISOString().split('T')[0]; // dnesni datum

    if (!datum)              chyby.push('Datum je povinné.');
    else if (datum < dnes)   chyby.push('Vyberte budoucí datum návštěvy.');
    if (!cas)                chyby.push('Čas je povinný.');
    if (!pocet || pocet < 1) chyby.push('Zadejte počet osob.');
    if (!typ)                chyby.push('Vyberte typ vstupenky.');
    if (!jmeno)              chyby.push('Zadejte jméno.');
    if (!email)              chyby.push('Zadejte e-mail.');
    if (!telefon)            chyby.push('Telefon je povinný.');

    // jsou chyby zastav odesilani a zobraz je nad formularem
    if (chyby.length > 0) {
        event.preventDefault();
        var stareChyby = formular.querySelector('.js-chyby');
        if (stareChyby) stareChyby.remove();
        var seznam = document.createElement('ul');
        seznam.className = 'error-list js-chyby';
        chyby.forEach(function (text) {
            var polozka = document.createElement('li');
            polozka.textContent = text;
            seznam.appendChild(polozka);
        });
        formular.insertBefore(seznam, formular.firstChild);
    }
    // bez chyb se formular odesle normalne do PHP
});


//stin navbar
// zesiluje stin headeru kdyz uzivatel scrolluje dolu

var header = document.querySelector('header.sticky-nav');

window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    }
});

// reveal animace pri scrollovani
var revealTargets = document.querySelectorAll('section, .feature-card, .card, .review-card, .faq-item, #reservation-form, .hero-highlights, .carousel-wrapper');
revealTargets.forEach(function (el) {
    el.classList.add('reveal');
});

var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealTargets.forEach(function (el) {
    revealObserver.observe(el);
});
