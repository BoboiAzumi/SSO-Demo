<?php
$secret = getenv("SSO_SECRET") ?: "mysecret";

require 'vendor/autoload.php'; // firebase/php-jwt
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$token = $_COOKIE['token'] ?? null;

function renderPage($content) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>SSO PHP Service</title>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
                background: #f8f9fa;
            }
            .card {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                text-align: center;
            }
            .btn {
                display: inline-block;
                margin-top: 1rem;
                padding: 0.6rem 1.2rem;
                background: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 6px;
            }
            .btn:hover {
                background: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class='card'>
            $content
        </div>
    </body>
    </html>";
}

if (!$token) {
    renderPage("
        <p>Anda belum login</p>
        <a href='https://login.azumidev.web.id/signin?callback=b.azumidev.web.id' class='btn'>Login</a>
    ");
    exit;
}

try {
    $decoded = JWT::decode($token, new Key($secret, 'HS256'));
    renderPage("
        <p>Sudah login sebagai <b>{$decoded->user_id}</b></p>
        <a href='https://login.azumidev.web.id/signout?callback=b.azumidev.web.id' class='btn'>Logout</a>
    ");
} catch (Exception $e) {
    renderPage("
        <p>Token tidak valid</p>
        <a href='https://login.azumidev.web.id/signin?callback=b.azumidev.web.id' class='btn'>Login ulang</a>
    ");
}
