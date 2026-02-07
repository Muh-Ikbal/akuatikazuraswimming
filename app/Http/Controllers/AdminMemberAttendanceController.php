<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Member;
use App\Models\ClassSession;
use Carbon\Carbon;

class AdminMemberAttendanceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Attendance::with([
                'user.member',
                'classSession',
                'enrolmentCourse.course',
                'schedule.coach'
            ])
            ->whereHas('user.member'); // Only member attendances
    
            // Filter by date range
            if ($request->has('start_date') && $request->start_date) {
                $query->whereDate('scan_time', '>=', $request->start_date);
            }
            if ($request->has('end_date') && $request->end_date) {
                $query->whereDate('scan_time', '<=', $request->end_date);
            }
    
            // Filter by class session
            if ($request->has('class_session_id') && $request->class_session_id) {
                $query->where('class_session_id', $request->class_session_id);
            }
    
            // Search by member name
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->whereHas('user.member', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            }
    
            $attendances = $query->orderBy('scan_time', 'desc')->paginate(15);
    
            // Transform data for frontend
            $attendanceData = $attendances->through(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'member_name' => $attendance->user->member->name ?? '-',
                    'class_session' => $attendance->classSession->title ?? '-',
                    'course' => $attendance->enrolmentCourse->course->title ?? '-',
                    'coach' => $attendance->schedule->coach->name ?? '-',
                    'scan_time' => Carbon::parse($attendance->scan_time)->format('d M Y H:i'),
                    'date' => Carbon::parse($attendance->scan_time)->format('Y-m-d'),
                ];
            });
    
            // Get class sessions for filter
            $classSessions = ClassSession::all()->map(function ($session) {
                return [
                    'id' => $session->id,
                    'title' => $session->title,
                ];
            });
    
            // Statistics
            $today = Carbon::today();
            $thisMonth = Carbon::now()->startOfMonth();
    
            $stats = [
                'total' => Attendance::whereHas('user.member')->count(),
                'today' => Attendance::whereHas('user.member')->whereDate('scan_time', $today)->count(),
                'this_month' => Attendance::whereHas('user.member')->where('scan_time', '>=', $thisMonth)->count(),
            ];

            // Get members for dropdown (user_id and name)
            $members = Member::with('user')->get()->map(function($member){
                 return [
                     'user_id' => $member->user_id,
                     'name' => $member->name
                 ];
            });

            // Get schedules for dropdown
            $schedules = \App\Models\Schedule::with('class_session')
                ->whereDate('date', '>=', now()->subMonths(1))
                ->orderBy('date', 'desc')
                ->get()
                ->map(function($schedule){
                    return [
                        'id' => $schedule->id,
                        'title' => $schedule->class_session->title . ' - ' . Carbon::parse($schedule->date)->format('d M Y') . ' ' . $schedule->time,
                        'class_session_id' => $schedule->class_session_id
                    ];
                });
    
            return Inertia::render('admin/kehadiran/member', [
                'attendances' => $attendanceData,
                'class_sessions' => $classSessions,
                'stats' => $stats,
                'members' => $members,
                'schedules' => $schedules,
                'filters' => [
                    'search' => $request->search ?? '',
                    'start_date' => $request->start_date ?? '',
                    'end_date' => $request->end_date ?? '',
                    'class_session_id' => $request->class_session_id ?? '',
                ],
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $attendance = Attendance::findOrFail($id);
            $attendance->delete();
    
            return redirect()->back()->with('success', 'Data kehadiran berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function store(Request $request)
    {
        // Only super_admin can add
        if (!auth()->user()->hasRole('super_admin')) {
             return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'schedule_id' => 'required|exists:schedules,id',
            'scan_time' => 'required|date',
        ]);

        try {
            $schedule = \App\Models\Schedule::findOrFail($request->schedule_id);
            $member = Member::where('user_id', $request->user_id)->firstOrFail();
            
            // Try to find enrolment
            $enrolment = \App\Models\EnrolmentCourse::where('member_id', $member->id)
                ->where('class_session_id', $schedule->class_session_id)
                ->where('state', 'on_progress')
                ->first();
                
            if (!$enrolment) {
                 // Try to find any enrolment
                 $enrolment = \App\Models\EnrolmentCourse::where('member_id', $member->id)
                    ->where('class_session_id', $schedule->class_session_id)
                    ->first();
            }

            // If strict: fail if no enrolment? 
            // For now, let's allow but maybe warn or just set null if schema allows.
            // But schema likely expects enrolment_course_id. 
            // If manual entry, we really should have an enrolment.
            
            if (!$enrolment) {
                return redirect()->back()->with('error', 'Member tidak terdaftar di kelas sesi jadwal ini.');
            }

            Attendance::create([
                'user_id' => $request->user_id,
                'class_session_id' => $schedule->class_session_id,
                'schedule_id' => $schedule->id,
                'enrolment_course_id' => $enrolment->id,
                'scan_time' => Carbon::parse($request->scan_time),
            ]);

            return redirect()->back()->with('success', 'Data kehadiran berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        // Only super_admin can update
        if (!auth()->user()->hasRole('super_admin')) {
             return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $request->validate([
            'scan_time' => 'required|date',
        ]);

        try {
            $attendance = Attendance::findOrFail($id);
            $attendance->update([
                'scan_time' => Carbon::parse($request->scan_time),
            ]);

            return redirect()->back()->with('success', 'Data kehadiran berhasil diperbarui');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
