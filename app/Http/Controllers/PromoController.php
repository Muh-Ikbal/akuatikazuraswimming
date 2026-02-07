<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Promo;

class PromoController extends Controller
{
    public function index()
    {
        try {
            $promos = Promo::orderBy('created_at', 'desc')->paginate(10);
            $promo_active = Promo::where('state', 'active')->count();
            $promo_inactive = Promo::where('state', 'inactive')->count();
            return Inertia::render('admin/promo_management', [
                'promos' => $promos,
                'promo_active' => $promo_active,
                'promo_inactive' => $promo_inactive,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create()
    {
        return Inertia::render('admin/promo/create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'discount_type' => 'required|in:percentage,fixed',
                'discount_value' => 'required|numeric|min:0',
                'state' => 'required|in:active,inactive',
            ]);
    
            Promo::create($validated);
    
            return redirect('/management-promo')->with('success', 'Promo berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id)
    {
        $promo = Promo::findOrFail($id);
        return Inertia::render('admin/promo/create', [
            'promo' => $promo
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'discount_type' => 'required|in:percentage,fixed',
                'discount_value' => 'required|numeric|min:0',
                'state' => 'required|in:active,inactive',
            ]);
    
            $promo = Promo::findOrFail($id);
            $promo->update($validated);
    
            return redirect('/management-promo')->with('success', 'Promo berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $promo = Promo::findOrFail($id);
            $promo->delete();
        } catch (\Throwable $th) {
            return redirect('/management-promo')->with('error', 'Promo gagal dihapus');
        }
        
        return redirect('/management-promo')->with('success', 'Promo berhasil dihapus');
    }
}
