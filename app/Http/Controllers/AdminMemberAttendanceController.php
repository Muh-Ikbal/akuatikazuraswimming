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
    
            return Inertia::render('admin/kehadiran/member', [
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
}
