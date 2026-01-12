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
                    $query->whereDate('date',today()->toDateString())->first();
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
            $courses = Course::where('user_id', $user->id)->count();
            $payments = Payment::where('user_id', $user->id)->where('state', 'paid')->get();
            return Inertia::render('member/dashboard',[
                'courses'=>$courses,
                'payments'=>$payments,
            ]);
        }else if($user->getRoleNames()->first() == 'coach') {
            $courses = Course::where('user_id', $user->id)->count();
            $payments = Payment::where('user_id', $user->id)->where('state', 'paid')->get();
            return Inertia::render('coach/dashboard',[
                'courses'=>$courses,
                'payments'=>$payments,
            ]);
        }else{
            return Inertia::render('operator/dashboard');
        }
        
       
    }
    
}
