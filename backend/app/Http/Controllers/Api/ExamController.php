<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $exams = Exam::with('schoolClass')
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->paginate(10);
        return response()->json($exams);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required',
            'class_id'      => 'required|exists:classes,id',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after_or_equal:start_date',
            'total_marks'   => 'required|integer',
            'passing_marks' => 'required|integer',
        ]);

        $exam = Exam::create($request->only(['name', 'class_id', 'start_date', 'end_date', 'total_marks', 'passing_marks']));
        return response()->json($exam, 201);
    }

    public function show(Exam $exam)
    {
        return response()->json($exam->load(['schoolClass', 'marks.student.user', 'marks.subject']));
    }

    public function update(Request $request, Exam $exam)
    {
        $exam->update($request->only(['name', 'start_date', 'end_date', 'total_marks', 'passing_marks']));
        return response()->json($exam);
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();
        return response()->json(['message' => 'Exam deleted.']);
    }
}
