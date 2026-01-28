<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\EnrolmentCourse;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $payments = Payment::with(['enrolment_course.member', 'enrolment_course.course'])
            ->when($search, function($query,$search){
                $query->whereHas('enrolment_course.member',function ($query) use ($search){
                    $query->where('name','like',"%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        $totalIncome = Payment::where('state', 'paid')->sum('amount_paid');
        $allAmount = Payment::whereNot('state', 'failed')->sum('amount');
        $pendingAmount = $allAmount-$totalIncome;
        $totalPaidCount = Payment::where('state','paid')->count();
        
        return Inertia::render('admin/payment_management', [
            'payments' => $payments,
            'totalIncome' => $totalIncome,
            'pendingAmount' => $pendingAmount,
            'totalPaidCount'=>$totalPaidCount,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        // Enrolment muncul jika:
        // 1. Tidak punya payment sama sekali, ATAU
        // 2. Tidak ada payment dengan status selain 'failed' (semua payment-nya failed)
        $enrolments = EnrolmentCourse::with(['member', 'course'])
            ->whereDoesntHave('payment', function($q) {
                $q->whereIn('state', ['pending', 'paid', 'partial_paid']);
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
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
        ]);

        if($validated['amount'] <= $validated['amount_paid']) {
            $validated['state'] = 'paid';
        } else if ($validated['amount_paid'] > 0) {
            $validated['state'] = 'partial_paid';
        } else {
            $validated['state'] = 'pending';
        }

        Payment::create($validated);

        return redirect('/management-pembayaran')->with('success', 'Payment berhasil ditambahkan');
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
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
            // 'state' => 'required|in:pending,paid,failed',
        ]);

        if($validated['amount'] <= $validated['amount_paid']) {
            $validated['state'] = 'paid';
        } else if ($validated['amount_paid'] > 0) {
            $validated['state'] = 'partial_paid';
        } else {
            $validated['state'] = 'pending';
        }

        $payment->update($validated);

        return redirect('/management-pembayaran')->with('success', 'Payment berhasil diupdate');
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return redirect('/management-pembayaran')->with('success', 'Payment berhasil dihapus');
    }

    public function pay(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
        ]);
        $payment = Payment::findOrFail($id);
        $payment_paid = $payment->amount_paid + $validated['amount_paid'];
        
        if($payment_paid >= $validated['amount']) {
            $validated['state'] = 'paid';
        } else if ($payment_paid > 0) {
            $validated['state'] = 'partial_paid';
        } else {
            $validated['state'] = 'pending';
        }
        $payment->update([
            'state' => $validated['state'],
            'amount_paid' => $payment_paid,
            'payment_method' => $validated['payment_method'],
        ]);
        

        return redirect('/management-pembayaran')->with('success', 'Payment berhasil dibayar');
    }

    public function fail($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'state' => 'failed',
        ]);

        return redirect('/management-pembayaran')->with('success', 'Payment berhasil dicancel');
    }
}
