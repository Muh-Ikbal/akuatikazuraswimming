<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AttandanceEmployee;


class EmployeeAttendanceSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'late_threshold',
        'alpha_threshold',
    ];

    public function attendanceEmployee()
    {
        return $this->hasMany(AttandanceEmployee::class);
    }
}
