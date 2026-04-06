# 🏛️ Muzejní webová stránka - Závěrečná práce PRO

Responzivní single-page webová aplikace pro fiktivní muzeum s přehledem expozic, carouselem prémiových výstav, countdownem a systémem rezervace vstupenek.

## ✨ Funkcionality

✅ **Responzivní design** - Optimalizováno pro mobily, tablety i desktopu (576px - 1440px)  
✅ **Sticky navigace** - Menu zůstává viditelné při scrollování  
✅ **Countdown timer** - Odpočet do zahájení nové výstavy  
✅ **Dynamické načítání expozic** - Z CSV souboru (JavaScript)  
✅ **Carousel** - Prémiové výstavy s navigačními tlačítky  
✅ **FAQ sekce** - Rozbalovatelné otázky a odpovědi  
✅ **Recenze návštěvníků** - Zobrazení hodnocení a komentářů  
✅ **Rezervační formulář** - S validací a ukládáním dat (PHP)  
✅ **Kontakty a mapa** - Google Maps integrace  
✅ **Moderní design** - Gradienty, animace, efekty  

## 📁 Struktura složek

```
museum-site/
├── index.html              # Hlavní HTML stránka
├── README.md               # Dokumentace
├── css/
│   └── style.css           # Globální CSS (responsive design)
├── js/
│   └── main.js             # JavaScript (countdown, carousel, FAQ)
├── php/
│   └── reservation.php     # Handler pro rezervace
├── data/
│   ├── exhibits.csv        # Databáze expozic CSV
│   └── reservations.txt    # Log rezervací
└── images/                 # Obrázky a bannery
```

## 🚀 Jak spustit

### Lokálně (bez PHP):
1. Stáhněte projekt
2. Otevřete `index.html` v prohlížeči
3. JavaScript a CSS budou fungovat, PHP část nebude (bez serveru)

### S PHP serverem:
```bash
# V kořenovém adresáři
php -S localhost:8000

# Potom otevřete v prohlížeči
# http://localhost:8000
```

### Na webhostingu:
1. Uploadujte veškeré soubory na server
2. Ujistěte se, že máte PHP 7.4+
3. Složka `data/` musí být zapisovatelná (chmod 755)

## 🎨 CSS Design

### Barvy (CSS proměnné):
- `--primary`: #1a1a2e (tmavá)
- `--accent`: #d4af37 (zlatá)
- `--accent-bright`: #f39c12 (oranžová)
- `--text-dark`: #2c3e50

### Responsive breakpointy:
- **Mobil**: 576px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px

### Animace:
- `fadeInUp` - Fade in s pohybem nahoru
- `slideInDown` - Slide in z horní strany
- `pulse` - Pulzující efekt (countdown)

## 📝 CSV formát (exhibits.csv)

```csv
Název,Popis,Kategorie,Obrázek
Starověký Egypt,Popis...,Antika,https://url-obrázku.jpg
Řecké sochy,Klasické sochařství...,Antika,https://url-obrázku.jpg
```

## 📧 Formulář rezervace

**Povinná pole:**
- Datum návštěvy
- Čas příchodu
- Počet osob
- Typ vstupenky
- Jméno a příjmení
- E-mail
- Telefonní číslo

**Volitelné:**
- Poznámky

**Výstup:** Uloženo v `data/reservations.txt`

## 🔒 Bezpečnost

- XSS ochrana: `htmlspecialchars()`
- CSRF ochrana: Validace input filtrů
- Validace server-side v PHP
- Sanitizace vstupů `FILTER_SANITIZE_*`

## 🌐 Kompatibilita prohlížečů

- Chrome/Edge (poslední 2 verze)
- Firefox (poslední 2 verze)
- Safari (poslední 2 verze)
- Mobilní prohlížeče (iOS Safari, Chrome Mobile)

## 📱 Mobile-first přístup

Stránka je primárně optimalizována pro mobilní zařízení s postupným vylepšením pro větší obrazovky.

## 📊 Performance

- Lazy loading obrázků
- CSS bez frameworků (čistý CSS)
- Minimální JavaScript (vanilla JS)
- Optimalizované animace (GPU accelerated)

## 🐛 Známé problémy

- CSV loading vyžaduje CORS (při hostingu na jiné doméně)
- PHP rezervace se ukládají jako plain text (pro produkci použít databázi)

## ✏️ Budoucí vylepšení

- [ ] Databáze místo textového souboru
- [ ] E-mailové notifikace
- [ ] Admin panel pro správu expozic
- [ ] Platby online
- [ ] Multi-jazykový support

## 📄 Licencia

© 2026 Závěrečná práce PRO MMK 3. ročník

---

**Vytvořeno s ❤️ pro zážitek z kultury a umění**

**Termín odevzdání:** 15. května 2026
