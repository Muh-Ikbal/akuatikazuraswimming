<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EnrolmentCourse;
use App\Models\Member;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Scheduler;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EnrolmentCourseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $enrolments = EnrolmentCourse::with(['member', 'class_session', 'course', 'payment'])
            ->whereHas('member', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            })
            ->withCount('attendance')
            ->orderBy('created_at', 'desc')
            ->paginate(1)
            ->withQueryString();

            $enrolmentsStats = EnrolmentCourse::select(
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN state = "on_progress" THEN 1 ELSE 0 END) as on_progress_count'),
                DB::raw('SUM(CASE WHEN state = "completed" THEN 1 ELSE 0 END) as completed_count'),
                DB::raw('SUM(CASE WHEN state = "cancelled" THEN 1 ELSE 0 END) as cancelled_count'),
            )
            ->first();
        
        return Inertia::render('admin/enrolment_management', [
            'enrolments' => $enrolments,
            'filters' => $request->only('search'),
            'stats' => $enrolmentsStats
        ]);
    }

    public function create()
    {
        $members = Member::all(['id', 'name']);
        $class_sessions = ClassSession::with('course', 'coach')->get();
        $courses = Course::where('state', 'active')->get(['id', 'title', 'price']);
        
        return Inertia::render('admin/enrolment/create', [
            'members' => $members,
            'class_sessions' => $class_sessions,
            'courses' => $courses
        ]);
    }
 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'class_session_id' => 'required|exists:class_sessions,id',
            'course_id' => 'required|exists:courses,id',
            'state' => 'required|in:on_progress,completed,cancelled',
        ]);


        $enromentAlready = EnrolmentCourse::where('member_id',$validated['member_id'])->where('state','on_progress')->first();
        if($enromentAlready){
            return redirect('/management-enrolment')->with('error', 'Member sudah memiliki enrolment yang sedang berlangsung');
        }
         DB::transaction(function () use ($validated) {
            $enrolmentCourse = EnrolmentCourse::create($validated);

            $course = Course::findOrFail($validated['course_id']);
            $enrolmentCourseId = $enrolmentCourse->id;
            Payment::create([
                'enrolment_course_id' => $enrolmentCourseId,
                'amount' => $course->price,
                'state' => 'pending',
            ]);
        });
        
        

        return redirect('/management-enrolment')->with('success', 'Enrolment berhasil ditambahkan');
    }

    public function show($id)
    {
        $enrolment = EnrolmentCourse::with(['member', 'class_session.coach', 'course', 'payment'])
            ->findOrFail($id);
        
        return Inertia::render('admin/enrolment/show', [
            'enrolment' => $enrolment
        ]);
    }

    public function edit($id)
    {
        $enrolment = EnrolmentCourse::with(['member', 'class_session', 'course'])->findOrFail($id);
        $members = Member::all(['id', 'name']);
        $class_sessions = ClassSession::with('course', 'coach')->get();
        $courses = Course::where('state', 'active')->get(['id', 'title', 'price']);
        
        return Inertia::render('admin/enrolment/create', [
            'enrolment' => $enrolment,
            'members' => $members,
            'class_sessions' => $class_sessions,
            'courses' => $courses
        ]);
    }

    public function update(Request $request, $id)
    {
        $enrolment = EnrolmentCourse::findOrFail($id);
        
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'class_session_id' => 'required|exists:class_sessions,id',
            'course_id' => 'required|exists:courses,id',
            'state' => 'required|in:on_progress,completed,cancelled',
        ]);

        $course = Course::findOrFail($validated['course_id']);

        $payment = Payment::where('enrolment_course_id', $id)->first();
        $payment->update([
            'amount' => $course->price,
        ]);

        $enrolment->update($validated);

        return redirect('/management-enrolment')->with('success', 'Enrolment berhasil diupdate');
    }

    public function destroy($id)
    {

        $enrolment = EnrolmentCourse::findOrFail($id);
        $payment = Payment::where('enrolment_course_id', $id)->first();
        if($payment){
            return redirect('/management-enrolment')->with('error', 'Enrolment tidak dapat dihapus karena ada pembayaran yang terkait');
        }
        $enrolment->delete();

        return redirect('/management-enrolment')->with('success', 'Enrolment berhasil dihapus');
    }
}
