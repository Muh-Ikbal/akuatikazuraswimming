<?php

namespace App\Models;

use App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Coach extends Model
{
    protected $fillable = [
        'name',
        'phone_number',
        'birth_date',
        'gender',
        'image',
        'user_id',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
