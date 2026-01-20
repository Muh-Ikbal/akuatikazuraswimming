<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\User;
use App\Models\EnrolmentCourse;
use App\Models\Payment;
use App\Models\Course;
use App\Models\ClassSession;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::with('user')->paginate(10);
        
        return Inertia::render('admin/member_management', [
            'members' => $members
        ]);
    }

    public function create()
    {
        $courses = Course::get(['id','title']);
        $classSessions = ClassSession::get(['id','title','course_id']);
        return Inertia::render('admin/member/create', [
            'courses' => $courses,
            'classSessions' => $classSessions,
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            // Member data
            'name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required|string',
            'phone_number' => 'required|string|max:20',
            'parent_name' => 'required|string|max:255',
            'parent_phone_number' => 'required|string|max:20',
            'email' => 'required|nullable|email|unique:users,email',
            'password' => ['required', 'nullable', 'confirmed', Password::defaults()],
            'course_id' => 'required|exists:courses,id',
            'class_session_id' => 'required|exists:class_sessions,id',

        ]);

        DB::transaction(function () use ($validated) {
            $userId = null;

            // Create user if requested
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $user->assignRole('member');
            $userId = $user->id;

            // Create member
            $member = Member::create([
                'name' => $validated['name'],
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'address' => $validated['address'],
                'phone_number' => $validated['phone_number'],
                'parent_name' => $validated['parent_name'],
                'parent_phone_number' => $validated['parent_phone_number'],
                'user_id' => $userId,
            ]);
            // create enrolment
            $memberId = $member->id; 
            $enrolmentCourse = EnrolmentCourse::create([
                'member_id' => $memberId,
                'course_id' => $validated['course_id'],
                'class_session_id' => $validated['class_session_id'],
            ]);

            $course = Course::findOrFail($validated['course_id']);
            $enrolmentCourseId = $enrolmentCourse->id;
            Payment::create([
                'enrolment_course_id' => $enrolmentCourseId,
                'amount' => $course->price,
                'state' => 'pending',
            ]);
        });

        return redirect('/management-member')->with('success', 'Member berhasil ditambahkan');
    }

    public function show($id)
    {
        $member = Member::with('user')->findOrFail($id);
        
        return Inertia::render('admin/member/show', [
            'member' => $member
        ]);
    }

    public function edit($id)
    {
        $member = Member::with('user')->findOrFail($id);
        // Get users with 'member' role that are not linked to any member OR linked to this member
        $users = User::role('member')
            ->where(function($query) use ($member) {
                $query->whereDoesntHave('member')
                    ->orWhere('id', $member->user_id);
            })
            ->get(['id', 'name', 'email']);
        
        return Inertia::render('admin/member/create', [
            'member' => $member,
            'users' => $users
        ]);
    }

    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required|string',
            'phone_number' => 'required|string|max:20',
            'parent_name' => 'required|string|max:255',
            'parent_phone_number' => 'required|string|max:20',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $member->update([
            'name' => $validated['name'],
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'address' => $validated['address'],
            'phone_number' => $validated['phone_number'],
            'parent_name' => $validated['parent_name'],
            'parent_phone_number' => $validated['parent_phone_number'],
            'user_id' => $validated['user_id'] ?? null,
        ]);

        // Update linked user name if exists
        if ($member->user_id && $member->user) {
            $member->user->update(['name' => $validated['name']]);
        }

        return redirect('/management-member')->with('success', 'Member berhasil diupdate');
    }

    public function destroy($id)
    {
        $member = Member::findOrFail($id);

        $enrolments = EnrolmentCourse::where('member_id', $id)->get();
        if($enrolments->count() > 0){
            return redirect('/management-member')->with('error', 'Member masih memiliki enrolment');
        }
        $member->delete();

        return redirect('/management-member')->with('success', 'Member berhasil dihapus');
    }
}
