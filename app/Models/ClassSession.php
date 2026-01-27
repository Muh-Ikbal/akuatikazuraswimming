<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
use App\Models\EnrolmentCourse;
use App\Models\Schedule;

class ClassSession extends Model
{
    protected $fillable = [
        'title',
        'capacity',
    ];

    

    public function enrolment(){
        return $this->hasMany(EnrolmentCourse::class);
    }

    public function schedule(){
        return $this->hasMany(Schedule::class);
    }
}
