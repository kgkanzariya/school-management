<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FeePaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = FeePayment::with(['student.user', 'fee'])
            ->when($request->student_id, fn($q) => $q->where('student_id', $request->student_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->paginate(10);
        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id'     => 'required|exists:students,id',
            'fee_id'         => 'required|exists:fees,id',
            'amount_paid'    => 'required|numeric',
            'payment_date'   => 'required|date',
            'payment_method' => 'required',
        ]);

        $payment = FeePayment::create([
            ...$request->only(['student_id', 'fee_id', 'amount_paid', 'payment_date', 'payment_method', 'status']),
            'receipt_number' => 'RCP-' . strtoupper(Str::random(8)),
        ]);

        return response()->json($payment->load(['student.user', 'fee']), 201);
    }

    public function show(FeePayment $feePayment)
    {
        return response()->json($feePayment->load(['student.user', 'fee']));
    }

    public function update(Request $request, FeePayment $feePayment)
    {
        $feePayment->update($request->only(['amount_paid', 'payment_method', 'status']));
        return response()->json($feePayment);
    }

    public function destroy(FeePayment $feePayment)
    {
        $feePayment->delete();
        return response()->json(['message' => 'Payment deleted.']);
    }
}
