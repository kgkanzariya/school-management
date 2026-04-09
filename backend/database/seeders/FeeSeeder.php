<?php

namespace Database\Seeders;

use App\Models\Fee;
use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class FeeSeeder extends Seeder
{
    public function run(): void
    {
        $classes = SchoolClass::all();

        $feeStructures = [
            ['fee_type' => 'Tuition Fee',   'frequency' => 'monthly'],
            ['fee_type' => 'Transport Fee',  'frequency' => 'monthly'],
            ['fee_type' => 'Library Fee',    'frequency' => 'yearly'],
            ['fee_type' => 'Lab Fee',        'frequency' => 'quarterly'],
            ['fee_type' => 'Sports Fee',     'frequency' => 'quarterly'],
        ];

        foreach ($classes as $class) {
            // Higher grades pay more
            $multiplier = 1 + ($class->grade_level * 0.1);

            foreach ($feeStructures as $fee) {
                $baseAmount = match($fee['fee_type']) {
                    'Tuition Fee'  => 500,
                    'Transport Fee'=> 150,
                    'Library Fee'  => 200,
                    'Lab Fee'      => 100,
                    'Sports Fee'   => 80,
                    default        => 100,
                };

                Fee::create([
                    'class_id'  => $class->id,
                    'fee_type'  => $fee['fee_type'],
                    'amount'    => round($baseAmount * $multiplier),
                    'frequency' => $fee['frequency'],
                ]);
            }
        }
    }
}
