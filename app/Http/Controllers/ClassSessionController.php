<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Coach;
use Inertia\Inertia;

class ClassSessionController extends Controller
{
    public function index()
    {
        $class_session = ClassSession::with('course', 'coach')->paginate(10);
        return Inertia::render('admin/class_session', [
            'class_session' => $class_session
        ]);
    }

    public function create()
    {
        $courses = Course::where('state', 'active')->get(['id', 'title']);
        $coaches = Coach::all(['id', 'name']);
        
        return Inertia::render('admin/classsession/create', [
            'courses' => $courses,
            'coaches' => $coaches
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'coach_id' => 'required|exists:coaches,id',
            'capacity' => 'required|integer|min:1',
        ]);

        ClassSession::create([
            'title' => $validated['title'],
            'course_id' => $validated['course_id'],
            'coach_id' => $validated['coach_id'],
            'capacity' => $validated['capacity'],
        ]);

        return redirect('/management-kelas')->with('success', 'Kelas berhasil ditambahkan');
    }

    public function show($id)
    {
        $class_session = ClassSession::with('course', 'coach')->findOrFail($id);
        
        return Inertia::render('admin/classsession/show', [
            'class_session' => $class_session
        ]);
    }

    public function edit($id)
    {
        $class_session = ClassSession::with('course', 'coach')->findOrFail($id);
        $courses = Course::where('state', 'active')->get(['id', 'title']);
        $coaches = Coach::all(['id', 'name']);
        
        return Inertia::render('admin/classsession/create', [
            'class_session' => $class_session,
            'courses' => $courses,
            'coaches' => $coaches
        ]);
    }

    public function update(Request $request, $id)
    {
        $class_session = ClassSession::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'coach_id' => 'required|exists:coaches,id',
            'capacity' => 'required|integer|min:1',
        ]);

        $class_session->update($validated);

        return redirect('/management-kelas')->with('success', 'Kelas berhasil diupdate');
    }

    public function destroy($id)
    {
        $class_session = ClassSession::findOrFail($id);
        $class_session->delete();

        return redirect('/management-kelas')->with('success', 'Kelas berhasil dihapus');
    }
}
