<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ClassSession;

class Schedule extends Model
{
    protected $fillable = [
        'class_session_id',
        'date',
        'time',
        'location',
        'status'
    ];

    public function class_session()
    {
        return $this->belongsTo(ClassSession::class);
    }
}
