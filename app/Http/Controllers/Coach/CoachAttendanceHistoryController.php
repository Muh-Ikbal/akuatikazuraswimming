<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Coach;
use App\Models\ClassSession;
use App\Models\Schedule;
use App\Models\Attendance;
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
            'total_absent' => 0,
            'total_schedules' => 0,
            'attendance_rate' => 0,
        ];
        
        if ($coach) {
            // Get all attendance records for this coach/user
            $userAttendances = Attendance::where('user_id', $user->id)
                ->orderBy('scan_time', 'desc')
                ->get();
            
            // Get all class sessions for this coach
            $classSessions = ClassSession::where('coach_id', $coach->id)
                ->with(['course', 'schedule'])
                ->get();

            
            // Map attendance dates for quick lookup
            $attendanceDates = $userAttendances->map(function ($attendance) {
                return Carbon::parse($attendance->scan_time)->toDateString();
            })->unique()->values()->toArray();
            
            // Build attendance records from schedules
            foreach ($classSessions as $classSession) {
                foreach ($classSession->schedule as $schedule) {
                    $scheduleDate = Carbon::parse($schedule->date);
                    
                    // Only include past and today's schedules
                    if ($scheduleDate->lte(today())) {
                        $isPresent = in_array($scheduleDate->toDateString(), $attendanceDates);
                        
                        // Find the attendance record for this date
                        $attendanceRecord = $userAttendances->first(function ($att) use ($scheduleDate) {
                            return Carbon::parse($att->scan_time)->toDateString() === $scheduleDate->toDateString();
                        });
                        
                        $attendanceRecords->push([
                            'id' => $schedule->id,
                            'date' => $schedule->date,
                            'time' => $schedule->time,
                            'location' => $schedule->location,
                            'class_title' => $classSession->title,
                            'course_title' => $classSession->course ? $classSession->course->title : '-',
                            'status' => $isPresent ? 'present' : ($schedule->status === 'cancelled' ? 'cancelled' : 'absent'),
                            'scan_time' => $attendanceRecord ? Carbon::parse($attendanceRecord->scan_time)->format('H:i:s') : null,
                        ]);
                        
                        $stats['total_schedules']++;
                        if ($isPresent) {
                            $stats['total_present']++;
                        } elseif ($schedule->status !== 'cancelled') {
                            $stats['total_absent']++;
                        }
                    }
                }
            }
            
            // Calculate attendance rate
            $stats['attendance_rate'] = $stats['total_schedules'] > 0 
                ? round(($stats['total_present'] / $stats['total_schedules']) * 100, 1)
                : 0;
            
            // Sort by date descending
            $attendanceRecords = $attendanceRecords->sortByDesc('date')->values();
        }
        
        return Inertia::render('coach/riwayat-absensi', [
            'attendanceRecords' => $attendanceRecords,
            'stats' => $stats,
        ]);
    }
}
