<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Get a JWT via given credentials.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (!$token = $this->authService->attemptLogin($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác.',
            ], 401);
        }

        return response()->json(array_merge(
            ['success' => true],
            $this->authService->buildTokenPayload($token)
        ));
    }

    /**
     * Get the authenticated User.
     */
    public function me(): JsonResponse
    {
        $user = $this->authService->getCurrentUser();

        return response()->json([
            'success' => true,
            'user'    => $user ? new UserResource($user) : null,
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công.',
        ]);
    }

    /**
     * Refresh a token.
     */
    public function refresh(): JsonResponse
    {
        $token = $this->authService->refreshToken();

        return response()->json(array_merge(
            ['success' => true],
            $this->authService->buildTokenPayload($token)
        ));
    }
}
