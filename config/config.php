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
define('ADMIN_EMAIL', 'jagannathmani4@gmail.com');

// ---- Site URL ----
// Auto-detected so the app works on any PHP host (localhost, shared hosting,
// a subfolder, or a root domain) without editing this file per environment.
// Set SITE_URL_OVERRIDE below if you ever need to force a specific value
// (e.g. behind a proxy/load balancer that hides the real host).
define('SITE_URL_OVERRIDE', ''); // e.g. 'https://jagannath.me' — leave blank to auto-detect

if (SITE_URL_OVERRIDE !== '') {
    define('SITE_URL', rtrim(SITE_URL_OVERRIDE, '/'));
} else {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

    // Work out the project's base path (e.g. '' if it's the domain root,
    // or '/portfolio-website' if it lives in a subfolder) by comparing the
    // project's filesystem path against the web server's document root.
    // This is independent of which page/subfolder is currently executing.
    $projectRoot  = str_replace('\\', '/', dirname(__DIR__));
    $documentRoot = isset($_SERVER['DOCUMENT_ROOT']) ? rtrim(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']), '/') : '';

    $basePath = '';
    if ($documentRoot !== '' && strpos($projectRoot, $documentRoot) === 0) {
        $basePath = substr($projectRoot, strlen($documentRoot));
    }

    define('SITE_URL', $scheme . '://' . $host . $basePath);
}

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
