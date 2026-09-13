<?php
/**
 * Site configuration.
 * Update the DB credentials below to match your hosting environment.
 */

// ---- Database credentials ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// ---- Site info ----
define('SITE_NAME', 'Jagannath Mani');
define('SITE_URL', 'http://localhost/portfolio-website'); // no trailing slash
define('ADMIN_EMAIL', 'jagannathmani4@gmail.com');

// ---- Default admin seed credentials (used ONLY on first run to create the account) ----
define('DEFAULT_ADMIN_EMAIL', 'jagannathmani4@gmail.com');
define('DEFAULT_ADMIN_PASSWORD', 'Jagannath@2005');
define('DEFAULT_ADMIN_NAME', 'Jagannath Mani');

// ---- Upload paths ----
define('PROJECT_UPLOAD_DIR', __DIR__ . '/../assets/uploads/projects/');
define('NOTE_UPLOAD_DIR', __DIR__ . '/../assets/uploads/notes/');
define('PROJECT_UPLOAD_URL', 'assets/uploads/projects/');
define('NOTE_UPLOAD_URL', 'assets/uploads/notes/');

// ---- Session ----
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ---- Error display (turn OFF in production) ----
define('APP_DEBUG', true);
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

date_default_timezone_set('Asia/Kolkata');
