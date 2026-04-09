<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\SchoolClass;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\Notice;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin()
    {
        return response()->json([
            'total_students' => Student::count(),
            'total_teachers' => Teacher::count(),
            'total_classes'  => SchoolClass::count(),
            'today_attendance' => [
                'present' => Attendance::where('date', today())->where('status', 'present')->count(),
                'absent'  => Attendance::where('date', today())->where('status', 'absent')->count(),
                'late'    => Attendance::where('date', today())->where('status', 'late')->count(),
            ],
            'fee_collected_this_month' => FeePayment::whereMonth('payment_date', now()->month)
                ->whereYear('payment_date', now()->year)
                ->sum('amount_paid'),
            'recent_notices' => Notice::latest()->take(5)->get(),
        ]);
    }

    public function student(Request $request)
    {
        $student = $request->user()->student;

        if (! $student) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        $attendanceSummary = Attendance::where('student_id', $student->id)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return response()->json([
            'student'            => $student->load(['schoolClass', 'section']),
            'attendance_summary' => $attendanceSummary,
            'recent_marks'       => $student->marks()->with(['exam', 'subject'])->latest()->take(10)->get(),
            'notices'            => Notice::where('target_role', 'all')->orWhere('target_role', 'student')->latest()->take(5)->get(),
        ]);
    }

    public function teacher(Request $request)
    {
        $teacher = $request->user()->teacher;

        return response()->json([
            'teacher'         => $teacher?->load('classSubjects.schoolClass'),
            'notices'         => Notice::where('target_role', 'all')->orWhere('target_role', 'teacher')->latest()->take(5)->get(),
        ]);
    }

    public function myChildren(Request $request)
    {
        $parent = $request->user()->parentProfile;

        if (!$parent) {
            return response()->json(['message' => 'Parent profile not found.'], 404);
        }

        $children = $parent->children()->with([
            'user',
            'schoolClass',
            'section',
            'marks.exam',
            'marks.subject',
            'attendance' => fn($q) => $q->orderBy('date', 'desc')->limit(30),
        ])->get()->map(function ($child) {
            $attendance = $child->attendance;
            $child->attendance_summary = [
                'total'   => $attendance->count(),
                'present' => $attendance->where('status', 'present')->count(),
                'absent'  => $attendance->where('status', 'absent')->count(),
                'late'    => $attendance->where('status', 'late')->count(),
            ];
            return $child;
        });

        return response()->json($children);
    }

    public function parent(Request $request)
    {
        $parent = $request->user()->parentProfile;

        $children = $parent?->children()->with(['schoolClass', 'section', 'marks.exam', 'marks.subject'])->get();

        return response()->json([
            'children' => $children,
            'notices'  => Notice::where('target_role', 'all')->orWhere('target_role', 'parent')->latest()->take(5)->get(),
        ]);
    }
}
