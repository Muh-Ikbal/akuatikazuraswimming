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
        try {
            $user = auth()->user();
            
            if($user->getRoleNames()->first() == 'admin' || $user->getRoleNames()->first() == 'super_admin') {
                $members = Member::count();
                $coaches = Coach::count();
                $courses = Course::count();
                // $payments = Payment::where('state', ['paid','partial_paid'])->get(); // Removed to improve performance

                // Backend calculation for income
                $totalPaymentsThisMonth = Payment::whereIn('state', ['paid', 'partial_paid'])
                    ->whereYear('created_at', now()->year)
                    ->whereMonth('created_at', now()->month)
                    ->sum('amount_paid');

                $totalPaymentsLastMonth = Payment::whereIn('state', ['paid', 'partial_paid'])
                    ->whereYear('created_at', now()->subMonth()->year)
                    ->whereMonth('created_at', now()->subMonth()->month)
                    ->sum('amount_paid');

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
                    'monthly_income'=>$totalPaymentsThisMonth,
                    'last_month_income'=>$totalPaymentsLastMonth,
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
                
                // Get class sessions via Schedules assigned to the coach
                $classesInfo = ClassSession::whereHas('schedule', function($q) use ($coach) {
                        $q->where('coach_id', $coach->id);
                    })
                    ->withCount(['enrolment' => function($query){
                        $query->where('state', 'on_progress');
                    }])
                    ->with(['enrolment.course']) // Load enrolment to get course details
                    ->get()
                    ->map(function($classSession){
                        // Try to get course from the first enrolment
                        $course = $classSession->enrolment->first() ? $classSession->enrolment->first()->course : null;
                        
                        return [
                            'class_title' => $classSession->title,
                            'course_title' => $course ? $course->title : '-',
                            'total_students' => $classSession->enrolment_count,
                            'capacity' => $classSession->capacity,
                        ];
                    })->toArray();

                $totalStudents = array_sum(array_column($classesInfo, 'total_students'));

                $upcoming_sessions = Schedule::where('coach_id', $coach->id)
                    ->where('date', '>=', now()->toDateString())
                    ->whereIn('status', ['published', 'on_going'])
                    ->count();

                $stats = [
                    'total_classes' => count($classesInfo),
                    'total_students' => $totalStudents,
                    'completed_sessions' => Schedule::where('coach_id', $coach->id)->where('status', 'completed')->count(),
                    'upcoming_sessions' => $upcoming_sessions,
                ];

                $todaySchedules = Schedule::where('coach_id', $coach->id)
                    ->whereDate('date', today())
                    ->with(['class_session' => function($query){
                        $query->withCount(['enrolment' => function($q){
                            $q->where('state', 'on_progress');
                        }])->with(['enrolment.course']);
                    }])
                    ->orderBy('time')
                    ->get()
                    ->map(function($schedule){
                        $classSession = $schedule->class_session;
                        // Try to get course from the first enrolment if classSession->course is not available
                        $course = null;
                        if ($classSession && $classSession->enrolment->isNotEmpty()) {
                            $course = $classSession->enrolment->first()->course;
                        }

                        return [
                            'id' => $schedule->id,
                            'time' => $schedule->time,
                            'location' => $schedule->location,
                            'class_title' => $classSession ? $classSession->title : '-',
                            'course_title' => $course ? $course->title : '-',
                            'total_students' => $classSession ? $classSession->enrolment_count : 0,
                        ];
                    });
                
                return Inertia::render('coach/dashboard', [
                    'stats' => $stats,
                    'classesInfo' => array_slice($classesInfo, 0, 5),
                    'todaySchedules' => $todaySchedules
                ]);
            }else{
                return Inertia::render('operator/dashboard');
            }
        } catch (\Throwable $th) {
             return redirect()->back()->with('error', 'Terjadi kesalahan saat memuat dashboard: ' . $th->getMessage());
        }
    }
    
}

       
