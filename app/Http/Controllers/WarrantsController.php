<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request as HttpRequest;
use File;

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
        $warrant = Warrant::create($httpRequest->all());
        $path = storage_path('attachments/' . $warrant->id);
        File::makeDirectory($path);
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
     * Get warrants that need to be validated.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNonvalidatedWarrants() {
        $warrants = Warrant::whereNotNull('sent')->whereNull('quality_check')->get()->toArray();
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

    /**
     * Save files attached to a warrant. Deletes all of the previously stored files for that warrant.
     *
     * @param $warrantId
     * @param HttpRequest $httpRequest
     */
    public function postAttachments($warrantId, HttpRequest $httpRequest) {
        $files = $httpRequest->files->all();
        $path = storage_path('attachments/' . $warrantId);

        File::cleanDirectory($path);

        foreach ($files as $file) {
            $name = $file->getClientOriginalName();
            $file->move($path, $name);
        }
    }

    /**
     * Remove files attached to a warrant.
     *
     * @param $warrantId
     */
    public function deleteAttachments($warrantId) {
        $path = storage_path('attachments/' . $warrantId);
        File::cleanDirectory($path);
    }

    /**
     * Get all files attached to a warrant.
     *
     * @param $warrantId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAttachments($warrantId) {
        $path = storage_path('attachments/' . $warrantId);
        $filePaths = File::files($path);
        $files = array();

        foreach ($filePaths as $filePath) {
            $files[] = array(
                'name' => File::name($filePath) . '.' . File::extension($filePath),
                'size' => File::size($filePath)
            );
        }

        return response()->json($files);
    }

    /**
     * Download warrant's attachment.
     *
     * @param $warrantId
     * @param $name
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function downloadAttachment($warrantId, $name) {
        $path = storage_path('attachments/' . $warrantId . '/' . $name);
        return response()->download($path);
    }
}
