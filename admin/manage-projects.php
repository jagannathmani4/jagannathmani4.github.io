<?php
require_once __DIR__ . '/../config/db.php';
require_admin();

$errors = [];

// ---- Delete ----
if (isset($_GET['delete'])) {
    $stmt = $pdo->prepare('SELECT image FROM projects WHERE id = ?');
    $stmt->execute([(int)$_GET['delete']]);
    if ($row = $stmt->fetch()) {
        if ($row['image'] && file_exists(PROJECT_UPLOAD_DIR . $row['image'])) {
            unlink(PROJECT_UPLOAD_DIR . $row['image']);
        }
        $pdo->prepare('DELETE FROM projects WHERE id = ?')->execute([(int)$_GET['delete']]);
        set_flash('success', 'Project deleted.');
    }
    redirect(url('admin/manage-projects.php'));
}

// ---- Create / Update ----
$editing = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ?');
    $stmt->execute([(int)$_GET['edit']]);
    $editing = $stmt->fetch() ?: null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $id          = (int)($_POST['id'] ?? 0);
        $title       = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $techStack   = trim($_POST['tech_stack'] ?? '');
        $githubUrl   = trim($_POST['github_url'] ?? '');
        $liveUrl     = trim($_POST['live_url'] ?? '');
        $featured    = isset($_POST['featured']) ? 1 : 0;

        if ($title === '') $errors[] = 'Title is required.';
        if ($description === '') $errors[] = 'Description is required.';

        $imageName = trim($_POST['image_url'] ?? '');
        if ($imageName === '' && !empty($_FILES['image']['name'])) {
            try {
                $imageName = handle_upload($_FILES['image'] ?? [], PROJECT_UPLOAD_DIR, ['jpg', 'jpeg', 'png', 'webp', 'gif']);
            } catch (RuntimeException $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (!$errors) {
            if ($id > 0) {
                // Update
                if ($imageName) {
                    $old = $pdo->prepare('SELECT image FROM projects WHERE id = ?');
                    $old->execute([$id]);
                    $oldImg = $old->fetchColumn();
                    if ($oldImg && !is_remote_asset_url($oldImg) && file_exists(PROJECT_UPLOAD_DIR . $oldImg)) {
                        unlink(PROJECT_UPLOAD_DIR . $oldImg);
                    }

                    $stmt = $pdo->prepare('UPDATE projects SET title=?, description=?, tech_stack=?, github_url=?, live_url=?, featured=?, image=? WHERE id=?');
                    $stmt->execute([$title, $description, $techStack, $githubUrl, $liveUrl, $featured, $imageName, $id]);
                } else {
                    $stmt = $pdo->prepare('UPDATE projects SET title=?, description=?, tech_stack=?, github_url=?, live_url=?, featured=? WHERE id=?');
                    $stmt->execute([$title, $description, $techStack, $githubUrl, $liveUrl, $featured, $id]);
                }
                set_flash('success', 'Project updated.');
            } else {
                // Create
                $stmt = $pdo->prepare('INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$title, $description, $techStack, $githubUrl, $liveUrl, $featured, $imageName]);
                set_flash('success', 'Project created.');
            }
            redirect(url('admin/manage-projects.php'));
        }
    }
}

$projects = $pdo->query('SELECT * FROM projects ORDER BY created_at DESC')->fetchAll();

$pageTitle = 'Manage Projects';
$activePage = 'projects';
include __DIR__ . '/includes/admin-header.php';
?>

<div class="row g-4">
  <div class="col-lg-5">
    <div class="card-surface p-4">
      <h6 class="mb-3"><?= $editing ? 'Edit Project' : 'Add New Project' ?></h6>

      <?php if ($errors): ?>
        <div class="alert alert-danger"><ul class="mb-0 ps-3"><?php foreach ($errors as $e): ?><li><?= clean($e) ?></li><?php endforeach; ?></ul></div>
      <?php endif; ?>

      <form method="post" enctype="multipart/form-data">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= (int)($editing['id'] ?? 0) ?>">
        <input type="hidden" name="image_url" id="project-image-url" value="<?= clean($editing['image'] ?? '') ?>">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input type="text" name="title" class="form-control" value="<?= clean($editing['title'] ?? '') ?>" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea name="description" rows="4" class="form-control" required><?= clean($editing['description'] ?? '') ?></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Tech stack (comma separated)</label>
          <input type="text" name="tech_stack" class="form-control" placeholder="PHP, MySQL, Bootstrap" value="<?= clean($editing['tech_stack'] ?? '') ?>">
        </div>
        <div class="mb-3">
          <label class="form-label">GitHub URL</label>
          <input type="url" name="github_url" class="form-control" value="<?= clean($editing['github_url'] ?? '') ?>">
        </div>
        <div class="mb-3">
          <label class="form-label">Live demo URL</label>
          <input type="url" name="live_url" class="form-control" value="<?= clean($editing['live_url'] ?? '') ?>">
        </div>
        <div class="mb-3">
          <label class="form-label">Project image</label>
          <input type="file" name="image" class="form-control" accept=".jpg,.jpeg,.png,.webp,.gif" data-firebase-upload data-storage-provider="supabase" data-firebase-folder="projects" data-firebase-target="project-image-url">
          <div class="form-text text-secondary firebase-upload-status">Choose a file to upload it to Supabase Storage.</div>
          <?php if (!empty($editing['image'])): ?>
            <div class="form-text text-secondary">Current: <?= clean($editing['image']) ?> (uploading a new one will replace it)</div>
          <?php endif; ?>
        </div>
        <div class="form-check mb-4">
          <input type="checkbox" name="featured" id="featured" class="form-check-input" <?= !empty($editing['featured']) ? 'checked' : '' ?>>
          <label for="featured" class="form-check-label">Feature on homepage</label>
        </div>
        <button type="submit" class="btn btn-accent w-100"><?= $editing ? 'Update Project' : 'Create Project' ?></button>
        <?php if ($editing): ?>
          <a href="<?= url('admin/manage-projects.php') ?>" class="btn btn-outline-accent w-100 mt-2">Cancel</a>
        <?php endif; ?>
      </form>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card-surface p-4">
      <h6 class="mb-3">All Projects (<?= count($projects) ?>)</h6>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Title</th><th>Featured</th><th>Created</th><th></th></tr></thead>
          <tbody>
          <?php foreach ($projects as $p): ?>
            <tr>
              <td><?= clean($p['title']) ?></td>
              <td><?= $p['featured'] ? '<span class="tech-pill">Yes</span>' : '<span class="text-secondary small">No</span>' ?></td>
              <td class="text-secondary small"><?= date('M j, Y', strtotime($p['created_at'])) ?></td>
              <td class="text-end">
                <a href="<?= url('admin/manage-projects.php?edit=' . $p['id']) ?>" class="btn btn-sm btn-outline-accent me-1"><i class="bi bi-pencil"></i></a>
                <a href="<?= url('admin/manage-projects.php?delete=' . $p['id']) ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this project?');"><i class="bi bi-trash"></i></a>
              </td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php include __DIR__ . '/includes/admin-footer.php'; ?>
