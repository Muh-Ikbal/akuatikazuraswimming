<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Coach;
use App\Models\ClassSession;
use App\Models\Schedule;
use App\Models\AttandanceEmployee;
use Carbon\Carbon;

class CoachScheduleController extends Controller
{
    public function index()
    {
        try {
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
                // Get all schedules for this coach (coach is now linked to schedules, not class_sessions)
                $coachSchedules = Schedule::where('coach_id', $coach->id)
                    ->with(['class_session.enrolment'])
                    ->get();
                
                // Get unique class sessions from schedules
                $classSessionIds = $coachSchedules->pluck('class_session_id')->unique()->filter();
                $classSessions = ClassSession::whereIn('id', $classSessionIds)
                    ->with(['enrolment'])
                    ->get();
                
                $stats['total_classes'] = $classSessions->count();
                 
                // Get all attendance records for this user (coach) using AttandanceEmployee
                $userAttendances = AttandanceEmployee::where('user_id', $user->id)
                    ->whereIn('schedule_id', $coachSchedules->pluck('id'))
                    ->get();
                
                // Get all schedules from coach's schedules
                foreach ($coachSchedules as $schedule) {
                    $classSession = $schedule->class_session;
                    $attendanceStatus = $this->getAttendanceStatus($schedule, $userAttendances);
                    
                    $schedules->push([
                        'id' => $schedule->id,
                        'date' => $schedule->date,
                        'time' => $schedule->time,
                        'end_time' => $schedule->end_time,
                        'location' => $schedule->location,
                        'status' => $schedule->status,
                        'class_session' => $classSession ? [
                            'id' => $classSession->id,
                            'title' => $classSession->title,
                        ] : null,
                        'total_students' => $classSession ? $classSession->enrolment->count() : 0,
                        'attendance_status' => $attendanceStatus,
                    ]);
                    
                    // Count stats
                    if ($schedule->status === 'completed') {
                        $stats['completed']++;
                    } elseif (Carbon::parse($schedule->date)->gte(today())) {
                        $stats['upcoming']++;
                    }
                }
                
                // Collect class info for sidebar from unique class sessions
                foreach ($classSessions as $classSession) {
                    // Get schedules for this class session
                    $classSchedules = $coachSchedules->where('class_session_id', $classSession->id);
                    $scheduleDays = $this->getScheduleDays($classSchedules);
                    $firstSchedule = $classSchedules->first();
                    $scheduleTime = $firstSchedule 
                        ? Carbon::parse($firstSchedule->time)->format('H:i') . ' - ' . 
                          ($firstSchedule->end_time ? Carbon::parse($firstSchedule->end_time)->format('H:i') : Carbon::parse($firstSchedule->time)->addHour()->format('H:i'))
                        : '-';
                    
                    $classesInfo[] = [
                        'class_title' => $classSession->title,
                        'total_students' => $classSession->enrolment->count(),
                        'capacity' => $classSession->capacity,
                        'schedule_days' => $scheduleDays,
                        'schedule_time' => $scheduleTime,
                        'location' => $firstSchedule ? $firstSchedule->location : '-',
                    ];
                }
                
                $stats['total_schedules'] = $schedules->count();
                
                // Get upcoming schedules (from today onwards)
                $upcomingSchedules = $schedules
                    ->filter(function ($schedule) {
                        return Carbon::parse($schedule['date'])->gte(today()) 
                            && in_array($schedule['status'], ['published', 'on_going']);
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
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
    
    /**
     * Get real attendance status for a schedule
     * Matches AttandanceEmployee record by schedule_id
     */
    private function getAttendanceStatus($schedule, $userAttendances)
    {
        $scheduleDate = Carbon::parse($schedule->date);

        // Check if coach has an attendance record for this specific schedule
        $hasAttendance = $userAttendances->first(function ($attendance) use ($schedule) {
            return $attendance->schedule_id == $schedule->id;
        });
        
        if ($hasAttendance) {
            // Return 'alpha' if state is alpha, otherwise the state (present/late)
            return $hasAttendance->state;
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
