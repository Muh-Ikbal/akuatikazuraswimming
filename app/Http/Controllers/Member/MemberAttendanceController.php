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
            
            // Load enrolments with minimal columns
            $enrolments = EnrolmentCourse::where('member_id', $member->id)
                ->with(['course:id,title', 'class_session:id,title'])
                ->get();
            
            // Get class session IDs from enrolments
            $classSessionIds = $enrolments->pluck('class_session_id')->filter()->unique()->toArray();
            
            // Load schedules directly — limit to last 3 months for performance
            $scheduleRangeStart = $today->copy()->subMonths(3)->format('Y-m-d');
            $dbSchedules = collect();
            if (!empty($classSessionIds)) {
                $dbSchedules = Schedule::whereIn('class_session_id', $classSessionIds)
                    ->where('date', '>=', $scheduleRangeStart)
                    ->orderBy('date', 'desc')
                    ->get(['id', 'class_session_id', 'date', 'time', 'location', 'status']);
            }
            
            // Load attendance records only for the schedules we loaded
            $scheduleIds = $dbSchedules->pluck('id')->toArray();
            $userAttendances = collect();
            if (!empty($scheduleIds)) {
                $userAttendances = Attendance::where('user_id', $user->id)
                    ->whereIn('schedule_id', $scheduleIds)
                    ->get();
            }
            
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
                $enrolmentSchedules = $dbSchedules->where('class_session_id', $enrolment->class_session_id);
                foreach ($enrolmentSchedules as $schedule) {
                    $allSchedules->push([
                        'id' => $schedule->id,
                        'enrolment_id' => $enrolment->id,
                        'date' => $schedule->date,
                        'time' => $schedule->time,
                        'location' => $schedule->location,
                        'status' => $schedule->status,
                        'class_session_id' => $enrolment->class_session_id,
                        'course_title' => $enrolment->course->title ?? '-',
                    ]);
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

