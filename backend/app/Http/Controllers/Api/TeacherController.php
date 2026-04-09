<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function index()
    {
        return response()->json(Teacher::with('user')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string',
            'email'       => 'required|email|unique:users',
            'password'    => 'required|min:6',
            'employee_id' => 'required|unique:teachers',
        ]);

        return DB::transaction(function () use ($request) {
            $roleId = \App\Models\Role::where('slug', 'teacher')->value('id');

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role_id'  => $roleId,
                'phone'    => $request->phone,
            ]);

            $teacher = Teacher::create([
                'user_id'       => $user->id,
                'employee_id'   => $request->employee_id,
                'date_of_birth' => $request->date_of_birth,
                'gender'        => $request->gender,
                'address'       => $request->address,
                'qualification' => $request->qualification,
                'joining_date'  => $request->joining_date,
            ]);

            return response()->json($teacher->load('user'), 201);
        });
    }

    public function show(Teacher $teacher)
    {
        return response()->json($teacher->load(['user', 'classSubjects.subject', 'classSubjects.schoolClass']));
    }

    public function update(Request $request, Teacher $teacher)
    {
        $teacher->update($request->only(['date_of_birth', 'gender', 'address', 'qualification', 'joining_date']));
        $teacher->user->update($request->only(['name', 'phone', 'avatar']));

        return response()->json($teacher->load('user'));
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->user->delete();
        return response()->json(['message' => 'Teacher deleted.']);
    }
}
