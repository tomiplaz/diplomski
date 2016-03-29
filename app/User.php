<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type', 'name', 'surname', 'email', 'password'
    ];

    /**
     * Encrypts and sets user's password.
     *
     * @param $password
     */
    public function setPasswordAttribute($password) {
        $this->attributes['password'] = bcrypt($password);
    }

    /**
     * User can have many requests.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function requests() {
        return $this->hasMany('App\Request');
    }

    /**
     * User can have many warrants.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function warrants() {
        return $this->hasMany('App\Warrant');
    }
}
