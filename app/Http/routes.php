<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});

Route::group(['prefix' => 'api/v1'], function() {

    Route::group(['middleware' => 'jwt.auth'], function() {

        Route::group(['prefix' => 'requests'], function() {
            Route::get('/', 'MainController@getRequests');
            Route::post('/', 'MainController@createRequest');
            Route::get('nonvalidated', 'MainController@getRequestsNonvalidated');
            Route::get('approvable', 'MainController@getRequestsApprovable');
            Route::put('{requestId}', 'MainController@updateRequest');
        });

    });

    Route::post('auth', 'AuthController@authenticate');
    Route::get('auth/user', 'AuthController@getAuthenticatedUser');
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //
});
