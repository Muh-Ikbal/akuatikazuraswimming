<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Coach;
use App\Models\ClassSession;
use Carbon\Carbon;

class AdminCoachAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with([
            'user.coach',
            'classSession.course'
        ])
        ->whereHas('user.coach'); // Only coach attendances

        // dd($query->get());

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

        // Search by coach name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('user.coach', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        $attendances = $query->orderBy('scan_time', 'desc')->paginate(15);

        // Transform data for frontend
        $attendanceData = $attendances->through(function ($attendance) {
            return [
                'id' => $attendance->id,
                'coach_name' => $attendance->user->coach->name ?? '-',
                'class_session' => $attendance->classSession->title ?? '-',
                'course' => $attendance->classSession->course->title ?? '-',
                'scan_time' => Carbon::parse($attendance->scan_time)->format('d M Y H:i'),
                'date' => Carbon::parse($attendance->scan_time)->format('Y-m-d'),
            ];
        });

        // Get class sessions for filter
        $classSessions = ClassSession::with('course')->get()->map(function ($session) {
            return [
                'id' => $session->id,
                'title' => $session->title . ' - ' . ($session->course->title ?? ''),
            ];
        });

        // Statistics
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        $stats = [
            'total' => Attendance::whereHas('user.coach')->count(),
            'today' => Attendance::whereHas('user.coach')->whereDate('scan_time', $today)->count(),
            'this_month' => Attendance::whereHas('user.coach')->where('scan_time', '>=', $thisMonth)->count(),
        ];

        return Inertia::render('admin/kehadiran/coach', [
            'attendances' => $attendanceData,
            'class_sessions' => $classSessions,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search ?? '',
                'start_date' => $request->start_date ?? '',
                'end_date' => $request->end_date ?? '',
                'class_session_id' => $request->class_session_id ?? '',
            ],
        ]);
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return redirect()->back()->with('success', 'Data kehadiran berhasil dihapus');
    }
}
