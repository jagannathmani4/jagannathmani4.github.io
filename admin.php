<?php
declare(strict_types=1);
session_set_cookie_params(['httponly' => true, 'secure' => !empty($_SERVER['HTTPS']), 'samesite' => 'Lax']);
session_start();
$adminUser = getenv('PORTFOLIO_ADMIN_USER') ?: 'admin';
$adminHash = getenv('PORTFOLIO_ADMIN_HASH') ?: '';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) { $error = 'Your session expired. Refresh and try again.'; }
    elseif (!$adminHash || !hash_equals($adminUser, (string)($_POST['username'] ?? '')) || !password_verify((string)($_POST['password'] ?? ''), $adminHash)) { $error = 'Invalid admin credentials.'; }
    else { session_regenerate_id(true); $_SESSION['admin'] = true; header('Location: admin.php'); exit; }
}
if (isset($_GET['logout'])) { session_destroy(); header('Location: admin.php'); exit; }
$_SESSION['csrf'] = bin2hex(random_bytes(32));
function e(string $value): string { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio Admin</title><link rel="stylesheet" href="assets/css/admin.css"></head><body>
<?php if (empty($_SESSION['admin'])): ?><main class="login"><p class="admin-mark">JM<span>.</span> / ADMIN</p><h1>Portfolio<br>control room.</h1><p class="muted">Use the server credentials configured in your environment.</p><form method="post"><input type="hidden" name="csrf" value="<?= e($_SESSION['csrf']) ?>"><label>Username<input name="username" autocomplete="username" required></label><label>Password<input type="password" name="password" autocomplete="current-password" required></label><?php if ($error): ?><p class="error"><?= e($error) ?></p><?php endif; ?><button name="login" type="submit">Sign in <span>↗</span></button></form></main>
<?php else: ?><main class="dashboard"><header><a class="admin-mark" href="index.html">JM<span>.</span></a><a class="logout" href="admin.php?logout=1">Log out</a></header><section class="dash-intro"><p class="admin-mark">CONTENT / FIRESTORE</p><h1>Keep the work<br><em>moving forward.</em></h1><p class="muted">Add project details below. Text is saved to <code>portfolio/main</code>.</p></section><form id="portfolioForm" class="editor"><section class="project-editor"><div class="editor-heading"><span>PROJECTS</span><button type="button" id="addProject">+ Add project</button></div><div id="projectRows"></div></section><label>Skills <textarea id="skills" rows="8" placeholder='[{"name":"React","level":"Building"}]'></textarea></label><div class="media-row"><label>Upload media <input id="media" type="file" accept="image/*,.pdf"></label><button type="button" id="uploadButton">Upload to Supabase</button></div><p id="status" class="status"></p><button type="submit">Save portfolio data <span>↗</span></button></form></main><script type="module" src="assets/js/admin.js"></script><?php endif; ?></body></html>