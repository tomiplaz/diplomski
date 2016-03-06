<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RequestN extends Model
{
    protected $guarded = [
        'id', 'created_at', 'updated_at',
        'quality_check', 'quality_check_timestamp',
        'approved', 'approved_timestamp'
    ];
}
