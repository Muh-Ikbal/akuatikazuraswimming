<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\ClassSession;
use App\Models\Course;
use Carbon\Carbon;

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
       $course = Course::whereHas('class_sessions', function ($query) use ($validated) {
            $query->where('id', $validated['class_session_id']);
        })->first();

        $schedule_count = Schedule::where('class_session_id', $validated['class_session_id'])
                          ->whereBetween('date',[
                            Carbon::parse($validated['date'])->startOfWeek()->toDateString(),
                            Carbon::parse($validated['date'])->endOfWeek()->toDateString()
                          ])->count();
        // dd(now()->startOfWeek()->toDateString(),now()->endOfWeek()->toDateString());
        if($course->weekly_meeting_count <= $schedule_count){
            return redirect('/management-jadwal')->with('error', 'Jadwal minggu ini sudah ' . $schedule_count . ' kali');
        }

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
