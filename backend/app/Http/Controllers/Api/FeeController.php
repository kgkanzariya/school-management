<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fee;
use Illuminate\Http\Request;

class FeeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Fee::with('schoolClass')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id'  => 'required|exists:classes,id',
            'fee_type'  => 'required',
            'amount'    => 'required|numeric',
            'frequency' => 'required',
        ]);
        $fee = Fee::create($request->only(['class_id', 'fee_type', 'amount', 'frequency']));
        return response()->json($fee, 201);
    }

    public function show(Fee $fee)
    {
        return response()->json($fee->load('schoolClass'));
    }

    public function update(Request $request, Fee $fee)
    {
        $fee->update($request->only(['fee_type', 'amount', 'frequency']));
        return response()->json($fee);
    }

    public function destroy(Fee $fee)
    {
        $fee->delete();
        return response()->json(['message' => 'Fee deleted.']);
    }
}
