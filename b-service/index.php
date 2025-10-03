<?php
$secret = getenv("SSO_SECRET") ?: "mysecret";

require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$token = $_COOKIE['token'] ?? null;

if (!$token) {
    echo '<p>anda belum login</p>';
    echo '<a href="https://login.azumidev.web.id/signin?callback=b.azumidev.web.id">Login</a>';
    exit;
}

try {
    $decoded = JWT::decode($token, new Key($secret, 'HS256'));
    echo "<p>Sudah login sebagai {$decoded->user_id}</p>";
    echo '<a href="https://login.azumidev.web.id/signout?callback=b.azumidev.web.id">Logout</a>';
} catch (Exception $e) {
    echo '<p>Token tidak valid</p>';
    echo '<a href="https://login.azumidev.web.id/signin?callback=b.azumidev.web.id">Login ulang</a>';
}
