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

class CoachScheduleController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $coach = Coach::where('user_id', $user->id)->first();
        
        // Get current month for calendar
        $currentMonth = request('month', now()->month);
        $currentYear = request('year', now()->year);
        
        $schedules = collect();
        $classesInfo = [];
        $upcomingSchedules = collect();
        $stats = [
            'total_classes' => 0,
            'total_schedules' => 0,
            'completed' => 0,
            'upcoming' => 0,
        ];
        
        if ($coach) {
            // Get all class sessions for this coach
            $classSessions = ClassSession::where('coach_id', $coach->id)
                ->with(['course', 'schedule', 'enrolment'])
                ->get();
            
            $stats['total_classes'] = $classSessions->count();
             
            // Get all attendance records for this user (coach)
            $userAttendances = Attendance::where('user_id', $user->id)->get();
            
            // Get all schedules from coach's class sessions
            foreach ($classSessions as $classSession) {
                foreach ($classSession->schedule as $schedule) {
                    $attendanceStatus = $this->getAttendanceStatus($schedule, $userAttendances);
                    
                    $schedules->push([
                        'id' => $schedule->id,
                        'date' => $schedule->date,
                        'time' => $schedule->time,
                        'location' => $schedule->location,
                        'status' => $schedule->status,
                        'class_session' => [
                            'id' => $classSession->id,
                            'title' => $classSession->title,
                        ],
                        'course' => $classSession->course ? [
                            'title' => $classSession->course->title,
                            'total_meeting' => $classSession->course->total_meeting,
                        ] : null,
                        'total_students' => $classSession->enrolment->count(),
                        'attendance_status' => $attendanceStatus,
                    ]);
                    
                    // Count stats
                    if ($schedule->status === 'completed') {
                        $stats['completed']++;
                    } elseif (Carbon::parse($schedule->date)->gte(today())) {
                        $stats['upcoming']++;
                    }
                }
                
                // Collect class info for sidebar
                if ($classSession->course) {
                    $scheduleDays = $this->getScheduleDays($classSession->schedule);
                    $scheduleTime = $classSession->schedule->first() 
                        ? Carbon::parse($classSession->schedule->first()->time)->format('H:i') . ' - ' . 
                          Carbon::parse($classSession->schedule->first()->time)->addHour()->format('H:i')
                        : '-';
                    
                    $classesInfo[] = [
                        'class_title' => $classSession->title,
                        'course_title' => $classSession->course->title,
                        'total_students' => $classSession->enrolment->count(),
                        'capacity' => $classSession->capacity,
                        'schedule_days' => $scheduleDays,
                        'schedule_time' => $scheduleTime,
                        'location' => $classSession->schedule->first() 
                            ? $classSession->schedule->first()->location 
                            : '-',
                    ];
                }
            }
            
            $stats['total_schedules'] = $schedules->count();
            
            // Get upcoming schedules (from today onwards)
            $upcomingSchedules = $schedules
                ->filter(function ($schedule) {
                    return Carbon::parse($schedule['date'])->gte(today());
                })
                ->sortBy('date')
                ->take(5)
                ->values();
        }
        
        // Group schedules by date for calendar
        $schedulesByDate = $schedules->groupBy('date');
        
        return Inertia::render('coach/jadwal', [
            'schedulesByDate' => $schedulesByDate,
            'classesInfo' => array_slice($classesInfo, 0, 3), // Show max 3 classes in sidebar
            'upcomingSchedules' => $upcomingSchedules,
            'currentMonth' => $currentMonth,
            'currentYear' => $currentYear,
            'stats' => $stats,
        ]);
    }
    
    /**
     * Get real attendance status for a schedule
     * Coach attendance is NOT tied to class - just check if they scanned on that date
     */
    private function getAttendanceStatus($schedule, $userAttendances)
    {
        $scheduleDate = Carbon::parse($schedule->date);
        
        // Check if coach has any attendance record on this date (not tied to specific class)
        $hasAttendance = $userAttendances->first(function ($attendance) use ($scheduleDate) {
            $scanDate = Carbon::parse($attendance->scan_time)->toDateString();
            return $scanDate == $scheduleDate->toDateString();
        });
        
        if ($hasAttendance) {
            return 'present';
        }
        
        if ($schedule->status === 'completed') {
            return 'absent';
        }
        
        if ($schedule->status === 'cancelled') {
            return 'cancelled';
        }
        
        if ($schedule->status === 'on_going' || $scheduleDate->isToday()) {
            return 'on_going';
        }
        
        if ($scheduleDate->lt(today())) {
            return 'absent';
        }
        
        return 'scheduled';
    }
    
    /**
     * Get schedule days string
     */
    private function getScheduleDays($schedules)
    {
        $days = [];
        $dayNames = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];
        
        foreach ($schedules as $schedule) {
            $dayOfWeek = Carbon::parse($schedule->date)->dayOfWeek;
            if (!in_array($dayNames[$dayOfWeek], $days)) {
                $days[] = $dayNames[$dayOfWeek];
            }
        }
        
        return implode(' & ', array_slice($days, 0, 2));
    }
}
