<?php

namespace App\Models;

use App\Models\User;
use App\Models\ClassSession;
use App\Models\CertificateCoach;

use Illuminate\Database\Eloquent\Model;

class Coach extends Model
{
    protected $fillable = [
        'name',
        'phone_number',
        'birth_date',
        'address',
        'birthplace',
        'gender',
        'image',
        'user_id',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function class_sessions(){
        return $this->hasOne(ClassSession::class);
    }

    public function certificate_coaches(){
        return $this->hasMany(CertificateCoach::class);
    }
}
