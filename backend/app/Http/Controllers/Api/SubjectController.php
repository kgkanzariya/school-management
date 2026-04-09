<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json(Subject::paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'code' => 'required|unique:subjects']);
        $subject = Subject::create($request->only(['name', 'code', 'description']));
        return response()->json($subject, 201);
    }

    public function show(Subject $subject)
    {
        return response()->json($subject->load('classes'));
    }

    public function update(Request $request, Subject $subject)
    {
        $subject->update($request->only(['name', 'code', 'description']));
        return response()->json($subject);
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Subject deleted.']);
    }
}
