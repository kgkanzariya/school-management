<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use App\Models\Section;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            ['name' => 'Grade 1',  'grade_level' => 1],
            ['name' => 'Grade 2',  'grade_level' => 2],
            ['name' => 'Grade 3',  'grade_level' => 3],
            ['name' => 'Grade 4',  'grade_level' => 4],
            ['name' => 'Grade 5',  'grade_level' => 5],
            ['name' => 'Grade 6',  'grade_level' => 6],
            ['name' => 'Grade 7',  'grade_level' => 7],
            ['name' => 'Grade 8',  'grade_level' => 8],
            ['name' => 'Grade 9',  'grade_level' => 9],
            ['name' => 'Grade 10', 'grade_level' => 10],
        ];

        foreach ($classes as $classData) {
            $class = SchoolClass::create($classData);
            foreach (['A', 'B', 'C'] as $section) {
                Section::create(['class_id' => $class->id, 'name' => $section]);
            }
        }
    }
}
