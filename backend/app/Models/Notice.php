<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = ['title', 'content', 'created_by', 'target_role', 'publish_date', 'expiry_date'];

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
