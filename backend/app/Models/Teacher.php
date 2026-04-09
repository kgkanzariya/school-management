<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'user_id', 'employee_id', 'date_of_birth', 'gender',
        'address', 'qualification', 'joining_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class);
    }
}
