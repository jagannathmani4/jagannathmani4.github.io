# Jagannath Mani Portfolio

Static developer portfolio for GitHub Pages.

## GitHub Pages

1. Push the repository to `jagannathmani4/jagannathmani4.github.io`.
2. Open **Settings > Pages**.
3. Select **Deploy from a branch**, choose `main`, and select `/ (root)`.
4. Open `https://jagannathmani4.github.io` after deployment finishes.

The public site is `index.html` and uses only relative local assets plus CDN-loaded Bootstrap and Google Fonts. The portfolio currently includes the Excel dashboard at:

- Preview: `assets/projects/images/Screenshot 2026-09-04 115031.png`
- Download: `assets/projects/files/excel task.xlsx`

## Updating Content

- Change the profile picture in `assets/dp/my_img.jpeg`.
- Change the shared profile image path in `assets/js/config.js` if the filename changes.
- Edit the text in `index.html`.
- Add project entries in the `defaults.projects` array in `assets/js/site.js`.

## Admin Note

`admin.php` is not executable on GitHub Pages because GitHub Pages is a static hosting service and does not run PHP. The public portfolio remains fully usable there. To use the PHP session admin page and Firebase/Supabase admin integrations, deploy the repository to a PHP-capable host and configure the environment variables documented in `admin.php` and `assets/js/config.js`.

Do not commit real passwords, private keys, service-role keys, or `.env` files.
