<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Course;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function financial(Request $request)
    {
        try {
            $period = $request->get('period', 'this_month');
            
            // Determine date range based on period
            switch ($period) {
                case 'last_month':
                    $startDate = Carbon::now()->subMonth()->startOfMonth();
                    $endDate = Carbon::now()->subMonth()->endOfMonth();
                    $prevStartDate = Carbon::now()->subMonths(2)->startOfMonth();
                    $prevEndDate = Carbon::now()->subMonths(2)->endOfMonth();
                    break;
                case 'this_quarter':
                    $startDate = Carbon::now()->startOfQuarter();
                    $endDate = Carbon::now()->endOfQuarter();
                    $prevStartDate = Carbon::now()->subQuarter()->startOfQuarter();
                    $prevEndDate = Carbon::now()->subQuarter()->endOfQuarter();
                    break;
                case 'this_year':
                    $startDate = Carbon::now()->startOfYear();
                    $endDate = Carbon::now()->endOfYear();
                    $prevStartDate = Carbon::now()->subYear()->startOfYear();
                    $prevEndDate = Carbon::now()->subYear()->endOfYear();
                    break;
                default: // this_month
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    $prevStartDate = Carbon::now()->subMonth()->startOfMonth();
                    $prevEndDate = Carbon::now()->subMonth()->endOfMonth();
            }
            
            // Total Income (from payments with state paid or partial_paid)
            $totalIncome = Payment::whereIn('state', ['paid', 'partial_paid'])
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('amount_paid');
            
            $prevTotalIncome = Payment::whereIn('state', ['paid', 'partial_paid'])
                ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
                ->sum('amount_paid');
            
            // Total Expense
            $totalExpense = Expense::whereBetween('created_at', [$startDate, $endDate])
                ->sum('amount');
            
            $prevTotalExpense = Expense::whereBetween('created_at', [$prevStartDate, $prevEndDate])
                ->sum('amount');
            
            // Net Profit
            $netProfit = $totalIncome - $totalExpense;
            
            // Receivables (pending + partial payments - amount already paid)
            $receivables = Payment::whereIn('state', ['pending', 'partial_paid'])
                ->selectRaw('SUM(amount - amount_paid) as total')
                ->value('total') ?? 0;
            
            // Income growth percentage
            $incomeGrowth = $prevTotalIncome > 0 
                ? (($totalIncome - $prevTotalIncome) / $prevTotalIncome) * 100 
                : ($totalIncome > 0 ? 100 : 0);
            
            // Expense growth percentage
            $expenseGrowth = $prevTotalExpense > 0 
                ? (($totalExpense - $prevTotalExpense) / $prevTotalExpense) * 100 
                : ($totalExpense > 0 ? 100 : 0);
            
            // Income by Course
            $incomeBySource = Course::select('courses.id', 'courses.title')
                // ->leftJoin('class_sessions', 'courses.id', '=', 'class_sessions.course_id')
                ->leftJoin('enrolment_courses', 'courses.id', '=', 'enrolment_courses.course_id')
                ->leftJoin('class_sessions', 'enrolment_courses.class_session_id', '=', 'class_sessions.id')
                ->leftJoin('payments', 'enrolment_courses.id', '=', 'payments.enrolment_course_id')
                ->whereIn('payments.state', ['paid', 'partial_paid'])
                ->whereBetween('payments.created_at', [$startDate, $endDate])
                ->groupBy('courses.id', 'courses.title')
                ->selectRaw('COALESCE(SUM(payments.amount_paid), 0) as amount')
                ->orderByDesc('amount')
                ->get()
                ->map(function($item) use ($totalIncome) {
                    return [
                        'name' => $item->title,
                        'amount' => (float) $item->amount,
                        'percentage' => $totalIncome > 0 ? round(($item->amount / $totalIncome) * 100, 1) : 0,
                    ];
                });
            
            // Expense by Category
            $expenseByCategory = ExpenseCategory::select('expense_categories.id', 'expense_categories.name')
                ->leftJoin('expenses', 'expense_categories.id', '=', 'expenses.expense_category_id')
                ->whereBetween('expenses.created_at', [$startDate, $endDate])
                ->groupBy('expense_categories.id', 'expense_categories.name')
                ->selectRaw('COALESCE(SUM(expenses.amount), 0) as amount')
                ->orderByDesc('amount')
                ->get()
                ->map(function($item) use ($totalExpense) {
                    return [
                        'name' => $item->name,
                        'amount' => (float) $item->amount,
                        'percentage' => $totalExpense > 0 ? round(($item->amount / $totalExpense) * 100, 1) : 0,
                    ];
                });
            
            return Inertia::render('admin/report/financial', [
                'summary' => [
                    'totalIncome' => (float) $totalIncome,
                    'totalExpense' => (float) $totalExpense,
                    'netProfit' => (float) $netProfit,
                    'receivables' => (float) $receivables,
                    'incomeGrowth' => round($incomeGrowth, 1),
                    'expenseGrowth' => round($expenseGrowth, 1),
                ],
                'incomeBySource' => $incomeBySource,
                'expenseByCategory' => $expenseByCategory,
                'selectedPeriod' => $period,
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }
}

