<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Schedule;
use App\Models\EmployeeAttendanceSession;

class AttandanceEmployee extends Model
{
    protected $fillable = [
        'user_id',
        'scan_time',
        'schedule_id',
        'employee_attendance_session_id',
        'state',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function employeeAttendanceSession()
    {
        return $this->belongsTo(EmployeeAttendanceSession::class);
    }
}
