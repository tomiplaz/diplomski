<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function index() {

    }

    public function authenticate(Request $request) {
        $credentials = $request->only(['email', 'password']);

        var_dump(JWTAuth::attempt($credentials));

        /*try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'unauthorized'], 401);
            }
        } catch(JWTException $e) {
            return response()->json(['error' => 'internal_server_error'], 500);
        }

        return response()->json(compact('token'));*/
    }
}
