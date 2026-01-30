<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CmsVisiMisiController extends Controller
{
    public function index()
    {
        try {
            $settings = SiteSetting::getMany([
                'visi_title',
                'visi_content',
                'misi_title',
                'misi_content',
            ]);

            return Inertia::render('admin/cms/visi-misi', [
                'settings' => $settings,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'visi_title' => 'required|string|max:255',
            'visi_content' => 'required|string|max:2000',
            'misi_title' => 'required|string|max:255',
            'misi_content' => 'required|string|max:2000',
        ]);

        try {
            SiteSetting::setValue('visi_title', $request->visi_title);
            SiteSetting::setValue('visi_content', $request->visi_content);
            SiteSetting::setValue('misi_title', $request->misi_title);
            SiteSetting::setValue('misi_content', $request->misi_content);

            return redirect()->back()->with('success', 'Visi & Misi berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
