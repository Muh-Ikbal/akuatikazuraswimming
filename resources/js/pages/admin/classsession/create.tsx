import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Building, BookOpen, Users, User } from 'lucide-react';


interface ClassSession {
    id: number;
    title: string;
    capacity: number;
}

interface Props {
    class_session?: ClassSession;
}

export default function CreateClassSession({ class_session }: Props) {
    const isEdit = !!class_session;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kelas Management',
            href: '/management-kelas',
        },
        {
            title: isEdit ? 'Edit Kelas' : 'Tambah Kelas',
            href: isEdit ? `/management-kelas/edit/${class_session?.id}` : '/management-kelas/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        title: class_session?.title || '',
        capacity: class_session?.capacity || 10,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-kelas/update/${class_session?.id}`);
        } else {
            post('/management-kelas');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Kelas" : "Tambah Kelas"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-kelas" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Kelas' : 'Tambah Kelas Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data kelas' : 'Lengkapi form berikut untuk menambah kelas baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6">
                        {/* Data Kelas */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    Data Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Nama Kelas */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm">
                                        Nama Kelas <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Contoh: Kelas Pemula A"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={`h-10 sm:h-11 ${errors.title ? 'border-destructive' : ''}`}
                                    />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>


                                {/* Kapasitas */}
                                <div className="space-y-2">
                                    <Label htmlFor="capacity" className="text-sm">
                                        Kapasitas <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="capacity"
                                            type="number"
                                            min="1"
                                            placeholder="Jumlah maksimal siswa"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', parseInt(e.target.value))}
                                            className={`h-10 sm:h-11 pl-10 ${errors.capacity ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-kelas" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Kelas' : 'Simpan Kelas')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
