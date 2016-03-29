<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request as HttpRequest;

use App\Http\Requests;
use Tymon\JWTAuth\Exceptions\JWTException;
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
        $credentials = $httpRequest->only(['email', 'password']);

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'unauthorized'], 401);
            }
        } catch(JWTException $e) {
            return response()->json(['error' => 'internal_server_error'], 500);
        }

        return response()->json(compact('token'));
    }
}
