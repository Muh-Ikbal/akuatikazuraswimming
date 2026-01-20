<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Models\Feature;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hero Section Settings
        $heroSettings = [
            'hero_title' => 'Belajar Berenang dengan Menyenangkan',
            'hero_subtitle' => 'Kursus renang profesional untuk semua usia. Didampingi coach bersertifikasi dalam lingkungan yang aman dan menyenangkan.',
            'hero_image' => null,
            'satisfaction_rate' => '98',
        ];

        foreach ($heroSettings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Contact Settings
        $contactSettings = [
            'contact_phone' => '+62 812 3456 7890',
            'contact_email' => 'info@akuatikazura.com',
            'contact_address' => 'Jl. Renang No. 123, Jakarta',
        ];

        foreach ($contactSettings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Default Features (Keunggulan)
        $features = [
            [
                'title' => 'Coach Bersertifikasi',
                'description' => 'Pelatih profesional dengan sertifikasi PRSI dan pengalaman bertahun-tahun',
                'icon' => 'Award',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Keamanan Terjamin',
                'description' => 'Fasilitas kolam renang yang aman dengan pengawasan ketat',
                'icon' => 'Shield',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Kelas Kecil',
                'description' => 'Maksimal 8 peserta per kelas untuk perhatian maksimal',
                'icon' => 'Users',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Jadwal Fleksibel',
                'description' => 'Pilihan waktu yang beragam sesuai kesibukan Anda',
                'icon' => 'Calendar',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($features as $feature) {
            Feature::updateOrCreate(
                ['title' => $feature['title']],
                $feature
            );
        }
    }
}
