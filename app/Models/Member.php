<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}



