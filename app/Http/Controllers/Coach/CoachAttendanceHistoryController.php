<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Coach;
use App\Models\AttandanceEmployee;
use Carbon\Carbon;

class CoachAttendanceHistoryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $coach = Coach::where('user_id', $user->id)->first();
        
        $attendanceRecords = collect();
        $stats = [
            'total_present' => 0,
            'total_late' => 0,
            'total_records' => 0,
        ];
        
        if ($coach) {
            // Get all attendance records for this coach/user from attandance_employees table
            $attendances = AttandanceEmployee::where('user_id', $user->id)
                ->orderBy('scan_time', 'desc')
                ->get();
            
            $stats['total_records'] = $attendances->count();
            $stats['total_present'] = $attendances->where('state', 'present')->count();
            $stats['total_late'] = $attendances->where('state', 'late')->count();
            
            // Each record is a separate attendance entry
            foreach ($attendances as $attendance) {
                $attendanceRecords->push([
                    'id' => $attendance->id,
                    'date' => Carbon::parse($attendance->scan_time)->toDateString(),
                    'check_in_time' => Carbon::parse($attendance->scan_time)->format('H:i:s'),
                    'state' => $attendance->state,
                    'status' => $attendance->state === 'present' ? 'Tepat Waktu' : 'Terlambat',
                ]);
            }
        }
        
        return Inertia::render('coach/riwayat-absensi', [
            'attendanceRecords' => $attendanceRecords,
            'stats' => $stats,
        ]);
    }
}
