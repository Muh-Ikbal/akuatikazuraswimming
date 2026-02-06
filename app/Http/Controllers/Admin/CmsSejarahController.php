<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CmsSejarahController extends Controller
{
    public function index()
    {
        try {
            $settings = SiteSetting::getMany([
                'sejarah_title',
                'sejarah_content',
                'sejarah_image',
            ]);

            return Inertia::render('admin/cms/sejarah', [
                'settings' => $settings,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'sejarah_title' => 'required|string|max:255',
            'sejarah_content' => 'required|string|max:3000',
            'sejarah_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5048',
        ]);

        try {
            SiteSetting::setValue('sejarah_title', $request->sejarah_title);
            SiteSetting::setValue('sejarah_content', $request->sejarah_content);

            if ($request->hasFile('sejarah_image')) {
                // Delete old image if exists
                $oldImage = SiteSetting::getValue('sejarah_image');
                if ($oldImage && \Illuminate\Support\Facades\Storage::disk('public')->exists($oldImage)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldImage);
                }

                // Store new image
                $path = $request->file('sejarah_image')->store('cms/sejarah', 'public');
                SiteSetting::setValue('sejarah_image', $path);
            }

            return redirect()->back()->with('success', 'Sejarah berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
