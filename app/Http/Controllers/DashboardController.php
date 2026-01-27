<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\Schedule;
use App\Models\EnrolmentCourse;
use App\Models\Coach;
use App\Models\Course;
use App\Models\Payment;
use App\Models\ClassSession;

class DashboardController extends Controller
{

    public function index(){
        $user = auth()->user();
        
        if($user->getRoleNames()->first() == 'admin') {
            $members = Member::count();
            $coaches = Coach::count();
            $courses = Course::count();
            $payments = Payment::where('state', ['paid','partial_paid'])->get();
            $class_sessions = ClassSession::whereHas('schedule',function($query){
                $query->whereDate('date',today()->toDateString())->orderBy('time','asc');
            })->with([
                'schedule'=> function($query){
                    $query->whereDate('date',today()->toDateString())->get();
                }
            ])->withCount('enrolment')->get();
            
           $revenuePerCourse = Course::withSum([
                    'enrolmentCourses as total_revenue' => function ($query) {
                        $query->join('payments', 'enrolment_courses.id', '=', 'payments.enrolment_course_id')
                            ->whereIn('payments.state', ['paid', 'partial_paid']);
                    }
                ], 'payments.amount_paid')
                ->withCount([
                    'enrolmentCourses as total_students'
                ])
                ->get()
                ->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'title' => $course->title,
                        'total_revenue' => (float) ($course->total_revenue ?? 0),
                        'total_students' => (int) ($course->total_students ?? 0),
                    ];
                })
                ->sortByDesc('total_revenue')
                ->take(5)
                ->values();

            
            return Inertia::render('admin/dashboard',[
                'members'=>$members,
                'coaches'=>$coaches,
                'courses'=>$courses,
                'payments'=>$payments,
                'class_sessions'=>$class_sessions,
                'revenue_per_course'=>$revenuePerCourse
            ]);
        } else if($user->getRoleNames()->first() == 'member') {
            $member = $user->member;
            
            // Initialize default values
            $stats = [
                'total_attendance' => 0,
                'total_courses' => 0,
            ];
            $upcomingSchedules = [];
            $historyCourses = [];
            $currentEnrolments = [];
            
            if ($member) {
                // Get current enrolled courses (on_progress)
                $enrolments = EnrolmentCourse::where('member_id', $member->id)
                    ->where('state', 'on_progress')
                    ->with(['class_session.schedule', 'course'])
                    ->get();
                
                // Current enrolments for display
                $currentEnrolments = $enrolments->map(function($enrolment) {
                    return [
                        'id' => $enrolment->id,
                        'course_title' => $enrolment->course ? $enrolment->course->title : '-',
                        'class_title' => $enrolment->class_session ? $enrolment->class_session->title : '-',
                        'meeting_count' => $enrolment->meeting_count,
                        'state' => $enrolment->state,
                    ];
                });
                
                // Stats
                $stats['total_courses'] = $enrolments->count();
                $userAttendances = EnrolmentCourse::where('member_id', $member->id)
                    ->where('state', 'on_progress')
                    ->sum('meeting_count');
                $stats['total_attendance'] = $userAttendances > 0 ? $userAttendances : 0;

                // Upcoming Schedules
                $upcomingSchedules = collect();
                foreach ($enrolments as $enrolment) {
                    if ($enrolment->class_session) {
                        foreach ($enrolment->class_session->schedule as $schedule) {
                            $scheduleDate = \Carbon\Carbon::parse($schedule->date);
                            // Only future or today schedules that are not completed
                            if ($scheduleDate->gte(today()) && $schedule->status !== 'completed') {
                                $upcomingSchedules->push([
                                    'id' => $schedule->id,
                                    'date' => $schedule->date,
                                    'time' => $schedule->time,
                                    'location' => $schedule->location,
                                    'class_title' => $enrolment->class_session->title,
                                    'course_title' => $enrolment->course ? $enrolment->course->title : '-',
                                ]);
                            }
                        }
                    }
                }
                
                // History courses (completed)
                $historyCourses = EnrolmentCourse::where('member_id', $member->id)
                    ->where('state', 'completed')
                    ->with(['class_session', 'course'])
                    ->get()
                    ->map(function($enrolment) {
                        return [
                            'id' => $enrolment->id,
                            'course_title' => $enrolment->course ? $enrolment->course->title : '-',
                            'class_title' => $enrolment->class_session ? $enrolment->class_session->title : '-',
                            'meeting_count' => $enrolment->meeting_count,
                            'state' => $enrolment->state,
                        ];
                    });
                
                // Sort upcoming schedules by date and time
                $upcomingSchedules = $upcomingSchedules->sortBy([
                    ['date', 'asc'],
                    ['time', 'asc'],
                ])->values()->take(5);
            }

            return Inertia::render('member/dashboard', [
                'stats' => $stats,
                'upcomingSchedules' => $upcomingSchedules,
                'historyCourses' => $historyCourses,
                'currentEnrolments' => $currentEnrolments,
            ]);
        } else if($user->getRoleNames()->first() == 'coach') {
            $coach = Coach::where('user_id', $user->id)->first();
            
            $stats = [
                'total_classes' => 0,
                'total_students' => 0,
                'completed_sessions' => 0,
                'upcoming_sessions' => 0,
            ];
            $todaySchedules = collect();
            $classesInfo = [];
            
            if ($coach) {
                // Get all schedules for this coach (coach is now linked to schedules, not class_sessions)
                $schedules = Schedule::where('coach_id', $coach->id)
                    ->with(['class_session.course', 'class_session.enrolment'])
                    ->get();
                
                // Get unique class sessions from schedules
                $classSessionIds = $schedules->pluck('class_session_id')->unique()->filter();
                $classSessions = ClassSession::whereIn('id', $classSessionIds)
                    ->with(['course', 'enrolment'])
                    ->get();
                
                $stats['total_classes'] = $classSessions->count();
                $stats['total_students'] = $classSessions->sum(function($class) {
                    return $class->enrolment->count();
                });
                
                // Count completed and upcoming schedules
                foreach ($schedules as $schedule) {
                    if ($schedule->status === 'completed') {
                        $stats['completed_sessions']++;
                    } elseif (\Carbon\Carbon::parse($schedule->date)->gte(today())) {
                        $stats['upcoming_sessions']++;
                    }
                    
                    // Get today's schedules
                    if (\Carbon\Carbon::parse($schedule->date)->isToday()) {
                        $classSession = $schedule->class_session;
                        $todaySchedules->push([
                            'id' => $schedule->id,
                            'time' => $schedule->time,
                            'end_time' => $schedule->end_time,
                            'location' => $schedule->location,
                            'class_title' => $classSession ? $classSession->title : '-',
                            'course_title' => $classSession && $classSession->course ? $classSession->course->title : '-',
                            'total_students' => $classSession ? $classSession->enrolment->count() : 0,
                        ]);
                    }
                }
                
                // Get class info from unique class sessions
                foreach ($classSessions as $classSession) {
                    if ($classSession->course) {
                        $classesInfo[] = [
                            'class_title' => $classSession->title,
                            'course_title' => $classSession->course->title,
                            'total_students' => $classSession->enrolment->count(),
                            'capacity' => $classSession->capacity,
                        ];
                    }
                }
            }
            
            return Inertia::render('coach/dashboard', [
                'stats' => $stats,
                'todaySchedules' => $todaySchedules->sortBy('time')->values(),
                'classesInfo' => array_slice($classesInfo, 0, 5),
            ]);
        }else{
            return Inertia::render('operator/dashboard');
        }
        
       
    }
    
}

       
