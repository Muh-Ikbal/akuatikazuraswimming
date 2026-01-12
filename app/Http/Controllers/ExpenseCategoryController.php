<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ExpenseCategory;

class ExpenseCategoryController extends Controller
{
    public function index(){
        $expensesCategory = ExpenseCategory::paginate(10);
        return Inertia::render('admin/expense-category',[
            'expensesCategory' => $expensesCategory
        ]);
    }

    public function create(){
        return Inertia::render('admin/expense/create');
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        ExpenseCategory::create($validated);

        return redirect('/kategori-pengeluaran')->with('success', 'Kategori berhasil ditambahkan');
    }

    public function edit($id){
        $expenseCategory = ExpenseCategory::findOrFail($id);
        return Inertia::render('admin/expense/create',[
            'expenseCategory' => $expenseCategory
        ]);
    }

    public function update(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $expenseCategory = ExpenseCategory::findOrFail($request->id);
        $expenseCategory->update($validated);

        return redirect('/kategori-pengeluaran')->with('success', 'Kategori berhasil diupdate');
    }

    public function destroy($id){
        $expenseCategory = ExpenseCategory::findOrFail($id);
        $expenseCategory->delete();
        
        return redirect('/kategori-pengeluaran')->with('success', 'Kategori berhasil dihapus');
    }


}
