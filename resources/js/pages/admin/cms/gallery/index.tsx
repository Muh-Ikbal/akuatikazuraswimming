import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AlertDelete from "@/components/alert-delete";
import { toast } from 'sonner';

interface Gallery {
    id: number;
    title: string | null;
    image: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Galeri',
        href: '/cms/gallery',
    },
];

export default function CmsGallery({ galleries }: { galleries: Gallery[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        image: null as File | null,
    });

    const openAddDialog = () => {
        reset();
        setPreviewImage(null);
        setIsDialogOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms/gallery', {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                toast.success('Berhasil!', {
                    description: 'Gambar berhasil ditambahkan.',
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

    const handleDelete = (id: number) => {
        router.delete(`/cms/gallery/${id}`, {
            onSuccess: () => {
                toast.success('Berhasil!', {
                    description: 'Gambar berhasil dihapus.',
                });
            },
            onError: () => {
                toast.error('Gagal menghapus!', {
                    description: 'Terjadi kesalahan saat menghapus data.',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Galeri" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Galeri
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola gambar galeri yang tampil di landing page
                        </p>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Gambar
                    </Button>
                </div>

                {/* Gallery Grid */}
                {galleries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {galleries.map((item) => (
                            <Card key={item.id} className="group relative overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="aspect-square relative">
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.title || 'Gallery Image'}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                            <AlertDelete
                                                title="Hapus Gambar?"
                                                description="Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan."
                                                action={() => handleDelete(item.id)}
                                                trigger={
                                                    <Button variant="destructive" size="icon" className="h-10 w-10 rounded-full">
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>
                                    {item.title && (
                                        <div className="p-3 border-t">
                                            <p className="text-sm font-medium truncate">{item.title}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-medium">Belum ada gambar galeri</p>
                        <p className="text-sm">Klik tombol "Tambah Gambar" untuk memulai</p>
                    </div>
                )}

                {/* Add Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Gambar Galeri</DialogTitle>
                            <DialogDescription>
                                Upload gambar baru untuk galeri di landing page
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul (Opsional)</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Judul gambar..."
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Gambar</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-red-500">{errors.image}</p>
                                    )}
                                </div>

                                {previewImage && (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing || !data.image}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
