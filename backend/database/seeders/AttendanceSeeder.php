<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::all();

        // Generate attendance for the last 30 school days
        $dates = [];
        $date  = Carbon::now()->subDays(1);
        $count = 0;

        while ($count < 30) {
            // Skip weekends
            if (!in_array($date->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY])) {
                $dates[] = $date->toDateString();
                $count++;
            }
            $date->subDay();
        }

        $records = [];

        foreach ($students as $student) {
            foreach ($dates as $attendanceDate) {
                // 85% present, 10% absent, 5% late
                $rand = rand(1, 100);
                $status = match(true) {
                    $rand <= 85 => 'present',
                    $rand <= 95 => 'absent',
                    default     => 'late',
                };

                $records[] = [
                    'student_id' => $student->id,
                    'class_id'   => $student->class_id,
                    'date'       => $attendanceDate,
                    'status'     => $status,
                    'remarks'    => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert in chunks to avoid memory issues
        foreach (array_chunk($records, 500) as $chunk) {
            Attendance::insert($chunk);
        }
    }
}
