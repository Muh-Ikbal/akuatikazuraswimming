<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmployeeAttendanceSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sessions = EmployeeAttendanceSession::all();
        return Inertia::render('admin/settings/employee-sessions/index', [
            'sessions' => $sessions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'late_threshold' => 'required|date_format:H:i',
            'alpha_threshold' => 'nullable|date_format:H:i',
        ]);

        EmployeeAttendanceSession::create($request->all());

        return redirect()->back()->with('success', 'Sesi absensi berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'late_threshold' => 'required|date_format:H:i',
            'alpha_threshold' => 'nullable|date_format:H:i',
        ]);

        $session = EmployeeAttendanceSession::findOrFail($id);
        $session->update($request->all());

        return redirect()->back()->with('success', 'Sesi absensi berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $session = EmployeeAttendanceSession::findOrFail($id);
        $session->delete();

        return redirect()->back()->with('success', 'Sesi absensi berhasil dihapus');
    }
}
