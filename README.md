# Portfolio Website — PHP + Bootstrap 5 + MySQL

A responsive personal portfolio site with:

- 🎨 A Bootstrap 5 front end (dark, custom-themed — not default Bootstrap look) covering Home, Projects, Notes, and Contact
- 🔐 User registration/login (required to send a contact message or read private notes)
- 📝 A Notes section with **public** notes (open to everyone) and **private** notes (login required)
- 🗂️ A full **Admin Panel** to manage projects, notes, users, and incoming contact messages
- 🔑 An admin **API Settings** page to store Supabase / Firebase credentials for future integrations
- 🛡️ CSRF protection, prepared statements (PDO), bcrypt password hashing, and locked-down upload/config folders

## Tech Stack

| Layer      | Choice                          |
|------------|----------------------------------|
| Frontend   | Bootstrap 5, Bootstrap Icons, custom CSS |
| Backend    | PHP 8+ (no framework, plain PDO)  |
| Database   | MySQL / MariaDB                   |
| Auth       | PHP sessions + `password_hash()`  |

## Folder Structure

```
portfolio-website/
├── admin/                 # Admin panel (dashboard, CRUD, API settings)
│   └── includes/          # Admin layout partials
├── assets/
│   ├── css/style.css      # Custom design system (dark theme)
│   ├── js/script.js
│   └── uploads/           # Project images & note attachments (writable)
├── auth/                  # register.php, login.php, logout.php
├── config/                # config.php (edit this!), db.php
├── database/schema.sql    # Import this into MySQL
├── includes/              # Shared header/navbar/footer + functions.php
├── index.php, projects.php, project-details.php,
│   notes.php, note-view.php, contact.php, profile.php
└── README.md
```

## Setup

1. **Clone/copy the project** into your PHP server's document root (Apache/Nginx + PHP 8+, or use `php -S localhost:8000` for local testing).

2. **Create the database:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE portfolio_db CHARACTER SET utf8mb4;"
   mysql -u root -p portfolio_db < database/schema.sql
   ```

3. **Configure credentials** in `config/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'portfolio_db');
   define('DB_USER', 'root');
   define('DB_PASS', 'your_password');
   define('SITE_URL', 'http://localhost/portfolio-website'); // no trailing slash
   ```

4. **Make the uploads folder writable:**
   ```bash
   chmod -R 755 assets/uploads
   ```

5. **Visit the site.** The very first request will automatically seed the default admin account (see below) and default settings rows — no manual SQL insert needed for the admin password.

## Default Admin Login

| Field    | Value                        |
|----------|-------------------------------|
| URL      | `/admin/login.php`            |
| Email    | `jagannathmani4@gmail.com`    |
| Password | `Jagannath@2005`               |

⚠️ **Change this password immediately after first login** (via Profile → Change Password while logged in as admin, or update it directly in the `users` table). The password is hashed with bcrypt at seed time — it is never stored or committed in plain text.

## Admin Panel Features

- **Dashboard** — quick stats (users, projects, notes, unread messages)
- **Projects** — create/edit/delete portfolio projects with image upload, tech tags, GitHub/live links, and a "featured" flag for the homepage
- **Notes** — create/edit/delete notes, mark public or private (login-gated), optional file attachment
- **Messages** — view contact form submissions, mark read/replied, reply via email, delete
- **Users** — promote/demote roles, ban/unban, delete accounts (self-protection built in — you can't ban/delete/demote yourself)
- **API Settings** — store Supabase URL/anon/service keys and Firebase config (`apiKey`, `authDomain`, `projectId`, etc.) in the `settings` table, ready to be read by any future integration code

## Security Notes

- All queries use PDO prepared statements — no raw string interpolation into SQL.
- Passwords are hashed with `password_hash()` / verified with `password_verify()`.
- Every state-changing form includes a CSRF token (`csrf_field()` / `verify_csrf()`).
- `config/` and `database/` folders are blocked from direct web access via `.htaccess`.
- `assets/uploads/` blocks PHP execution via `.htaccess`, so an uploaded file can never run as a script.
- Uploaded files are renamed to random names and validated by extension + size before being stored.
- The `settings` table stores API keys in the database, not in source control — never commit real Supabase/Firebase secrets into `config/config.php` or `.env` files that get pushed to GitHub.

## Notes on the Supabase/Firebase Settings Page

This app's own data (users, projects, notes, messages) runs on MySQL via PDO. The **API Settings** page in the admin panel lets you store Supabase or Firebase credentials in the database so you (or future code you add) can wire up additional features — e.g. real-time chat, file storage, or a second auth provider — without hardcoding secrets into PHP files that might get committed to Git. Wiring those keys into actual Supabase/Firebase SDK calls is left open for you to extend based on what you build next.

## License

Free to use and modify for your own portfolio.
