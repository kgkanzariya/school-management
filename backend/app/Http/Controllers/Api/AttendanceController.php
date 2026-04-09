<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['class_id' => 'required', 'date' => 'required|date']);

        $attendance = Attendance::with('student.user')
            ->where('class_id', $request->class_id)
            ->where('date', $request->date)
            ->get();

        return response()->json($attendance);
    }

    // Mark attendance for multiple students at once
    public function store(Request $request)
    {
        $request->validate([
            'class_id'    => 'required|exists:classes,id',
            'date'        => 'required|date',
            'attendance'  => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status'     => 'required|in:present,absent,late',
        ]);

        foreach ($request->attendance as $record) {
            Attendance::updateOrCreate(
                ['student_id' => $record['student_id'], 'date' => $request->date],
                ['class_id' => $request->class_id, 'status' => $record['status'], 'remarks' => $record['remarks'] ?? null]
            );
        }

        return response()->json(['message' => 'Attendance saved.']);
    }

    // Report: attendance per student
    public function report(Request $request)
    {
        $request->validate(['student_id' => 'required|exists:students,id']);

        $report = Attendance::where('student_id', $request->student_id)
            ->when($request->from, fn($q) => $q->where('date', '>=', $request->from))
            ->when($request->to, fn($q) => $q->where('date', '<=', $request->to))
            ->orderBy('date')
            ->get();

        $summary = [
            'total'   => $report->count(),
            'present' => $report->where('status', 'present')->count(),
            'absent'  => $report->where('status', 'absent')->count(),
            'late'    => $report->where('status', 'late')->count(),
        ];

        return response()->json(['records' => $report, 'summary' => $summary]);
    }

    public function myAttendance(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return response()->json(['message' => 'Student profile not found.'], 404);

        $records = Attendance::where('student_id', $student->id)
            ->when($request->from, fn($q) => $q->where('date', '>=', $request->from))
            ->when($request->to,   fn($q) => $q->where('date', '<=', $request->to))
            ->orderBy('date', 'desc')
            ->get();

        $summary = [
            'total'   => $records->count(),
            'present' => $records->where('status', 'present')->count(),
            'absent'  => $records->where('status', 'absent')->count(),
            'late'    => $records->where('status', 'late')->count(),
        ];

        return response()->json(['records' => $records, 'summary' => $summary]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $attendance->update($request->only(['status', 'remarks']));
        return response()->json($attendance);
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return response()->json(['message' => 'Record deleted.']);
    }
}
