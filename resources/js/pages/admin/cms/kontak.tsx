import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Phone,
    Mail,
    MapPin,
    Save,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ContactSettings {
    contact_phone: string | null;
    contact_email: string | null;
    contact_address: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Informasi Kontak',
        href: '/cms/kontak',
    },
];

export default function CmsKontak({ settings }: { settings: ContactSettings }) {
    const { data, setData, put, processing, errors } = useForm({
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        contact_address: settings.contact_address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/cms/kontak', {
            onSuccess: () => {
                toast.success('Berhasil!', {
                    description: 'Informasi kontak berhasil diperbarui.',
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
            <Head title="Informasi Kontak" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Informasi Kontak
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola informasi kontak yang tampil di landing page
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Contact Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Kontak</CardTitle>
                                <CardDescription>
                                    Informasi ini akan ditampilkan di bagian "Hubungi Kami"
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Nomor Telepon
                                    </Label>
                                    <Input
                                        id="contact_phone"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        placeholder="+62 812 3456 7890"
                                    />
                                    {errors.contact_phone && (
                                        <p className="text-sm text-red-500">{errors.contact_phone}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        placeholder="info@akuatikazura.com"
                                    />
                                    {errors.contact_email && (
                                        <p className="text-sm text-red-500">{errors.contact_email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_address" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Alamat
                                    </Label>
                                    <Textarea
                                        id="contact_address"
                                        value={data.contact_address}
                                        onChange={(e) => setData('contact_address', e.target.value)}
                                        placeholder="Jl. Renang No. 123, Jakarta"
                                        rows={3}
                                    />
                                    {errors.contact_address && (
                                        <p className="text-sm text-red-500">{errors.contact_address}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Tampilan di landing page
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-1">Telepon</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {data.contact_phone || '-'}
                                        </p>
                                    </div>

                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {data.contact_email || '-'}
                                        </p>
                                    </div>

                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-1">Lokasi</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {data.contact_address || '-'}
                                        </p>
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
