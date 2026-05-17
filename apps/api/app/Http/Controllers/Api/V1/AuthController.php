<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $admin = Admin::query()->where('email', $credentials['identity'])->first();

        if (! $admin || ! Hash::check($credentials['password'], $admin->password)) {
            throw ValidationException::withMessages([
                'identity' => ['Invalid login credentials.'],
            ]);
        }

        $token = $admin->createToken('admin-api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'record' => new AdminResource($admin),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'record' => new AdminResource($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }
}
