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
            ['name' => 'Mr. & Mrs. Sharma',    'email' => 'sharma.parent@school.com',    'occupation' => 'Engineer'],
            ['name' => 'Mr. & Mrs. Patel',     'email' => 'patel.parent@school.com',     'occupation' => 'Doctor'],
            ['name' => 'Mr. & Mrs. Singh',     'email' => 'singh.parent@school.com',     'occupation' => 'Lawyer'],
            ['name' => 'Mr. & Mrs. Verma',     'email' => 'verma.parent@school.com',     'occupation' => 'Accountant'],
            ['name' => 'Mr. & Mrs. Gupta',     'email' => 'gupta.parent@school.com',     'occupation' => 'Teacher'],
            ['name' => 'Mr. & Mrs. Joshi',     'email' => 'joshi.parent@school.com',     'occupation' => 'Businessman'],
            ['name' => 'Mr. & Mrs. Mehta',     'email' => 'mehta.parent@school.com',     'occupation' => 'Nurse'],
            ['name' => 'Mr. & Mrs. Yadav',     'email' => 'yadav.parent@school.com',     'occupation' => 'Architect'],
            ['name' => 'Mr. & Mrs. Mishra',    'email' => 'mishra.parent@school.com',    'occupation' => 'Banker'],
            ['name' => 'Mr. & Mrs. Tiwari',    'email' => 'tiwari.parent@school.com',    'occupation' => 'Pharmacist'],
            ['name' => 'Mr. & Mrs. Pandey',    'email' => 'pandey.parent@school.com',    'occupation' => 'Pilot'],
            ['name' => 'Mr. & Mrs. Chauhan',   'email' => 'chauhan.parent@school.com',   'occupation' => 'Manager'],
            ['name' => 'Mr. & Mrs. Rajput',    'email' => 'rajput.parent@school.com',    'occupation' => 'Scientist'],
            ['name' => 'Mr. & Mrs. Nair',      'email' => 'nair.parent@school.com',      'occupation' => 'Consultant'],
            ['name' => 'Mr. & Mrs. Reddy',     'email' => 'reddy.parent@school.com',     'occupation' => 'Entrepreneur'],
        ];

        $cities = ['Mumbai','Delhi','Pune','Jaipur','Ahmedabad','Lucknow','Nagpur','Indore','Bhopal','Surat'];
        $areas  = ['Shanti Nagar','Gandhi Road','Nehru Colony','MG Road','Laxmi Nagar','Rajiv Chowk','Sadar Bazar'];

        foreach ($parents as $i => $p) {
            $city = $cities[array_rand($cities)];
            $area = $areas[array_rand($areas)];

            $user = User::create([
                'name'      => $p['name'],
                'email'     => $p['email'],
                'password'  => Hash::make('password'),
                'role_id'   => $roleId,
                'is_active' => true,
                'phone'     => '96' . str_pad($i + 10001, 8, '0', STR_PAD_LEFT),
            ]);

            ParentProfile::create([
                'user_id'    => $user->id,
                'occupation' => $p['occupation'],
                'address'    => rand(1, 99) . ', ' . $area . ', ' . $city,
            ]);
        }
    }
}
