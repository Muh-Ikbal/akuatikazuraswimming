<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Expense;
use App\Models\ExpenseCategory;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Expense::with('expense_category');

            // Filter by search
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhereHas('expense_category', fn($q2) => $q2->where('name', 'like', "%{$search}%"));
                });
            }

            // Filter by category
            if ($request->filled('category')) {
                $query->where('expense_category_id', $request->category);
            }

            // Filter by date range
            if ($request->filled('start_date')) {
                $query->whereDate('date', '>=', $request->start_date);
            }
            if ($request->filled('end_date')) {
                $query->whereDate('date', '<=', $request->end_date);
            }

            $expense_count = $query->count();
            $expense_amount = $query->sum('amount');
            $expenses = $query->latest('date')->paginate(10)->appends($request->query());
            $expense_categories = ExpenseCategory::all();

            return Inertia::render('admin/expense_management', [
                'expenses' => $expenses,
                'expense_count' => $expense_count,
                'expense_amount' => $expense_amount,
                'expense_categories' => $expense_categories,
                'filters' => [
                    'search' => $request->search ?? '',
                    'category' => $request->category ?? '',
                    'start_date' => $request->start_date ?? '',
                    'end_date' => $request->end_date ?? '',
                ],
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create()
    {
        $expenseCategories = ExpenseCategory::all();
        return Inertia::render('admin/pengeluaran/create',[
            'expenseCategories' => $expenseCategories
        ]);
    }

    public function store(Request $request){
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'expense_category_id' => 'required|exists:expense_categories,id',
                'amount' => 'required|numeric',
                'date' => 'required|date',
                'description' => 'nullable|string',
            ]);
    
            Expense::create($validated);
    
            return redirect('/management-pengeluaran')->with('success', 'Pengeluaran berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id){
        $expense = Expense::findOrFail($id);
        $expenseCategories = ExpenseCategory::all();
        return Inertia::render('admin/pengeluaran/create',[
            'expenseCategories' => $expenseCategories,
            'expense' => $expense
        ]);
    }

    public function update(Request $request){
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'expense_category_id' => 'required|exists:expense_categories,id',
                'amount' => 'required|numeric',
                'date' => 'required|date',
                'description' => 'nullable|string',
            ]);
    
            $expense = Expense::findOrFail($request->id);
            $expense->update($validated);
    
            return redirect('/management-pengeluaran')->with('success', 'Pengeluaran berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id){
        try {
            $expense = Expense::findOrFail($id);
            $expense->delete();
    
            return redirect('/management-pengeluaran')->with('success', 'Pengeluaran berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}
