<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\SiteSetting;
use App\Models\Feature;
use App\Models\Course;
use App\Models\Coach;
use App\Models\Member;
use App\Models\Gallery;

class LandingController extends Controller
{
    public function index()
    {
        try {
            // Get hero and contact settings
            $settings = SiteSetting::getMany([
                'hero_title',
                'hero_subtitle',
                'hero_image',
                'satisfaction_rate',
                'contact_phone',
                'contact_email',
                'contact_address',
                'contact_instagram',
                'visi_title',
                'visi_content',
                'misi_title',
                'misi_content',
                'sejarah_title',
                'sejarah_content',
                'sejarah_image',
            ]);

            // Get active features
            $features = Feature::active()->ordered()->get();

            // Get active courses
            $courses = Course::where('state', 'active')->get();
            
            // Get coaches with certificates
            $coaches = Coach::with('certificate_coaches')->get();

            // Get galleries
            $galleries = Gallery::latest()->get();
            
            // Get stats
            $stats = [
                'members_count' => Member::count(),
                'coaches_count' => Coach::count(),
                'satisfaction_rate' => $settings['satisfaction_rate'] ?? '98',
            ];

            return Inertia::render('welcome', [
                'canRegister' => Features::enabled(Features::registration()),
                'settings' => $settings,
                'features' => $features,
                'courses' => $courses,
                'coaches' => $coaches,
                'galleries' => $galleries,
                'stats' => $stats,
            ]);
        } catch (\Throwable $th) {
             return redirect()->back()->with('error', 'Terjadi kesalahan saat memuat halaman utama: ' . $th->getMessage());
        }
    }
}
