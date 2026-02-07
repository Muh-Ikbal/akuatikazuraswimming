import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Percent } from 'lucide-react';

interface Promo {
    id: number;
    title: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    state: 'active' | 'inactive';
}

interface Props {
    promo?: Promo;
}

export default function CreatePromo({ promo }: Props) {
    const isEdit = !!promo;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Promo',
            href: '/management-promo',
        },
        {
            title: isEdit ? 'Edit Promo' : 'Tambah Promo',
            href: isEdit ? `/management-promo/edit/${promo?.id}` : '/management-promo/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        title: promo?.title || '',
        description: promo?.description || '',
        discount_type: promo?.discount_type || 'percentage',
        discount_value: promo?.discount_value || '',
        state: promo?.state || 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-promo/update/${promo?.id}`);
        } else {
            post('/management-promo');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Promo" : "Tambah Promo"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-promo" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Promo' : 'Tambah Promo Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data promo' : 'Buat promo baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6">
                        {/* Data Promo */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Percent className="w-5 h-5" />
                                    Data Promo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Nama */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm">
                                        Nama Promo <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Contoh: Diskon Akhir Tahun"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.title ? 'border-destructive' : ''}`}
                                    />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Deskripsi promo (opsional)"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-destructive' : ''}
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                {/* Tipe Diskon */}
                                <div className="space-y-2">
                                    <Label htmlFor="discount_type" className="text-sm">
                                        Tipe Diskon <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="discount_type"
                                        value={data.discount_type}
                                        onChange={(e) => setData('discount_type', e.target.value as 'percentage' | 'fixed')}
                                        className={`w-full h-10 sm:h-11 px-3 border rounded-md bg-background text-sm border-input ${errors.discount_type ? 'border-destructive' : ''}`}
                                    >
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Nominal Tetap (Rp)</option>
                                    </select>
                                    {errors.discount_type && <p className="text-sm text-destructive">{errors.discount_type}</p>}
                                </div>

                                {/* Nilai Diskon */}
                                <div className="space-y-2">
                                    <Label htmlFor="discount_value" className="text-sm">
                                        Nilai Diskon <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                            {data.discount_type === 'percentage' ? '%' : 'Rp'}
                                        </span>
                                        <Input
                                            id="discount_value"
                                            type="number"
                                            placeholder={data.discount_type === 'percentage' ? '10' : '50000'}
                                            value={data.discount_value}
                                            onChange={(e) => setData('discount_value', e.target.value)}
                                            className={`pl-10 h-10 sm:h-11 ${errors.discount_value ? 'border-destructive' : ''}`}
                                            min="0"
                                            step={data.discount_type === 'percentage' ? '1' : '1000'}
                                        />
                                    </div>
                                    {errors.discount_value && <p className="text-sm text-destructive">{errors.discount_value}</p>}
                                    {data.discount_type === 'percentage' && (
                                        <p className="text-xs text-muted-foreground">Maksimal 100%</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-sm">
                                        Status <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="state"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value as 'active' | 'inactive')}
                                        className={`w-full h-10 sm:h-11 px-3 border rounded-md bg-background text-sm border-input ${errors.state ? 'border-destructive' : ''}`}
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                    </select>
                                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-promo" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Promo' : 'Simpan Promo')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
