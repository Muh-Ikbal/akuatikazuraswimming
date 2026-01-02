import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, UserCircle, Mail, Lock, Shield } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Props {
    user?: User;
    roles: Role[];
}

export default function CreateUser({ user, roles }: Props) {
    const isEdit = !!user;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'User Management',
            href: '/management-user',
        },
        {
            title: isEdit ? 'Edit User' : 'Tambah User',
            href: isEdit ? `/management-user/edit/${user?.id}` : '/management-user/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.roles?.[0]?.name || 'member',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-user/update/${user?.id}`);
        } else {
            post('/management-user');
        }
    };

    const roleColors: Record<string, string> = {
        admin: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30',
        coach: 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
        member: 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
        operator: 'border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit User" : "Tambah User"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-user" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit User' : 'Tambah User Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui informasi user' : 'Lengkapi form berikut untuk menambahkan user baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 max-w-2xl">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <UserCircle className="w-5 h-5" />
                                    Informasi Dasar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Nama */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm">
                                        Nama Lengkap <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder="Masukkan nama lengkap"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`h-10 sm:h-11 pl-10 ${errors.name ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

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
                            </CardContent>
                        </Card>

                        {/* Password */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Password
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm">
                                        Password {!isEdit && <span className="text-destructive">*</span>}
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder={isEdit ? "Kosongkan jika tidak ingin mengubah" : "Minimal 8 karakter"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`h-10 sm:h-11 pl-10 ${errors.password ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm">
                                        Konfirmasi Password {!isEdit && <span className="text-destructive">*</span>}
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
                            </CardContent>
                        </Card>

                        {/* Role */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Hak Akses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                                <div className="space-y-2">
                                    <Label className="text-sm">
                                        Pilih Role <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {roles.map((role) => (
                                            <label
                                                key={role.id}
                                                className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.role === role.name
                                                        ? roleColors[role.name] + ' border-2'
                                                        : 'border-input hover:border-primary/50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.name}
                                                    checked={data.role === role.name}
                                                    onChange={(e) => setData('role', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role.name === 'admin' ? 'bg-red-100 dark:bg-red-900/50' :
                                                        role.name === 'coach' ? 'bg-blue-100 dark:bg-blue-900/50' :
                                                            role.name === 'member' ? 'bg-green-100 dark:bg-green-900/50' :
                                                                'bg-purple-100 dark:bg-purple-900/50'
                                                    }`}>
                                                    <Shield className={`w-5 h-5 ${role.name === 'admin' ? 'text-red-600 dark:text-red-400' :
                                                            role.name === 'coach' ? 'text-blue-600 dark:text-blue-400' :
                                                                role.name === 'member' ? 'text-green-600 dark:text-green-400' :
                                                                    'text-purple-600 dark:text-purple-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium capitalize">{role.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {role.name === 'admin' && 'Akses penuh sistem'}
                                                        {role.name === 'coach' && 'Akses pelatih'}
                                                        {role.name === 'member' && 'Akses member'}
                                                        {role.name === 'operator' && 'Akses operator'}
                                                    </p>
                                                </div>
                                                {data.role === role.name && (
                                                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-user" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update User' : 'Simpan User')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
