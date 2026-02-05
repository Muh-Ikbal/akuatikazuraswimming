import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    History,
    Save,
    Upload,
    Image as ImageIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SejarahSettings {
    sejarah_title: string | null;
    sejarah_content: string | null;
    sejarah_image: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sejarah',
        href: '/cms/sejarah',
    },
];

export default function CmsSejarah({ settings }: { settings: SejarahSettings }) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        settings.sejarah_image ? `/storage/${settings.sejarah_image}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        sejarah_title: settings.sejarah_title || '',
        sejarah_content: settings.sejarah_content || '',
        sejarah_image: null as File | null,
        _method: 'PUT',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('sejarah_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms/sejarah', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Berhasil!', {
                    description: 'Sejarah berhasil disimpan.',
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
            <Head title="Sejarah" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Sejarah
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola tampilan sejarah di halaman utama
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Content Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Konten Sejarah
                                </CardTitle>
                                <CardDescription>
                                    Atur konten sejarah yang tampil di halaman utama
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sejarah_title">Judul</Label>
                                    <Input
                                        id="sejarah_title"
                                        value={data.sejarah_title}
                                        onChange={(e) => setData('sejarah_title', e.target.value)}
                                        placeholder="Sejarah Kami"
                                    />
                                    {errors.sejarah_title && (
                                        <p className="text-sm text-red-500">{errors.sejarah_title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sejarah_content">Isi Sejarah</Label>
                                    <Textarea
                                        id="sejarah_content"
                                        value={data.sejarah_content}
                                        onChange={(e) => setData('sejarah_content', e.target.value)}
                                        placeholder="Ceritakan sejarah Akuatik Azura..."
                                        rows={8}
                                    />
                                    {errors.sejarah_content && (
                                        <p className="text-sm text-red-500">{errors.sejarah_content}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Gunakan baris baru untuk memisahkan paragraf
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Gambar Sejarah
                                </CardTitle>
                                <CardDescription>
                                    Upload gambar yang akan ditampilkan di bagian sejarah
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sejarah_image">Upload Gambar</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="sejarah_image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="flex-1"
                                        />
                                    </div>
                                    {errors.sejarah_image && (
                                        <p className="text-sm text-red-500">{errors.sejarah_image}</p>
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
