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
        $expenses = Expense::with('expense_category')->paginate(10);
        return Inertia::render('admin/expense_management', [
            'expenses' => $expenses
        ]);
    }

    public function create()
    {
        $expenseCategories = ExpenseCategory::all();
        return Inertia::render('admin/pengeluaran/create',[
            'expenseCategories' => $expenseCategories
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'expense_category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        Expense::create($validated);

        return redirect('/management-pengeluaran')->with('success', 'Pengeluaran berhasil ditambahkan');
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'expense_category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $expense = Expense::findOrFail($request->id);
        $expense->update($validated);

        return redirect('/management-pengeluaran')->with('success', 'Pengeluaran berhasil diupdate');
    }

    public function destroy($id){
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return redirect('/management-pengeluaran')->with('success', 'Pengeluaran berhasil dihapus');
    }
}
