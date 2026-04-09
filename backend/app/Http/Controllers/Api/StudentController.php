<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['user', 'schoolClass', 'section'])
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->when($request->section_id, fn($q) => $q->where('section_id', $request->section_id));

        // Allow fetching all records (e.g. for attendance marking)
        if ($request->per_page == -1) {
            return response()->json(['data' => $query->get()]);
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'             => 'required|string',
            'email'            => 'required|email|unique:users',
            'password'         => 'required|min:6',
            'class_id'         => 'required|exists:classes,id',
            'section_id'       => 'required|exists:sections,id',
            'admission_number' => 'required|unique:students',
        ]);

        return DB::transaction(function () use ($request) {
            $roleId = \App\Models\Role::where('slug', 'student')->value('id');

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role_id'  => $roleId,
                'phone'    => $request->phone,
            ]);

            $student = Student::create([
                'user_id'          => $user->id,
                'admission_number' => $request->admission_number,
                'class_id'         => $request->class_id,
                'section_id'       => $request->section_id,
                'parent_id'        => $request->parent_id,
                'date_of_birth'    => $request->date_of_birth,
                'gender'           => $request->gender,
                'address'          => $request->address,
                'admission_date'   => $request->admission_date,
                'blood_group'      => $request->blood_group,
            ]);

            return response()->json($student->load(['user', 'schoolClass', 'section']), 201);
        });
    }

    public function show(Student $student)
    {
        return response()->json($student->load(['user', 'schoolClass', 'section', 'parent.user']));
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'class_id'   => 'sometimes|exists:classes,id',
            'section_id' => 'sometimes|exists:sections,id',
        ]);

        $student->update($request->only([
            'class_id', 'section_id', 'parent_id', 'date_of_birth',
            'gender', 'address', 'blood_group'
        ]));

        if ($request->has('name') || $request->has('phone')) {
            $student->user->update($request->only(['name', 'phone', 'avatar']));
        }

        return response()->json($student->load(['user', 'schoolClass', 'section']));
    }

    public function destroy(Student $student)
    {
        $student->user->delete(); // cascades to student
        return response()->json(['message' => 'Student deleted.']);
    }
}
