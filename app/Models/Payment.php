<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\EnrolmentCourse;

class Payment extends Model
{
    protected $fillable = [
        'enrolment_course_id',
        'amount',
        'payment_method',
        'state'
    ];

    public function enrolment_course(){
        return $this->belongsTo(EnrolmentCourse::class);
    }
}
