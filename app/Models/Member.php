<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\EnrolmentCourse;

class Member extends Model
{
    protected $fillable = [
        'name',
        'birth_date',
        'gender',
        'address',
        'phone_number',
        'parent_name',
        'parent_phone_number',
        'user_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function enrolments(){
        return $this->hasMany(EnrolmentCourse::class);
    }
}



