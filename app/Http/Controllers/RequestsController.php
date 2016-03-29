<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request as HttpRequest;

use App\Http\Requests;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

use App\Request as Request;

class RequestsController extends Controller
{
    /**
     * Get all requests.
     */
    public function getRequests() {
        $requests = Request::all()->toArray();
        return response()->json($requests);
    }

    /**
     * Get requests that need to be validated.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNonvalidatedRequests() {
        $requests = Request::whereNull('quality_check')->get()->toArray();
        return response()->json($requests);
    }

    /**
     * Get requests that need to be approved.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getApprovableRequests() {
        $requests = Request::where('quality_check', true)->whereNull('approved')->get()->toArray();
        return response()->json($requests);
    }

    /**
     * Create a new request.
     *
     * @param HttpRequest $httpRequest
     */
    public function createRequest(HttpRequest $httpRequest) {
        Request::create($httpRequest->all());
    }

    /**
     * Update request.
     *
     * @param $requestId
     * @param HttpRequest $httpRequest
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRequest($requestId, HttpRequest $httpRequest) {
        $request = Request::findOrFail($requestId);
        $request->update($httpRequest->all());

        return response()->json(Request::findOrFail($requestId));
    }

    /**
     * Get current user's requests.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserRequests() {
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

        $requests = $user->requests;
        return response()->json($requests);
    }
}
