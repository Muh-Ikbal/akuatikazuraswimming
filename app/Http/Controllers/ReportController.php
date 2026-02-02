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

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\FinancialReportExport;

class ReportController extends Controller
{
    private function getFinancialData(Request $request)
    {
        $period = $request->get('period', 'all_time');
        $name_period = $period;
        
        // Determine date range based on period
        switch ($period) {
            case 'custom':
                $startDate = Carbon::parse($request->get('start_date'))->startOfDay();
                $endDate = Carbon::parse($request->get('end_date'))->endOfDay();
                
                // Calculate duration in days
                $days = $startDate->diffInDays($endDate) + 1;
                
                // Previous period is the same number of days immediately before the start date
                $prevEndDate = $startDate->copy()->subDay()->endOfDay();
                $prevStartDate = $prevEndDate->copy()->subDays($days - 1)->startOfDay();
                $name_period = Carbon::parse($request->get('start_date'))->format('d-m-Y').' - '.Carbon::parse($request->get('end_date'))->format('d-m-Y');
                break;
            case 'this_month':
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $prevStartDate = Carbon::now()->subMonth()->startOfMonth();
                $prevEndDate = Carbon::now()->subMonth()->endOfMonth();
                $name_period = 'Bulan '.Carbon::now()->format('F').' - '.Carbon::now()->format('Y');
                break;
            case 'last_month':
                $startDate = Carbon::now()->subMonth()->startOfMonth();
                $endDate = Carbon::now()->subMonth()->endOfMonth();
                $prevStartDate = Carbon::now()->subMonths(2)->startOfMonth();
                $prevEndDate = Carbon::now()->subMonths(2)->endOfMonth();
                $name_period = 'Bulan '.Carbon::now()->subMonth()->format('F').' - '.Carbon::now()->subMonth()->format('Y');
                break;
            case 'this_quarter':
                $startDate = Carbon::now()->startOfQuarter();
                $endDate = Carbon::now()->endOfQuarter();
                $prevStartDate = Carbon::now()->subQuarter()->startOfQuarter();
                $prevEndDate = Carbon::now()->subQuarter()->endOfQuarter();
                $name_period = 'Kuartal '.Carbon::now()->quarter.' - '.Carbon::now()->format('Y');
                break;
            case 'this_year':
                $startDate = Carbon::now()->startOfYear();
                $endDate = Carbon::now()->endOfYear();
                $prevStartDate = Carbon::now()->subYear()->startOfYear();
                $prevEndDate = Carbon::now()->subYear()->endOfYear();
                $name_period = 'Tahun '.Carbon::now()->year;
                break;
            default: // all_time
                // Find earliest date from payments or expenses
                $firstPayment = Payment::min('created_at');
                $firstExpense = Expense::min('created_at');
                
                $earliest = $firstPayment;
                if ($firstExpense && (!$earliest || $firstExpense < $earliest)) {
                    $earliest = $firstExpense;
                }
                
                $startDate = $earliest ? Carbon::parse($earliest)->startOfDay() : Carbon::now()->startOfYear();
                $endDate = Carbon::now()->endOfDay();
                
                // For all time, comparison is effectively 0, so we set a previous period that is guaranteed to have no data
                // e.g. 100 years ago
                $prevStartDate = $startDate->copy()->subYears(100);
                $prevEndDate = $startDate->copy()->subDay()->endOfDay();
                $period = 'all_time'; // Ensure period name is set for frontend
                $name_period = 'Semua Waktu';
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

        return [
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
            'period' => $period,
            'name_period' => $name_period,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ];
    }

    public function financial(Request $request)
    {
        try {
            $data = $this->getFinancialData($request);
            
            return Inertia::render('admin/report/financial', [
                'summary' => $data['summary'],
                'incomeBySource' => $data['incomeBySource'],
                'expenseByCategory' => $data['expenseByCategory'],
                'selectedPeriod' => $data['period'],
                'startDate' => $data['startDate'],
                'endDate' => $data['endDate'],
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function export(Request $request)
    {
        try {
            $data = $this->getFinancialData($request);
            $fileName = 'Laporan_Keuangan_' . $data['startDate'] . '_sd_' . $data['endDate'] . '.xlsx';
            
            return Excel::download(new FinancialReportExport($data), $fileName);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal export data: ' . $th->getMessage());
        }
    }
}

