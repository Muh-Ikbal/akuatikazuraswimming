<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\EnrolmentCourse;
use App\Models\Promo;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->query('search');
            $state = $request->query('state');

            $payments = Payment::with(['enrolment_course.member', 'enrolment_course.course'])
                ->when($search, function($query,$search){
                    $query->whereHas('enrolment_course.member',function ($query) use ($search){
                        $query->where('name','like',"%{$search}%");
                    });
                })
                ->when($state && $state !== 'all', function ($query) use ($state) {
                    $query->where('state', $state);
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString();
            
            $totalIncome = Payment::where('state', 'paid')->sum('amount_paid');
            $allAmount = Payment::whereNot('state', 'failed')->sum('amount');
            $pendingAmount = $allAmount-$totalIncome;
            $totalPaidCount = Payment::where('state','paid')->count();
            
            $promos = Promo::where('state', 'active')->get();

            return Inertia::render('admin/payment_management', [
                'payments' => $payments,
                'totalIncome' => $totalIncome,
                'pendingAmount' => $pendingAmount,
                'totalPaidCount'=>$totalPaidCount,
                'filters' => $request->only(['search', 'state']),
                'promos' => $promos,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create()
    {
        try {
            // Enrolment muncul jika:
            // 1. Tidak punya payment sama sekali, ATAU
            // 2. Tidak ada payment dengan status selain 'failed' (semua payment-nya failed)
            $enrolments = EnrolmentCourse::with(['member', 'course'])
                ->whereDoesntHave('payment', function($q) {
                    $q->whereIn('state', ['pending', 'paid', 'partial_paid']);
                })
                ->get();
            
            $promos = Promo::where('state', 'active')->get();

            return Inertia::render('admin/payment/create', [
                'enrolments' => $enrolments,
                'promos' => $promos
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'enrolment_course_id' => 'required|exists:enrolment_courses,id',
            'amount' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
            'promo_id' => 'nullable|exists:promos,id',
        ]);
        try {
            $discountAmount = 0;
            $notes = null;

            if (!empty($validated['promo_id'])) {
                $promo = Promo::find($validated['promo_id']);
                if ($promo) {
                    if ($promo->discount_type === 'percentage') {
                        $discountAmount = ($validated['amount'] * $promo->discount_value) / 100;
                    } else {
                        $discountAmount = $promo->discount_value;
                    }
                    
                    if ($discountAmount > $validated['amount']) {
                        $discountAmount = $validated['amount'];
                    }
                    
                    $notes = "Promo applied: {$promo->title} (Discount: " . number_format($discountAmount, 0, ',', '.') . ")";
                }
            }
            
            $validated['discount_amount'] = $discountAmount;
            if($notes) $validated['notes'] = $notes;

            if(($validated['amount'] - $discountAmount) <= $validated['amount_paid']) {
                $validated['state'] = 'paid';
            } else if ($validated['amount_paid'] > 0) {
                $validated['state'] = 'partial_paid';
            } else {
                $validated['state'] = 'pending';
            }

            Payment::create($validated);

            return redirect('/management-pembayaran')->with('success', 'Payment berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $payment = Payment::with(['enrolment_course.member', 'enrolment_course.course', 'enrolment_course.class_session'])
                ->findOrFail($id);
            
            return Inertia::render('admin/payment/show', [
                'payment' => $payment
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function invoice($id)
    {
        try {
            $payment = Payment::with(['enrolment_course.member', 'enrolment_course.course', 'enrolment_course.class_session', 'promo'])
                ->where('state', 'paid')
                ->findOrFail($id);
            
            // Generate invoice number
            $invoiceNumber = 'INV-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT);
            
            return Inertia::render('admin/payment/invoice', [
                'payment' => $payment,
                'invoiceNumber' => $invoiceNumber,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $payment = Payment::with(['enrolment_course.member', 'enrolment_course.course'])->findOrFail($id);
            $enrolments = EnrolmentCourse::with(['member', 'course'])->get();
            $promos = Promo::where('state', 'active')->get();
            
            return Inertia::render('admin/payment/create', [
                'payment' => $payment,
                'enrolments' => $enrolments,
                'promos' => $promos,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $payment = Payment::findOrFail($id);
            
            $validated = $request->validate([
                'enrolment_course_id' => 'required|exists:enrolment_courses,id',
                'amount' => 'required|numeric|min:0',
                'amount_paid' => 'required|numeric|min:0',
                'payment_method' => 'required|string|max:50',
                'promo_id' => 'nullable|exists:promos,id',
                // 'state' => 'required|in:pending,paid,failed',
            ]);

            $discountAmount = 0;
            $notes = null;

            if (!empty($validated['promo_id'])) {
                $promo = Promo::find($validated['promo_id']);
                if ($promo) {
                    if ($promo->discount_type === 'percentage') {
                        $discountAmount = ($validated['amount'] * $promo->discount_value) / 100;
                    } else {
                        $discountAmount = $promo->discount_value;
                    }
                    
                    if ($discountAmount > $validated['amount']) {
                        $discountAmount = $validated['amount'];
                    }
                    
                    $notes = "Promo applied: {$promo->title} (Discount: " . number_format($discountAmount, 0, ',', '.') . ")";
                }
            }
            
            $validated['discount_amount'] = $discountAmount;
            if($notes) $validated['notes'] = $notes;


            if(($validated['amount'] - $discountAmount) <= $validated['amount_paid']) {
                $validated['state'] = 'paid';
            } else if ($validated['amount_paid'] > 0) {
                $validated['state'] = 'partial_paid';
            } else {
                $validated['state'] = 'pending';
            }

            $payment->update($validated);

            return redirect('/management-pembayaran')->with('success', 'Payment berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $payment = Payment::findOrFail($id);
            $payment->delete();

            return redirect('/management-pembayaran')->with('success', 'Payment berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function pay(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
            'promo_id' => 'nullable|exists:promos,id',
        ]);
        try {
            $payment = Payment::findOrFail($id);
            
            $discountAmount = 0;
            $notes = null;

            if (!empty($validated['promo_id'])) {
                $promo = Promo::find($validated['promo_id']);
                if ($promo) {
                    if ($promo->discount_type === 'percentage') {
                        $discountAmount = ($payment->amount * $promo->discount_value) / 100;
                    } else {
                        $discountAmount = $promo->discount_value;
                    }
                    
                    // Ensure discount doesn't exceed total amount
                    if ($discountAmount > $payment->amount) {
                        $discountAmount = $payment->amount;
                    }
                    
                    $notes = "Promo applied: {$promo->title} (Discount: " . number_format($discountAmount, 0, ',', '.') . ")";
                }
            }

            // Adjust validation logic: total needed includes discount
            // Currently 'amount' is total cost.
            // User pays 'amount_paid'.
            // If discount is applied, effective cost is amount - discount.
            // So total paid or cleared = amount_paid + discountAmount.
            
            $payment_paid = $payment->amount_paid + $validated['amount_paid'];
            $total_cleared = $payment_paid + $discountAmount;
            
            if($total_cleared >= $payment->amount) { // Or usually >= amount
                 // However, logic says if amount_paid >= amount.
                 // With discount, we should consider discount as part of "covering" the cost?
                 // Or update the amount?
                 // Let's assume (paid + discount) >= amount means Fully Paid.
                 $validated['state'] = 'paid';
            } else if ($total_cleared > 0) {
                $validated['state'] = 'partial_paid';
            } else {
                $validated['state'] = 'pending';
            }
            
            $payment->update([
                'state' => $validated['state'],
                'amount_paid' => $payment_paid,
                'payment_method' => $validated['payment_method'],
                'promo_id' => $validated['promo_id'] ?? null,
                'discount_amount' => $discountAmount, // Note: this overwrites previous discount if any?
                // If paying multiple times, maybe we shouldn't overwrite discount unless it's a new promo application on first pay?
                // For simplicity, we assume promo is applied once or updated.
                 'notes' => $notes ? ($payment->notes ? $payment->notes . "\n" . $notes : $notes) : $payment->notes,
            ]);
            

            return redirect('/management-pembayaran')->with('success', 'Payment berhasil dibayar');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function fail($id)
    {
        try {
            $payment = Payment::findOrFail($id);
            $payment->update([
                'state' => 'failed',
            ]);

            return redirect('/management-pembayaran')->with('success', 'Payment berhasil dicancel');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
