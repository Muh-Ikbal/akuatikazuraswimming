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



        $scheduleToday = Schedule::whereDate('date', today())->whereTime('time', '<=', now())->whereTime('end_time', '>=', now())->first();

        if(!$scheduleToday){
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Tidak ada sesi dijam ini',
                'employee' => $user->name,
                'attendanceToday' => $attendanceToday,
            ]);
        }

        
        // Check if already attended today (max 2 times - check-in and check-out)
        $alreadyAttend = AttandanceEmployee::where('schedule_id', $scheduleToday->id)
            ->exist();

        if ($alreadyAttend) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Anda sudah melakukan absensi 2x hari ini (masuk & pulang)',
                'employee' => $user->name,
                'attendanceToday' => $attendanceToday,
            ]);
        }

        // Determine state based on time (e.g., late if after 08:30)
        $state = 'present';
        $currentHour = now()->format('H:i');
        if ($alreadyAttend == 0 && $currentHour > '07:40') {
            $state = 'late';
        }else if($currentHour>'15:40'){
            $state = 'late';
        }

        // Create attendance record
        AttandanceEmployee::create([
            'user_id' => $user->id,
            'scan_time' => now(),
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
            'attendanceType' => $attendanceType,
            'state' => $state,
        ]);
    }
}
