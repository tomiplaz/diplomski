<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request as HttpRequest;

use App\Http\Requests;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

use App\Warrant as Warrant;

class WarrantsController extends Controller
{
    /**
     * Get all warrants.
     */
    public function getWarrants() {
        $warrants = Warrant::all()->toArray();
        return response()->json($warrants);
    }

    /**
     * Create a new warrant.
     *
     * @param HttpRequest $httpRequest
     */
    public function createWarrant(HttpRequest $httpRequest) {
        Warrant::create($httpRequest->all());
    }

    /**
     * Get current user's pending warrants.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserPendingWarrants() {
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

        $warrants = $user->warrants()->whereNull('sent')->get();
        return response()->json($warrants);
    }

    /**
     * Get current user's sent warrants.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserSentWarrants() {
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

        $warrants = $user->warrants()->whereNotNull('sent')->get();
        return response()->json($warrants);
    }

    /**
     * Update warrant.
     *
     * @param $warrantId
     * @param HttpRequest $httpRequest
     */
    public function updateWarrant($warrantId, HttpRequest $httpRequest) {
        $warrant = Warrant::findOrFail($warrantId);
        $warrant->update($httpRequest->all());
    }
}
