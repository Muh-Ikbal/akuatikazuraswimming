<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;
class CourseController extends Controller
{
    public function index(){
        try {
            $courses = Course::paginate(10);
            return Inertia::render('admin/course_management',[
                'courses' => $courses
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create(){
        try {
            return Inertia::render('admin/course/create');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function store(Request $request){
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:5048',
            'total_meeting' => 'required|integer|min:1',
            'weekly_meeting_count' => 'required|integer|min:1|max:7',
            'price' => 'required|numeric|min:0',
            'state' => 'required|in:active,inactive',
        ]);

        try {
            if ($request->hasFile('image')){
                $fileName = time() . '.' . $request->image->extension();
                $validated['image'] = $request->image->storeAs('courses', $fileName, 'public');
            }
            Course::create($validated);

            return redirect('/management-course')->with('success', 'Course berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id){
        try {
            $course = Course::findOrFail($id);
            return Inertia::render('admin/course/create', [
                'course' => $course
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request, $id){

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'total_meeting' => 'required|integer|min:1',
            'image' => 'nullable|image|max:5048',
            'weekly_meeting_count' => 'required|integer|min:1|max:7',
            'price' => 'required|numeric|min:0',
            'state' => 'required|in:active,inactive',
        ]);
        try {
            $course = Course::findOrFail($id);
            $validated['image'] = $course->image;
            if ($request->hasFile('image')){
                if ($course->image){
                    Storage::disk('public')->delete($course->image);
                }
                $fileName = time() . '.' . $request->image->extension();
                $validated['image'] = $request->image->storeAs('courses', $fileName, 'public');
            }
            $course->update($validated);

            return redirect('/management-course')->with('success', 'Course berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function show($id){
        try {
            $course = Course::findOrFail($id);
            return Inertia::render('admin/course/show', [
                'course' => $course
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id){

        try {
            $course = Course::findOrFail($id);
            if($course->image){
                Storage::disk('public')->delete($course->image);
            }
            $course->delete();
        } catch (\Throwable $th) {
            return redirect('/management-course')->with('error', 'Course gagal dihapus, masih ada data yang terkait dengan course ini');
        }
        
        return redirect('/management-course')->with('success', 'Course berhasil dihapus');
    }
}
