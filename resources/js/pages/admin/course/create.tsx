import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Image, Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course Management',
        href: '/management-course',
    },
    {
        title: 'Tambah Course',
        href: '/management-course/create',
    },
];

interface CourseFormData {
    id: number,
    title: string;
    description: string;
    image: File | null;
    total_meeting: number;
    weekly_meeting_count: number;
    price: number;
    state: "active" | "inactive";
}

export default function CreateCourse({ course }: { course: CourseFormData }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors } = useForm<CourseFormData>({
        id: course?.id || 0,
        title: course?.title || '',
        description: course?.description || '',
        image: null,
        total_meeting: course?.total_meeting || 12,
        weekly_meeting_count: course?.weekly_meeting_count || 2,
        price: course?.price || 0,
        state: course?.state || 'active',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) {
            post('/management-course', {
                forceFormData: true,
            });
        } else {
            // Use post with _method=PUT for proper FormData handling with file uploads
            post(`/management-course/update/${course.id}?_method=PUT`, {
                forceFormData: true,
            });
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Course" />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-course" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Tambah Course Baru</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">Lengkapi form berikut untuk menambahkan course baru</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg">Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Nama Course */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm">Nama Course <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="title"
                                        placeholder="Contoh: Basic Swimming"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.title ? 'border-destructive' : ''}`}
                                    />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm">Deskripsi <span className="text-destructive">*</span></Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Jelaskan tentang course ini..."
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-destructive' : ''}
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label className="text-sm">Gambar Course</Label>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <div className="w-full sm:w-40 h-32 sm:h-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50 overflow-hidden shrink-0">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Image className="w-8 h-8 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground sm:hidden">Tap untuk upload</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="cursor-pointer">
                                                <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2 border border-input rounded-md bg-background hover:bg-muted active:bg-muted transition-colors w-full sm:w-fit">
                                                    <Upload className="w-4 h-4" />
                                                    <span className="text-sm">Upload Gambar</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
                                                Format: JPG, PNG. Maksimal 2MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule & Pricing */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg">Jadwal & Harga</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Jumlah Pertemuan */}
                                    <div className="space-y-2">
                                        <Label htmlFor="total_meeting" className="text-sm">Jumlah Pertemuan <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="total_meeting"
                                            type="number"
                                            min="1"
                                            placeholder="12"
                                            value={data.total_meeting}
                                            onChange={(e) => setData('total_meeting', parseInt(e.target.value) || 0)}
                                            className={`h-10 sm:h-11 ${errors.total_meeting ? 'border-destructive' : ''}`}
                                        />
                                        {errors.total_meeting && <p className="text-sm text-destructive">{errors.total_meeting}</p>}
                                    </div>

                                    {/* Pertemuan Per Minggu */}
                                    <div className="space-y-2">
                                        <Label htmlFor="weekly_meeting_count" className="text-sm">Pertemuan Per Minggu <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="weekly_meeting_count"
                                            type="number"
                                            min="1"
                                            max="7"
                                            placeholder="2"
                                            value={data.weekly_meeting_count}
                                            onChange={(e) => setData('weekly_meeting_count', parseInt(e.target.value) || 0)}
                                            className={`h-10 sm:h-11 ${errors.weekly_meeting_count ? 'border-destructive' : ''}`}
                                        />
                                        {errors.weekly_meeting_count && <p className="text-sm text-destructive">{errors.weekly_meeting_count}</p>}
                                    </div>

                                    {/* Harga */}
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-sm">Harga (Rp) <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="10000"
                                            placeholder="750000"
                                            value={data.price}
                                            onChange={(e) => setData('price', parseInt(e.target.value))}
                                            className={`h-10 sm:h-11 ${errors.price ? 'border-destructive' : ''}`}
                                        />
                                        {data.price > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                Rp {formatCurrency(data.price)}
                                            </p>
                                        )}
                                        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="state" className="text-sm">Status</Label>
                                        <select
                                            id="state"
                                            className="w-full h-10 sm:h-11 px-3 sm:px-4 py-2 border border-input rounded-md bg-background text-sm"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value as "active" | "inactive")}
                                        >
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Nonaktif</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-course" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">Batal</Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : 'Simpan Course'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
