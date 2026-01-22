<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\ClassSession;
use App\Models\EnrolmentCourse;

class Attendance extends Model
{
    protected $table = 'attendances';
    protected $fillable = [
        'user_id',
        'class_session_id',
        'scan_time',
        'enrolment_course_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classSession()
    {
        return $this->belongsTo(ClassSession::class);
    }

    public function enrolmentCourse()
    {
        return $this->belongsTo(EnrolmentCourse::class);
    }
}
