<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Coach;
use App\Models\User;
use App\Models\CertificateCoach;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use App\Models\ClassSession;

class CoachController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->query('search');
        $coaches = Coach::with('user')
        ->when($search, function ($query,$search){
            $query->whereHas('user', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        })
        ->paginate(10)
        ->withQueryString();

        $coachStats = Coach::with('user')->get();
        
        return Inertia::render('admin/coach_management', [
            'coaches' => $coaches,
            'coachStats'=>$coachStats,
            'filters' => $request->only(['search']),
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
            'address' => 'required|string',
            'birthplace' => 'required|string',
            // User data
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            // Certificates
            'certificates' => 'nullable|array',
            'certificates.*.title' => 'required_with:certificates|string|max:255',
            'certificates.*.description' => 'nullable|string',
            'certificates.*.image' => 'nullable|image|max:2048',
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
            $coach = Coach::create([
                'name' => $validated['name'],
                'phone_number' => $validated['phone_number'],
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'address' => $validated['address'],
                'birthplace' => $validated['birthplace'],
                'image' => $imagePath,
                'user_id' => $user->id,
            ]);

            // Create certificates
            if ($request->has('certificates')) {
                foreach ($request->certificates as $index => $certData) {
                    $certImagePath = null;
                    if ($request->hasFile("certificates.{$index}.image")) {
                        $certImagePath = $request->file("certificates.{$index}.image")->store('certificates', 'public');
                    }
                    
                    CertificateCoach::create([
                        'title' => $certData['title'],
                        'description' => $certData['description'] ?? '',
                        'image' => $certImagePath,
                        'coach_id' => $coach->id,
                    ]);
                }
            }
        });

        return redirect('/management-coach')->with('success', 'Coach berhasil ditambahkan');
    }

    public function show($id)
    {
        $coach = Coach::with(['user', 'certificate_coaches'])->findOrFail($id);
        
        return Inertia::render('admin/coach/show', [
            'coach' => $coach
        ]);
    }

    public function edit($id)
    {
        $coach = Coach::with(['user', 'certificate_coaches'])->findOrFail($id);
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
            'address' => 'required|string',
            'birthplace' => 'required|string',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'image' => 'nullable|image|max:2048',
            'user_id' => 'nullable|exists:users,id',
            // Certificates
            'certificates' => 'nullable|array',
            'certificates.*.id' => 'nullable|exists:certificate_coaches,id',
            'certificates.*.title' => 'required_with:certificates|string|max:255',
            'certificates.*.description' => 'nullable|string',
            'certificates.*.image' => 'nullable|image|max:2048',
            'deleted_certificates' => 'nullable|array',
            'deleted_certificates.*' => 'exists:certificate_coaches,id',
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
            'address' => $validated['address'],
            'birthplace' => $validated['birthplace'],
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'image' => $validated['image'] ?? $coach->image,
            'user_id' => $validated['user_id'] ?? $coach->user_id,
        ]);

        // Update linked user name if exists
        if ($coach->user_id && $coach->user) {
            $coach->user->update(['name' => $validated['name']]);
        }

        // Handle deleted certificates
        if ($request->has('deleted_certificates')) {
            foreach ($request->deleted_certificates as $certId) {
                $cert = CertificateCoach::find($certId);
                if ($cert && $cert->coach_id == $coach->id) {
                    if ($cert->image) {
                        Storage::disk('public')->delete($cert->image);
                    }
                    $cert->delete();
                }
            }
        }

        // Handle certificates (create new or update existing)
        if ($request->has('certificates')) {
            foreach ($request->certificates as $index => $certData) {
                $certImagePath = null;
                if ($request->hasFile("certificates.{$index}.image")) {
                    $certImagePath = $request->file("certificates.{$index}.image")->store('certificates', 'public');
                }
                
                if (isset($certData['id']) && $certData['id']) {
                    // Update existing certificate
                    $cert = CertificateCoach::find($certData['id']);
                    if ($cert && $cert->coach_id == $coach->id) {
                        $updateData = [
                            'title' => $certData['title'],
                            'description' => $certData['description'] ?? '',
                        ];
                        if ($certImagePath) {
                            if ($cert->image) {
                                Storage::disk('public')->delete($cert->image);
                            }
                            $updateData['image'] = $certImagePath;
                        }
                        $cert->update($updateData);
                    }
                } else {
                    // Create new certificate
                    CertificateCoach::create([
                        'title' => $certData['title'],
                        'description' => $certData['description'] ?? '',
                        'image' => $certImagePath,
                        'coach_id' => $coach->id,
                    ]);
                }
            }
        }

        return redirect('/management-coach')->with('success', 'Coach berhasil diupdate');
    }

    public function destroy($id)
    {
        $coach = Coach::findOrFail($id);

        $class_coaches = ClassSession::where('coach_id', $coach->id)->get();
        if($class_coaches->count() > 0){
            return redirect('/management-coach')->with('error', 'Coach gagal dihapus, masih ada data yang terkait dengan coach ini');
        }
        
        // Delete image
        if ($coach->image) {
            Storage::disk('public')->delete($coach->image);
        }

        $certificates = CertificateCoach::where('coach_id', $coach->id)->get();
        foreach ($certificates as $certificate) {
            if ($certificate->image) {
                Storage::disk('public')->delete($certificate->image);
            }
            $certificate->delete();
        }

        $coach->certificate_coaches()->delete();

        
        $coach->delete();

        return redirect('/management-coach')->with('success', 'Coach berhasil dihapus');
    }
}
