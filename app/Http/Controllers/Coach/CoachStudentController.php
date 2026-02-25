<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\EnrolmentCourse;

class CoachStudentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->query('search');

            $query = Member::with(['enrolments.course', 'enrolments.class_session']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone_number', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
                });
            }

            $totalStudents = Member::count();

            $paginated = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();

            // Transform the paginated data to include classes info
            $paginated->getCollection()->transform(function ($member) {
                $classes = $member->enrolments->map(function ($enrolment) {
                    return [
                        'class_title' => $enrolment->class_session?->title ?? '-',
                        'course_title' => $enrolment->course?->title ?? '-',
                        'enrolment_state' => $enrolment->state,
                    ];
                })->toArray();

                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'phone' => $member->phone_number,
                    'image' => $member->image,
                    'address' => $member->address,
                    'classes' => $classes,
                    'enrolment_count' => $member->enrolments->count(),
                ];
            });

            $stats = [
                'total_students' => $totalStudents,
            ];

            return Inertia::render('coach/siswa', [
                'students' => $paginated,
                'stats' => $stats,
                'filters' => $request->only(['search']),
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $member = Member::findOrFail($id);

            // Get all enrolments for this member (no coach filter)
            $enrolments = EnrolmentCourse::where('member_id', $member->id)
                ->with(['course', 'class_session', 'attendance'])
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

            $memberData = [
                'id' => $member->id,
                'name' => $member->name,
                'phone' => $member->phone_number,
                'image' => $member->image,
                'address' => $member->address,
                'gender' => $member->gender,
                'birth_date' => $member->birth_date,
            ];

            return Inertia::render('coach/riwayat-enrolment', [
                'member' => $memberData,
                'enrolments' => $enrolments,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function storeReport(Request $request, $id)
    {
        try {
            $request->validate([
                'report_member' => 'required|string',
            ]);

            $enrolment = EnrolmentCourse::findOrFail($id);

            if ($enrolment->state !== 'completed') {
                return redirect()->back()->with('error', 'Laporan hanya bisa ditambahkan pada enrolment yang sudah selesai.');
            }

            $enrolment->update([
                'report_member' => $request->report_member,
            ]);

            return redirect()->back()->with('success', 'Laporan member berhasil disimpan.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
