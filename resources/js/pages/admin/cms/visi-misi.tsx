import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Eye,
    Target,
    Save,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface VisiMisiSettings {
    visi_title: string | null;
    visi_content: string | null;
    misi_title: string | null;
    misi_content: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Visi & Misi',
        href: '/cms/visi-misi',
    },
];

export default function CmsVisiMisi({ settings }: { settings: VisiMisiSettings }) {
    const { data, setData, post, processing, errors } = useForm({
        visi_title: settings.visi_title || '',
        visi_content: settings.visi_content || '',
        misi_title: settings.misi_title || '',
        misi_content: settings.misi_content || '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms/visi-misi', {
            onSuccess: () => {
                toast.success('Berhasil!', {
                    description: 'Visi & Misi berhasil disimpan.',
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
            <Head title="Visi & Misi" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Visi & Misi
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola tampilan visi dan misi di landing page
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Visi Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Visi
                                </CardTitle>
                                <CardDescription>
                                    Atur konten visi yang tampil di landing page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="visi_title">Judul Visi</Label>
                                    <Input
                                        id="visi_title"
                                        value={data.visi_title}
                                        onChange={(e) => setData('visi_title', e.target.value)}
                                        placeholder="Visi Kami"
                                    />
                                    {errors.visi_title && (
                                        <p className="text-sm text-red-500">{errors.visi_title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="visi_content">Isi Visi</Label>
                                    <Textarea
                                        id="visi_content"
                                        value={data.visi_content}
                                        onChange={(e) => setData('visi_content', e.target.value)}
                                        placeholder="Deskripsi visi..."
                                        rows={5}
                                    />
                                    {errors.visi_content && (
                                        <p className="text-sm text-red-500">{errors.visi_content}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Misi Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Misi
                                </CardTitle>
                                <CardDescription>
                                    Atur konten misi yang tampil di landing page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="misi_title">Judul Misi</Label>
                                    <Input
                                        id="misi_title"
                                        value={data.misi_title}
                                        onChange={(e) => setData('misi_title', e.target.value)}
                                        placeholder="Misi Kami"
                                    />
                                    {errors.misi_title && (
                                        <p className="text-sm text-red-500">{errors.misi_title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="misi_content">Isi Misi</Label>
                                    <Textarea
                                        id="misi_content"
                                        value={data.misi_content}
                                        onChange={(e) => setData('misi_content', e.target.value)}
                                        placeholder="Deskripsi misi..."
                                        rows={5}
                                    />
                                    {errors.misi_content && (
                                        <p className="text-sm text-red-500">{errors.misi_content}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Tip: Gunakan baris baru untuk tiap poin misi
                                    </p>
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
