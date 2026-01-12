<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
use App\Models\Coach;
use App\Models\EnrolmentCourse;
use App\Models\Schedule;

class ClassSession extends Model
{
    protected $fillable = [
        'title',
        'course_id',
        'coach_id',
        'total_student',
        'capacity',
    ];

    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function coach(){
        return $this->belongsTo(Coach::class);
    }

    public function enrolment(){
        return $this->hasMany(EnrolmentCourse::class);
    }

    public function schedule(){
        return $this->hasMany(Schedule::class);
    }
}
