<?php

namespace App\Http\Controllers;

use App\Models\EnrolmentCourse;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportMemberController extends Controller
{
    private function getReportData(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        $status = $request->input('status');

        $query = EnrolmentCourse::with(['member', 'class_session', 'course', 'payment.promo', 'attendance'])
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate);

        if ($status) {
            $query->where('state', $status);
        }

        $enrolments = $query->latest()->get()->map(function ($enrolment) {
            $member = $enrolment->member;
            
            // Logic for Description (Keterangan)
            $firstEnrolment = EnrolmentCourse::where('member_id', $member->id)->orderBy('id')->first();
            
            $isNew = false;
            // Check if this enrolment is the first one
            if ($firstEnrolment && $firstEnrolment->id == $enrolment->id) {
                $isNew = true;
            }

            $courseName = $enrolment->class_session ? $enrolment->class_session->title : '-';
            // "jumlah pertemuan kursus yang diikuti (dari tabel courses)"
            $meetingCount = $enrolment->course ? $enrolment->course->total_meeting : $enrolment->meeting_count;
            $paymentNote = $enrolment->payment->promo ? $enrolment->payment->promo->title : ' ';

            if ($isNew) {
                $description = "Baru {$courseName} - {$meetingCount}X Pertemuan - {$paymentNote}";
            } else {
                $description = "Lanjut {$courseName} - {$meetingCount}X Pertemuan - {$paymentNote}";
            }

            // Remaining sessions
            // Sisa pertemuan = Quota - Attended
            // Assuming meeting_count in EnrolmentCourse is the purchased quota
            $totalQuota = $enrolment->meeting_count; 
            // $attended = $enrolment->attendance->count();
            // $remaining = max(0, $totalQuota - $attended);

            // Payment Date
            $paymentDate = $enrolment->payment ? $enrolment->payment->created_at : $enrolment->created_at;

            return [
                'id' => $enrolment->id,
                'joined_date' => $paymentDate->format('Y-m-d'), // Renamed usage in frontend to Tanggal Pembayaran
                'name' => $member->name, // Nama
                'description' => $description, // Keterangan
                'amount' => $enrolment->payment ? $enrolment->payment->amount_paid : 0, // Jumlah Bayar
                'remaining_sessions' => $totalQuota, // Sisa Pertemuan
                'phone_number' => $member->phone_number,
                'enrolment_date' => $enrolment->created_at->format('Y-m-d'), // For reference
                'status' => $enrolment->state,
                'class_name' => $courseName, // For grouping in export
            ];
        });

        return [
            'data' => $enrolments,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
            ]
        ];
    }

    public function index(Request $request)
    {
        $result = $this->getReportData($request);

        return Inertia::render('admin/report/member/index', [
            'data' => $result['data'],
            'filters' => $result['filters']
        ]);
    }

    public function export(Request $request)
    {
        $result = $this->getReportData($request);
        $fileName = 'Laporan_Member_' . $result['filters']['start_date'] . '_sd_' . $result['filters']['end_date'] . '.xlsx';
        
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\MemberReportMultiSheetExport($result['data'],$result['filters']['start_date'],$result['filters']['end_date']), $fileName);
    }
}
