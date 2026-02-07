import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Tag } from 'lucide-react';

interface ExpenseCategory {
    id: number;
    name: string;
}

interface Props {
    expenseCategory?: ExpenseCategory;
}

export default function CreateExpenseCategory({ expenseCategory }: Props) {
    const isEdit = !!expenseCategory;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kategori Pengeluaran',
            href: '/kategori-pengeluaran',
        },
        {
            title: isEdit ? 'Edit Kategori' : 'Tambah Kategori',
            href: isEdit ? `/kategori-pengeluaran/edit/${expenseCategory?.id}` : '/kategori-pengeluaran/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: expenseCategory?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/kategori-pengeluaran/update/${expenseCategory?.id}`);
        } else {
            post('/kategori-pengeluaran');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Kategori" : "Tambah Kategori"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/kategori-pengeluaran" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data kategori' : 'Buat kategori pengeluaran baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 ">
                        {/* Data Kategori */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Data Kategori
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Nama */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm">
                                        Nama Kategori <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Operasional, Gaji, dll"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.name ? 'border-destructive' : ''}`}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/kategori-pengeluaran" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Kategori' : 'Simpan Kategori')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
