<?php

namespace Database\Seeders;

use App\Models\ParentProfile;
use App\Models\Role;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $roleId  = Role::where('slug', 'student')->value('id');
        $classes = SchoolClass::with('sections')->get();
        $parents = ParentProfile::all();

        $maleNames = [
            'Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Ayaan','Krishna','Ishaan',
            'Shaurya','Atharv','Advik','Pranav','Advait','Dhruv','Kabir','Ritvik','Aarush','Darsh',
            'Parth','Nikhil','Rohan','Karan','Yash','Harsh','Kunal','Rahul','Varun','Tarun',
        ];

        $femaleNames = [
            'Aadhya','Ananya','Pari','Anika','Navya','Angel','Diya','Saanvi','Myra','Sara',
            'Priya','Riya','Sneha','Pooja','Kavya','Nisha','Tanvi','Shreya','Divya','Meera',
            'Isha','Tara','Nandini','Swara','Avni','Khushi','Simran','Anjali','Neha','Komal',
        ];

        $lastNames = [
            'Sharma','Verma','Patel','Singh','Kumar','Gupta','Joshi','Mehta','Shah','Yadav',
            'Mishra','Tiwari','Pandey','Chauhan','Rajput','Nair','Iyer','Reddy','Rao','Pillai',
        ];

        $bloodGroups = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
        $genders     = ['Male','Female'];
        $cities      = ['Mumbai','Delhi','Ahmedabad','Pune','Jaipur','Surat','Lucknow','Nagpur','Indore','Bhopal'];

        $counter = 1;

        foreach ($classes as $class) {
            foreach ($class->sections as $section) {
                for ($i = 0; $i < 5; $i++) {
                    $gender    = $genders[array_rand($genders)];
                    $firstName = $gender === 'Male'
                        ? $maleNames[array_rand($maleNames)]
                        : $femaleNames[array_rand($femaleNames)];
                    $lastName  = $lastNames[array_rand($lastNames)];
                    $email     = strtolower($firstName . '.' . $lastName . $counter . '@student.school.com');
                    $city      = $cities[array_rand($cities)];

                    $user = User::create([
                        'name'      => "$firstName $lastName",
                        'email'     => $email,
                        'password'  => Hash::make('password'),
                        'role_id'   => $roleId,
                        'is_active' => true,
                        'phone'     => '98' . str_pad($counter + 10000, 8, '0', STR_PAD_LEFT),
                    ]);

                    Student::create([
                        'user_id'          => $user->id,
                        'admission_number' => 'ADM' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                        'class_id'         => $class->id,
                        'section_id'       => $section->id,
                        'parent_id'        => $parents->random()->id,
                        'date_of_birth'    => now()->subYears(rand(6, 16))->subMonths(rand(0, 11))->toDateString(),
                        'gender'           => $gender,
                        'address'          => rand(1, 99) . ', ' . ['Shanti Nagar','Gandhi Road','Nehru Colony','MG Road','Laxmi Nagar'][rand(0,4)] . ', ' . $city,
                        'admission_date'   => now()->subYears(rand(0, 3))->toDateString(),
                        'blood_group'      => $bloodGroups[array_rand($bloodGroups)],
                    ]);

                    $counter++;
                }
            }
        }
    }
}
