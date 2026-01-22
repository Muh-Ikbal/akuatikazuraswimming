<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Member;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Attendance;

class EnrolmentCourse extends Model
{
    protected $fillable=[
        'member_id',
        'class_session_id',
        'course_id',
        'state'
    ];

    public function member(){
        return $this->belongsTo(Member::class);
    }

    public function class_session(){
        return $this->belongsTo(ClassSession::class);
    }

    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function payment(){
        return $this->hasOne(Payment::class);
    }

    public function attendance(){
        return $this->hasMany(Attendance::class);

    }   
}
