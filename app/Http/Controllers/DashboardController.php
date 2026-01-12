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
            return Inertia::render('member/dashboard');
        }else if($user->getRoleNames()->first() == 'coach') {
            return Inertia::render('coach/dashboard');
        }else{
            return Inertia::render('operator/dashboard');
        }
        
       
    }
    
}

       
