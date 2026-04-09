<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            ['name' => 'Mathematics',        'code' => 'MATH'],
            ['name' => 'English',            'code' => 'ENG'],
            ['name' => 'Science',            'code' => 'SCI'],
            ['name' => 'Social Studies',     'code' => 'SS'],
            ['name' => 'Computer Science',   'code' => 'CS'],
            ['name' => 'Physics',            'code' => 'PHY'],
            ['name' => 'Chemistry',          'code' => 'CHEM'],
            ['name' => 'Biology',            'code' => 'BIO'],
            ['name' => 'History',            'code' => 'HIST'],
            ['name' => 'Geography',          'code' => 'GEO'],
            ['name' => 'Art',                'code' => 'ART'],
            ['name' => 'Physical Education', 'code' => 'PE'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
