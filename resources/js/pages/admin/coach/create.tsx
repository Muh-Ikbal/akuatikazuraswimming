import { useState, useRef } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save, User, Mail, Lock, Phone, Calendar, Upload, X } from 'lucide-react';

interface Coach {
    id: number;
    name: string;
    phone_number: string;
    birth_date: string;
    gender: string;
    image: string | null;
    user_id: number | null;
    user?: {
        id: number;
        email: string;
    };
}

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface Props {
    coach?: Coach;
    users?: UserOption[];
}

export default function CreateCoach({ coach, users = [] }: Props) {
    const isEdit = !!coach;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        coach?.image ? `/storage/${coach.image}` : null
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Coach Management',
            href: '/management-coach',
        },
        {
            title: isEdit ? 'Edit Coach' : 'Tambah Coach',
            href: isEdit ? `/management-coach/edit/${coach?.id}` : '/management-coach/create',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: coach?.name || '',
        phone_number: coach?.phone_number || '',
        birth_date: coach?.birth_date || '',
        gender: coach?.gender || 'male',
        image: null as File | null,
        user_id: coach?.user_id || '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            post(`/management-coach/update/${coach?.id}?_method=PUT`, {
                forceFormData: true,
            });
        } else {
            post('/management-coach', {
                forceFormData: true,
            });
        }
    };

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

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Coach" : "Tambah Coach"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-coach" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Coach' : 'Tambah Coach Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data coach' : 'Lengkapi form berikut untuk mendaftarkan coach baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6">
                        {/* Data Coach */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Data Coach
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label className="text-sm">Foto</Label>
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-24 h-24 rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-24 h-24 rounded-lg border-2 border-dashed border-input flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                                >
                                                    <Upload className="w-6 h-6 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div className="text-sm text-muted-foreground">
                                            <p>Upload foto coach</p>
                                            <p className="text-xs">JPG, PNG max 2MB</p>
                                        </div>
                                    </div>
                                    {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                </div>

                                {/* Nama */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm">
                                        Nama Lengkap <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan nama lengkap"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.name ? 'border-destructive' : ''}`}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                {/* Birth Date & Gender */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date" className="text-sm">
                                            Tanggal Lahir <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="birth_date"
                                                type="date"
                                                value={data.birth_date}
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                                className={`h-10 sm:h-11 pl-10 ${errors.birth_date ? 'border-destructive' : ''}`}
                                            />
                                        </div>
                                        {errors.birth_date && <p className="text-sm text-destructive">{errors.birth_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-sm">
                                            Jenis Kelamin <span className="text-destructive">*</span>
                                        </Label>
                                        <select
                                            id="gender"
                                            className="w-full h-10 sm:h-11 px-3 border border-input rounded-md bg-background text-sm"
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                        >
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                        {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number" className="text-sm">
                                        No HP <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="phone_number"
                                            placeholder="08xxxxxxxxxx"
                                            value={data.phone_number}
                                            onChange={(e) => setData('phone_number', e.target.value)}
                                            className={`h-10 sm:h-11 pl-10 ${errors.phone_number ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Create User Account - Only on Create */}
                        {!isEdit && (
                            <Card>
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Akun Login
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Buat akun login untuk coach ini
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="contoh@email.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`h-10 sm:h-11 pl-10 ${errors.email ? 'border-destructive' : ''}`}
                                            />
                                        </div>
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm">
                                                Password <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Minimal 8 karakter"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={`h-10 sm:h-11 pl-10 ${errors.password ? 'border-destructive' : ''}`}
                                                />
                                            </div>
                                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation" className="text-sm">
                                                Konfirmasi Password <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    placeholder="Ulangi password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className="h-10 sm:h-11 pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Akun akan dibuat dengan role <strong>coach</strong>
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* User Selector - Only on Edit */}
                        {isEdit && (
                            <Card>
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Akun Login
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Pilih akun user yang terhubung dengan coach ini
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="user_id" className="text-sm">
                                            User Account
                                        </Label>
                                        <select
                                            id="user_id"
                                            className="w-full h-10 sm:h-11 px-3 border border-input rounded-md bg-background text-sm"
                                            value={data.user_id || ''}
                                            onChange={(e) => setData('user_id', e.target.value ? parseInt(e.target.value) : '')}
                                        >
                                            <option value="">-- Tidak ada akun --</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                                        <p className="text-xs text-muted-foreground">
                                            Hanya menampilkan user dengan role <strong>coach</strong> yang belum terhubung ke coach lain
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-coach" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Coach' : 'Simpan Coach')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
