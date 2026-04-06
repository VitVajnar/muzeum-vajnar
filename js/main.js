/**
 * MUSEUM WEBSITE - MAIN JAVASCRIPT
 * Funkционality: Countdown, Carousel, FAQ, Form Validation
 * Author: Závěrečná práce PRO
 */

// ===== 0. HAMBURGER MENU - Mobilní navigace =====
(function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];
    
    // Otevřít/zavřít menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Zavřít menu po kliknutí na odkaz
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Zavřít menu po kliknutí mimo
    document.addEventListener('click', (e) => {
        if (!e.target.closest('header')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Zavřít menu při scrollování
    window.addEventListener('scroll', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
    });
})();

// ===== 1. COUNTDOWN TIMER - Do zahájení nové výstavy =====
(function() {
    const timerEl = document.getElementById('timer');
    
    // Target date: 1. června 2026 v 10:00
    const countdownTarget = new Date('2026-06-01T10:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownTarget - now;
        
        // Pokud je deadline prošlý
        if (distance < 0) {
            timerEl.innerHTML = '<span style="font-size: 32px;">🎉 Výstava právě začala!</span>';
            return;
        }
        
        // Výpočet dní, hodin, minut a sekund
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Formátování výstupu
        timerEl.textContent = `${days} dní · ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    // Initial update
    updateCountdown();
    
    // Update každou sekundu
    setInterval(updateCountdown, 1000);
})();

// ===== 2. NAČÍTÁNÍ EXPOZIC Z CSV =====
(function() {
    async function loadExhibits() {
        // Použít default data vždy pro zajištění zobrazení obrázků
        loadDefaultExhibits();
        
        // Pokusit se načíst z CSV pro aktualizaci
        try {
            const response = await fetch('data/exhibits.csv');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.text();
            const rows = data.trim().split('\n').filter(row => row.trim() !== '');
            const grid = document.getElementById('exhibit-grid');
            
            // Pokud nejsou řádky, ponechat default
            if (rows.length <= 1) {
                return;
            }
            
            // Přeskočit header
            grid.innerHTML = '';
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (!row) continue;
                
                // Parsování CSV
                const parts = row.split(',').map(s => s.trim());
                
                if (parts.length < 4) continue;
                
                const [name, description, category, image] = parts;
                
                // Validace obrázku
                const imgUrl = image && image.length > 0 ? image : `https://via.placeholder.com/280x200?text=${encodeURIComponent(name)}`;
                
                // Vytvoření karty
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${imgUrl}" alt="${name}" loading="lazy" onerror="this.src='https://via.placeholder.com/280x200?text=Bez+obrázku'">
                    <div class="card-content">
                        <h3>${name || 'Bez názvu'}</h3>
                        <p>${description || 'Bez popisu'}</p>
                        <span class="category-badge">${category || 'Ostatní'}</span>
                    </div>
                `;
                
                grid.appendChild(card);
            }
        } catch (error) {
            console.error('Chyba při načítání CSV:', error);
            // Default data už jsou načtené, takže nic dalšího nedělat
        }
    }
    
    // Default data pokud CSV selhá
    function loadDefaultExhibits() {
        const defaultData = [
            { name: 'Starověký Egypt', description: 'Objevujte hrobky faraónů a mistrovská díla egyptské civilizace', category: 'Antika', image: 'images/muzeum1.jpg' },
            { name: 'Řecké sochy', description: 'Klasické sochařství a umění starověkého Řecka', category: 'Antika', image: 'images/muzeum2.jpg' },
            { name: 'Středověké zbraně', description: 'Fascinující sbírka zbraní a brnění z doby středověku', category: 'Středověk', image: 'images/muzeum3.jpg' },
            { name: 'Gotické umění', description: 'Náboženská díla a ikony gotického období', category: 'Středověk', image: 'images/muzeum4.jpg' },
            { name: 'Renesanční malby', description: 'Mistrovská díla italských a evropských renesančních umělců', category: 'Renesance', image: 'images/muzeum5.jpg' },
            { name: 'Barokní porcelán', description: 'Krásná sbírka porcelánu a keramiky z období baroka', category: 'Barok', image: 'images/muzeum6.png' },
        ];
        
        const grid = document.getElementById('exhibit-grid');
        grid.innerHTML = '';
        
        defaultData.forEach(exhibit => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${exhibit.image}" alt="${exhibit.name}" loading="lazy">
                <div class="card-content">
                    <h3>${exhibit.name}</h3>
                    <p>${exhibit.description}</p>
                    <span class="category-badge">${exhibit.category}</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    
    // Načíst expozice po načtení DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadExhibits);
    } else {
        loadExhibits();
    }
})();

// ===== 3. CAROUSEL - Prémiové výstavy =====
(function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return; // Pokud carousel neexistuje, vynechat
    
    const slides = carousel.querySelector('.slides');
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');
    
    let currentIndex = 0;
    const slideCount = slides.children.length;
    
    function updateCarousel() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }
    
    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    }
    
    // Event listenery
    if (prevBtn) prevBtn.addEventListener('click', showPrevSlide);
    if (nextBtn) nextBtn.addEventListener('click', showNextSlide);
    
    // Auto-scroll každých 8 sekund (optional)
    // setInterval(showNextSlide, 8000);
})();

// ===== 4. FAQ - Rozbalování/sbalování =====
(function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Toggle třídy 'open'
            const isOpen = item.classList.contains('open');
            
            // Zavřít všechny ostatní FAQ položky
            faqItems.forEach(el => {
                if (el !== item) {
                    el.classList.remove('open');
                    el.querySelector('.faq-answer').classList.remove('open');
                }
            });
            
            // Nastavit aktuální položku
            if (isOpen) {
                item.classList.remove('open');
                answer.classList.remove('open');
            } else {
                item.classList.add('open');
                answer.classList.add('open');
            }
        });
    });
})();

// ===== 5. VALIDACE FORMULÁŘE =====
(function() {
    const form = document.getElementById('reservation-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        // Ověřit, že všechna pole jsou vyplněna
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Alespoň minimální custom validace
        const today = new Date().toISOString().split('T')[0];
        const dateInput = form.querySelector('input[name="date"]');
        
        if (dateInput.value < today) {
            e.preventDefault();
            alert('❌ Prosím, vyberte budoucí datum!');
            dateInput.focus();
            return false;
        }
    });
})();

// ===== 6. HLADKÝ SCROLL V NAVIGACI =====
(function() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Pokud je odkaz interní (začíná #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
})();

// ===== 7. DETEKCE SCROLL POZICE PRO STICKY NAV =====
(function() {
    const header = document.querySelector('header.sticky-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
})();

// ===== 8. INICIALIZACE PRZY NAČTENÍ STRÁNKY =====
window.addEventListener('load', () => {
    console.log('✅ Museum website loaded successfully!');
    
    // Přidání fade-in efektu na sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
});
