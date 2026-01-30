<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CmsHeroController extends Controller
{
    public function index()
    {
        try {
            $settings = SiteSetting::getMany([
                'hero_title',
                'hero_subtitle',
                'hero_image',
                'satisfaction_rate',
            ]);

            return Inertia::render('admin/cms/hero', [
                'settings' => $settings,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'required|string|max:500',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'satisfaction_rate' => 'required|numeric|min:0|max:100',
        ]);

        try {
            SiteSetting::setValue('hero_title', $request->hero_title);
            SiteSetting::setValue('hero_subtitle', $request->hero_subtitle);
            SiteSetting::setValue('satisfaction_rate', $request->satisfaction_rate);

            if ($request->hasFile('hero_image')) {
                // Delete old image if exists
                $oldImage = SiteSetting::getValue('hero_image');
                if ($oldImage && Storage::disk('public')->exists($oldImage)) {
                    Storage::disk('public')->delete($oldImage);
                }

                // Store new image
                $path = $request->file('hero_image')->store('cms/hero', 'public');
                SiteSetting::setValue('hero_image', $path);
            }

            return redirect()->back()->with('success', 'Hero section berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
