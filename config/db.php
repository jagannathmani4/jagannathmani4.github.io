<?php
require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    if (APP_DEBUG) {
        die('Database connection failed: ' . htmlspecialchars($e->getMessage()));
    }
    die('Database connection failed. Please try again later.');
}

require_once __DIR__ . '/../includes/functions.php';

// Make sure the settings table has default rows and the default admin exists.
seed_default_admin($pdo);
seed_default_settings($pdo);
