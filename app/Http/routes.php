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

    Route::post('auth', 'AuthController@authenticate');

    Route::group(['middleware' => 'jwt.auth'], function() {

        Route::group(['prefix' => 'users'], function() {
            Route::get('/', 'UsersController@getAuthenticatedUser');
            Route::post('/', 'UsersController@createUser');
        });

        Route::group(['prefix' => 'requests'], function() {
            Route::get('/', 'RequestsController@getRequests');
            Route::post('/', 'RequestsController@createRequest');
            Route::get('nonvalidated', 'RequestsController@getRequestsNonvalidated');
            Route::get('approvable', 'RequestsController@getRequestsApprovable');
            Route::get('user', 'RequestsController@getUserRequests');
            Route::put('{requestId}', 'RequestsController@updateRequest');
        });

    });
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
