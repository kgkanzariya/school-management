<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\MarkController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\FeePaymentController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\ReportCardController;
use App\Http\Controllers\Api\DashboardController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboards
    Route::get('/dashboard/admin',   [DashboardController::class, 'admin'])->middleware('role:admin');
    Route::get('/dashboard/teacher', [DashboardController::class, 'teacher'])->middleware('role:teacher');
    Route::get('/dashboard/student', [DashboardController::class, 'student'])->middleware('role:student');
    Route::get('/dashboard/parent',  [DashboardController::class, 'parent'])->middleware('role:parent');

    // Admin & Teacher routes
    Route::middleware('role:admin,teacher')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('classes', ClassController::class);
        Route::apiResource('sections', SectionController::class);
        Route::apiResource('subjects', SubjectController::class);
        Route::apiResource('exams', ExamController::class);
        Route::apiResource('marks', MarkController::class);
        Route::apiResource('timetables', TimetableController::class);

        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::post('/attendance', [AttendanceController::class, 'store']);
        Route::put('/attendance/{attendance}', [AttendanceController::class, 'update']);
        Route::delete('/attendance/{attendance}', [AttendanceController::class, 'destroy']);
        Route::get('/attendance/report', [AttendanceController::class, 'report']);
    });

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('fees', FeeController::class);
        Route::apiResource('fee-payments', FeePaymentController::class);
    });

    // Notices (admin posts, all can read)
    Route::get('/notices', [NoticeController::class, 'index']);
    Route::get('/notices/{notice}', [NoticeController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/notices', [NoticeController::class, 'store']);
        Route::put('/notices/{notice}', [NoticeController::class, 'update']);
        Route::delete('/notices/{notice}', [NoticeController::class, 'destroy']);
    });

    // Student self-service routes
    Route::middleware('role:student')->group(function () {
        Route::get('/my-attendance', [AttendanceController::class, 'myAttendance']);
        Route::get('/my-marks',      [MarkController::class, 'myMarks']);
        Route::get('/my-timetable',  [TimetableController::class, 'myTimetable']);
    });

    // Parent self-service routes
    Route::middleware('role:parent')->group(function () {
        Route::get('/my-children', [DashboardController::class, 'myChildren']);
    });

    // Report cards
    Route::get('/report-card/{student}', [ReportCardController::class, 'show']);
    Route::get('/report-card/{student}/pdf', [ReportCardController::class, 'pdf']);
});
