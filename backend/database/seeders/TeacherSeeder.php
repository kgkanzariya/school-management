<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        $roleId = Role::where('slug', 'teacher')->value('id');

        $teachers = [
            ['name' => 'Mr. James Wilson',    'email' => 'james.wilson@school.com',    'emp' => 'EMP001', 'gender' => 'Male',   'qual' => 'M.Sc Mathematics'],
            ['name' => 'Ms. Sarah Johnson',   'email' => 'sarah.johnson@school.com',   'emp' => 'EMP002', 'gender' => 'Female', 'qual' => 'B.Ed English'],
            ['name' => 'Mr. David Brown',     'email' => 'david.brown@school.com',     'emp' => 'EMP003', 'gender' => 'Male',   'qual' => 'M.Sc Physics'],
            ['name' => 'Ms. Emily Davis',     'email' => 'emily.davis@school.com',     'emp' => 'EMP004', 'gender' => 'Female', 'qual' => 'M.Sc Chemistry'],
            ['name' => 'Mr. Robert Martinez', 'email' => 'robert.martinez@school.com', 'emp' => 'EMP005', 'gender' => 'Male',   'qual' => 'M.Sc Biology'],
            ['name' => 'Ms. Linda Garcia',    'email' => 'linda.garcia@school.com',    'emp' => 'EMP006', 'gender' => 'Female', 'qual' => 'B.Ed History'],
            ['name' => 'Mr. Michael Lee',     'email' => 'michael.lee@school.com',     'emp' => 'EMP007', 'gender' => 'Male',   'qual' => 'M.Tech CS'],
            ['name' => 'Ms. Patricia White',  'email' => 'patricia.white@school.com',  'emp' => 'EMP008', 'gender' => 'Female', 'qual' => 'B.Ed Geography'],
            ['name' => 'Mr. Thomas Harris',   'email' => 'thomas.harris@school.com',   'emp' => 'EMP009', 'gender' => 'Male',   'qual' => 'M.Sc Science'],
            ['name' => 'Ms. Jennifer Clark',  'email' => 'jennifer.clark@school.com',  'emp' => 'EMP010', 'gender' => 'Female', 'qual' => 'B.Ed Art'],
        ];

        foreach ($teachers as $i => $t) {
            $user = User::create([
                'name'      => $t['name'],
                'email'     => $t['email'],
                'password'  => Hash::make('password'),
                'role_id'   => $roleId,
                'is_active' => true,
                'phone'     => '555-' . str_pad($i + 1001, 4, '0', STR_PAD_LEFT),
            ]);

            Teacher::create([
                'user_id'       => $user->id,
                'employee_id'   => $t['emp'],
                'gender'        => $t['gender'],
                'qualification' => $t['qual'],
                'joining_date'  => now()->subYears(rand(1, 8))->subMonths(rand(0, 11))->toDateString(),
                'date_of_birth' => now()->subYears(rand(28, 50))->toDateString(),
                'address'       => rand(10, 999) . ' Main Street, City',
            ]);
        }
    }
}
