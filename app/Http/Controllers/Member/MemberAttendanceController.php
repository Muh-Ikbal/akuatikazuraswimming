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
            
            // Build enrolment filter options & find default (active/on_progress)
            $enrolmentFilters = [];
            $defaultEnrolmentId = null;
            
            foreach ($enrolments as $enrolment) {
                $enrolmentFilters[] = [
                    'id' => $enrolment->id,
                    'label' => ($enrolment->course->title ?? '-') . ' — ' . ($enrolment->class_session->title ?? '-'),
                    'state' => $enrolment->state,
                ];
                
                if (!$defaultEnrolmentId && in_array($enrolment->state, ['active', 'on_progress'])) {
                    $defaultEnrolmentId = $enrolment->id;
                }
            }
            
            // Fallback to first enrolment if none is active
            if (!$defaultEnrolmentId && $enrolments->isNotEmpty()) {
                $defaultEnrolmentId = $enrolments->first()->id;
            }
            
            // Build schedules grouped by enrolment
            $allSchedules = collect();
            foreach ($enrolments as $enrolment) {
                if ($enrolment->class_session && $enrolment->class_session->schedule) {
                    foreach ($enrolment->class_session->schedule as $schedule) {
                        $allSchedules->push([
                            'id' => $schedule->id,
                            'enrolment_id' => $enrolment->id,
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
            
            // Enrolment details for stats cards
            $presentCount = 0;
            $enrolmentDetails = [];
            
            foreach ($enrolments as $enrolment) {
                $count = $enrolment->meeting_count ?? 0;
                $presentCount += $count;
                
                $enrolmentDetails[] = [
                    'enrolment_id' => $enrolment->id,
                    'course_title' => $enrolment->course->title ?? '-',
                    'class_title' => $enrolment->class_session->title ?? '-',
                    'meeting_count' => $count,
                    'class_session_id' => $enrolment->class_session->id ?? null,
                ];
            }
            
            // Build detailed attendance with enrolment_id
            $detailedAttendance = [];
            
            foreach ($allSchedules->sortByDesc('date') as $schedule) {
                $attendance = $userAttendances->first(function ($att) use ($schedule) {
                    return $att->schedule_id == $schedule['id'];
                });
                
                if ($attendance) {
                    $detailedAttendance[] = [
                        'enrolment_id' => $attendance->enrolment_course_id ?? $schedule['enrolment_id'],
                        'date' => $schedule['date'],
                        'time' => $schedule['time'],
                        'location' => $schedule['location'],
                        'status' => 'present',
                        'schedule_status' => $schedule['status'], 
                        'scan_time' => Carbon::parse($attendance->scan_time)->format('H:i'),
                        'course_title' => $schedule['course_title'],
                    ];
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
                'enrolmentFilters' => $enrolmentFilters,
                'defaultEnrolmentId' => $defaultEnrolmentId,
                'enrolmentDetails' => $enrolmentDetails,
                'detailedAttendance' => $detailedAttendance,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}

