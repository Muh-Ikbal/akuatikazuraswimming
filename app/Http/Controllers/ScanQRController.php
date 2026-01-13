<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QrCodeGenerate;
use App\Models\User;
use App\Models\Attendance;
use App\Models\ClassSession;

class ScanQRController extends Controller
{
    public function index()
    {
        return Inertia::render('operator/scan-qr');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);



        $qrCode = QrCodeGenerate::where('qr_code', $request->qr_code)->first();

        if (!$qrCode) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'QR Code tidak ditemukan atau tidak valid',
            ]);
        }

        $alreadyAttend = Attendance::where('user_id', $qrCode->user_id)
            ->whereDate('scan_time', today())
            ->exists();

        if ($alreadyAttend) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Anda sudah melakukan absensi hari ini',
            ]);
        }

        $user = User::find($qrCode->user_id);

        if (!$user) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Member tidak ditemukan',
            ]);
        }

        // TODO: Add attendance record here
        $classSessions = ClassSession::whereHas('enrolment.member', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->first();

        if(!$classSessions){
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Anda tidak terdaftar di kelas mana pun',
            ]);
        }

        Attendance::create([
            'user_id' => $user->id,
            'scan_time' => now(),
            'class_session_id' => $classSessions->id,
        ]);

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
        ]);
    }
}
