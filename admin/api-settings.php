<?php
require_once __DIR__ . '/../config/db.php';
require_admin();

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $fields = [
            'active_backend',
            'user_login_backend',
            'content_backend',
            'supabase_url',
            'supabase_anon_key',
            'supabase_service_key',
            'firebase_api_key',
            'firebase_auth_domain',
            'firebase_project_id',
            'firebase_storage_bucket',
            'firebase_messaging_sender_id',
            'firebase_app_id',
            'project_db_code',
        ];
        foreach ($fields as $field) {
            set_setting($pdo, $field, trim($_POST[$field] ?? ''));
        }
        $success = 'Settings saved successfully.';
    }
}

$settings = get_all_settings($pdo);

$pageTitle = 'API Settings';
$activePage = 'settings';
include __DIR__ . '/includes/admin-header.php';
?>

<?php if ($errors): ?>
  <div class="alert alert-danger"><ul class="mb-0 ps-3"><?php foreach ($errors as $e): ?><li><?= clean($e) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>
<?php if ($success): ?>
  <div class="alert alert-success"><?= clean($success) ?></div>
<?php endif; ?>

<div class="alert alert-warning small">
  <i class="bi bi-exclamation-triangle-fill me-2"></i>
  Keys are stored in the <code>settings</code> table in your database. Never commit real keys into
  version control, and prefer Supabase/Firebase keys that are safe for the intended scope
  (e.g. anon/public keys), keeping service-role / private keys restricted to trusted server-side use only.
</div>

<form method="post">
  <?= csrf_field() ?>

  <div class="card-surface p-4 mb-4">
    <h6 class="mb-3">Backend Split</h6>
    <p class="text-secondary small">Use Firebase only for user login/auth data and Supabase for project, notes, media, and other site records. MySQL remains available as a fallback for legacy/local compatibility.</p>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">User login data</label>
        <select name="user_login_backend" class="form-select">
          <?php foreach (['firebase' => 'Firebase', 'mysql' => 'MySQL'] as $val => $label): ?>
            <option value="<?= $val ?>" <?= strtolower((string)($settings['user_login_backend'] ?? 'firebase')) === $val ? 'selected' : '' ?>><?= $label ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label">Content / records storage</label>
        <select name="content_backend" class="form-select">
          <?php foreach (['supabase' => 'Supabase', 'mysql' => 'MySQL'] as $val => $label): ?>
            <option value="<?= $val ?>" <?= strtolower((string)($settings['content_backend'] ?? 'supabase')) === $val ? 'selected' : '' ?>><?= $label ?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>
    <input type="hidden" name="active_backend" value="<?= clean($settings['active_backend'] ?? 'mysql') ?>">
  </div>

  <div class="card-surface p-4 mb-4">
    <h6 class="mb-3"><i class="bi bi-lightning-charge me-2"></i>Supabase Configuration</h6>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Project URL</label>
        <input type="text" name="supabase_url" class="form-control" placeholder="https://xxxx.supabase.co" value="<?= clean($settings['supabase_url'] ?? '') ?>">
      </div>
      <div class="col-md-6">
        <label class="form-label">Anon (public) Key</label>
        <input type="text" name="supabase_anon_key" class="form-control" placeholder="eyJhbGciOi..." value="<?= clean($settings['supabase_anon_key'] ?? '') ?>">
      </div>
      <div class="col-md-6">
        <label class="form-label">Service Role Key <span class="text-danger">(sensitive)</span></label>
        <input type="password" name="supabase_service_key" class="form-control" value="<?= clean($settings['supabase_service_key'] ?? '') ?>">
      </div>
    </div>
  </div>

  <div class="card-surface p-4 mb-4">
    <h6 class="mb-3"><i class="bi bi-fire me-2"></i>Firebase Configuration</h6>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">API Key</label>
        <input type="text" name="firebase_api_key" class="form-control" value="<?= clean($settings['firebase_api_key'] ?? '') ?>">
      </div>
      <div class="col-md-6">
        <label class="form-label">Auth Domain</label>
        <input type="text" name="firebase_auth_domain" class="form-control" placeholder="project.firebaseapp.com" value="<?= clean($settings['firebase_auth_domain'] ?? '') ?>">
      </div>
      <div class="col-md-6">
        <label class="form-label">Project ID</label>
        <input type="text" name="firebase_project_id" class="form-control" value="<?= clean($settings['firebase_project_id'] ?? '') ?>">
      </div>
      <div class="col-md-6">
        <label class="form-label">Storage Bucket</label>
        <input type="text" name="firebase_storage_bucket" class="form-control" placeholder="project.appspot.com" value="<?= clean($settings['firebase_storage_bucket'] ?? '') ?>">
      </div>
      <div class="col-md-6">
        <label class="form-label">Messaging Sender ID</label>
        <input type="text" name="firebase_messaging_sender_id" class="form-control" value="<?= clean($settings['firebase_messaging_sender_id'] ?? '') ?>">
      </div>
      <div class="col-md-6">
        <label class="form-label">App ID</label>
        <input type="text" name="firebase_app_id" class="form-control" value="<?= clean($settings['firebase_app_id'] ?? '') ?>">
      </div>
    </div>
  </div>

  <div class="card-surface p-4 mb-4">
    <h6 class="mb-3"><i class="bi bi-database me-2"></i>Project Database Code</h6>
    <p class="text-secondary small mb-3">Keep a flexible spot here for project-specific database/client setup code, such as Firebase initialization.</p>
    <textarea name="project_db_code" class="form-control font-monospace" rows="18" placeholder="// Import the functions you need from the SDKs you need
import { initializeApp } from \"firebase/app\";

const firebaseConfig = {
  apiKey: \"...\",
  authDomain: \"...\",
  projectId: \"...\",
  storageBucket: \"...\",
  messagingSenderId: \"...\",
  appId: \"...\"
};

const app = initializeApp(firebaseConfig);"><?= clean($settings['project_db_code'] ?? "// Import the functions you need from the SDKs you need
import { initializeApp } from \"firebase/app\";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: \"AIzaSyDXRq_Wfs2mlvxdLkmh2t3PokZ5n03Vc-I\",
  authDomain: \"portfolio-web-bd546.firebaseapp.com\",
  projectId: \"portfolio-web-bd546\",
  storageBucket: \"portfolio-web-bd546.firebasestorage.app\",
  messagingSenderId: \"1093729951257\",
  appId: \"1:1093729951257:web:6f9f5665273c01e2285488\"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);") ?></textarea>
  </div>

  <button type="submit" class="btn btn-accent px-4">Save Settings</button>
</form>

<?php include __DIR__ . '/includes/admin-footer.php'; ?>
