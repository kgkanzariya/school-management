<?php

namespace Database\Seeders;

use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class ClassSubjectSeeder extends Seeder
{
    public function run(): void
    {
        $classes  = SchoolClass::all();
        $subjects = Subject::all();
        $teachers = Teacher::all();

        // Core subjects for all classes
        $coreSubjectCodes = ['MATH', 'ENG', 'SCI', 'SS'];

        // Advanced subjects for Grade 6+
        $advancedSubjectCodes = ['PHY', 'CHEM', 'BIO', 'CS', 'HIST', 'GEO'];

        foreach ($classes as $class) {
            $assignedSubjects = $subjects->whereIn('code', $coreSubjectCodes);

            if ($class->grade_level >= 6) {
                $assignedSubjects = $subjects; // all subjects
            }

            foreach ($assignedSubjects as $subject) {
                ClassSubject::firstOrCreate([
                    'class_id'   => $class->id,
                    'subject_id' => $subject->id,
                ], [
                    'teacher_id' => $teachers->random()->id,
                ]);
            }
        }
    }
}
