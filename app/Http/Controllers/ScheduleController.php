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
    public function index(Request $request){
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
            $query = Schedule::with('class_session','coach')->orderBy('date', 'desc')->orderBy('time', 'desc');

            if ($request->has('search') && $request->search != null) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('location', 'like', '%' . $search . '%')
                      ->orWhereHas('class_session', function ($subQ) use ($search) {
                          $subQ->where('title', 'like', '%' . $search . '%');
                      });
                });
            }

            if ($request->has('date') && $request->date != null) {
                $query->whereDate('date', $request->date);
            }

            if ($request->has('coach_id') && $request->coach_id != null) {
                $query->where('coach_id', $request->coach_id);
            }

            if ($request->has('status') && $request->status != null && $request->status != 'all') {
                $query->where('status', $request->status);
            }

            $schedules = $query->paginate(10)->withQueryString();

            $schedule_count = Schedule::count();
            $schedule_on_going = Schedule::where('status', 'published')->count();
            $schedule_completed = Schedule::where('status', 'completed')->count();
            
            $coaches = Coach::all();
            
            return Inertia::render('admin/schedule_management', [
                'schedule_count' => $schedule_count,
                'schedule_on_going' => $schedule_on_going,
                'schedule_completed' => $schedule_completed,
                'schedules' => $schedules,
                'coaches' => $coaches,
                'filters' => $request->only(['date', 'coach_id', 'search', 'status'])
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
            'end_time' => 'required|after:time',
            'location' => 'required',
            'status' => 'required|in:published,on_going,completed,cancelled'
        ]);
      
        try {
            // Check for overlapping schedules
            $overlap = Schedule::where('coach_id', $validated['coach_id'])
                ->where('date', $validated['date'])
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($validated) {
                    $query->where(function ($q) use ($validated) {
                        $q->where('time', '<', $validated['end_time'])
                          ->where('end_time', '>', $validated['time']);
                    });
                })
                ->exists();

            if ($overlap) {
                return redirect()->back()->with('error', 'Coach sudah memiliki jadwal di rentang waktu tersebut.');
            }

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
            'end_time' => 'required|after:time',
            'location' => 'required',
            'status' => 'required|in:published,on_going,completed,cancelled'
        ]);

        try {
            // Check for overlapping schedules (excluding current)
            $overlap = Schedule::where('coach_id', $validated['coach_id'])
                ->where('date', $validated['date'])
                ->where('id', '!=', $id)
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($validated) {
                    $query->where(function ($q) use ($validated) {
                        $q->where('time', '<', $validated['end_time'])
                          ->where('end_time', '>', $validated['time']);
                    });
                })
                ->exists();

            if ($overlap) {
                return redirect()->back()->with('error', 'Coach sudah memiliki jadwal di rentang waktu tersebut.');
            }

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
