<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QrCodeGenerate;
use App\Models\User;
use App\Models\AttandanceEmployee;
use App\Models\Schedule;

class AttandanceEmployeeController extends Controller
{
    public function index()
    {
        try {
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
            $attendanceToday = AttandanceEmployee::whereDate('scan_time', today())->count();
            
            return Inertia::render('operator/scan-qr-employee', [
                'attendanceToday' => $attendanceToday,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function verify(Request $request)
    {
        
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        try {
            $attendanceToday = AttandanceEmployee::whereDate('scan_time', today())->count();

            // Find QR Code
            $qrCode = QrCodeGenerate::where('qr_code', $request->qr_code)->first();

            if (!$qrCode) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'QR Code tidak ditemukan atau tidak valid',
                    'employee' => $request->qr_code,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            $user = User::find($qrCode->user_id);



            if (!$user) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'User tidak ditemukan',
                    'employee' => $request->qr_code,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            // Check if user has employee role (coach, admin, operator)
            $roles = $user->getRoleNames();
            $allowedRoles = ['coach', 'admin', 'operator'];
            $isEmployee = false;
            $userRole = '';
             
            foreach ($roles as $role) {
                if (in_array($role, $allowedRoles)) {
                    $isEmployee = true;
                    $userRole = $role;
                    break;
                }
            }

            if (!$isEmployee) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Silahkan absen di menu member',
                    'employee' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            $scheduleToday = null;
            $state = 'present';
            
            // 1. Find matching session based on current time (Applies to ALL roles)
            $currentTime = now()->format('H:i:s');
            $session = \App\Models\EmployeeAttendanceSession::where('start_time', '<=', $currentTime)
                ->where('end_time', '>=', $currentTime)
                ->first();
            // dd($session);

            if (!$session) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Diluar jam absensi pegawai yang ditentukan',
                    'employee' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            // 2. Determine state based on session late/alpha threshold
            if ($session->alpha_threshold && $currentTime > $session->alpha_threshold) {
                $state = 'alpha';
            } elseif ($currentTime > $session->late_threshold) {
                $state = 'late';
            }

            // 3. Role-specific checks
            if ($userRole === 'coach') {
                // Get coach record
                $coach = \App\Models\Coach::where('user_id', $user->id)->first();
                
                if (!$coach) {
                    return back()->with('scan_result', [
                        'success' => false,
                        'message' => 'Data coach tidak ditemukan',
                        'employee' => $user->name,
                        'attendanceToday' => $attendanceToday,
                    ]);
                }

                // Find schedule for this coach today
                $scheduleToday = Schedule::where('coach_id', $coach->id)
                    ->whereDate('date', today())
                    ->whereTime('end_time', '>=', now())
                    ->first();

                if (!$scheduleToday) {
                    return back()->with('scan_result', [
                        'success' => false,
                        'message' => 'Anda tidak memiliki jadwal mengajar saat ini',
                        'employee' => $user->name,
                        'attendanceToday' => $attendanceToday,
                    ]);
                }

                // Check if already attended for this *schedule*
                $alreadyAttend = AttandanceEmployee::where('schedule_id', $scheduleToday->id)
                    ->where('user_id', $user->id)
                    ->exists();

                if ($alreadyAttend) {
                    return back()->with('scan_result', [
                        'success' => false,
                        'message' => 'Anda sudah melakukan absensi pada sesi ini',
                        'employee' => $user->name,
                        'attendanceToday' => $attendanceToday,
                    ]);
                }
            } else {
                // Admin/Operator: Check if already attended for this *session* today
                $alreadyAttendSession = AttandanceEmployee::where('user_id', $user->id)
                    ->where('employee_attendance_session_id', $session->id)
                    ->whereDate('scan_time', today())
                    ->exists();

                if ($alreadyAttendSession) {
                    return back()->with('scan_result', [
                        'success' => false,
                        'message' => 'Anda sudah melakukan absensi pada sesi ' . $session->name . ' hari ini',
                        'employee' => $user->name,
                        'attendanceToday' => $attendanceToday,
                    ]);
                }
            }

            // Create attendance record
            AttandanceEmployee::create([
                'user_id' => $user->id,
                'scan_time' => now(),
                'schedule_id' => $scheduleToday ? $scheduleToday->id : null,
                'employee_attendance_session_id' => $session->id, 
                'state' => $state,
            ]);

            $attendanceToday = $attendanceToday + 1;

            return back()->with('scan_result', [
                'success' => true,
                'message' => "Absensi berhasil dicatat" . 
                    ($state === 'late' ? ' (Terlambat)' : ($state === 'alpha' ? ' (Alpa)' : '')),
                'employee' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => ucfirst($userRole),
                    'qr_code' => $qrCode->qr_code,
                ],
                'timestamp' => now()->format('H:i:s'),
                'attendanceToday' => $attendanceToday,
                'state' => $state,
            ]);
        } catch (\Throwable $th) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $th->getMessage(),
                'employee' => $request->qr_code,
                'attendanceToday' => $attendanceToday ?? 0,
            ]);
        }
    }
}
