<?php

namespace Database\Seeders;

use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Timetable;
use Illuminate\Database\Seeder;

class TimetableSeeder extends Seeder
{
    public function run(): void
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        $slots = [
            ['start' => '08:00:00', 'end' => '08:45:00'],
            ['start' => '08:45:00', 'end' => '09:30:00'],
            ['start' => '09:45:00', 'end' => '10:30:00'],
            ['start' => '10:30:00', 'end' => '11:15:00'],
            ['start' => '11:30:00', 'end' => '12:15:00'],
            ['start' => '12:15:00', 'end' => '13:00:00'],
        ];

        $classes = SchoolClass::with('sections')->get();

        foreach ($classes as $class) {
            $classSubjects = ClassSubject::where('class_id', $class->id)->get();

            if ($classSubjects->isEmpty()) continue;

            foreach ($class->sections as $section) {
                $subjectPool = $classSubjects->shuffle();
                $subjectIndex = 0;

                foreach ($days as $day) {
                    foreach ($slots as $slot) {
                        $cs = $subjectPool[$subjectIndex % $subjectPool->count()];

                        Timetable::create([
                            'class_id'   => $class->id,
                            'section_id' => $section->id,
                            'subject_id' => $cs->subject_id,
                            'teacher_id' => $cs->teacher_id,
                            'day'        => $day,
                            'start_time' => $slot['start'],
                            'end_time'   => $slot['end'],
                        ]);

                        $subjectIndex++;
                    }
                }
            }
        }
    }
}
