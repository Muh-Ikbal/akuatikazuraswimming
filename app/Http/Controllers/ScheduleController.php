<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\AttandanceEmployee;
use App\Models\Coach;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    public function index(){
        try {
            Schedule::where('status', '!=', 'completed')
                ->where(function ($query) {
                    $query->whereDate('date', '<', now()->toDateString())
                        ->orWhere(function ($subQuery) {
                            $subQuery->whereDate('date', now()->toDateString())
                                     ->whereNotNull('end_time')
                                     ->whereTime('end_time', '<=', now()->format('H:i:s'));
                        });
                })
                ->update([
                    'status' => 'completed'
                ]);
            
            // Check for missing schedules and create alpha attendance
            $missingSchedules = Schedule::with('coach.user')
                ->whereDoesntHave('attendanceEmployee')
                ->where('status', 'completed')
                ->get();

            foreach ($missingSchedules as $schedule) {
                if ($schedule->coach && $schedule->coach->user) {
                    AttandanceEmployee::create([
                        'user_id' => $schedule->coach->user->id,
                        'schedule_id' => $schedule->id,
                        'state' => 'alpha',
                        'scan_time' => null,
                    ]);
                }
            }
            $schedules = Schedule::with('class_session','coach')->orderBy('date', 'desc')->orderBy('time', 'desc')->paginate(10);

            $schedule_count = Schedule::count();
            $schedule_on_going = Schedule::where('status', 'published')->count();
            $schedule_completed = Schedule::where('status', 'completed')->count();
                   
            
            return Inertia::render('admin/schedule_management', [
                'schedule_count' => $schedule_count,
                'schedule_on_going' => $schedule_on_going,
                'schedule_completed' => $schedule_completed,
                'schedules' => $schedules
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create(){
        try {
            $class_sessions = ClassSession::all();
            $coaches = Coach::all();

            return Inertia::render('admin/schedule/create',[
                'class_sessions' => $class_sessions,
                'coaches' => $coaches
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function store(Request $request){
        $validated = $request->validate([
            'class_session_id'=>'required|exists:class_sessions,id',
            'coach_id'=>'required|exists:coaches,id',
            'date' => 'required|date',
            'time' => 'required',
            'end_time' => 'nullable',
            'location' => 'required',
            'status' => 'required|in:published,on_going,completed,cancelled'
        ]);
      
        try {
            Schedule::create($validated);

            return redirect('/management-jadwal')->with('success', 'Jadwal berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id){
        try {
            $schedule = Schedule::findOrFail($id);
            $class_sessions = ClassSession::all();
            $coaches = Coach::all();

            return Inertia::render('admin/schedule/create',[
                'schedule' => $schedule,
                'class_sessions' => $class_sessions,
                'coaches' => $coaches 
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request,$id){
        $validated = $request->validate([
            'class_session_id' => 'required|exists:class_sessions,id',
            'coach_id' => 'required|exists:coaches,id',
            'date' => 'required|date',
            'time' => 'required',
            'end_time' => 'nullable',
            'location' => 'required',
            'status' => 'required|in:published,on_going,completed,cancelled'
        ]);

        try {
            Schedule::findOrFail($id)->update($validated);

            return redirect('/management-jadwal')->with('success', 'Schedule berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id){
        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->delete();

            return redirect('/management-jadwal')->with('success', 'Schedule berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
