<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;
class CourseController extends Controller
{
    public function index(){
        $courses = Course::paginate(10);
        return Inertia::render('admin/course_management',[
            'courses' => $courses
        ]);
    }

    public function create(){
        return Inertia::render('admin/course/create');
    }

    public function store(Request $request){
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'total_meeting' => 'required|integer|min:1',
            'weekly_meeting_count' => 'required|integer|min:1|max:7',
            'price' => 'required|numeric|min:0',
            'state' => 'required|in:active,inactive',
        ]);

        if ($request->hasFile('image')){
            $fileName = time() . '.' . $request->image->extension();
            $validated['image'] = $request->image->storeAs('courses', $fileName, 'public');
        }
        Course::create($validated);

        return redirect('/management-course')->with('success', 'Course berhasil ditambahkan');
    }

    public function edit($id){
        $course = Course::findOrFail($id);
        return Inertia::render('admin/course/create', [
            'course' => $course
        ]);
    }

    public function update(Request $request, $id){

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'total_meeting' => 'required|integer|min:1',
            'weekly_meeting_count' => 'required|integer|min:1|max:7',
            'price' => 'required|numeric|min:0',
            'state' => 'required|in:active,inactive',
        ]);
        $course = Course::findOrFail($id);
        if ($request->hasFile('image')){
            if ($course->image){
                Storage::disk('public')->delete($course->image);
            }
            $fileName = time() . '.' . $request->image->extension();
            $validated['image'] = $request->image->storeAs('courses', $fileName, 'public');
        }
        $course->update($validated);

        return redirect('/management-course')->with('success', 'Course berhasil diupdate');
    }

    public function show($id){
        $course = Course::findOrFail($id);
        return Inertia::render('admin/course/show', [
            'course' => $course
        ]);
    }

    public function destroy($id){
        $course = Course::findOrFail($id);
        if($course->image){
            Storage::disk('public')->delete($course->image);
        }
        $course->delete();
        return redirect('/management-course')->with('success', 'Course berhasil dihapus');
    }
}
