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
     * Create a new request.
     *
     * @param HttpRequest $request
     */
    public function newRequest(HttpRequest $request) {
        Request::create($request->all());
    }
}
