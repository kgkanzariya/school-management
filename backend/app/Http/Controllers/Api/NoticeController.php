<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->user()->role?->slug;

        $notices = Notice::with('author')
            ->where(fn($q) => $q->where('target_role', 'all')->orWhere('target_role', $role))
            ->where('publish_date', '<=', now())
            ->where(fn($q) => $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now()))
            ->orderByDesc('publish_date')
            ->get();

        return response()->json($notices);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required',
            'content'      => 'required',
            'target_role'  => 'required',
            'publish_date' => 'required|date',
        ]);

        $notice = Notice::create([
            ...$request->only(['title', 'content', 'target_role', 'publish_date', 'expiry_date']),
            'created_by' => $request->user()->id,
        ]);

        return response()->json($notice, 201);
    }

    public function show(Notice $notice)
    {
        return response()->json($notice->load('author'));
    }

    public function update(Request $request, Notice $notice)
    {
        $notice->update($request->only(['title', 'content', 'target_role', 'publish_date', 'expiry_date']));
        return response()->json($notice);
    }

    public function destroy(Notice $notice)
    {
        $notice->delete();
        return response()->json(['message' => 'Notice deleted.']);
    }
}
