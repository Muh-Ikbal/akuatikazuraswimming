<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CmsFeatureController extends Controller
{
    public function index()
    {
        try {
            $features = Feature::ordered()->get();

            return Inertia::render('admin/cms/keunggulan', [
                'features' => $features,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'icon' => 'required|string|max:50',
        ]);

        try {
            $maxOrder = Feature::max('order') ?? 0;

            Feature::create([
                'title' => $request->title,
                'description' => $request->description,
                'icon' => $request->icon,
                'order' => $maxOrder + 1,
                'is_active' => true,
            ]);

            return redirect()->back()->with('success', 'Keunggulan berhasil ditambahkan.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'icon' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        try {
            $feature = Feature::findOrFail($id);
            $feature->update([
                'title' => $request->title,
                'description' => $request->description,
                'icon' => $request->icon,
                'is_active' => $request->is_active ?? true,
            ]);

            return redirect()->back()->with('success', 'Keunggulan berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $feature = Feature::findOrFail($id);
            $feature->delete();

            return redirect()->back()->with('success', 'Keunggulan berhasil dihapus.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:features,id',
            'orders.*.order' => 'required|integer',
        ]);

        try {
            foreach ($request->orders as $item) {
                Feature::where('id', $item['id'])->update(['order' => $item['order']]);
            }

            return redirect()->back()->with('success', 'Urutan berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
