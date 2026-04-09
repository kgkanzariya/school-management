<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index()
    {
        return response()->json(SchoolClass::with(['sections', 'classTeacher'])->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'grade_level' => 'required|integer']);
        $class = SchoolClass::create($request->only(['name', 'grade_level', 'class_teacher_id']));
        return response()->json($class->load('sections'), 201);
    }

    public function show(SchoolClass $class)
    {
        return response()->json($class->load(['sections', 'classTeacher', 'subjects']));
    }

    public function update(Request $request, SchoolClass $class)
    {
        $class->update($request->only(['name', 'grade_level', 'class_teacher_id']));
        return response()->json($class->load('sections'));
    }

    public function destroy(SchoolClass $class)
    {
        $class->delete();
        return response()->json(['message' => 'Class deleted.']);
    }
}
