<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Coach;
use App\Models\ClassSession;
use App\Models\EnrolmentCourse;

class CoachStudentController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $coach = Coach::where('user_id', $user->id)->first();
        
        $students = collect();
        $classesInfo = [];
        $stats = [
            'total_students' => 0,
            'total_classes' => 0,
        ];
        
        if ($coach) {
            // Get all class sessions for this coach
            $classSessions = ClassSession::where('coach_id', $coach->id)
                ->with(['course', 'enrolment.member'])
                ->get();
            
            $stats['total_classes'] = $classSessions->count();
            
            // Collect all students from each class session
            foreach ($classSessions as $classSession) {
                // Add class info
                $classesInfo[] = [
                    'id' => $classSession->id,
                    'title' => $classSession->title,
                    'course_title' => $classSession->course?->title,
                ];
                
                // Add students from this class
                foreach ($classSession->enrolment as $enrolment) {
                    if ($enrolment->member) {
                        $students->push([
                            'id' => $enrolment->member->id,
                            'name' => $enrolment->member->name,
                            'phone' => $enrolment->member->phone_number,
                            'image' => $enrolment->member->image,
                            'address' => $enrolment->member->address,
                            'class_session' => [
                                'id' => $classSession->id,
                                'title' => $classSession->title,
                            ],
                            'course' => $classSession->course ? [
                                'id' => $classSession->course->id,
                                'title' => $classSession->course->title,
                            ] : null,
                            'enrolment_state' => $enrolment->state,
                        ]);
                    }
                }
            }
            
            $stats['total_students'] = $students->count();
        }
        
        return Inertia::render('coach/siswa', [
            'students' => $students,
            'classesInfo' => $classesInfo,
            'stats' => $stats,
        ]);
    }
}
