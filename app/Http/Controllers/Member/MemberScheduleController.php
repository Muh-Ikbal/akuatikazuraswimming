<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\EnrolmentCourse;
use App\Models\Schedule;
use App\Models\Attendance;
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
        
        // Get all attendance records for this user
        $userAttendances = Attendance::where('user_id', $user->id)->get();
        
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
                            'class_session_id' => $enrolment->class_session->id,
                            'course' => $enrolment->class_session->course,
                            'coach' => $enrolment->class_session->coach,
                            // Real attendance status from database
                            'attendance_status' => $this->getAttendanceStatus(
                                $schedule, 
                                $enrolment->class_session->id,
                                $userAttendances
                            ),
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
     * Get real attendance status for a schedule
     * Checks attendance table for user presence
     */
    private function getAttendanceStatus($schedule, $classSessionId, $userAttendances)
    {
        // Check if user has attendance record for this class session on this date
        $scheduleDateString = Carbon::parse($schedule->date)->format('Y-m-d');
        $scheduleDate = Carbon::parse($schedule->date)->startOfDay();
        $today = Carbon::today();
        
        $hasAttendance = $userAttendances->first(function ($attendance) use ($classSessionId, $scheduleDateString) {
            $scanDateString = Carbon::parse($attendance->scan_time)->format('Y-m-d');
            return $attendance->class_session_id == $classSessionId && $scanDateString === $scheduleDateString;
        });
        
        // If has attendance record → present (green)
        if ($hasAttendance) {
            return 'present';
        }
        
        // If schedule is completed but no attendance → absent (red)
        if ($schedule->status === 'completed') {
            return 'absent';
        }
        
        // If schedule is cancelled
        if ($schedule->status === 'cancelled') {
            return 'cancelled';
        }
        
        // If schedule is today or on_going
        if ($schedule->status === 'on_going' || $scheduleDate->eq($today)) {
            return 'on_going';
        }
        
        // If schedule is in the past but not completed yet (might be missed data)
        if ($scheduleDate->lt($today)) {
            return 'absent';
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
