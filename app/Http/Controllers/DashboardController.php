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
            
            // Revenue per course
            $revenuePerCourse = Course::withSum(['class_sessions as total_revenue' => function($query) {
                $query->join('enrolment_courses', 'class_sessions.id', '=', 'enrolment_courses.class_session_id')
                    ->join('payments', 'enrolment_courses.id', '=', 'payments.enrolment_course_id')
                    ->whereIn('payments.state', ['paid', 'partial_paid']);
            }], 'payments.amount_paid')
            ->withCount(['class_sessions as total_students' => function($query) {
                $query->join('enrolment_courses', 'class_sessions.id', '=', 'enrolment_courses.class_session_id');
            }])
            ->get()
            ->map(function($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'total_revenue' => (float) ($course->total_revenue ?? 0),
                    'total_students' => (int) ($course->total_students ?? 0),
                ];
            })
            ->sortByDesc('total_revenue')
            ->values()
            ->take(5);
            
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
            
            if (!$member) {
               $stats = [
                   'total_attendance' => 0,
                   'total_courses' => 0,
               ];
               $upcomingSchedules = [];
            } else {
                // Get enrolled courses
                $enrolments = EnrolmentCourse::where('member_id', $member->id)
                    ->where('state', 'on_progress')
                    ->with(['class_session.schedule', 'class_session.course'])
                    ->get();
                
                // 1. Total Courses
                $stats['total_courses'] = $enrolments->count();
                
                // 2. Total Attendance (Count 'present' status in users attendance or verify manually if needed, 
                // but simpler approach: count completed schedules user attended)
                // Using simple approach similar to Controller logic:
                $userAttendances = \App\Models\Attendance::where('user_id', $user->id)->count();
                $stats['total_attendance'] = $userAttendances;

                // 3. Upcoming Schedules
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
                                    'course_title' => $enrolment->class_session->course->title,
                                ]);
                            }
                        }
                    }
                }
                // Sort by date and time
                $upcomingSchedules = $upcomingSchedules->sortBy([
                    ['date', 'asc'],
                    ['time', 'asc'],
                ])->values()->take(5); // Limit to 5
            }

            return Inertia::render('member/dashboard', [
                'stats' => $stats,
                'upcomingSchedules' => $upcomingSchedules
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
                // Get all class sessions for this coach
                $classSessions = ClassSession::where('coach_id', $coach->id)
                    ->with(['course', 'schedule', 'enrolment'])
                    ->get();
                
                $stats['total_classes'] = $classSessions->count();
                $stats['total_students'] = $classSessions->sum(function($class) {
                    return $class->enrolment->count();
                });
                
                // Count completed and upcoming schedules
                foreach ($classSessions as $classSession) {
                    foreach ($classSession->schedule as $schedule) {
                        if ($schedule->status === 'completed') {
                            $stats['completed_sessions']++;
                        } elseif (\Carbon\Carbon::parse($schedule->date)->gte(today())) {
                            $stats['upcoming_sessions']++;
                        }
                        
                        // Get today's schedules
                        if (\Carbon\Carbon::parse($schedule->date)->isToday()) {
                            $todaySchedules->push([
                                'id' => $schedule->id,
                                'time' => $schedule->time,
                                'location' => $schedule->location,
                                'class_title' => $classSession->title,
                                'course_title' => $classSession->course ? $classSession->course->title : '-',
                                'total_students' => $classSession->enrolment->count(),
                            ]);
                        }
                    }
                    
                    // Get class info
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

       
