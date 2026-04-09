<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $timetables = Timetable::with(['subject', 'teacher.user'])
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->when($request->section_id, fn($q) => $q->where('section_id', $request->section_id))
            ->orderByRaw("FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')")
            ->orderBy('start_time')
            ->get();

        return response()->json($timetables);
    }

    public function myTimetable(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return response()->json(['message' => 'Student profile not found.'], 404);

        $timetables = Timetable::with(['subject', 'teacher.user'])
            ->where('class_id', $student->class_id)
            ->when($student->section_id, fn($q) => $q->where('section_id', $student->section_id))
            ->orderByRaw("FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')")
            ->orderBy('start_time')
            ->get();

        return response()->json($timetables);
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id'   => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day'        => 'required',
            'start_time' => 'required',
            'end_time'   => 'required|after:start_time',
        ]);

        $timetable = Timetable::create($request->only([
            'class_id', 'section_id', 'subject_id', 'teacher_id', 'day', 'start_time', 'end_time'
        ]));

        return response()->json($timetable->load(['subject', 'teacher.user']), 201);
    }

    public function show(Timetable $timetable)
    {
        return response()->json($timetable->load(['subject', 'teacher.user', 'schoolClass', 'section']));
    }

    public function update(Request $request, Timetable $timetable)
    {
        $timetable->update($request->only(['subject_id', 'teacher_id', 'day', 'start_time', 'end_time']));
        return response()->json($timetable);
    }

    public function destroy(Timetable $timetable)
    {
        $timetable->delete();
        return response()->json(['message' => 'Timetable entry deleted.']);
    }
}
