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
        $features = Feature::ordered()->get();

        return Inertia::render('admin/cms/keunggulan', [
            'features' => $features,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'icon' => 'required|string|max:50',
        ]);

        $maxOrder = Feature::max('order') ?? 0;

        Feature::create([
            'title' => $request->title,
            'description' => $request->description,
            'icon' => $request->icon,
            'order' => $maxOrder + 1,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Keunggulan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'icon' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        $feature = Feature::findOrFail($id);
        $feature->update([
            'title' => $request->title,
            'description' => $request->description,
            'icon' => $request->icon,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->back()->with('success', 'Keunggulan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $feature = Feature::findOrFail($id);
        $feature->delete();

        return redirect()->back()->with('success', 'Keunggulan berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:features,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            Feature::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return redirect()->back()->with('success', 'Urutan berhasil diperbarui.');
    }
}
