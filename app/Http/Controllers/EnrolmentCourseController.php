<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EnrolmentCourse;
use App\Models\Member;
use App\Models\ClassSession;
use App\Models\Course;
use Inertia\Inertia;

class EnrolmentCourseController extends Controller
{
    public function index()
    {
        $enrolments = EnrolmentCourse::with(['member', 'class_session', 'course', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('admin/enrolment_management', [
            'enrolments' => $enrolments
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

        EnrolmentCourse::create($validated);

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

        $enrolment->update($validated);

        return redirect('/management-enrolment')->with('success', 'Enrolment berhasil diupdate');
    }

    public function destroy($id)
    {
        $enrolment = EnrolmentCourse::findOrFail($id);
        $enrolment->delete();

        return redirect('/management-enrolment')->with('success', 'Enrolment berhasil dihapus');
    }
}
