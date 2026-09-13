<?php
require_once __DIR__ . '/../config/db.php';
require_admin();

$errors = [];

if (isset($_GET['delete'])) {
    $stmt = $pdo->prepare('SELECT file_path FROM notes WHERE id = ?');
    $stmt->execute([(int)$_GET['delete']]);
    if ($row = $stmt->fetch()) {
        if ($row['file_path'] && file_exists(NOTE_UPLOAD_DIR . $row['file_path'])) {
            unlink(NOTE_UPLOAD_DIR . $row['file_path']);
        }
        $pdo->prepare('DELETE FROM notes WHERE id = ?')->execute([(int)$_GET['delete']]);
        set_flash('success', 'Note deleted.');
    }
    redirect(url('admin/manage-notes.php'));
}

$editing = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM notes WHERE id = ?');
    $stmt->execute([(int)$_GET['edit']]);
    $editing = $stmt->fetch() ?: null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $id       = (int)($_POST['id'] ?? 0);
        $title    = trim($_POST['title'] ?? '');
        $category = trim($_POST['category'] ?? 'General');
        $content  = trim($_POST['content'] ?? '');
        $isPublic = isset($_POST['is_public']) ? 1 : 0;

        if ($title === '') $errors[] = 'Title is required.';
        if ($content === '') $errors[] = 'Content is required.';

        $fileName = null;
        try {
            $fileName = handle_upload($_FILES['attachment'] ?? [], NOTE_UPLOAD_DIR, ['pdf', 'doc', 'docx', 'txt', 'zip', 'jpg', 'png']);
        } catch (RuntimeException $e) {
            $errors[] = $e->getMessage();
        }

        if (!$errors) {
            if ($id > 0) {
                if ($fileName) {
                    $old = $pdo->prepare('SELECT file_path FROM notes WHERE id = ?');
                    $old->execute([$id]);
                    $oldFile = $old->fetchColumn();
                    if ($oldFile && file_exists(NOTE_UPLOAD_DIR . $oldFile)) unlink(NOTE_UPLOAD_DIR . $oldFile);

                    $stmt = $pdo->prepare('UPDATE notes SET title=?, category=?, content=?, is_public=?, file_path=? WHERE id=?');
                    $stmt->execute([$title, $category, $content, $isPublic, $fileName, $id]);
                } else {
                    $stmt = $pdo->prepare('UPDATE notes SET title=?, category=?, content=?, is_public=? WHERE id=?');
                    $stmt->execute([$title, $category, $content, $isPublic, $id]);
                }
                set_flash('success', 'Note updated.');
            } else {
                $stmt = $pdo->prepare('INSERT INTO notes (title, category, content, is_public, file_path) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$title, $category, $content, $isPublic, $fileName]);
                set_flash('success', 'Note created.');
            }
            redirect(url('admin/manage-notes.php'));
        }
    }
}

$notes = $pdo->query('SELECT * FROM notes ORDER BY created_at DESC')->fetchAll();

$pageTitle = 'Manage Notes';
$activePage = 'notes';
include __DIR__ . '/includes/admin-header.php';
?>

<div class="row g-4">
  <div class="col-lg-5">
    <div class="card-surface p-4">
      <h6 class="mb-3"><?= $editing ? 'Edit Note' : 'Add New Note' ?></h6>

      <?php if ($errors): ?>
        <div class="alert alert-danger"><ul class="mb-0 ps-3"><?php foreach ($errors as $e): ?><li><?= clean($e) ?></li><?php endforeach; ?></ul></div>
      <?php endif; ?>

      <form method="post" enctype="multipart/form-data">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= (int)($editing['id'] ?? 0) ?>">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input type="text" name="title" class="form-control" value="<?= clean($editing['title'] ?? '') ?>" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Category</label>
          <input type="text" name="category" class="form-control" value="<?= clean($editing['category'] ?? 'General') ?>">
        </div>
        <div class="mb-3">
          <label class="form-label">Content</label>
          <textarea name="content" rows="6" class="form-control" required><?= clean($editing['content'] ?? '') ?></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Attachment (optional)</label>
          <input type="file" name="attachment" class="form-control">
          <?php if (!empty($editing['file_path'])): ?>
            <div class="form-text text-secondary">Current: <?= clean($editing['file_path']) ?></div>
          <?php endif; ?>
        </div>
        <div class="form-check mb-4">
          <input type="checkbox" name="is_public" id="is_public" class="form-check-input" <?= !empty($editing['is_public']) ? 'checked' : '' ?>>
          <label for="is_public" class="form-check-label">Make public (no login required)</label>
        </div>
        <button type="submit" class="btn btn-accent w-100"><?= $editing ? 'Update Note' : 'Create Note' ?></button>
        <?php if ($editing): ?>
          <a href="<?= url('admin/manage-notes.php') ?>" class="btn btn-outline-accent w-100 mt-2">Cancel</a>
        <?php endif; ?>
      </form>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card-surface p-4">
      <h6 class="mb-3">All Notes (<?= count($notes) ?>)</h6>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Title</th><th>Category</th><th>Visibility</th><th></th></tr></thead>
          <tbody>
          <?php foreach ($notes as $n): ?>
            <tr>
              <td><?= clean($n['title']) ?></td>
              <td><span class="tech-pill"><?= clean($n['category']) ?></span></td>
              <td><?= $n['is_public'] ? '<span class="text-secondary small"><i class="bi bi-unlock-fill"></i> Public</span>' : '<span class="text-secondary small"><i class="bi bi-lock-fill"></i> Private</span>' ?></td>
              <td class="text-end">
                <a href="<?= url('admin/manage-notes.php?edit=' . $n['id']) ?>" class="btn btn-sm btn-outline-accent me-1"><i class="bi bi-pencil"></i></a>
                <a href="<?= url('admin/manage-notes.php?delete=' . $n['id']) ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this note?');"><i class="bi bi-trash"></i></a>
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
