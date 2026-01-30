<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->query('search');
            $role = $request->query('role');
            
            $users = User::with('roles')
                ->when($search, function($query, $search) {
                    $query->where(function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->when($role && $role !== 'all', function($query) use ($role) {
                    $query->whereHas('roles', function($q) use ($role) {
                        $q->where('name', $role);
                    });
                })
                ->paginate(10)
                ->withQueryString();
            $roles = Role::all();
    
            $userStats = DB::table('users')
                ->leftJoin('model_has_roles', function ($join) {
                    $join->on('users.id', '=', 'model_has_roles.model_id')
                        ->where('model_has_roles.model_type', User::class);
                })
                ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->selectRaw('
                    COUNT(DISTINCT users.id) as total,
                    SUM(CASE WHEN roles.name = "admin" THEN 1 ELSE 0 END) as admin_count,
                    SUM(CASE WHEN roles.name = "coach" THEN 1 ELSE 0 END) as coach_count,
                    SUM(CASE WHEN roles.name = "member" THEN 1 ELSE 0 END) as member_count,
                    SUM(CASE WHEN roles.name = "operator" THEN 1 ELSE 0 END) as operator_count
                ')
                ->first();
            
            return Inertia::render('admin/user_management', [
                'users' => $users,
                'roles' => $roles,
                'stats' => $userStats,
                'filters' => [
                    'search' => $search,
                    'role' => $role,
                ],
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create()
    {
        $roles = Role::all();
        return Inertia::render('admin/user/create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Password::defaults()],
                'role' => 'required|string|exists:roles,name',
            ]);
    
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
    
            $user->assignRole($validated['role']);
    
            return redirect('/management-user')->with('success', 'User berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $roles = Role::all();
        
        return Inertia::render('admin/user/create', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'password' => ['nullable', 'confirmed', Password::defaults()],
                'role' => 'required|string|exists:roles,name',
            ]);
    
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);
    
            if (!empty($validated['password'])) {
                $user->update(['password' => Hash::make($validated['password'])]);
            }
    
            $user->syncRoles([$validated['role']]);
    
            return redirect('/management-user')->with('success', 'User berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // 1. Check for Dependencies (Prevention)
            if ($user->member) {
                return redirect()->back()->with('error', 'Gagal: User ini terhubung dengan data Member. Silahkan hapus data Member terlebih dahulu.');
            }
            
            if ($user->coach) {
                return redirect()->back()->with('error', 'Gagal: User ini terhubung dengan data Coach. Silahkan hapus data Coach terlebih dahulu.');
            }

            // 2. Delete the User
            DB::transaction(function () use ($user) {
                if ($user->qrCode) {
                    $user->qrCode->delete();
                }
                $user->delete();
            });
    
            return redirect('/management-user')->with('success', 'User berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
