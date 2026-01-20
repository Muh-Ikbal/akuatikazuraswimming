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
        
        // Set Carbon timezone
        $today = Carbon::today();
        
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
            if ($enrolment->class_session && $enrolment->class_session->schedule) {
                $schedules = $enrolment->class_session->schedule;
                foreach ($schedules as $schedule) {
                    $allSchedules->push([
                        'id' => $schedule->id,
                        'date' => $schedule->date,
                        'time' => $schedule->time,
                        'location' => $schedule->location,
                        'status' => $schedule->status,
                        'class_session_id' => $enrolment->class_session->id,
                        'course_title' => $enrolment->class_session->course->title ?? '-',
                    ]);
                }
            }
        }
        
        // Calculate statistics - schedule yang sudah lewat ATAU sudah ada attendance
        $presentCount = 0;
        $absentCount = 0;
        
        foreach ($allSchedules as $schedule) {
            $scheduleDateString = Carbon::parse($schedule['date'])->format('Y-m-d');
            $scheduleDate = Carbon::parse($schedule['date'])->startOfDay();
            
            // Check if user has attendance for this schedule
            $attendance = $userAttendances->first(function ($att) use ($schedule, $scheduleDateString) {
                $scanDateString = Carbon::parse($att->scan_time)->format('Y-m-d');
                return $att->class_session_id == $schedule['class_session_id'] 
                    && $scanDateString === $scheduleDateString;
            });
            
            if ($attendance) {
                // Jika ada attendance, hitung sebagai present
                $presentCount++;
            } elseif ($schedule['status'] === 'completed' || $scheduleDate->lt($today)) {
                // Jika jadwal sudah lewat atau completed tapi tidak ada attendance, hitung sebagai absent
                $absentCount++;
            }
            // Jadwal yang akan datang tidak dihitung ke statistik
        }
        
        // Total meetings = yang sudah ada keputusan (present + absent)
        $totalMeetings = $presentCount + $absentCount;
        
        // Build detailed attendance list - SEMUA schedule (termasuk yang akan datang)
        $detailedAttendance = [];
        $meetingNumber = 1;
        
        foreach ($allSchedules->sortBy('date') as $schedule) {
            $scheduleDateString = Carbon::parse($schedule['date'])->format('Y-m-d');
            $scheduleDate = Carbon::parse($schedule['date'])->startOfDay();
            
            // Check if user has attendance for this schedule
            $attendance = $userAttendances->first(function ($att) use ($schedule, $scheduleDateString) {
                $scanDateString = Carbon::parse($att->scan_time)->format('Y-m-d');
                return $att->class_session_id == $schedule['class_session_id'] 
                    && $scanDateString === $scheduleDateString;
            });
            
            // Determine status
            $status = 'scheduled'; // default untuk jadwal yang akan datang
            
            if ($attendance) {
                $status = 'present';
            } elseif ($schedule['status'] === 'completed' || $scheduleDate->lt($today)) {
                $status = 'absent';
            } elseif ($scheduleDate->eq($today)) {
                $status = 'today'; // jadwal hari ini
            }
            // else tetap 'scheduled' untuk jadwal yang akan datang
            
            $detailedAttendance[] = [
                'meeting_number' => $meetingNumber,
                'date' => $schedule['date'],
                'time' => $schedule['time'],
                'location' => $schedule['location'],
                'status' => $status,
                'schedule_status' => $schedule['status'], // status dari schedule (completed, on_going, dll)
                'scan_time' => $attendance ? Carbon::parse($attendance->scan_time)->format('H:i') : null,
                'course_title' => $schedule['course_title'],
            ];
            
            $meetingNumber++;
        }
        
        // Calculate attendance percentage (dari yang sudah lewat saja)
        $attendancePercentage = $totalMeetings > 0 
            ? round(($presentCount / $totalMeetings) * 100) 
            : 0;
        
        // Count remaining (future) meetings including today
        $remainingMeetings = $allSchedules->filter(function ($schedule) use ($today) {
            $scheduleDate = Carbon::parse($schedule['date'])->startOfDay();
            return $scheduleDate->gte($today) && $schedule['status'] !== 'completed';
        })->count();
        
        return Inertia::render('member/riwayat-absensi', [
            'statistics' => [
                'total' => $totalMeetings,
                'present' => $presentCount,
                'absent' => $absentCount,
                'percentage' => $attendancePercentage,
                'remaining' => $remainingMeetings,
                'all_schedules' => $allSchedules->count(), // total semua jadwal
            ],
            'detailedAttendance' => $detailedAttendance,
        ]);
    }
}
