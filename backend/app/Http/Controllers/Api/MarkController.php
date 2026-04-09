<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mark;
use App\Models\Exam;
use Illuminate\Http\Request;

class MarkController extends Controller
{
    public function index(Request $request)
    {
        $marks = Mark::with(['student.user', 'subject', 'exam'])
            ->when($request->exam_id, fn($q) => $q->where('exam_id', $request->exam_id))
            ->when($request->student_id, fn($q) => $q->where('student_id', $request->student_id))
            ->get();
        return response()->json($marks);
    }

    // Bulk save marks for an exam
    public function store(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'marks'   => 'required|array',
            'marks.*.student_id'     => 'required|exists:students,id',
            'marks.*.subject_id'     => 'required|exists:subjects,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
        ]);

        $exam = Exam::findOrFail($request->exam_id);

        foreach ($request->marks as $record) {
            $grade = Mark::calculateGrade($record['marks_obtained'], $exam->total_marks);

            Mark::updateOrCreate(
                ['exam_id' => $request->exam_id, 'student_id' => $record['student_id'], 'subject_id' => $record['subject_id']],
                ['marks_obtained' => $record['marks_obtained'], 'grade' => $grade, 'remarks' => $record['remarks'] ?? null]
            );
        }

        return response()->json(['message' => 'Marks saved.']);
    }

    public function myMarks(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return response()->json(['message' => 'Student profile not found.'], 404);

        $marks = Mark::with(['subject', 'exam'])
            ->where('student_id', $student->id)
            ->when($request->exam_id, fn($q) => $q->where('exam_id', $request->exam_id))
            ->get();

        return response()->json($marks);
    }

    public function show(Mark $mark)
    {
        return response()->json($mark->load(['student.user', 'subject', 'exam']));
    }

    public function update(Request $request, Mark $mark)
    {
        $exam = $mark->exam;
        $marksObtained = $request->marks_obtained ?? $mark->marks_obtained;
        $grade = Mark::calculateGrade($marksObtained, $exam->total_marks);

        $mark->update(['marks_obtained' => $marksObtained, 'grade' => $grade, 'remarks' => $request->remarks]);
        return response()->json($mark);
    }

    public function destroy(Mark $mark)
    {
        $mark->delete();
        return response()->json(['message' => 'Mark deleted.']);
    }
}
