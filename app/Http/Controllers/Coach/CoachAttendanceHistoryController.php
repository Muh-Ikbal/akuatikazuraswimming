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
        try {
            $user = auth()->user()->load('coach');
            $coach = $user->coach;
            
            $attendanceRecords = collect();
            $stats = [
                'total_present' => 0,
                'total_late' => 0,
                'total_alpha' => 0,
                'total_records' => 0,
            ];
            
            if ($coach) {
                $attendances = AttandanceEmployee::where('user_id', $user->id)
                    ->with('schedule.class_session')
                    ->orderBy('scan_time', 'desc')
                    ->get();
                
                $stats['total_records'] = $attendances->count();
                $stats['total_present'] = $attendances->where('state', 'present')->count();
                $stats['total_late'] = $attendances->where('state', 'late')->count();
                $stats['total_alpha'] = $attendances->where('state', 'alpha')->count();
                
                foreach ($attendances as $attendance) {
                    $schedule = $attendance->schedule;

                    $attendanceRecords->push([
                        'id' => $attendance->id,
                        'date' => $schedule?->date ?? ($attendance->scan_time ? Carbon::parse($attendance->scan_time)->toDateString() : null),
                        'scheduled_time' => $schedule?->time ? Carbon::parse($schedule->time)->format('H:i') : '-',
                        'check_in_time' => $attendance->scan_time ? Carbon::parse($attendance->scan_time)->format('H:i:s') : null,
                        'class_title' => $schedule?->class_session?->title ?? '-',
                        'location' => $schedule?->location ?? '-',
                        'state' => $attendance->state,
                        'status' => match($attendance->state) {
                            'present' => 'Tepat Waktu',
                            'late' => 'Terlambat',
                            'alpha' => 'Alpa',
                            default => '-'
                        },
                    ]);
                }
            }
            
            return Inertia::render('coach/riwayat-absensi', [
                'attendanceRecords' => $attendanceRecords,
                'stats' => $stats,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}

