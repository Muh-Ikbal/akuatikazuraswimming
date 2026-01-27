import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save, User, Users, Mail, Lock, Phone, MapPin, Calendar, Book } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Member {
    id: number;
    name: string;
    birth_date: string;
    gender: string;
    address: string;
    phone_number: string;
    parent_name: string;
    parent_phone_number: string;
    birth_place: string;
    entry_date: string;
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

interface CourseOption {
    id: number;
    title: string;
}

interface ClassSessionOption {
    id: number;
    title: string;
    course_id: number;
}

interface Props {
    member?: Member;
    users?: UserOption[];
    courses?: CourseOption[];
    classSessions?: ClassSessionOption[];
}

export default function CreateMember({ member, users = [], courses = [], classSessions = [] }: Props) {
    const isEdit = !!member;
    const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
    const [selectedClassSession, setSelectedClassSession] = useState<number | ''>('');


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Member Management',
            href: '/management-member',
        },
        {
            title: isEdit ? 'Edit Member' : 'Tambah Member',
            href: isEdit ? `/management-member/edit/${member?.id}` : '/management-member/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: member?.name || '',
        birth_date: member?.birth_date || '',
        gender: member?.gender || 'male',
        address: member?.address || '',
        phone_number: member?.phone_number || '',
        parent_name: member?.parent_name || '',
        parent_phone_number: member?.parent_phone_number || '',
        user_id: member?.user_id || '',
        birth_place: member?.birth_place || '',
        entry_date: member?.entry_date || '',
        create_user: false,
        email: '',
        password: '',
        password_confirmation: '',
        course_id: '',
        class_session_id: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-member/update/${member?.id}`);
        } else {
            post('/management-member');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Member" : "Tambah Member"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-member" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Member' : 'Tambah Member Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data member' : 'Lengkapi form berikut untuk mendaftarkan member baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 ">
                        {/* Data Siswa */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Data Siswa
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
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
                                <div className="space-y-2">
                                    <Label htmlFor="birth_place" className="text-sm">
                                        Tempat Lahir <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="birth_place"
                                        placeholder="Masukkan tempat lahir"
                                        value={data.birth_place}
                                        onChange={(e) => setData('birth_place', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.birth_place ? 'border-destructive' : ''}`}
                                    />
                                    {errors.birth_place && <p className="text-sm text-destructive">{errors.birth_place}</p>}
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
                                        No HP Siswa <span className="text-destructive">*</span>
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

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm">
                                        Alamat <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Textarea
                                            id="address"
                                            placeholder="Masukkan alamat lengkap"
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className={`pl-10 ${errors.address ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                                </div>
                                {/* tanggal masuk */}
                                <div className="space-y-2">
                                    <Label htmlFor="entry_date" className="text-sm">
                                        Tanggal Masuk <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="entry_date"
                                            type="date"
                                            placeholder="Masukkan tanggal masuk"
                                            value={data.entry_date}
                                            onChange={(e) => setData('entry_date', e.target.value)}
                                            className={`h-10 sm:h-11 ${errors.entry_date ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.entry_date && <p className="text-sm text-destructive">{errors.entry_date}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Orang Tua */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Data Orang Tua / Wali
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Parent Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="parent_name" className="text-sm">
                                        Nama Orang Tua <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="parent_name"
                                        placeholder="Masukkan nama orang tua/wali"
                                        value={data.parent_name}
                                        onChange={(e) => setData('parent_name', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.parent_name ? 'border-destructive' : ''}`}
                                    />
                                    {errors.parent_name && <p className="text-sm text-destructive">{errors.parent_name}</p>}
                                </div>

                                {/* Parent Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="parent_phone_number" className="text-sm">
                                        No HP Orang Tua <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="parent_phone_number"
                                            placeholder="08xxxxxxxxxx"
                                            value={data.parent_phone_number}
                                            onChange={(e) => setData('parent_phone_number', e.target.value)}
                                            className={`h-10 sm:h-11 pl-10 ${errors.parent_phone_number ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.parent_phone_number && <p className="text-sm text-destructive">{errors.parent_phone_number}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Create User Account - Only on Create */}
                        {!isEdit && (
                            <div>
                                <Card>
                                    <CardHeader className="p-4 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                                    <Lock className="w-5 h-5" />
                                                    Akun Login
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    Buat akun login untuk member ini
                                                </CardDescription>
                                            </div>

                                        </div>
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
                                            Akun akan dibuat dengan role <strong>member</strong>
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="mt-6">
                                    <CardHeader className="p-4 sm:p-6 ">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                                    <Book className="w-5 h-5" />
                                                    Daftar Kursus
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    Pilih kursus yang akan diikuti oleh member ini
                                                </CardDescription>
                                            </div>

                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">

                                        {/* course and classsession */}
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div className="space-y-2">
                                                <Label htmlFor="course_id" className="text-sm">
                                                    Kurus <span className="text-destructive">*</span>
                                                </Label>
                                                <select
                                                    id="course_id"
                                                    className="w-full h-10 sm:h-11 px-3 border border-input rounded-md bg-background text-sm"
                                                    value={selectedCourse}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSelectedCourse(value ? Number(value) : '');
                                                        setData('course_id', value);
                                                    }}

                                                >
                                                    <option value="">-- Pilih Kursus --</option>
                                                    {courses.map((course) => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.course_id && <p className="text-sm text-destructive">{errors.course_id}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="class_session_id" className="text-sm">
                                                    Kelas <span className="text-destructive">*</span>
                                                </Label>
                                                <select
                                                    id="class_session_id"
                                                    className="w-full h-10 sm:h-11 px-3 border border-input rounded-md bg-background text-sm"
                                                    value={selectedClassSession}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSelectedClassSession(value ? Number(value) : '');
                                                        setData('class_session_id', value);
                                                    }}
                                                >
                                                    <option value="">-- Pilih Kelas --</option>
                                                    {classSessions.map((classSession) => (
                                                        <option key={classSession.id} value={classSession.id}>
                                                            {classSession.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.class_session_id && <p className="text-sm text-destructive">{errors.class_session_id}</p>}
                                            </div>
                                        </div>




                                    </CardContent>
                                </Card>

                            </div>

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
                                        Pilih akun user yang terhubung dengan member ini
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="user_id" className="text-sm">
                                            Akun Member
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
                                            Hanya menampilkan user dengan role <strong>member</strong> yang belum terhubung ke member lain
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-member" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Member' : 'Simpan Member')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div >
        </AppLayout >
    );
}
