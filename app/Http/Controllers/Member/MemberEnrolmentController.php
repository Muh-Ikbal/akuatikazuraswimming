<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\EnrolmentCourse;

class MemberEnrolmentController extends Controller
{
    public function index()
    {
        try {
            $user = auth()->user();
            $member = $user->member;

            $enrolments = collect();

            if ($member) {
                $enrolments = EnrolmentCourse::where('member_id', $member->id)
                    ->with(['course', 'class_session', 'attendance'])
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($enrolment) {
                        return [
                            'id' => $enrolment->id,
                            'course_title' => $enrolment->course?->title ?? '-',
                            'class_title' => $enrolment->class_session?->title ?? '-',
                            'meeting_count' => $enrolment->meeting_count,
                            'state' => $enrolment->state,
                            'state_member' => $enrolment->state_member,
                            'attendance_count' => $enrolment->attendance->count(),
                            'report_member' => $enrolment->report_member,
                            'created_at' => $enrolment->created_at?->format('d M Y'),
                        ];
                    });
            }

            return Inertia::render('member/riwayat-enrolment', [
                'enrolments' => $enrolments,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
