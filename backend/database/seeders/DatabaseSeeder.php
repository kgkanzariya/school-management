<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminUserSeeder::class,
            ClassSeeder::class,
            SubjectSeeder::class,
            TeacherSeeder::class,
            ParentSeeder::class,
            StudentSeeder::class,
            ClassSubjectSeeder::class,
            AttendanceSeeder::class,
            ExamSeeder::class,
            MarksSeeder::class,
            FeeSeeder::class,
            FeePaymentSeeder::class,
            NoticeSeeder::class,
            TimetableSeeder::class,
        ]);
    }
}
