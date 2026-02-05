import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Edit,
    Star,
    Save,
    X,
    Award,
    Shield,
    Users,
    Calendar,
    CheckCircle,
    Heart,
    Zap,
    Target,
    Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AlertDelete from "@/components/alert-delete";
import { toast } from 'sonner';

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    order: number;
    is_active: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Keunggulan',
        href: '/cms/keunggulan',
    },
];

const iconOptions = [
    { value: 'Award', label: 'Award', icon: Award },
    { value: 'Shield', label: 'Shield', icon: Shield },
    { value: 'Users', label: 'Users', icon: Users },
    { value: 'Calendar', label: 'Calendar', icon: Calendar },
    { value: 'CheckCircle', label: 'CheckCircle', icon: CheckCircle },
    { value: 'Heart', label: 'Heart', icon: Heart },
    { value: 'Zap', label: 'Zap', icon: Zap },
    { value: 'Target', label: 'Target', icon: Target },
    { value: 'Clock', label: 'Clock', icon: Clock },
    { value: 'Star', label: 'Star', icon: Star },
];

const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Award;
};

export default function CmsKeunggulan({ features }: { features: Feature[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        icon: 'Award',
        is_active: true,
    });

    const openAddDialog = () => {
        reset();
        setEditingFeature(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (feature: Feature) => {
        setEditingFeature(feature);
        setData({
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            is_active: feature.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFeature) {
            put(`/cms/keunggulan/${editingFeature.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                    toast.success('Berhasil!', {
                        description: 'Keunggulan berhasil diperbarui.',
                    });
                },
                onError: (errors) => {
                    const errorMessages = Object.values(errors).flat();
                    toast.error('Gagal menyimpan!', {
                        description: errorMessages[0] || 'Terjadi kesalahan. Silakan periksa kembali data Anda.',
                    });
                },
            });
        } else {
            post('/cms/keunggulan', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                    toast.success('Berhasil!', {
                        description: 'Keunggulan baru berhasil ditambahkan.',
                    });
                },
                onError: (errors) => {
                    const errorMessages = Object.values(errors).flat();
                    toast.error('Gagal menyimpan!', {
                        description: errorMessages[0] || 'Terjadi kesalahan. Silakan periksa kembali data Anda.',
                    });
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/cms/keunggulan/${id}`, {
            onSuccess: () => {
                toast.success('Berhasil!', {
                    description: 'Keunggulan berhasil dihapus.',
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
            <Head title="Keunggulan" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Keunggulan
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola daftar keunggulan yang tampil di halaman utama
                        </p>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Keunggulan
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{features.length}</div>
                                <div className="text-sm text-muted-foreground">Total Keunggulan</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {features.filter(f => f.is_active).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Aktif Ditampilkan</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Keunggulan</CardTitle>
                        <CardDescription>
                            Keunggulan yang aktif akan ditampilkan di bagian "Mengapa Memilih Kami?"
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16 text-center">No</TableHead>
                                        <TableHead>Keunggulan</TableHead>
                                        <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                                        <TableHead className="w-24 text-center">Status</TableHead>
                                        <TableHead className="w-24 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {features.map((feature, index) => {
                                        const IconComponent = getIconComponent(feature.icon);
                                        return (
                                            <TableRow key={feature.id}>
                                                <TableCell className="font-medium text-center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <IconComponent className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <span className="font-medium">{feature.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="text-sm text-muted-foreground line-clamp-2">
                                                        {feature.description}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${feature.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {feature.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => openEditDialog(feature)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <AlertDelete
                                                            title="Hapus Keunggulan?"
                                                            description={`Apakah Anda yakin ingin menghapus "${feature.title}"? Tindakan ini tidak dapat dibatalkan.`}
                                                            action={() => handleDelete(feature.id)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {features.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Belum ada keunggulan. Klik "Tambah Keunggulan" untuk menambahkan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingFeature ? 'Edit Keunggulan' : 'Tambah Keunggulan'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingFeature
                                    ? 'Ubah informasi keunggulan yang sudah ada'
                                    : 'Tambahkan keunggulan baru untuk ditampilkan di landing page'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Coach Bersertifikasi"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Pelatih profesional dengan sertifikasi..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="icon">Ikon</Label>
                                    <Select
                                        value={data.icon}
                                        onValueChange={(value) => setData('icon', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih ikon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {iconOptions.map((option) => {
                                                const IconComp = option.icon;
                                                return (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <IconComp className="w-4 h-4" />
                                                            <span>{option.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {errors.icon && (
                                        <p className="text-sm text-red-500">{errors.icon}</p>
                                    )}
                                </div>

                                {editingFeature && (
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="is_active">Status Aktif</Label>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
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
