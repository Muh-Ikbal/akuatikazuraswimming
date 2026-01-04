<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\User;
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
        return Inertia::render('admin/member/create');
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
            Member::create([
                'name' => $validated['name'],
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'address' => $validated['address'],
                'phone_number' => $validated['phone_number'],
                'parent_name' => $validated['parent_name'],
                'parent_phone_number' => $validated['parent_phone_number'],
                'user_id' => $userId,
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
        $member->delete();

        return redirect('/management-member')->with('success', 'Member berhasil dihapus');
    }
}
