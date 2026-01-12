<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\ClassSession;

class ScheduleController extends Controller
{
    public function index(){
        $schedules = Schedule::with('class_session')->paginate(10);
        
        return Inertia::render('admin/schedule_management', [
            'schedules' => $schedules
        ]);
    }

    public function create(){
        $class_sessions = ClassSession::all();
        return Inertia::render('admin/schedule/create',[
            'class_sessions' => $class_sessions
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'class_session_id'=>'required|exists:class_sessions,id',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required',
            'status' => 'required|in:published,on_going,completed,cancelled'
        ]);

        Schedule::create($validated);

        return redirect('/management-jadwal')->with('success', 'Jadwal berhasil ditambahkan');
    }

    public function edit($id){
        $schedule = Schedule::findOrFail($id);
        $class_sessions = ClassSession::all();
        return Inertia::render('admin/schedule/create',[
            'schedule' => $schedule,
            'class_sessions' => $class_sessions 
        ]);
    }

    public function update(Request $request,$id){
        $validated = $request->validate([
            'class_session_id' => 'required|exists:class_sessions,id',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required',
            'status' => 'required|in:published,on_going,completed,cancelled'
        ]);

        Schedule::findOrFail($id)->update($validated);

        return redirect('/management-jadwal')->with('success', 'Schedule berhasil diupdate');
    }

    public function destroy($id){
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return redirect('/management-jadwal')->with('success', 'Schedule berhasil dihapus');
    }
}
