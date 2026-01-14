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

class MemberAttendanceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $member = $user->member;
        
        if (!$member) {
            return redirect()->route('dashboard')->with('error', 'Member data not found');
        }
        
        // Get enrolled courses for this member
        $enrolments = EnrolmentCourse::where('member_id', $member->id)
            ->with(['class_session.course', 'class_session.schedule'])
            ->get();
        
        // Get all user attendances
        $userAttendances = Attendance::where('user_id', $user->id)
            ->with('classSession')
            ->get();
        
        // Collect all schedules from enrolled courses
        $allSchedules = collect();
        foreach ($enrolments as $enrolment) {
            if ($enrolment->class_session) {
                $schedules = $enrolment->class_session->schedule;
                foreach ($schedules as $schedule) {
                    $allSchedules->push([
                        'id' => $schedule->id,
                        'date' => $schedule->date,
                        'time' => $schedule->time,
                        'location' => $schedule->location,
                        'status' => $schedule->status,
                        'class_session_id' => $enrolment->class_session->id,
                        'course_title' => $enrolment->class_session->course->title,
                    ]);
                }
            }
        }
        
        // Filter only completed or past schedules for statistics
        $completedSchedules = $allSchedules->filter(function ($schedule) {
            $scheduleDate = Carbon::parse($schedule['date']);
            return $schedule['status'] === 'completed' || $scheduleDate->lt(today());
        });
        
        // Calculate statistics
        $totalMeetings = $completedSchedules->count();
        
        // Count present (has attendance record)
        $presentCount = 0;
        $absentCount = 0;
        
        // Build detailed attendance list
        $detailedAttendance = [];
        $meetingNumber = 1;
        
        foreach ($completedSchedules->sortBy('date') as $schedule) {
            $scheduleDate = Carbon::parse($schedule['date']);
            
            // Check if user has attendance for this schedule
            $attendance = $userAttendances->first(function ($att) use ($schedule, $scheduleDate) {
                $scanDate = Carbon::parse($att->scan_time)->toDateString();
                return $att->class_session_id == $schedule['class_session_id'] 
                    && $scanDate == $scheduleDate->toDateString();
            });
            
            $isPresent = $attendance !== null;
            
            if ($isPresent) {
                $presentCount++;
            } else {
                $absentCount++;
            }
            
            $detailedAttendance[] = [
                'meeting_number' => $meetingNumber,
                'date' => $schedule['date'],
                'time' => $schedule['time'],
                'location' => $schedule['location'],
                'status' => $isPresent ? 'present' : 'absent',
                'scan_time' => $attendance ? Carbon::parse($attendance->scan_time)->format('H:i') : null,
                'course_title' => $schedule['course_title'],
            ];
            
            $meetingNumber++;
        }
        
        // Calculate attendance percentage
        $attendancePercentage = $totalMeetings > 0 
            ? round(($presentCount / $totalMeetings) * 100) 
            : 0;
        
        // Count remaining (future) meetings
        $remainingMeetings = $allSchedules->filter(function ($schedule) {
            $scheduleDate = Carbon::parse($schedule['date']);
            return $scheduleDate->gte(today()) && $schedule['status'] !== 'completed';
        })->count();
        
        return Inertia::render('member/riwayat-absensi', [
            'statistics' => [
                'total' => $totalMeetings,
                'present' => $presentCount,
                'absent' => $absentCount,
                'percentage' => $attendancePercentage,
                'remaining' => $remainingMeetings,
            ],
            'detailedAttendance' => $detailedAttendance,
        ]);
    }
}
