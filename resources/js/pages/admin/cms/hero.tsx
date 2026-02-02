import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Home,
    Image as ImageIcon,
    Save,
    Upload,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface HeroSettings {
    hero_title: string | null;
    hero_subtitle: string | null;
    hero_image: string | null;
    satisfaction_rate: string | null;
    coach_count: number;
    member_count: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda Utama',
        href: '/cms/hero',
    },
];

export default function CmsHero({ settings }: { settings: HeroSettings }) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        settings.hero_image ? `/storage/${settings.hero_image}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_image: null as File | null,
        satisfaction_rate: settings.satisfaction_rate || '98',
        coach_count: settings.coach_count,
        member_count: settings.member_count,
        _method: 'PUT',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('hero_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms/hero', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Berhasil!', {
                    description: 'Perubahan beranda utama berhasil disimpan.',
                });
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors).flat();
                toast.error('Gagal menyimpan!', {
                    description: errorMessages[0] || 'Terjadi kesalahan. Silakan periksa kembali data Anda.',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda Utama" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Beranda Utama
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola tampilan hero section di landing page
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Content Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Konten Hero
                                </CardTitle>
                                <CardDescription>
                                    Atur judul dan deskripsi yang tampil di bagian utama landing page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hero_title">Judul Utama</Label>
                                    <Input
                                        id="hero_title"
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        placeholder="Belajar Berenang dengan Menyenangkan"
                                    />
                                    {errors.hero_title && (
                                        <p className="text-sm text-red-500">{errors.hero_title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hero_subtitle">Tagline / Deskripsi</Label>
                                    <Textarea
                                        id="hero_subtitle"
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        placeholder="Kursus renang profesional untuk semua usia..."
                                        rows={3}
                                    />
                                    {errors.hero_subtitle && (
                                        <p className="text-sm text-red-500">{errors.hero_subtitle}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="satisfaction_rate">Tingkat Kepuasan (%)</Label>
                                    <Input
                                        id="satisfaction_rate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.satisfaction_rate}
                                        onChange={(e) => setData('satisfaction_rate', e.target.value)}
                                        placeholder="98"
                                    />
                                    {errors.satisfaction_rate && (
                                        <p className="text-sm text-red-500">{errors.satisfaction_rate}</p>
                                    )}

                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="coach_count">Jumlah Coach</Label>
                                    <Input
                                        id="coach_count"
                                        type="number"
                                        disabled
                                        value={data.coach_count}

                                    />
                                    {errors.coach_count && (
                                        <p className="text-sm text-red-500">{errors.coach_count}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Statistik peserta aktif dan coach akan diambil otomatis dari database
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="member_count">Jumlah Member</Label>
                                    <Input
                                        id="member_count"
                                        type="number"
                                        disabled
                                        value={data.member_count}

                                    />
                                    {errors.member_count && (
                                        <p className="text-sm text-red-500">{errors.member_count}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Statistik peserta aktif dan coach akan diambil otomatis dari database
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Gambar Hero
                                </CardTitle>
                                <CardDescription>
                                    Upload gambar yang akan ditampilkan di hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hero_image">Upload Gambar</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="hero_image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="flex-1"
                                        />
                                    </div>
                                    {errors.hero_image && (
                                        <p className="text-sm text-red-500">{errors.hero_image}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Format: JPG, PNG, GIF, WebP. Maksimal 2MB
                                    </p>
                                </div>

                                {/* Preview */}
                                <div className="space-y-2">
                                    <Label>Preview</Label>
                                    <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center text-muted-foreground">
                                                <Upload className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">Belum ada gambar</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} size="lg">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
