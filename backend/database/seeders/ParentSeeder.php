<?php

namespace Database\Seeders;

use App\Models\ParentProfile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ParentSeeder extends Seeder
{
    public function run(): void
    {
        $roleId = Role::where('slug', 'parent')->value('id');

        $parents = [
            ['name' => 'Mr. & Mrs. Anderson', 'email' => 'anderson.parent@school.com', 'occupation' => 'Engineer'],
            ['name' => 'Mr. & Mrs. Thompson',  'email' => 'thompson.parent@school.com', 'occupation' => 'Doctor'],
            ['name' => 'Mr. & Mrs. Jackson',   'email' => 'jackson.parent@school.com',  'occupation' => 'Lawyer'],
            ['name' => 'Mr. & Mrs. White',     'email' => 'white.parent@school.com',    'occupation' => 'Accountant'],
            ['name' => 'Mr. & Mrs. Harris',    'email' => 'harris.parent@school.com',   'occupation' => 'Teacher'],
            ['name' => 'Mr. & Mrs. Martin',    'email' => 'martin.parent@school.com',   'occupation' => 'Business'],
            ['name' => 'Mr. & Mrs. Garcia',    'email' => 'garcia.parent@school.com',   'occupation' => 'Nurse'],
            ['name' => 'Mr. & Mrs. Martinez',  'email' => 'martinez.parent@school.com', 'occupation' => 'Architect'],
            ['name' => 'Mr. & Mrs. Robinson',  'email' => 'robinson.parent@school.com', 'occupation' => 'Banker'],
            ['name' => 'Mr. & Mrs. Clark',     'email' => 'clark.parent@school.com',    'occupation' => 'Pharmacist'],
            ['name' => 'Mr. & Mrs. Lewis',     'email' => 'lewis.parent@school.com',    'occupation' => 'Pilot'],
            ['name' => 'Mr. & Mrs. Walker',    'email' => 'walker.parent@school.com',   'occupation' => 'Manager'],
            ['name' => 'Mr. & Mrs. Hall',      'email' => 'hall.parent@school.com',     'occupation' => 'Scientist'],
            ['name' => 'Mr. & Mrs. Allen',     'email' => 'allen.parent@school.com',    'occupation' => 'Consultant'],
            ['name' => 'Mr. & Mrs. Young',     'email' => 'young.parent@school.com',    'occupation' => 'Entrepreneur'],
        ];

        foreach ($parents as $i => $p) {
            $user = User::create([
                'name'      => $p['name'],
                'email'     => $p['email'],
                'password'  => Hash::make('password'),
                'role_id'   => $roleId,
                'is_active' => true,
                'phone'     => '555-' . str_pad($i + 2001, 4, '0', STR_PAD_LEFT),
            ]);

            ParentProfile::create([
                'user_id'    => $user->id,
                'occupation' => $p['occupation'],
                'address'    => rand(10, 999) . ' Oak Avenue, City',
            ]);
        }
    }
}
