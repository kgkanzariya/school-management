<?php

namespace Database\Seeders;

use App\Models\Fee;
use App\Models\FeePayment;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FeePaymentSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::all();
        $methods  = ['cash', 'bank', 'online'];
        $records  = [];
        $counter  = 1;

        foreach ($students as $student) {
            $fees = Fee::where('class_id', $student->class_id)->get();

            foreach ($fees as $fee) {
                // 80% of students have paid, 15% partial, 5% due
                $rand   = rand(1, 100);
                $status = match(true) {
                    $rand <= 80 => 'paid',
                    $rand <= 95 => 'partial',
                    default     => 'due',
                };

                $amountPaid = match($status) {
                    'paid'    => $fee->amount,
                    'partial' => round($fee->amount * (rand(30, 70) / 100)),
                    'due'     => 0,
                };

                if ($status === 'due') continue; // no payment record for dues

                $records[] = [
                    'student_id'     => $student->id,
                    'fee_id'         => $fee->id,
                    'amount_paid'    => $amountPaid,
                    'payment_date'   => now()->subDays(rand(1, 60))->toDateString(),
                    'payment_method' => $methods[array_rand($methods)],
                    'receipt_number' => 'RCP-' . strtoupper(Str::random(6)) . $counter,
                    'status'         => $status,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ];

                $counter++;
            }
        }

        foreach (array_chunk($records, 500) as $chunk) {
            FeePayment::insert($chunk);
        }
    }
}
