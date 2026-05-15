<?php
// presmeroovani pokud neni odesilani formulare pres post
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header('Location: ../index.html');
    exit;
}

// nacteni dat z formulare - operator ?? vraci prazdny retezec kdyz pole neexistuje
$name   = $_POST['name']   ?? '';
$email  = $_POST['email']  ?? '';
$phone  = $_POST['phone']  ?? '';
$date   = $_POST['date']   ?? '';
$time   = $_POST['time']   ?? '';
$people = (int)($_POST['people'] ?? 0);  // pretypovani na int pro bezpecnost
$type   = $_POST['type']   ?? '';
$notes  = $_POST['notes']  ?? '';

// pole pro zachyceni chybovych hlasek pri validaci
$errors = [];

// kontrola povinnych poli a rozsahu hodnot
if (empty($date))                               $errors[] = 'Vyberte datum';
if (empty($time))                               $errors[] = 'Vyberte čas';
if ($people < 1 || $people > 50)               $errors[] = 'Zadejte počet osob (1–50)';
if (empty($name))                               $errors[] = 'Zadejte jméno';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Zadejte platný e-mail';
if (empty($phone))                              $errors[] = 'Zadejte telefon';

// inicializace promennych pro vysledek zpracovani
$success = false;
$price   = 0;

// zpracovani rezervace pouze pokud nejsou zadne chyby
if (count($errors) == 0) {
    // cenik vstupenek 
    $prices = ['adult' => 250, 'child' => 150, 'senior' => 150, 'family' => 700];

    // rodinne oevna cena
    if ($type == 'family') {
        $price = 700;
    } else {
        // ostatni typy
        $price = $prices[$type] * $people;
    }

    // sestaveni jednoho radku zaznamu pro ulozeni do souboru
    $record = date('Y-m-d H:i:s') . ' | ' . $name . ' | ' . $date . ' ' . $time . ' | ' . $people . ' osob | ' . $type . ' | ' . $email . ' | ' . $price . " Kč\n";

    // zapis na konec souboru 
    if (file_put_contents(__DIR__ . '/../data/reservations.txt', $record, FILE_APPEND)) {
        $success = true;
    } else {
        $errors[] = 'Nepodařilo se uložit rezervaci';
    }
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rezervace | Muzeum Věků</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="page-result">
    <header class="sticky-nav">
        <div class="logo">
            <img src="../images/muzeum.logo.webp" alt="Muzeum Věků">
        </div>
    </header>

    <main>
        <div class="confirmation">

            <?php if ($success): ?>
                <h1 class="success">✅ Rezervace potvrzena!</h1>
                <p class="podtitul">Děkujeme, těšíme se na vaši návštěvu.</p>
                <div class="details">
                    <p><strong>Jméno:</strong> <?= htmlspecialchars($name) ?></p>
                    <p><strong>Datum:</strong> <?= date('d.m.Y', strtotime($date)) ?></p>
                    <p><strong>Čas:</strong> <?= htmlspecialchars($time) ?></p>
                    <p><strong>Počet osob:</strong> <?= $people ?></p>
                    <p><strong>E-mail:</strong> <?= htmlspecialchars($email) ?></p>
                    <p class="price-row"><strong>Celková cena:</strong> <?= $price ?> Kč</p>
                </div>
            <?php else: ?>
                <h1 class="error">❌ Chyba při rezervaci</h1>
                <ul class="error-list">
                    <?php foreach ($errors as $e): ?>
                    <li><?= htmlspecialchars($e) ?></li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

            <a href="../index.html" class="btn">← Zpět na web</a>

        </div>
    </main>
</body>
</html>
