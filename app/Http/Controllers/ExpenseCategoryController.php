<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ExpenseCategory;

class ExpenseCategoryController extends Controller
{
    public function index(){
        try {
            $expensesCategory = ExpenseCategory::paginate(10);
            $expenseCategory_count = ExpenseCategory::count();
            return Inertia::render('admin/expense-category',[
                'expensesCategory' => $expensesCategory,
                'expenseCategory_count' => $expenseCategory_count
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function create(){
        return Inertia::render('admin/expense/create');
    }

    public function store(Request $request){
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);
    
            ExpenseCategory::create($validated);
    
            return redirect('/kategori-pengeluaran')->with('success', 'Kategori berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function edit($id){
        $expenseCategory = ExpenseCategory::findOrFail($id);
        return Inertia::render('admin/expense/create',[
            'expenseCategory' => $expenseCategory
        ]);
    }

    public function update(Request $request){
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);
    
            $expenseCategory = ExpenseCategory::findOrFail($request->id);
            $expenseCategory->update($validated);
    
            return redirect('/kategori-pengeluaran')->with('success', 'Kategori berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function destroy($id){
        try {
            $expenseCategory = ExpenseCategory::findOrFail($id);
            $expenseCategory->delete();
            
            return redirect('/kategori-pengeluaran')->with('success', 'Kategori berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }


}
