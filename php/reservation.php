<?php
/**
 * RESERVATION HANDLER
 * Probírá formulář z index.html a ukládá rezervace
 */

// Konfigurace
define('RESERVATIONS_FILE', __DIR__ . '/../data/reservations.txt');
define('ALLOWED_TYPES', ['adult', 'child', 'senior', 'family']);

// Zpracování POST requestu
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Sběr a sanitizace dat
    $data = [
        'date'      => filter_input(INPUT_POST, 'date', FILTER_SANITIZE_STRING),
        'time'      => filter_input(INPUT_POST, 'time', FILTER_SANITIZE_STRING),
        'people'    => filter_input(INPUT_POST, 'people', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 50]]),
        'type'      => filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING),
        'name'      => filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING),
        'email'     => filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL),
        'phone'     => filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING),
        'notes'     => filter_input(INPUT_POST, 'notes', FILTER_SANITIZE_STRING)
    ];
    
    // Validace povinných polí
    $errors = [];
    
    if (empty($data['date']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
        $errors[] = 'Neplatné datum';
    }
    
    if (empty($data['time']) || !preg_match('/^\d{2}:\d{2}$/', $data['time'])) {
        $errors[] = 'Neplatný čas';
    }
    
    if (!$data['people'] || $data['people'] < 1) {
        $errors[] = 'Neplatný počet osob';
    }
    
    if (!in_array($data['type'], ALLOWED_TYPES)) {
        $errors[] = 'Neplatný typ vstupenky';
    }
    
    if (empty($data['name']) || strlen($data['name']) < 3) {
        $errors[] = 'Prosím, zadejte platné jméno';
    }
    
    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Prosím, zadejte platný e-mail';
    }
    
    if (empty($data['phone']) || !preg_match('/^[\d\s\-\+()]+$/', $data['phone'])) {
        $errors[] = 'Prosím, zadejte platné telefonní číslo';
    }
    
    // Pokud nejsou chyby, uložit data
    if (empty($errors)) {
        // Ceny vstupenek (v Kč)
        $prices = [
            'adult'  => 250,
            'child'  => 150,
            'senior' => 150,
            'family' => 700
        ];
        
        $price = $prices[$data['type']] * ($data['type'] === 'family' ? 1 : $data['people']);
        
        // Příprava záznamu
        $record = sprintf(
            "[%s] %s | %s %s | %d osob | %s | %s | %d Kč\n",
            date('Y-m-d H:i:s'),
            htmlspecialchars($data['name']),
            $data['date'],
            $data['time'],
            $data['people'],
            htmlspecialchars($data['type']),
            htmlspecialchars($data['email']),
            $price
        );
        
        // Uložit do souboru
        if (file_put_contents(RESERVATIONS_FILE, $record, FILE_APPEND)) {
            $success = true;
        } else {
            $errors[] = 'Chyba při zápisu rezervace';
            $success = false;
        }
    } else {
        $success = false;
    }
} else {
    // Pokud není POST, přesměrovat na hlavní stránku
    header('Location: ../index.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $success ? 'Rezervace potvrzena' : 'Chyba' ?> | Muzeum</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .confirmation {
            background: white;
            padding: 50px;
            text-align: center;
            margin: 50px auto;
            max-width: 600px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .success { color: #27ae60; }
        .error { color: #e74c3c; }
        .confirmation h1 { margin-bottom: 20px; }
        .details { text-align: left; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .details p { margin: 12px 0; }
        .details strong { color: #1a1a2e; }
        .error-list { text-align: left; margin: 20px 0; }
        .error-list li { margin: 10px 0; color: #e74c3c; }
        .btn-back { 
            display: inline-block; 
            margin-top: 30px; 
            padding: 14px 40px; 
            background: linear-gradient(135deg, #d4af37 0%, #f39c12 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
        }
        .btn-back:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    </style>
</head>
<body>
    <header class="sticky-nav">
        <div class="logo">Muzeum</div>
        <nav>
            <ul>
                <li><a href="../index.html#exhibits">Zpět na web</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="confirmation">
            <?php if ($success && empty($errors)): ?>
                <h1 class="success">✅ Rezervace potvrzena!</h1>
                <p style="font-size: 18px; margin-bottom: 30px;">Děkujeme za Vaši rezervaci.</p>
                
                <div class="details">
                    <p><strong>Jméno:</strong> <?= htmlspecialchars($data['name']) ?></p>
                    <p><strong>Datum:</strong> <?= date('d.m.Y', strtotime($data['date'])) ?></p>
                    <p><strong>Čas příchodu:</strong> <?= htmlspecialchars($data['time']) ?></p>
                    <p><strong>Počet osob:</strong> <?= htmlspecialchars($data['people']) ?></p>
                    <p><strong>Typ vstupenky:</strong> <?= htmlspecialchars($data['type']) ?></p>
                    <p><strong>E-mail:</strong> <?= htmlspecialchars($data['email']) ?></p>
                    <p><strong>Telefon:</strong> <?= htmlspecialchars($data['phone']) ?></p>
                    <?php if (!empty($data['notes'])): ?>
                    <p><strong>Poznámky:</strong> <?= htmlspecialchars($data['notes']) ?></p>
                    <?php endif; ?>
                    <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <strong>Cena:</strong> 
                        <?php 
                            $prices = ['adult' => 250, 'child' => 150, 'senior' => 150, 'family' => 700];
                            $price = $prices[$data['type']] * ($data['type'] === 'family' ? 1 : $data['people']);
                            echo number_format($price, 0, ',', ' ') . ' Kč';
                        ?>
                    </p>
                </div>
                
                <p style="color: #7f8c8d; font-size: 14px;">Potvrzovací e-mail byl odeslán na adresu <strong><?= htmlspecialchars($data['email']) ?></strong></p>
                
            <?php else: ?>
                <h1 class="error">❌ Chyba při zpracování rezervace</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Při zpracování Vaší rezervace došlo k chybě:</p>
                
                <?php if (!empty($errors)): ?>
                <ul class="error-list">
                    <?php foreach ($errors as $error): ?>
                    <li><?= htmlspecialchars($error) ?></li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
                
                <p style="color: #7f8c8d; font-size: 14px;">Prosím, vraťte se zpět a zkuste to znovu.</p>
            <?php endif; ?>
            
            <a href="../index.html#reservation" class="btn-back">← Vrátit se na web</a>
        </div>
    </main>

    <footer>
        <p>© 2026 Národní muzeum</p>
    </footer>
</body>
</html>
