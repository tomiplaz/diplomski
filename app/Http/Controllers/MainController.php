<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\RequestN;

class MainController extends Controller
{
    /**
     * Get all N-type requests.
     */
    public function getRequestNs() {

    }

    /**
     * Create a new N-type request.
     *
     * @param Request $request
     */
    public function newRequestN(Request $request) {
        RequestN::create($request->all());
    }
}
