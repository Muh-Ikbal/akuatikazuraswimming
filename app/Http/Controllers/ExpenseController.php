<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Expense;
use App\Models\ExpenseCategory;

class ExpenseController extends Controller
{
    public function index()
    {
        try {
            $expenses = Expense::with('expense_category')->paginate(10);
            $expense_count = Expense::count();
            $expense_amount = Expense::sum('amount');
            return Inertia::render('admin/expense_management', [
                'expenses' => $expenses,
                'expense_count' => $expense_count,
                'expense_amount' => $expense_amount
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
