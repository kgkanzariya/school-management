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
            ['name' => 'Mr. Rajesh Sharma',    'email' => 'rajesh.sharma@school.com',    'emp' => 'EMP001', 'gender' => 'Male',   'qual' => 'M.Sc Mathematics'],
            ['name' => 'Ms. Priya Verma',       'email' => 'priya.verma@school.com',       'emp' => 'EMP002', 'gender' => 'Female', 'qual' => 'B.Ed English'],
            ['name' => 'Mr. Suresh Patel',      'email' => 'suresh.patel@school.com',      'emp' => 'EMP003', 'gender' => 'Male',   'qual' => 'M.Sc Physics'],
            ['name' => 'Ms. Anita Gupta',       'email' => 'anita.gupta@school.com',       'emp' => 'EMP004', 'gender' => 'Female', 'qual' => 'M.Sc Chemistry'],
            ['name' => 'Mr. Vikram Singh',      'email' => 'vikram.singh@school.com',      'emp' => 'EMP005', 'gender' => 'Male',   'qual' => 'M.Sc Biology'],
            ['name' => 'Ms. Sunita Joshi',      'email' => 'sunita.joshi@school.com',      'emp' => 'EMP006', 'gender' => 'Female', 'qual' => 'B.Ed History'],
            ['name' => 'Mr. Amit Kumar',        'email' => 'amit.kumar@school.com',        'emp' => 'EMP007', 'gender' => 'Male',   'qual' => 'M.Tech Computer Science'],
            ['name' => 'Ms. Kavita Mehta',      'email' => 'kavita.mehta@school.com',      'emp' => 'EMP008', 'gender' => 'Female', 'qual' => 'B.Ed Geography'],
            ['name' => 'Mr. Deepak Yadav',      'email' => 'deepak.yadav@school.com',      'emp' => 'EMP009', 'gender' => 'Male',   'qual' => 'M.Sc Science'],
            ['name' => 'Ms. Pooja Mishra',      'email' => 'pooja.mishra@school.com',      'emp' => 'EMP010', 'gender' => 'Female', 'qual' => 'B.Ed Arts'],
        ];

        $cities = ['Mumbai','Delhi','Pune','Jaipur','Ahmedabad','Lucknow','Nagpur','Indore'];

        foreach ($teachers as $i => $t) {
            $user = User::create([
                'name'      => $t['name'],
                'email'     => $t['email'],
                'password'  => Hash::make('password'),
                'role_id'   => $roleId,
                'is_active' => true,
                'phone'     => '97' . str_pad($i + 10001, 8, '0', STR_PAD_LEFT),
            ]);

            Teacher::create([
                'user_id'       => $user->id,
                'employee_id'   => $t['emp'],
                'gender'        => $t['gender'],
                'qualification' => $t['qual'],
                'joining_date'  => now()->subYears(rand(1, 8))->subMonths(rand(0, 11))->toDateString(),
                'date_of_birth' => now()->subYears(rand(28, 50))->toDateString(),
                'address'       => rand(1, 99) . ', Sector ' . rand(1, 20) . ', ' . $cities[array_rand($cities)],
            ]);
        }
    }
}
