<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id_users,
                'username' => $user->username,
                'email' => $user->email,
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id_users,
                'username' => $request->user()->username,
                'email' => $request->user()->email,
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'username' => 'required|string|max:100|unique:users,username,' . $user->id_users . ',id_users',
            'email' => 'required|email|max:50|unique:users,email,' . $user->id_users . ',id_users',
            'password' => 'nullable|min:6',
        ]);

        $updateData = [
            'username' => $request->username,
            'email' => $request->email,
        ];

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id_users,
                'username' => $user->username,
                'email' => $user->email,
            ]
        ]);
    }
}