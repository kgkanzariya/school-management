<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $sections = Section::with('schoolClass')
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->get();
        return response()->json($sections);
    }

    public function store(Request $request)
    {
        $request->validate(['class_id' => 'required|exists:classes,id', 'name' => 'required']);
        $section = Section::create($request->only(['class_id', 'name']));
        return response()->json($section, 201);
    }

    public function show(Section $section)
    {
        return response()->json($section->load('schoolClass'));
    }

    public function update(Request $request, Section $section)
    {
        $section->update($request->only(['name']));
        return response()->json($section);
    }

    public function destroy(Section $section)
    {
        $section->delete();
        return response()->json(['message' => 'Section deleted.']);
    }
}
