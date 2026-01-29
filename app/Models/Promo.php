<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'discount_type',
        'discount_value',
        'state',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
