<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CmsContactController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::getMany([
            'contact_phone',
            'contact_email',
            'contact_address',
            'contact_instagram',
        ]);

        return Inertia::render('admin/cms/kontak', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'contact_phone' => 'required|string|max:50',
            'contact_email' => 'required|email|max:255',
            'contact_address' => 'required|string|max:500',
            'contact_instagram' => 'nullable|string|max:100',
        ]);

        SiteSetting::setValue('contact_phone', $request->contact_phone);
        SiteSetting::setValue('contact_email', $request->contact_email);
        SiteSetting::setValue('contact_address', $request->contact_address);
        SiteSetting::setValue('contact_instagram', $request->contact_instagram);

        return redirect()->back()->with('success', 'Informasi kontak berhasil diperbarui.');
    }
}
