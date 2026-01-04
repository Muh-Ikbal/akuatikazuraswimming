<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Coach;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class CoachController extends Controller
{
    public function index()
    {
        $coaches = Coach::with('user')->paginate(10);
        
        return Inertia::render('admin/coach_management', [
            'coaches' => $coaches
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/coach/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Coach data
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'image' => 'nullable|image|max:2048',
            // User data
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('coaches', 'public');
            }

            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $user->assignRole('coach');

            // Create coach
            Coach::create([
                'name' => $validated['name'],
                'phone_number' => $validated['phone_number'],
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'image' => $imagePath,
                'user_id' => $user->id,
            ]);
        });

        return redirect('/management-coach')->with('success', 'Coach berhasil ditambahkan');
    }

    public function show($id)
    {
        $coach = Coach::with('user')->findOrFail($id);
        
        return Inertia::render('admin/coach/show', [
            'coach' => $coach
        ]);
    }

    public function edit($id)
    {
        $coach = Coach::with('user')->findOrFail($id);
        // Get users with 'coach' role that are not linked to any coach OR linked to this coach
        $users = User::role('coach')
            ->where(function($query) use ($coach) {
                $query->whereDoesntHave('coach')
                    ->orWhere('id', $coach->user_id);
            })
            ->get(['id', 'name', 'email']);
        
        return Inertia::render('admin/coach/create', [
            'coach' => $coach,
            'users' => $users
        ]);
    }

    public function update(Request $request, $id)
    {
        $coach = Coach::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'image' => 'nullable|image|max:2048',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($coach->image) {
                Storage::disk('public')->delete($coach->image);
            }
            $validated['image'] = $request->file('image')->store('coaches', 'public');
        }

        $coach->update([
            'name' => $validated['name'],
            'phone_number' => $validated['phone_number'],
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'image' => $validated['image'] ?? $coach->image,
            'user_id' => $validated['user_id'] ?? $coach->user_id,
        ]);

        // Update linked user name if exists
        if ($coach->user_id && $coach->user) {
            $coach->user->update(['name' => $validated['name']]);
        }

        return redirect('/management-coach')->with('success', 'Coach berhasil diupdate');
    }

    public function destroy($id)
    {
        $coach = Coach::findOrFail($id);
        
        // Delete image
        if ($coach->image) {
            Storage::disk('public')->delete($coach->image);
        }
        
        $coach->delete();

        return redirect('/management-coach')->with('success', 'Coach berhasil dihapus');
    }
}
