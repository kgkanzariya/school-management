<?php

namespace Database\Seeders;

use App\Models\Notice;
use App\Models\User;
use Illuminate\Database\Seeder;

class NoticeSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = User::whereHas('role', fn($q) => $q->where('slug', 'admin'))->value('id');

        $notices = [
            [
                'title'       => 'Annual Sports Day — Save the Date',
                'content'     => 'We are pleased to announce that the Annual Sports Day will be held on April 15th. All students are encouraged to participate. Parents are welcome to attend.',
                'target_role' => 'all',
                'publish_date'=> now()->subDays(5)->toDateString(),
            ],
            [
                'title'       => 'Parent-Teacher Meeting — March 25th',
                'content'     => 'A Parent-Teacher Meeting is scheduled for March 25th from 9:00 AM to 1:00 PM. Parents are requested to attend and discuss their child\'s academic progress.',
                'target_role' => 'parent',
                'publish_date'=> now()->subDays(3)->toDateString(),
            ],
            [
                'title'       => 'Exam Schedule Released',
                'content'     => 'The Second Term Exam schedule has been released. Students are advised to check the timetable and prepare accordingly. No leaves will be granted during exam period.',
                'target_role' => 'student',
                'publish_date'=> now()->subDays(7)->toDateString(),
            ],
            [
                'title'       => 'Staff Meeting — April 1st',
                'content'     => 'A mandatory staff meeting will be held on April 1st at 3:00 PM in the conference room. All teaching and non-teaching staff must attend.',
                'target_role' => 'teacher',
                'publish_date'=> now()->subDays(2)->toDateString(),
            ],
            [
                'title'       => 'School Closed — Public Holiday',
                'content'     => 'The school will remain closed on March 22nd on account of a public holiday. Regular classes will resume on March 23rd.',
                'target_role' => 'all',
                'publish_date'=> now()->subDays(10)->toDateString(),
            ],
            [
                'title'       => 'Fee Payment Reminder',
                'content'     => 'This is a reminder that the last date for fee payment for this quarter is March 31st. Please ensure timely payment to avoid late fees.',
                'target_role' => 'parent',
                'publish_date'=> now()->subDays(1)->toDateString(),
            ],
            [
                'title'       => 'Science Fair Registration Open',
                'content'     => 'Registration for the Annual Science Fair is now open. Students from Grade 5 to Grade 10 can register with their class teacher by March 28th.',
                'target_role' => 'student',
                'publish_date'=> now()->subDays(4)->toDateString(),
            ],
            [
                'title'       => 'New Library Books Available',
                'content'     => 'The school library has received a new collection of books across all subjects. Students are encouraged to visit the library and make use of the new resources.',
                'target_role' => 'all',
                'publish_date'=> now()->subDays(6)->toDateString(),
            ],
        ];

        foreach ($notices as $notice) {
            Notice::create([...$notice, 'created_by' => $adminId]);
        }
    }
}
