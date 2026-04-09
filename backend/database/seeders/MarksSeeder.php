<?php

namespace Database\Seeders;

use App\Models\ClassSubject;
use App\Models\Exam;
use App\Models\Mark;
use App\Models\Student;
use Illuminate\Database\Seeder;

class MarksSeeder extends Seeder
{
    public function run(): void
    {
        $exams    = Exam::all();
        $records  = [];

        foreach ($exams as $exam) {
            $students        = Student::where('class_id', $exam->class_id)->get();
            $classSubjectIds = ClassSubject::where('class_id', $exam->class_id)->pluck('subject_id');

            foreach ($students as $student) {
                foreach ($classSubjectIds as $subjectId) {
                    $marksObtained = rand(30, 100);
                    $grade         = Mark::calculateGrade($marksObtained, $exam->total_marks);

                    $records[] = [
                        'exam_id'        => $exam->id,
                        'student_id'     => $student->id,
                        'subject_id'     => $subjectId,
                        'marks_obtained' => $marksObtained,
                        'grade'          => $grade,
                        'remarks'        => null,
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ];
                }
            }
        }

        foreach (array_chunk($records, 500) as $chunk) {
            Mark::insert($chunk);
        }
    }
}
