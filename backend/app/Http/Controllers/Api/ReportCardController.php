<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Exam;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportCardController extends Controller
{
    public function show(Request $request, Student $student)
    {
        $request->validate(['exam_id' => 'required|exists:exams,id']);

        $exam = Exam::with('schoolClass')->findOrFail($request->exam_id);

        $marks = $student->marks()
            ->where('exam_id', $exam->id)
            ->with('subject')
            ->get();

        $totalObtained = $marks->sum('marks_obtained');
        $totalMax      = $marks->count() * $exam->total_marks;
        $percentage    = $totalMax > 0 ? round(($totalObtained / $totalMax) * 100, 2) : 0;

        return response()->json([
            'student'        => $student->load(['user', 'schoolClass', 'section']),
            'exam'           => $exam,
            'marks'          => $marks,
            'total_obtained' => $totalObtained,
            'total_max'      => $totalMax,
            'percentage'     => $percentage,
            'overall_grade'  => \App\Models\Mark::calculateGrade($totalObtained, $totalMax),
        ]);
    }

    public function pdf(Request $request, Student $student)
    {
        $request->validate(['exam_id' => 'required|exists:exams,id']);

        $exam  = Exam::with('schoolClass')->findOrFail($request->exam_id);
        $marks = $student->marks()->where('exam_id', $exam->id)->with('subject')->get();

        $totalObtained = $marks->sum('marks_obtained');
        $totalMax      = $marks->count() * $exam->total_marks;
        $percentage    = $totalMax > 0 ? round(($totalObtained / $totalMax) * 100, 2) : 0;

        $pdf = Pdf::loadView('reports.report_card', compact('student', 'exam', 'marks', 'totalObtained', 'totalMax', 'percentage'));

        return $pdf->download("report_card_{$student->admission_number}.pdf");
    }
}
