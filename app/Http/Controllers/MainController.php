<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request as HttpRequest;

use App\Http\Requests;

use App\Request as Request;

class MainController extends Controller
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
    public function getRequestsNonvalidated() {
        $requests = Request::where('quality_check', null)->get()->toArray();
        return response()->json($requests);
    }

    /**
     * Get requests that need to be approved.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRequestsApprovable() {
        $requests = Request::where('quality_check', true)->get()->toArray();
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
     */
    public function updateRequest($requestId, HttpRequest $httpRequest) {
        $request = Request::findOrFail($requestId);
        $request->update($httpRequest->all());
    }
}
