import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Banknote, Tag } from 'lucide-react';

interface ExpenseCategory {
    id: number;
    name: string;
}

interface Expense {
    id: number;
    name: string;
    description: string;
    amount: number;
    expense_category_id: number;
}

interface Props {
    expense?: Expense;
    expenseCategories: ExpenseCategory[];
}

export default function CreateExpense({ expense, expenseCategories }: Props) {
    const isEdit = !!expense;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Management Pengeluaran',
            href: '/management-pengeluaran',
        },
        {
            title: isEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran',
            href: isEdit ? `/management-pengeluaran/${expense?.id}` : '/management-pengeluaran/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: expense?.name || '',
        description: expense?.description || '',
        amount: expense?.amount || '',
        expense_category_id: expense?.expense_category_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-pengeluaran/${expense?.id}`);
        } else {
            post('/management-pengeluaran');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Pengeluaran" : "Tambah Pengeluaran"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-pengeluaran" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data pengeluaran' : 'Catat pengeluaran baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6">
                        {/* Data Pengeluaran */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Banknote className="w-5 h-5" />
                                    Data Pengeluaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Nama */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm">
                                        Nama Pengeluaran <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Bayar listrik, Gaji karyawan, dll"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.name ? 'border-destructive' : ''}`}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                {/* Kategori */}
                                <div className="space-y-2">
                                    <Label htmlFor="expense_category_id" className="text-sm">
                                        Kategori <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="expense_category_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.expense_category_id ? 'border-destructive' : 'border-input'}`}
                                            value={data.expense_category_id}
                                            onChange={(e) => setData('expense_category_id', parseInt(e.target.value))}
                                        >
                                            <option value="">-- Pilih Kategori --</option>
                                            {expenseCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.expense_category_id && <p className="text-sm text-destructive">{errors.expense_category_id}</p>}
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-sm">
                                        Jumlah <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                                            className={`h-10 sm:h-11 pl-10 ${errors.amount ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm">
                                        Keterangan
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Tambahkan keterangan (opsional)"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={`min-h-[100px] ${errors.description ? 'border-destructive' : ''}`}
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-pengeluaran" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Pengeluaran' : 'Simpan Pengeluaran')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
