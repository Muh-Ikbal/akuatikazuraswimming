<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QrCodeGenerate;
use App\Models\User;

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

        $user = User::find($qrCode->user_id);

        if (!$user) {
            return back()->with('scan_result', [
                'success' => false,
                'message' => 'Member tidak ditemukan',
            ]);
        }

        // TODO: Add attendance record here
        // Attendance::create([
        //     'user_id' => $user->id,
        //     'scan_time' => now(),
        //     'operator_id' => auth()->id(),
        // ]);

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
