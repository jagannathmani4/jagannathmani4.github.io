<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fudo - Food Delivery</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --brand-color: #f54748;
            --brand-hover: #d43b3c;
            --text-dark: #2e2e2e;
            --text-muted: #797979;
            --bg-light-pink: #fff5f5;
        }

        body {
            font-family: 'Poppins', sans-serif;
            color: var(--text-dark);
            overflow-x: hidden;
        }

        /* Typography & Colors */
        .text-brand { color: var(--brand-color) !important; }
        .bg-brand { background-color: var(--brand-color) !important; }
        .text-muted { color: var(--text-muted) !important; }
        
        h1, h2, h3, h4, h5, h6 { font-weight: 700; }

        /* Buttons */
        .btn-brand {
            background-color: var(--brand-color);
            color: #fff;
            border: none;
            border-radius: 50px;
            padding: 10px 24px;
            font-weight: 500;
            transition: 0.3s;
        }
        .btn-brand:hover {
            background-color: var(--brand-hover);
            color: #fff;
        }
        .btn-play {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #fff;
            color: var(--brand-color);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-decoration: none;
            transition: 0.3s;
        }
        
        /* Navbar */
        .navbar-nav .nav-link {
            color: var(--text-dark);
            font-weight: 500;
            margin: 0 10px;
        }
        .navbar-nav .nav-link.active, .navbar-nav .nav-link:hover {
            color: var(--brand-color);
        }

        /* Hero Section */
        .hero-section {
            padding-top: 80px;
            padding-bottom: 80px;
        }
        .badge-brand {
            background-color: var(--bg-light-pink);
            color: var(--brand-color);
            border-radius: 50px;
            padding: 8px 16px;
            font-weight: 500;
            display: inline-block;
        }
        .hero-img-bg {
            background-color: var(--brand-color);
            border-radius: 50%;
            width: 450px;
            height: 450px;
            position: absolute;
            z-index: -1;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        .hero-image {
            width: 100%;
            max-width: 500px;
            border-radius: 20px;
            z-index: 1;
        }

        /* Feature Section */
        .feature-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
        }
        .section-subtitle {
            color: var(--brand-color);
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 600;
        }

        /* Menu Section */
        .menu-sidebar .list-group-item {
            border: none;
            padding: 12px 20px;
            border-radius: 50px !important;
            margin-bottom: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.3s;
        }
        .menu-sidebar .list-group-item.active {
            background-color: var(--brand-color);
            color: white;
            box-shadow: 0 4px 15px rgba(245, 71, 72, 0.3);
        }
        .menu-sidebar .list-group-item:not(.active):hover {
            background-color: var(--bg-light-pink);
        }
        .food-card {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            transition: 0.3s;
        }
        .food-card:hover { transform: translateY(-5px); }
        .food-card img {
            height: 250px;
            object-fit: cover;
        }

        /* App Download Section */
        .app-section {
            background-color: var(--bg-light-pink);
            border-radius: 30px;
            padding: 60px 40px;
            margin: 80px 0;
        }

        /* Footer */
        .footer-links li { margin-bottom: 12px; }
        .footer-links a {
            color: var(--text-muted);
            text-decoration: none;
            transition: 0.3s;
        }
        .footer-links a:hover { color: var(--brand-color); }
        .newsletter-input {
            border-radius: 50px;
            padding: 12px 20px;
        }
        .newsletter-btn {
            position: absolute;
            right: 5px;
            top: 5px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-light bg-white py-3 sticky-top shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="#">
                <i class="fa-solid fa-utensils text-brand me-2 fs-3"></i>
                <span class="fw-bold fs-4">Fudo</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item"><a class="nav-link active" href="#">Why Fudo?</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Services</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Menu</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
                </ul>
                <div class="d-flex align-items-center gap-4">
                    <a href="#" class="text-dark"><i class="fas fa-search"></i></a>
                    <a href="#" class="text-dark position-relative">
                        <i class="fas fa-shopping-bag"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-brand" style="font-size: 0.6rem;">2</span>
                    </a>
                    <a href="#" class="btn btn-brand px-4 d-flex align-items-center gap-2">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center min-vh-75">
                <div class="col-lg-6 mb-5 mb-lg-0">
                    <div class="badge-brand mb-4">More than Faster 🍒</div>
                    <h1 class="display-3 fw-bold lh-sm mb-4">
                        Be The Fastest<br>
                        In Delivering<br>
                        Your <span class="text-brand">Food</span>
                    </h1>
                    <p class="text-muted fs-5 mb-5 pe-lg-5">
                        Our job is filling your tummy with delicious food and with fast and free delivery.
                    </p>
                    <div class="d-flex align-items-center gap-4 mb-5">
                        <a href="#" class="btn btn-brand btn-lg">Get Started</a>
                        <a href="#" class="d-flex align-items-center text-dark text-decoration-none fw-semibold">
                            <span class="btn-play me-3"><i class="fas fa-play"></i></span>
                            Watch Video
                        </a>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" class="rounded-circle border border-white border-2" style="margin-right: -15px;" alt="user">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" class="rounded-circle border border-white border-2" style="margin-right: -15px;" alt="user">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" class="rounded-circle border border-white border-2" alt="user">
                        </div>
                        <div>
                            <p class="mb-0 fw-bold">Our Happy Customer</p>
                            <p class="mb-0 text-muted small"><i class="fas fa-star text-warning"></i> 4.8 (12.5k Review)</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 position-relative text-center">
                    <div class="hero-img-bg d-none d-lg-block"></div>
                    <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Person eating" class="hero-image shadow-lg">
                    
                    <div class="position-absolute bg-white p-3 rounded-4 shadow d-flex align-items-center gap-3" style="bottom: 10%; left: -5%;">
                        <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=50&h=50&fit=crop" class="rounded-3" alt="Pizza">
                        <div class="text-start">
                            <h6 class="mb-0 fw-bold">Italian Pizza</h6>
                            <span class="text-muted small">⭐⭐⭐⭐⭐</span><br>
                            <span class="fw-bold text-dark">$ 7.49</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5 text-center">
        <div class="container">
            <span class="section-subtitle">What We Serve</span>
            <h2 class="display-6 fw-bold mb-5 mt-2">Your Favourite Food<br>Delivery Partner</h2>
            
            <div class="row mt-5">
                <div class="col-md-4 mb-4">
                    <div class="p-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/3501/3501062.png" class="feature-icon" alt="Easy to Order">
                        <h4 class="fw-bold mb-3">Easy To Order</h4>
                        <p class="text-muted">You only need a few steps in ordering food.</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="p-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/1048/1048329.png" class="feature-icon" alt="Fastest Delivery">
                        <h4 class="fw-bold mb-3">Fastest Delivery</h4>
                        <p class="text-muted">Delivery that is always on time even faster.</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="p-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" class="feature-icon" alt="Best Quality">
                        <h4 class="fw-bold mb-3">Best Quality</h4>
                        <p class="text-muted">Not only fast for us quality is also number one.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5">
        <div class="container">
            <div class="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <span class="section-subtitle">Our Menu</span>
                    <h2 class="display-6 fw-bold mt-2">Menu That Always<br>Make You Fall In Love</h2>
                </div>
                <div class="d-none d-md-flex gap-2">
                    <button class="btn btn-light rounded-circle" style="width: 50px; height: 50px;"><i class="fas fa-chevron-left"></i></button>
                    <button class="btn btn-brand rounded-circle" style="width: 50px; height: 50px; padding:0;"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-3 mb-4">
                    <div class="list-group menu-sidebar gap-2">
                        <button class="list-group-item d-flex align-items-center gap-3">
                            <i class="fas fa-hamburger text-warning"></i> Burger
                        </button>
                        <button class="list-group-item active d-flex align-items-center gap-3">
                            <i class="fas fa-pizza-slice"></i> Pizza
                        </button>
                        <button class="list-group-item d-flex align-items-center gap-3">
                            <i class="fas fa-cookie text-danger"></i> Cupcake
                        </button>
                        <button class="list-group-item d-flex align-items-center gap-3">
                            <i class="fas fa-bowl-food text-success"></i> Ramen
                        </button>
                        <button class="list-group-item d-flex align-items-center gap-3">
                            <i class="fas fa-ice-cream text-info"></i> Ice Cream
                        </button>
                    </div>
                </div>
                
                <div class="col-lg-9">
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <div class="card food-card text-white bg-dark">
                                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="card-img" alt="Italian Pizza">
                                <div class="card-img-overlay d-flex flex-column justify-content-end p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
                                    <h4 class="card-title fw-bold">Italian Pizza</h4>
                                    <p class="card-text fs-4 fw-bold text-brand mb-1">$ 7.49</p>
                                    <a href="#" class="text-white text-decoration-none">Order Now <i class="fas fa-arrow-right ms-2"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-4">
                            <div class="card food-card text-white bg-dark">
                                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="card-img" alt="Sausage Pizza">
                                <div class="card-img-overlay d-flex flex-column justify-content-end p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
                                    <h4 class="card-title fw-bold">Sausage Pizza</h4>
                                    <p class="card-text fs-4 fw-bold text-brand mb-1">$ 6.59</p>
                                    <a href="#" class="text-white text-decoration-none">Order Now <i class="fas fa-arrow-right ms-2"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 position-relative text-center mb-5 mb-lg-0">
                    <div class="bg-brand rounded-circle position-absolute" style="width: 400px; height: 400px; z-index: -1; left: 10%; bottom: 0;"></div>
                    <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Chef" class="img-fluid" style="border-radius: 20px 20px 100px 100px; max-height: 500px; object-fit: cover;">
                </div>
                <div class="col-lg-6 ps-lg-5">
                    <span class="section-subtitle">What They Say</span>
                    <h2 class="display-6 fw-bold mb-4 mt-2">What Our Customer<br>Say About Us</h2>
                    <p class="text-muted fs-5 mb-4 font-italic">
                        "Fudo is the best. Besides the many and delicious meals, the service is also very good, especially in the very fast delivery. I highly recommend Fudo to you."
                    </p>
                    <div class="d-flex align-items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop" class="rounded-circle" alt="Customer">
                        <div>
                            <h6 class="mb-0 fw-bold">Theresa Jordan</h6>
                            <p class="text-muted small mb-0">Food Enthusiast</p>
                        </div>
                    </div>
                    <div class="mt-3 text-warning">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <span class="text-dark fw-bold ms-2">4.8</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="container">
        <div class="app-section">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <span class="section-subtitle">Download App</span>
                    <h2 class="display-5 fw-bold mb-4 mt-2">Get Started With<br>Fudo Today!</h2>
                    <p class="text-muted mb-4 pe-lg-5">
                        Discover food wherever and whenever and get your food delivered quickly.
                    </p>
                    <a href="#" class="btn btn-brand btn-lg px-5">Get The App</a>
                </div>
                <div class="col-lg-6 text-center">
                    <div class="bg-white p-4 rounded-4 shadow-lg d-inline-block text-start" style="width: 300px;">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <i class="fas fa-bars"></i>
                            <span class="small fw-bold"><i class="fas fa-map-marker-alt text-brand"></i> California, US</span>
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=30&h=30&fit=crop" class="rounded-circle" alt="user">
                        </div>
                        <div class="bg-light-pink p-3 rounded-3 mb-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 class="fw-bold mb-1">The Fastest In<br>Delivery <span class="text-brand">Food</span></h6>
                                <button class="btn btn-brand btn-sm" style="font-size: 0.7rem;">Order Now</button>
                            </div>
                            <img src="https://cdn-icons-png.flaticon.com/512/1048/1048329.png" width="50" alt="scooter">
                        </div>
                        <h6 class="fw-bold mb-3">Categories</h6>
                        <div class="d-flex gap-2 mb-4">
                            <span class="badge bg-brand rounded-pill px-3 py-2"><i class="fas fa-hamburger"></i> Burger</span>
                            <span class="badge bg-light text-dark rounded-pill px-3 py-2"><i class="fas fa-pizza-slice"></i> Pizza</span>
                        </div>
                        <h6 class="fw-bold mb-3">Popular Now</h6>
                        <div class="d-flex gap-3">
                            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" class="rounded-3 w-50" alt="burger">
                            <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop" class="rounded-3 w-50" alt="burger">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="bg-white py-5 mt-5 border-top">
        <div class="container">
            <div class="row gy-4">
                <div class="col-lg-4 pe-lg-5">
                    <a class="navbar-brand d-flex align-items-center mb-3" href="#">
                        <i class="fa-solid fa-utensils text-brand me-2 fs-3"></i>
                        <span class="fw-bold fs-4 text-dark">Fudo</span>
                    </a>
                    <p class="text-muted mb-4">
                        Our job is to filling your tummy with delicious food and with fast and free delivery.
                    </p>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-brand fs-5"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-brand fs-5"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-brand fs-5"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
                
                <div class="col-lg-2 col-md-4">
                    <h5 class="fw-bold mb-4">About</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">News</a></li>
                        <li><a href="#">Menu</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-2 col-md-4">
                    <h5 class="fw-bold mb-4">Company</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">Why Fudo?</a></li>
                        <li><a href="#">Partner With Us</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-2 col-md-4">
                    <h5 class="fw-bold mb-4">Support</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">Account</a></li>
                        <li><a href="#">Support Center</a></li>
                        <li><a href="#">Feedback</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div class="col-lg-2 col-md-12">
                    <h5 class="fw-bold mb-4">Get in Touch</h5>
                    <p class="text-muted mb-3">Question or feedback? We'd love to hear from you</p>
                    <div class="position-relative">
                        <input type="email" class="form-control newsletter-input bg-light border-0" placeholder="Email Address">
                        <button class="btn btn-brand newsletter-btn"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
