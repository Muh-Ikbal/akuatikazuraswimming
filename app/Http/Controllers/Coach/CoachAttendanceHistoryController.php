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
            
            // Group by date to show check-in and check-out
            $groupedByDate = $attendances->groupBy(function ($attendance) {
                return Carbon::parse($attendance->scan_time)->toDateString();
            });
            
            foreach ($groupedByDate as $date => $records) {
                $checkIn = $records->first(); // First scan = check-in
                $checkOut = $records->count() > 1 ? $records->last() : null; // Second scan = check-out
                
                $attendanceRecords->push([
                    'id' => $checkIn->id,
                    'date' => $date,
                    'check_in_time' => Carbon::parse($checkIn->scan_time)->format('H:i:s'),
                    'check_out_time' => $checkOut ? Carbon::parse($checkOut->scan_time)->format('H:i:s') : null,
                    'state' => $checkIn->state,
                    'status' => $checkIn->state === 'present' ? 'Tepat Waktu' : 'Terlambat',
                ]);
            }
        }
        
        return Inertia::render('coach/riwayat-absensi', [
            'attendanceRecords' => $attendanceRecords,
            'stats' => $stats,
        ]);
    }
}
