<?php
require_once __DIR__ . '/../config/db.php';

$_SESSION = [];
session_destroy();

session_start();
redirect(url('admin/login.php'));
