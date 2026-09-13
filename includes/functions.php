<?php
/**
 * Shared helper functions used across the whole application.
 */

// ---------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------

/**
 * Creates the default admin account on first run only, hashing the
 * password with PHP's own password_hash() so no plain-text password
 * is ever stored or committed to the database.
 */
function seed_default_admin(PDO $pdo): void
{
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([DEFAULT_ADMIN_EMAIL]);

    if ($stmt->fetch()) {
        return; // already exists
    }

    $hash = password_hash(DEFAULT_ADMIN_PASSWORD, PASSWORD_DEFAULT);

    $insert = $pdo->prepare(
        'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, "admin", "active")'
    );
    $insert->execute([DEFAULT_ADMIN_NAME, DEFAULT_ADMIN_EMAIL, $hash]);
}

/**
 * Ensures the known settings keys exist (Supabase / Firebase config)
 * so the admin panel form always has a row to update.
 */
function seed_default_settings(PDO $pdo): void
{
    $keys = [
        'active_backend',        // legacy fallback: 'mysql' | 'supabase' | 'firebase'
        'user_login_backend',   // 'firebase' | 'mysql'
        'content_backend',      // 'supabase' | 'mysql'
        'supabase_url',
        'supabase_anon_key',
        'supabase_service_key',
        'firebase_api_key',
        'firebase_auth_domain',
        'firebase_project_id',
        'firebase_storage_bucket',
        'firebase_messaging_sender_id',
        'firebase_app_id',
        'project_db_code',      // Optional project-specific DB/client config snippet (e.g. Firebase init code)
    ];

    $check  = $pdo->prepare('SELECT id FROM settings WHERE setting_key = ? LIMIT 1');
    $insert = $pdo->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)');

    foreach ($keys as $key) {
        $check->execute([$key]);
        if (!$check->fetch()) {
            $default = $key === 'active_backend' ? 'mysql' : '';
            $insert->execute([$key, $default]);
        }
    }
}

// ---------------------------------------------------------------------
// Sanitization / helpers
// ---------------------------------------------------------------------

function clean(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

/** Builds an absolute site URL (works regardless of which subfolder a page lives in). */
function url(string $path = ''): string
{
    return rtrim(SITE_URL, '/') . '/' . ltrim($path, '/');
}

/** Builds an absolute URL for a static asset (css/js/images). */
function asset(string $path): string
{
    return url($path);
}

function is_remote_asset_url(?string $value): bool
{
    if ($value === null || $value === '') {
        return false;
    }

    return (bool) preg_match('/^(https?:\/\/|data:|gs:\/\/)/i', $value);
}

function resolve_upload_url(?string $value, string $basePath): string
{
    if (empty($value)) {
        return '';
    }

    if (is_remote_asset_url($value)) {
        return $value;
    }

    return rtrim($basePath, '/') . '/' . ltrim($value, '/');
}

// ---------------------------------------------------------------------
// Flash messages (one-time session messages, e.g. after form submit)
// ---------------------------------------------------------------------

function set_flash(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function get_flash(): ?array
{
    if (!empty($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

// ---------------------------------------------------------------------
// CSRF protection
// ---------------------------------------------------------------------

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}

function verify_csrf(): bool
{
    $token = $_POST['csrf_token'] ?? '';
    return !empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// ---------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function is_logged_in(): bool
{
    return isset($_SESSION['user']);
}

function is_admin(): bool
{
    return is_logged_in() && ($_SESSION['user']['role'] ?? '') === 'admin';
}

/** Redirects to login if the visitor is not authenticated. */
function require_login(?string $redirectTo = null): void
{
    if (!is_logged_in()) {
        set_flash('warning', 'Please log in to continue.');
        redirect($redirectTo ?? url('auth/login.php'));
    }
}

/** Redirects to the admin login if the visitor is not an authenticated admin. */
function require_admin(?string $redirectTo = null): void
{
    if (!is_admin()) {
        set_flash('danger', 'Admin access required.');
        redirect($redirectTo ?? url('admin/login.php'));
    }
}

// ---------------------------------------------------------------------
// Settings (Supabase / Firebase keys, stored in the `settings` table)
// ---------------------------------------------------------------------

function get_setting(PDO $pdo, string $key, string $default = ''): string
{
    $stmt = $pdo->prepare('SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1');
    $stmt->execute([$key]);
    $row = $stmt->fetch();
    return $row ? (string)$row['setting_value'] : $default;
}

function set_setting(PDO $pdo, string $key, string $value): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    $stmt->execute([$key, $value]);
}

function get_all_settings(PDO $pdo): array
{
    $stmt = $pdo->query('SELECT setting_key, setting_value FROM settings');
    $out = [];
    foreach ($stmt->fetchAll() as $row) {
        $out[$row['setting_key']] = $row['setting_value'];
    }
    return $out;
}

/**
 * Returns the configured backend split for the app.
 * Firebase is intended for user login data, while Supabase handles project/notes/content records.
 */
function get_backend_config(PDO $pdo): array
{
    $settings = get_all_settings($pdo);

    $userLogin = strtolower((string)($settings['user_login_backend'] ?? $settings['active_backend'] ?? 'firebase'));
    $content = strtolower((string)($settings['content_backend'] ?? $settings['active_backend'] ?? 'supabase'));

    if (!in_array($userLogin, ['firebase', 'mysql'], true)) {
        $userLogin = 'firebase';
    }
    if (!in_array($content, ['supabase', 'mysql'], true)) {
        $content = 'supabase';
    }

    return [
        'user_login_backend' => $userLogin,
        'content_backend' => $content,
    ];
}

// ---------------------------------------------------------------------
// File uploads (project images / note attachments)
// ---------------------------------------------------------------------

/**
 * Handles a single uploaded file, validating extension + size.
 * Returns the stored filename on success, or null if no file was uploaded.
 * Throws a RuntimeException on validation failure.
 */
function handle_upload(array $file, string $destDir, array $allowedExt, int $maxBytes = 5 * 1024 * 1024): ?string
{
    if (!isset($file['error']) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload failed with error code ' . $file['error']);
    }
    if ($file['size'] > $maxBytes) {
        throw new RuntimeException('File is too large. Max size is ' . round($maxBytes / 1024 / 1024, 1) . 'MB.');
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt, true)) {
        throw new RuntimeException('File type .' . $ext . ' is not allowed.');
    }

    if (!is_dir($destDir)) {
        mkdir($destDir, 0755, true);
    }

    $newName = bin2hex(random_bytes(8)) . '_' . time() . '.' . $ext;
    $destPath = rtrim($destDir, '/') . '/' . $newName;

    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        throw new RuntimeException('Could not move uploaded file.');
    }

    return $newName;
}
