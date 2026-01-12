<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\EnrolmentCourse;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['enrolment_course.member', 'enrolment_course.course'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        $totalIncome = Payment::where('state', 'paid')->sum('amount');
        $pendingAmount = Payment::where('state', 'pending')->sum('amount');
        
        return Inertia::render('admin/payment_management', [
            'payments' => $payments,
            'totalIncome' => $totalIncome,
            'pendingAmount' => $pendingAmount
        ]);
    }

    public function create()
    {
        $enrolments = EnrolmentCourse::with(['member', 'course'])
            ->whereDoesntHave('payment')
            ->orWhereHas('payment', function($q) {
                $q->where('state', 'failed');
            })
            ->get();
        
        return Inertia::render('admin/payment/create', [
            'enrolments' => $enrolments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'enrolment_course_id' => 'required|exists:enrolment_courses,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
            'state' => 'required|in:pending,paid,failed',
        ]);

        Payment::create($validated);

        return redirect('/management-pemasukan')->with('success', 'Payment berhasil ditambahkan');
    }

    public function show($id)
    {
        $payment = Payment::with(['enrolment_course.member', 'enrolment_course.course', 'enrolment_course.class_session'])
            ->findOrFail($id);
        
        return Inertia::render('admin/payment/show', [
            'payment' => $payment
        ]);
    }

    public function edit($id)
    {
        $payment = Payment::with(['enrolment_course.member', 'enrolment_course.course'])->findOrFail($id);
        $enrolments = EnrolmentCourse::with(['member', 'course'])->get();
        
        return Inertia::render('admin/payment/create', [
            'payment' => $payment,
            'enrolments' => $enrolments
        ]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        
        $validated = $request->validate([
            'enrolment_course_id' => 'required|exists:enrolment_courses,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
            'state' => 'required|in:pending,paid,failed',
        ]);

        $payment->update($validated);

        return redirect('/management-pemasukan')->with('success', 'Payment berhasil diupdate');
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return redirect('/management-pemasukan')->with('success', 'Payment berhasil dihapus');
    }
}
