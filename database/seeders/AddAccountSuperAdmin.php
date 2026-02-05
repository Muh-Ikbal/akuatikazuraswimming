<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AddAccountSuperAdmin extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@akuatikazura.com',
            'password' => bcrypt('password'),
        ]);
        $userAdmin->assignRole('super_admin');
    }
}
