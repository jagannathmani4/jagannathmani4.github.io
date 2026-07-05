<?php
// Function to read and parse the .db files
function getDbData($filename) {
    $filepath = __DIR__ . '/db/' . $filename . '.db';
    if (file_exists($filepath)) {
        $json_data = file_get_contents($filepath);
        return json_decode($json_data, true);
    }
    return [];
}

// Fetch dynamic data
$details = getDbData('details');
$skills = getDbData('skills');
$services = getDbData('services');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($details['name'] ?? 'Portfolio') ?> | Portfolio</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-dark text-light" data-bs-spy="scroll" data-bs-target="#mainNav" data-bs-smooth-scroll="true" tabindex="0">

    <nav id="mainNav" class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm border-bottom border-secondary">
        <div class="container">
            <a class="navbar-brand fw-bold text-info" href="#"><?= htmlspecialchars($details['name'] ?? 'Logo') ?>.</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#skills">Skills</a></li>
                    <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                </ul>
                <a href="mailto:<?= htmlspecialchars($details['email'] ?? '') ?>" class="btn btn-info ms-lg-3 rounded-pill px-4 fw-semibold">Let's Talk</a>
            </div>
        </div>
    </nav>

    <section id="about" class="min-vh-100 d-flex align-items-center py-5">
        <div class="container">
            <div class="row align-items-center flex-column-reverse flex-lg-row">
                <div class="col-lg-6 pe-lg-5 fade-in-up">
                    <h1 class="display-4 fw-bold mb-3">Hi, I'm <span class="text-info"><?= htmlspecialchars($details['name'] ?? '') ?></span></h1>
                    <h2 class="h3 text-secondary mb-4"><?= htmlspecialchars($details['role'] ?? '') ?></h2>
                    <p class="lead mb-4"><?= htmlspecialchars($details['about'] ?? '') ?></p>
                    
                    <div class="bg-secondary bg-opacity-25 p-4 rounded-4 mb-4 border border-secondary border-opacity-50">
                        <p class="mb-2"><i class="bi bi-envelope-fill text-info me-2"></i> <?= htmlspecialchars($details['email'] ?? '') ?></p>
                        <p class="mb-0"><i class="bi bi-telephone-fill text-info me-2"></i> <?= htmlspecialchars($details['phone'] ?? '') ?></p>
                    </div>
                    
                    <a href="#services" class="btn btn-outline-info btn-lg rounded-pill px-4">View My Work</a>
                </div>
                <div class="col-lg-6 mb-5 mb-lg-0 text-center fade-in">
                    <div class="hero-image-circle bg-info bg-gradient mx-auto shadow-lg"></div>
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="py-5 bg-darker">
        <div class="container py-5">
            <h2 class="text-center fw-bold mb-5">My <span class="text-info">Skills</span></h2>
            <div class="row g-4">
                <?php foreach ($skills as $skill): ?>
                    <div class="col-sm-6 col-lg-3">
                        <div class="card h-100 bg-secondary bg-opacity-10 border-secondary border-opacity-25 hover-lift text-light">
                            <div class="card-body text-center p-4">
                                <h5 class="card-title mb-3"><?= htmlspecialchars($skill['name']) ?></h5>
                                <div class="progress mb-2 bg-dark" style="height: 10px;">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: <?= htmlspecialchars($skill['percentage']) ?>%;" aria-valuenow="<?= htmlspecialchars($skill['percentage']) ?>" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <span class="fw-bold text-info"><?= htmlspecialchars($skill['percentage']) ?>%</span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section id="services" class="py-5">
        <div class="container py-5">
            <h2 class="text-center fw-bold mb-5">My <span class="text-info">Services</span></h2>
            <div class="row g-4">
                <?php foreach ($services as $service): ?>
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 bg-secondary bg-opacity-10 border-secondary border-opacity-25 hover-lift text-light">
                            <div class="card-body p-4 text-center">
                                <div class="display-4 mb-3"><?= htmlspecialchars($service['icon']) ?></div>
                                <h3 class="h4 card-title fw-bold mb-3"><?= htmlspecialchars($service['title']) ?></h3>
                                <p class="card-text text-secondary"><?= htmlspecialchars($service['desc']) ?></p>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <footer class="py-4 bg-darker border-top border-secondary border-opacity-25 text-center">
        <div class="container">
            <p class="mb-0 text-secondary">&copy; <?= date('Y') ?> <?= htmlspecialchars($details['name'] ?? '') ?>. All Rights Reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>