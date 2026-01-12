<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'name',
        'description',
        'amount',
        'expense_category_id'
    ];

    public function expense_category()
    {
        return $this->belongsTo(ExpenseCategory::class);
    }
}
