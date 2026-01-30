<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AttandanceEmployee;
use Carbon\Carbon;

class AdminCoachAttendanceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = AttandanceEmployee::with([
                'user.roles',
                'schedule.class_session'
            ])->whereHas('user.roles', function ($q) {
                $q->where('name', '!=', 'member');
            });
    
            // Filter by date range
            if ($request->has('start_date') && $request->start_date) {
                $query->whereDate('scan_time', '>=', $request->start_date);
            }
            if ($request->has('end_date') && $request->end_date) {
                $query->whereDate('scan_time', '<=', $request->end_date);
            }
    
            // Search by user name
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            }
    
            $attendances = $query->orderBy('scan_time', 'desc')->paginate(15);
    
            // Transform data for frontend
            $attendanceData = $attendances->through(function ($attendance) {
                $classSessionTitle = '-';
                $userRole = $attendance->user->roles->first()->name ?? '-';
                
                // Hanya tampilkan kelas untuk coach yang punya jadwal
                if ($userRole === 'coach' && $attendance->schedule && $attendance->schedule->class_session) {
                    $classSessionTitle = $attendance->schedule->class_session->title;
                }
    
                return [
                    'id' => $attendance->id,
                    'employee_name' => $attendance->user->name ?? '-',
                    'role' => $userRole,
                    'class_session' => $classSessionTitle,
                    'scan_time' => Carbon::parse($attendance->scan_time)->format('d M Y H:i'),
                    'date' => Carbon::parse($attendance->scan_time)->format('Y-m-d'),
                    'state' => $attendance->state,
                ];
            });
    
            // Statistics
            $today = Carbon::today();
            $thisMonth = Carbon::now()->startOfMonth();
    
            $stats = [
                'total' => AttandanceEmployee::count(),
                'today' => AttandanceEmployee::whereDate('scan_time', $today)->count(),
                'this_month' => AttandanceEmployee::where('scan_time', '>=', $thisMonth)->count(),
            ];
    
            return Inertia::render('admin/kehadiran/coach', [
                'attendances' => $attendanceData,
                'stats' => $stats,
                'filters' => [
                    'search' => $request->search ?? '',
                    'start_date' => $request->start_date ?? '',
                    'end_date' => $request->end_date ?? '',
                ],
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $attendance = AttandanceEmployee::findOrFail($id);
            $attendance->delete();
    
            return redirect()->back()->with('success', 'Data kehadiran berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
