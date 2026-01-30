<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QrCodeGenerate;
use App\Models\User;
use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Schedule;
use App\Models\EnrolmentCourse;

class ScanQRController extends Controller
{
    public function index()
    {
        try {
            $attendance = Attendance::whereDate('scan_time', today())->count();
            return Inertia::render('operator/scan-qr-member', [
                'attendance' => $attendance,
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
            $qrCode = QrCodeGenerate::where('qr_code', $request->qr_code)->first();
            
            // Check if QR code exists before accessing properties (like user_id)
            if (!$qrCode) {
                // If we can't find the QR code, we also can't find the user easily unless passed differently, 
                // but let's assume we need a valid QR code first.
                // Re-fetch attendance stats for response
                $attendanceToday = Attendance::whereDate('scan_time', today())->count();
                
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'QR Code tidak ditemukan atau tidak valid',
                    'member' => $request->qr_code,
                    'attendanceToday' => $attendanceToday,
                ]);
            }
            
            $user = User::find($qrCode->user_id);
            $attendanceToday = Attendance::whereDate('scan_time', today())->count();

            if (!$user) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Member tidak ditemukan',
                    'member' => $request->qr_code,
                    'attendanceToday' => $attendanceToday,
                ]);
            }
            
            $role = $user->getRoleNames();

            if(!isset($role[0]) || $role[0] != 'member'){
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Silahkan absen dimenu pegawai',
                    'member' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            // Ambil class session hanya dari enrolment yang masih aktif (on_progress)
            $classSessions = ClassSession::whereHas('enrolment', function ($query) use ($user) {
                $query->whereHas('member', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                })->where('state', 'on_progress');
            })
            ->first();

            if(!$classSessions ){
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Anda tidak memiliki kelas aktif saat ini',
                    'member' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            // sesi jam
            $todaySchedule = Schedule::where('class_session_id', $classSessions->id)
                ->whereDate('date', today())
                ->whereTime('time', '<=', now())
                ->whereTime('end_time', '>=', now())
                ->first();

            if(!$todaySchedule ){
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Kelas anda tidak ada sesi dijam ini',
                    'member' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            $alreadyAttend = Attendance::where('user_id', $qrCode->user_id)
                ->where('schedule_id', $todaySchedule->id)
                ->exists();
            
            if ($alreadyAttend) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Anda sudah melakukan absensi pada sesi ini',
                    'member' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            // Ambil enrolment berdasarkan class session yang sedang dihadiri
            $enrolmentCourse = EnrolmentCourse::whereHas('member', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
                ->where('class_session_id', $classSessions->id)
                ->where('state', 'on_progress')
                ->first();

            // Validasi enrolment
            if (!$enrolmentCourse) {
                return back()->with('scan_result', [
                    'success' => false,
                    'message' => 'Anda tidak memiliki pendaftaran kursus aktif untuk kelas ini',
                    'member' => $user->name,
                    'attendanceToday' => $attendanceToday,
                ]);
            }

            $enrolmentCourse->update([
                'meeting_count' => $enrolmentCourse->meeting_count + 1,
            ]);
        
            Attendance::create([
                'user_id' => $user->id,
                'schedule_id' => $todaySchedule->id,
                'scan_time' => now(),
                'enrolment_course_id' => $enrolmentCourse->id,
                'class_session_id' => $classSessions->id ?? null,
            ]);

            $attendanceToday = $attendanceToday + 1;

            return back()->with('scan_result', [
                'success' => true,
                'message' => 'Absensi berhasil dicatat',
                'member' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'qr_code' => $qrCode->qr_code,
                    'status' => 'active',
                ],
                'timestamp' => now()->format('H:i:s'),
                'attendanceToday' => $attendanceToday,
            ]);
        } catch (\Throwable $th) {
            $attendanceToday = isset($attendanceToday) ? $attendanceToday : 0;
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $th->getMessage(),
                'member' => $request->qr_code,
                'attendanceToday' => $attendanceToday,
            ]);
        }
    }
}
