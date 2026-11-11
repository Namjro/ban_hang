<?php

namespace App\Services;

use App\Models\User;

class AuthService
{
    /**
     * Attempt login with credentials and return JWT token or null.
     */
    public function attemptLogin(array $credentials): ?string
    {
        $token = auth('api')->attempt($credentials);

        return $token ?: null;
    }

    /**
     * Get the authenticated user.
     */
    public function getCurrentUser(): ?User
    {
        /** @var User|null $user */
        $user = auth('api')->user();

        return $user;
    }

    /**
     * Invalidate the current token.
     */
    public function logout(): void
    {
        auth('api')->logout();
    }

    /**
     * Refresh current token.
     */
    public function refreshToken(): string
    {
        return auth('api')->refresh();
    }

    /**
     * Build standard token response payload.
     */
    public function buildTokenPayload(string $token): array
    {
        /** @var User $user */
        $user = auth('api')->user();

        return [
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role ?? 'admin',
            ],
        ];
    }
}
