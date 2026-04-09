<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Midterm, Final
            $table->foreignId('class_id')->constrained('classes');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_marks')->default(100);
            $table->integer('passing_marks')->default(40);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
