<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CmsGalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::latest()->get();

        return Inertia::render('admin/cms/gallery/index', [
            'galleries' => $galleries,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'title' => 'nullable|string|max:255',
        ]);

        $path = $request->file('image')->store('cms/gallery', 'public');

        Gallery::create([
            'image' => $path,
            'title' => $request->title,
        ]);

        return redirect()->back()->with('success', 'Gambar berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        if (Storage::disk('public')->exists($gallery->image)) {
            Storage::disk('public')->delete($gallery->image);
        }

        $gallery->delete();

        return redirect()->back()->with('success', 'Gambar berhasil dihapus.');
    }
}
