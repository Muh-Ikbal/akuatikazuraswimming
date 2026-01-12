<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QrCodeGenerate extends Model
{
    protected $table = 'qr_codes';
    protected $fillable = [
        'qr_code',
        'qr_code_path',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
