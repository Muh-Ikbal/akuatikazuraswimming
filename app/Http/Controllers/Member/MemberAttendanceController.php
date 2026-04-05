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
        try {
            $user = auth()->user()->load('member');
            $member = $user->member;
            
            if (!$member) {
                return redirect()->route('dashboard')->with('error', 'Member data not found');
            }
            
            $today = Carbon::today();
            
            $enrolments = EnrolmentCourse::where('member_id', $member->id)
                ->with(['course', 'class_session.schedule'])
                ->get();
            
            $userAttendances = Attendance::where('user_id', $user->id)->get();
            
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
                            'course_title' => $enrolment->course->title ?? '-',
                        ]);
                    }
                }
            }
            
            // Calculate statistics based on enrolment meeting_count
            $presentCount = 0;
            $enrolmentDetails = [];
            
            foreach ($enrolments as $enrolment) {
                $count = $enrolment->meeting_count ?? 0;
                $presentCount += $count;
                
                $enrolmentDetails[] = [
                    'course_title' => $enrolment->course->title ?? '-',
                    'class_title' => $enrolment->class_session->title ?? '-',
                    'meeting_count' => $count,
                    'class_session_id' => $enrolment->class_session->id ?? null,
                ];
            }
            
            $detailedAttendance = [];
            $meetingNumber = 1;
            
            foreach ($allSchedules->sortByDesc('date') as $schedule) {
                $attendance = $userAttendances->first(function ($att) use ($schedule) {
                    return $att->schedule_id == $schedule['id'];
                });
                
                if ($attendance) {
                    $status = 'present';
                    
                    $detailedAttendance[] = [
                        'meeting_number' => $meetingNumber,
                        'date' => $schedule['date'],
                        'time' => $schedule['time'],
                        'location' => $schedule['location'],
                        'status' => $status,
                        'schedule_status' => $schedule['status'], 
                        'scan_time' => Carbon::parse($attendance->scan_time)->format('H:i'),
                        'course_title' => $schedule['course_title'],
                    ];
                    
                    $meetingNumber++;
                }
            }

            $remainingMeetings = $allSchedules->filter(function ($schedule) use ($today) {
                $scheduleDate = Carbon::parse($schedule['date'])->startOfDay();
                return $scheduleDate->gte($today) && $schedule['status'] !== 'completed';
            })->count();
            
            return Inertia::render('member/riwayat-absensi', [
                'statistics' => [
                    'present' => $presentCount,
                    'remaining' => $remainingMeetings,
                    'all_schedules' => $allSchedules->count(),
                ],
                'enrolmentDetails' => $enrolmentDetails,
                'detailedAttendance' => $detailedAttendance,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
