import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle,
    Download,
    PieChart,
    BarChart3
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Keuangan',
        href: '/laporan-keuangan',
    },
];

interface Summary {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    receivables: number;
    incomeGrowth: number;
    expenseGrowth: number;
}

interface IncomeBySource {
    name: string;
    amount: number;
    percentage: number;
}

interface ExpenseByCategory {
    name: string;
    amount: number;
    percentage: number;
}

interface Props {
    summary: Summary;
    incomeBySource: IncomeBySource[];
    expenseByCategory: ExpenseByCategory[];
    selectedPeriod: string;
    startDate?: string;
    endDate?: string;
}

export default function FinancialReport({
    summary = { totalIncome: 0, totalExpense: 0, netProfit: 0, receivables: 0, incomeGrowth: 0, expenseGrowth: 0 },
    incomeBySource = [],
    expenseByCategory = [],
    selectedPeriod = 'all_time',
    startDate,
    endDate
}: Props) {
    const [customStartDate, setCustomStartDate] = useState(startDate || '');
    const [customEndDate, setCustomEndDate] = useState(endDate || '');
    const [isCustomPeriod, setIsCustomPeriod] = useState(selectedPeriod === 'custom');

    const handlePeriodChange = (period: string) => {
        if (period === 'custom') {
            setIsCustomPeriod(true);
        } else {
            setIsCustomPeriod(false);
            router.get('/laporan-keuangan', { period }, { preserveState: true });
        }
    };
    const handleApplyCustomDate = () => {
        if (customStartDate && customEndDate) {
            router.get('/laporan-keuangan', {
                period: 'custom',
                start_date: customStartDate,
                end_date: customEndDate
            }, { preserveState: true });
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const maxIncome = Math.max(...incomeBySource.map(i => i.amount), 1);
    const maxExpense = Math.max(...expenseByCategory.map(e => e.amount), 1);
    const profitMargin = summary.totalIncome > 0 ? ((summary.netProfit / summary.totalIncome) * 100).toFixed(1) : '0';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Keuangan" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Laporan Keuangan</h1>
                        <p className="text-muted-foreground">Ringkasan keuangan Akuatik Azura</p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                            value={selectedPeriod}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                        >
                            <option value="all_time">Semua Waktu</option>
                            <option value="this_month">Bulan Ini</option>
                            <option value="last_month">Bulan Lalu</option>
                            <option value="this_quarter">Kuartal Ini</option>
                            <option value="this_year">Tahun Ini</option>
                            <option value="custom">Custom</option>
                        </select>
                        {isCustomPeriod && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="w-auto h-9"
                                />
                                <span className="text-muted-foreground">-</span>
                                <Input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-auto h-9"
                                />
                                <Button size="sm" onClick={handleApplyCustomDate} disabled={!customStartDate || !customEndDate}>
                                    Terapkan
                                </Button>
                            </div>
                        )}
                        <Button variant="outline" asChild>
                            <a href={`/laporan-keuangan/export?period=${selectedPeriod}&start_date=${customStartDate}&end_date=${customEndDate}`}>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Pemasukan */}
                    < Card className="border-l-4 border-l-green-500" >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                                <ArrowUpCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                {summary.incomeGrowth >= 0 ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        <span className="text-green-600 font-medium">+{summary.incomeGrowth}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600" />
                                        <span className="text-red-600 font-medium">{summary.incomeGrowth}%</span>
                                    </>
                                )}
                                dari periode lalu
                            </p>
                        </CardContent>
                    </Card >

                    {/* Total Pengeluaran */}
                    < Card className="border-l-4 border-l-red-500" >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
                                <ArrowDownCircle className="h-5 w-5 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                {summary.expenseGrowth <= 0 ? (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-green-600" />
                                        <span className="text-green-600 font-medium">{summary.expenseGrowth}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-red-600" />
                                        <span className="text-red-600 font-medium">+{summary.expenseGrowth}%</span>
                                    </>
                                )}
                                dari periode lalu
                            </p>
                        </CardContent>
                    </Card>

                    {/* Laba Bersih */}
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Wallet className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-primary' : 'text-red-600'}`}>
                                {formatCurrency(summary.netProfit)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Margin: {profitMargin}%
                            </p>
                        </CardContent>
                    </Card>

                    {/* Piutang */}
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Piutang</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100">
                                <CreditCard className="h-5 w-5 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{formatCurrency(summary.receivables)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Belum terbayar
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Profit & Loss Statement */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Laporan Laba Rugi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Pemasukan Section */}
                            <div>
                                <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                                    <ArrowUpCircle className="h-4 w-4" />
                                    PEMASUKAN
                                </h3>
                                <div className="space-y-2 pl-6">
                                    {incomeBySource.length > 0 ? (
                                        incomeBySource.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between py-2 border-b border-dashed">
                                                <span className="text-muted-foreground">{item.name}</span>
                                                <span className="font-medium">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm py-2">Belum ada pemasukan</p>
                                    )}
                                    <div className="flex items-center justify-between py-2 font-bold text-green-600">
                                        <span>Total Pemasukan</span>
                                        <span>{formatCurrency(summary.totalIncome)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pengeluaran Section */}
                            <div>
                                <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                                    <ArrowDownCircle className="h-4 w-4" />
                                    PENGELUARAN
                                </h3>
                                <div className="space-y-2 pl-6">
                                    {expenseByCategory.length > 0 ? (
                                        expenseByCategory.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between py-2 border-b border-dashed">
                                                <span className="text-muted-foreground">{item.name}</span>
                                                <span className="font-medium">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm py-2">Belum ada pengeluaran</p>
                                    )}
                                    <div className="flex items-center justify-between py-2 font-bold text-red-600">
                                        <span>Total Pengeluaran</span>
                                        <span>{formatCurrency(summary.totalExpense)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Net Profit */}
                            <div className="border-t-2 border-primary pt-4">
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span className={summary.netProfit >= 0 ? 'text-primary' : 'text-red-600'}>
                                        {summary.netProfit >= 0 ? 'LABA BERSIH' : 'RUGI BERSIH'}
                                    </span>
                                    <span className={summary.netProfit >= 0 ? 'text-primary' : 'text-red-600'}>
                                        {formatCurrency(Math.abs(summary.netProfit))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Two Column Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Income by Course */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-green-600" />
                                Pemasukan per Course
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {incomeBySource.length > 0 ? (
                                incomeBySource.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{item.name}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-green-600">{formatCurrency(item.amount)}</span>
                                                <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3">
                                            <div
                                                className="bg-green-500 h-3 rounded-full transition-all"
                                                style={{ width: `${(item.amount / maxIncome) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <PieChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>Belum ada data pemasukan</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Expense by Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-red-600" />
                                Pengeluaran per Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {expenseByCategory.length > 0 ? (
                                expenseByCategory.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{item.name}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-red-600">{formatCurrency(item.amount)}</span>
                                                <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3">
                                            <div
                                                className="bg-red-500 h-3 rounded-full transition-all"
                                                style={{ width: `${(item.amount / maxExpense) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <PieChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>Belum ada data pengeluaran</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

