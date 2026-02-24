<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'name',
        'description',
        'amount',
        'expense_category_id',
        'date'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function expense_category()
    {
        return $this->belongsTo(ExpenseCategory::class);
    }
}
