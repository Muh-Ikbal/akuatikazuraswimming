<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\EnrolmentCourse;
use App\Models\Schedule;
use Carbon\Carbon;

class MemberScheduleController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $member = $user->member;
        
        // Get current month for calendar
        $currentMonth = request('month', now()->month);
        $currentYear = request('year', now()->year);
        
        // Get enrolled courses for this member
        $enrolments = [];
        $schedules = collect();
        $courseInfo = null;
        $upcomingSchedules = collect();
        
        if ($member) {
            $enrolments = EnrolmentCourse::where('member_id', $member->id)
                ->with(['class_session.course', 'class_session.coach', 'class_session.schedule'])
                ->get();
            
            // Get all schedules from enrolled class sessions
            foreach ($enrolments as $enrolment) {
                if ($enrolment->class_session) {
                    $classSchedules = $enrolment->class_session->schedule;
                    foreach ($classSchedules as $schedule) {
                        $schedules->push([
                            'id' => $schedule->id,
                            'date' => $schedule->date,
                            'time' => $schedule->time,
                            'location' => $schedule->location,
                            'status' => $schedule->status,
                            'class_session' => $enrolment->class_session,
                            'course' => $enrolment->class_session->course,
                            'coach' => $enrolment->class_session->coach,
                            // Dummy attendance status for now
                            // Will be replaced with actual attendance data later
                            'attendance_status' => $this->getDummyAttendanceStatus($schedule),
                        ]);
                    }
                    
                    // Get first enrolled course info for sidebar
                    if (!$courseInfo && $enrolment->class_session->course) {
                        $course = $enrolment->class_session->course;
                        $coach = $enrolment->class_session->coach;
                        $classSession = $enrolment->class_session;
                        
                        // Get schedule days (e.g., "Selasa & Kamis")
                        $scheduleDays = $this->getScheduleDays($classSession->schedule);
                        $scheduleTime = $classSession->schedule->first() 
                            ? Carbon::parse($classSession->schedule->first()->time)->format('H:i') . ' - ' . 
                              Carbon::parse($classSession->schedule->first()->time)->addHour()->format('H:i')
                            : '-';
                        
                        $courseInfo = [
                            'title' => $course->title,
                            'state' => $enrolment->state,
                            'coach_name' => $coach ? $coach->name : '-',
                            'schedule_days' => $scheduleDays,
                            'schedule_time' => $scheduleTime,
                            'location' => $classSession->schedule->first() 
                                ? $classSession->schedule->first()->location 
                                : '-',
                            'total_meeting' => $course->total_meeting,
                            'class_title' => $classSession->title,
                        ];
                    }
                }
            }
            
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
        
        return Inertia::render('member/jadwal', [
            'schedulesByDate' => $schedulesByDate,
            'courseInfo' => $courseInfo,
            'upcomingSchedules' => $upcomingSchedules,
            'currentMonth' => $currentMonth,
            'currentYear' => $currentYear,
            'totalSchedules' => $schedules->count(),
        ]);
    }
    
    /**
     * Get dummy attendance status for a schedule
     * This will be replaced with actual attendance data later
     */
    private function getDummyAttendanceStatus($schedule)
    {
        // Based on schedule status
        if ($schedule->status === 'completed') {
            // Randomly mark as present or absent for demo
            return rand(0, 1) ? 'present' : 'absent';
        }
        
        if ($schedule->status === 'cancelled') {
            return 'cancelled';
        }
        
        if ($schedule->status === 'on_going') {
            return 'on_going';
        }
        
        // Future schedules
        return 'scheduled';
    }
    
    /**
     * Get schedule days string (e.g., "Selasa & Kamis")
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
