<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserInitiationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userAdmin = User::create([
            'name' => 'Admin',
            'email' => 'admin@azura.id',
            'password' => bcrypt('password'),
        ]);
        $userAdmin->assignRole('admin');
        $userCoach = User::create([
            'name' => 'Coach',
            'email' => 'coach@azura.id',
            'password' => bcrypt('password'),
        ]);
        $userCoach->assignRole('coach');
        $userMember = User::create([
            'name' => 'Member',
            'email' => 'member@azura.id',
            'password' => bcrypt('password'),
        ]);
        $userMember->assignRole('member');
        $userOperator = User::create([
            'name' => 'Operator',
            'email' => 'operator@azura.id',
            'password' => bcrypt('password'),
        ]);
        $userOperator->assignRole('operator');
    }
}
