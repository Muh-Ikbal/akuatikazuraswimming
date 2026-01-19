<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Coach;

class CertificateCoach extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'coach_id',
    ];

    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }
}
