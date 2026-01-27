<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\EnrolmentCourse;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'total_meeting',
        'weekly_meeting_count',
        'price',
        'state',
        'image',
        'created_at',
        'updated_at',
    ];

    public function enrolmentCourses(){
        return $this->hasMany(EnrolmentCourse::class);
    }
}
