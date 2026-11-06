@echo off
title AXIOM Industrial Supply - Khoi dong he thong

echo ========================================================
echo   AXIOM INDUSTRIAL SUPPLY - KHOI DONG HE THONG
echo   Next.js 15 + Laravel 12 (PHP 8.2.35) + JWT CMS
echo ========================================================
echo.

if not exist "%~dp0backend" (
    echo [LOI] Khong tim thay thu muc backend!
    pause
    exit /b 1
)

if not exist "%~dp0frontend" (
    echo [LOI] Khong tim thay thu muc frontend!
    pause
    exit /b 1
)

echo [1/3] Dang khoi dong Backend Laravel 12 API tai http://127.0.0.1:8000...
start "AXIOM-Backend" cmd /k "cd /d ""%~dp0backend"" && php artisan serve --port=8000"

echo [2/3] Dang khoi dong Frontend Next.js 15 tai http://localhost:3000...
start "AXIOM-Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo [3/3] Dang cho server khoi dong...
ping 127.0.0.1 -n 4 >nul

echo.
echo ========================================================
echo   HE THONG DA KHOI DONG THANH CONG!
echo ========================================================
echo.
echo   * Landing Page Public:   http://localhost:3000
echo   * Danh muc San pham:     http://localhost:3000/products
echo   * CMS Quan tri:          http://localhost:3000/admin/login
echo   * Backend REST API:      http://127.0.0.1:8000/api
echo.
echo   ------------------------------------------------------
echo   TAI KHOAN DANG NHAP CMS QUAN TRI:
echo   - Email:    admin@axiom.vn
echo   - Mat khau: Password@123
echo   ------------------------------------------------------
echo.
echo Dang mo trinh duyet...
start http://localhost:3000

echo.
echo Nhan phim bat ky de dong cua so nay (he thong van tiep tuc chay).
pause
