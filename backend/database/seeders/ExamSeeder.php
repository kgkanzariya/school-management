<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    public function run(): void
    {
        $classes = SchoolClass::all();

        $examTemplates = [
            ['name' => 'First Term Exam',  'start_offset' => -180, 'end_offset' => -175],
            ['name' => 'Midterm Exam',     'start_offset' => -90,  'end_offset' => -85],
            ['name' => 'Second Term Exam', 'start_offset' => -30,  'end_offset' => -25],
        ];

        foreach ($classes as $class) {
            foreach ($examTemplates as $template) {
                Exam::create([
                    'name'          => $template['name'],
                    'class_id'      => $class->id,
                    'start_date'    => now()->addDays($template['start_offset'])->toDateString(),
                    'end_date'      => now()->addDays($template['end_offset'])->toDateString(),
                    'total_marks'   => 100,
                    'passing_marks' => 40,
                ]);
            }
        }
    }
}
