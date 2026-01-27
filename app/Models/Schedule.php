<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ClassSession;
use App\Models\Coach;
use App\Models\Attendance;
use App\Models\AttandanceEmployee;

class Schedule extends Model
{
    protected $fillable = [
        'class_session_id',
        'date',
        'time',
        'end_time',
        'location',
        'status',
        'coach_id'
    ];

    public function class_session()
    {
        return $this->belongsTo(ClassSession::class);
    }

    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function attendanceEmployee()
    {
        return $this->hasMany(AttandanceEmployee::class);
    }
}
