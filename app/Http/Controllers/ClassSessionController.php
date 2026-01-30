<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClassSession;
use App\Models\EnrolmentCourse;
use App\Models\Schedule;
use Inertia\Inertia;

class ClassSessionController extends Controller
{
    public function index()
    {
        try {
            $class_session = ClassSession::paginate(10);
            $total_student = EnrolmentCourse::all();
            return Inertia::render('admin/class_session', [
                'class_session' => $class_session,
                'total_student' => $total_student
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create()
    {
        try {
            return Inertia::render('admin/classsession/create');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        try {
            ClassSession::create([
                'title' => $validated['title'],
                'capacity' => $validated['capacity'],
            ]);

            return redirect('/management-kelas')->with('success', 'Kelas berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $class_session = ClassSession::findOrFail($id);
            
            return Inertia::render('admin/classsession/show', [
                'class_session' => $class_session
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $class_session = ClassSession::findOrFail($id);
            
            return Inertia::render('admin/classsession/create', [
                'class_session' => $class_session
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $class_session = ClassSession::findOrFail($id);
            
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'capacity' => 'required|integer|min:1',
            ]);

            $class_session->update($validated);

            return redirect('/management-kelas')->with('success', 'Kelas berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $class_session = ClassSession::findOrFail($id);
            $enrolments = EnrolmentCourse::where('class_session_id', $id)->get();
            if($enrolments->count() > 0) {
                return redirect('/management-kelas')->with('error', 'Kelas tidak dapat dihapus karena ada yang terdaftar');
            }
            $schedule = Schedule::where('class_session_id', $id)->get();
            if($schedule->count() > 0) {
                return redirect('/management-kelas')->with('error', 'Kelas tidak dapat dihapus karena ada jadwal yang terkait');
            }
            $class_session->delete();

            return redirect('/management-kelas')->with('success', 'Kelas berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
