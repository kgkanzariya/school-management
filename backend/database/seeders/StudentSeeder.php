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

        $firstNames = ['Liam','Emma','Noah','Olivia','William','Ava','James','Isabella','Oliver','Sophia',
                       'Benjamin','Mia','Elijah','Charlotte','Lucas','Amelia','Mason','Harper','Logan','Evelyn',
                       'Alexander','Abigail','Ethan','Emily','Daniel','Elizabeth','Jacob','Mila','Michael','Ella',
                       'Henry','Avery','Jackson','Sofia','Sebastian','Camila','Aiden','Aria','Matthew','Scarlett'];

        $lastNames  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Moore',
                       'Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Young','Allen'];

        $bloodGroups = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
        $genders     = ['Male','Female'];

        $counter = 1;

        foreach ($classes as $class) {
            foreach ($class->sections as $section) {
                // 5 students per section
                for ($i = 0; $i < 5; $i++) {
                    $firstName = $firstNames[array_rand($firstNames)];
                    $lastName  = $lastNames[array_rand($lastNames)];
                    $gender    = $genders[array_rand($genders)];
                    $email     = strtolower($firstName . '.' . $lastName . $counter . '@student.school.com');

                    $user = User::create([
                        'name'      => "$firstName $lastName",
                        'email'     => $email,
                        'password'  => Hash::make('password'),
                        'role_id'   => $roleId,
                        'is_active' => true,
                        'phone'     => '555-' . str_pad($counter + 3000, 4, '0', STR_PAD_LEFT),
                    ]);

                    Student::create([
                        'user_id'          => $user->id,
                        'admission_number' => 'ADM' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                        'class_id'         => $class->id,
                        'section_id'       => $section->id,
                        'parent_id'        => $parents->random()->id,
                        'date_of_birth'    => now()->subYears(rand(6, 16))->subMonths(rand(0, 11))->toDateString(),
                        'gender'           => $gender,
                        'address'          => rand(10, 999) . ' Elm Street, City',
                        'admission_date'   => now()->subYears(rand(0, 3))->toDateString(),
                        'blood_group'      => $bloodGroups[array_rand($bloodGroups)],
                    ]);

                    $counter++;
                }
            }
        }
    }
}
