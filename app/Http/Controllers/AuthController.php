<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request as HttpRequest;

use App\Http\Requests;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Authenticate user by checking credentials and returning a token.
     *
     * @param HttpRequest $httpRequest
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticate(HttpRequest $httpRequest) {
        $credentials = $httpRequest->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'unauthorized'], 401);
            }
        } catch(JWTException $e) {
            return response()->json(['error' => 'internal_server_error'], 500);
        }

        return response()->json(compact('token'));
    }

    /**
     * Get user's data based on a provided token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuthenticatedUser() {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'user_not_found'], 404);
            }
        } catch(TokenExpiredException $e) {
            return response()->json(['error' => 'token_expired'], $e->getStatusCode());
        } catch(TokenInvalidException $e) {
            return response()->json(['error' => 'token_invalid'], $e->getStatusCode());
        } catch(JWTException $e) {
            return response()->json(['error' => 'token_missing'], $e->getStatusCode());
        }

        return response()->json(compact('user'));
    }

    /**
     * Create new user.
     *
     * @param HttpRequest $httpRequest
     */
    public function createUser(HttpRequest $httpRequest) {
        User::create($httpRequest->all());
    }
}
