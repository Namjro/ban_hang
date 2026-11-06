# Script khoi dong project AXIOM Industrial Supply (Next.js + Laravel 12)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   AXIOM INDUSTRIAL SUPPLY - KHỞI ĐỘNG HỆ THỐNG" -ForegroundColor Yellow
Write-Host "   Next.js 15 + Laravel 12 (PHP 8.2.35) + JWT CMS" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot

if (-not (Test-Path "$rootPath\backend") -or -not (Test-Path "$rootPath\frontend")) {
    Write-Host "[LỖI] Không tìm thấy thư mục backend hoặc frontend!" -ForegroundColor Red
    exit 1
}

Write-Host "[1/3] Đang khởi động Backend Laravel 12 (Port 8000)..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootPath\backend`" && php artisan serve --port=8000" -WindowStyle Normal

Write-Host "[2/3] Đang khởi động Frontend Next.js 15 (Port 3000)..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootPath\frontend`" && npm run dev" -WindowStyle Normal

Write-Host "[3/3] Đang chờ server sẵn sàng (3 giây)..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   HỆ THỐNG ĐÃ KHỞI ĐỘNG THÀNH CÔNG!" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ► Landing Page Public:   http://localhost:3000" -ForegroundColor White
Write-Host "  ► Danh mục Sản phẩm:     http://localhost:3000/products" -ForegroundColor White
Write-Host "  ► CMS Quản trị:          http://localhost:3000/admin/login" -ForegroundColor Yellow
Write-Host "  ► Backend REST API:      http://127.0.0.1:8000/api" -ForegroundColor Gray
Write-Host ""
Write-Host "  ------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  TÀI KHOẢN ĐĂNG NHẬP CMS QUẢN TRỊ:" -ForegroundColor Cyan
Write-Host "  - Email:    admin@axiom.vn" -ForegroundColor White
Write-Host "  - Mật khẩu: Password@123" -ForegroundColor White
Write-Host "  ------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "Đang mở trình duyệt..." -ForegroundColor Green
Start-Process "http://localhost:3000"
