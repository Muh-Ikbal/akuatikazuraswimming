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
        $attendanceToday = AttandanceEmployee::whereDate('scan_time', today())->count();
        
        return Inertia::render('operator/scan-qr-employee', [
            'attendanceToday' => $attendanceToday,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);


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

        // Coach must have a schedule to scan attendance
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

            // Check if already attended for this schedule
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
            // Admin/Operator: per-session attendance (pagi/sore), no schedule_id needed
            $currentHour = now()->format('H:i');
            $currentSession = $currentHour < '12:00' ? 'pagi' : 'sore';
            
            // Check if already attended for this session today
            if ($currentSession === 'pagi') {
                $alreadyAttendSession = AttandanceEmployee::where('user_id', $user->id)
                    ->whereDate('scan_time', today())
                    ->whereTime('scan_time', '<', '12:00:00')
                    ->exists();
            } else {
                $alreadyAttendSession = AttandanceEmployee::where('user_id', $user->id)
                    ->whereDate('scan_time', today())
                    ->whereTime('scan_time', '>=', '12:00:00')
                    ->exists();
            }

            if ($alreadyAttendSession) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Anda sudah melakukan absensi pada sesi ' . $currentSession . ' hari ini',
                    'employee' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }
        }

        // Determine state based on time (hardcoded lateness thresholds)
        // Session 1 (pagi): late if after 07:40
        // Session 2 (sore): late if after 15:40
        $state = 'present';
        $currentHour = now()->format('H:i');
        
        // Cek sesi berdasarkan jam saat ini
        if ($currentHour < '12:00') {
            // Sesi 1 (Pagi) - terlambat jika setelah 07:40
            if ($currentHour > '07:40') {
                $state = 'late';
            }
        } else {
            // Sesi 2 (Sore) - terlambat jika setelah 15:40
            if ($currentHour > '15:40') {
                $state = 'late';
            }
        }

        // Create attendance record
        AttandanceEmployee::create([
            'user_id' => $user->id,
            'scan_time' => now(),
            'schedule_id' => $scheduleToday ? $scheduleToday->id : null,
            'state' => $state,
        ]);

        $attendanceToday = $attendanceToday + 1;

        return back()->with('scan_result', [
            'success' => true,
            'message' => "Absensi berhasil dicatat" . ($state === 'late' ? ' (Terlambat)' : ''),
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
    }
}
