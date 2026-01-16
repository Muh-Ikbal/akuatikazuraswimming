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
            $payments = Payment::where('state', 'paid')->get();
            $class_sessions = ClassSession::whereHas('schedule',function($query){
                $query->whereDate('date',today()->toDateString())->orderBy('time','asc');
            })->with([
                'schedule'=> function($query){
                    $query->whereDate('date',today()->toDateString())->get();
                }
            ])->withCount('enrolment')->get();
            return Inertia::render('admin/dashboard',[
                'members'=>$members,
                'coaches'=>$coaches,
                'courses'=>$courses,
                'payments'=>$payments,
                'class_sessions'=>$class_sessions
            ]);
        } else if($user->getRoleNames()->first() == 'member') {
            return Inertia::render('member/dashboard');
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

       
