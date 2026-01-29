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
        'amount_paid',
        'state',
        'promo_id',
        'discount_amount',
        'notes',
    ];

    public function enrolment_course(){
        return $this->belongsTo(EnrolmentCourse::class);
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }
}
