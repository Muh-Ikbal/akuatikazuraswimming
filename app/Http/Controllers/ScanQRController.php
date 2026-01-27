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

        $attendance = Attendance::whereDate('scan_time', today())->count();
        return Inertia::render('operator/scan-qr-member', [
            'attendance' => $attendance,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);



        $qrCode = QrCodeGenerate::where('qr_code', $request->qr_code)->first();
        $user = User::find($qrCode->user_id);

        $role = $user->getRoleNames();
        $attendanceToday = Attendance::whereDate('scan_time', today())
            ->count();

        if($role[0] != 'member'){
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Silahkan absen dimenu pegawai',
                'member' => $user->name,
                'attendanceToday' => $attendanceToday,
            ]);
        }

        if (!$qrCode) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'QR Code tidak ditemukan atau tidak valid',
                'member' => $request->qr_code,
                'attendanceToday' => $attendanceToday,
            ]);
        }

        if (!$user) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Member tidak ditemukan',
                'member' => $request->qr_code,
                'attendanceToday' => $attendanceToday,
            ]);
        }

        

        

        

        $classSessions = ClassSession::whereHas('enrolment.member', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->first();

        if(!$classSessions ){
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Anda tidak terdaftar di kelas mana pun',
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
        // dd($todaySchedule->id);


        $alreadyAttend = Attendance::where('user_id', $qrCode->user_id)
            ->where('schedule_id', $todaySchedule->id)
            ->exists();
        

        if ($alreadyAttend) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Anda sudah melakukan absensi hari ini',
                'member' => $user->name,
                'attendanceToday' => $attendanceToday,
            ]);
        }
        // else if($role[0] == 'coach'){
        //     $classSessions = ClassSession::whereHas('coach', function ($query) use ($user) {
        //     $query->where('user_id', $user->id);
        // })
        // ->first();

        //     if(!$classSessions ){
        //         return back()->with('scan_result', [
        //             'success' => false,
        //             'message' => 'Anda tidak terdaftar di kelas mana pun',
        //             'member' => $user->name,
        //             'attendanceToday' => $attendanceToday,
        //         ]);
        //     }
        // }

        $enrolmentCourse = EnrolmentCourse::whereHas('member', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->first();

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
    }
}
