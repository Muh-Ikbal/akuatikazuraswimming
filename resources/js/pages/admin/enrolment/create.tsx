import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User, Building, BookOpen } from 'lucide-react';

interface Member {
    id: number;
    name: string;
}

interface ClassSession {
    id: number;
    title: string;
    course?: {
        id: number;
        title: string;
    };
    coach?: {
        id: number;
        name: string;
    };
}

interface Course {
    id: number;
    title: string;
    price: number;
}

interface Enrolment {
    id: number;
    member_id: number;
    class_session_id: number;
    course_id: number;
    state: string;
}

interface Props {
    enrolment?: Enrolment;
    members: Member[];
    class_sessions: ClassSession[];
    courses: Course[];
}

export default function CreateEnrolment({ enrolment, members, class_sessions, courses }: Props) {
    const isEdit = !!enrolment;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Enrolment Management',
            href: '/management-enrolment',
        },
        {
            title: isEdit ? 'Edit Enrolment' : 'Tambah Enrolment',
            href: isEdit ? `/management-enrolment/edit/${enrolment?.id}` : '/management-enrolment/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        member_id: enrolment?.member_id || '',
        class_session_id: enrolment?.class_session_id || '',
        course_id: enrolment?.course_id || '',
        state: enrolment?.state || 'on_progress',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-enrolment/update/${enrolment?.id}`);
        } else {
            post('/management-enrolment');
        }
    };

    // Auto-select course when class_session is selected
    const handleClassSessionChange = (sessionId: number) => {
        setData('class_session_id', sessionId);
        const session = class_sessions.find(s => s.id === sessionId);
        if (session?.course) {
            setData('course_id', session.course.id);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Enrolment" : "Tambah Enrolment"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-enrolment" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Enrolment' : 'Tambah Enrolment Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data enrolment' : 'Daftarkan member ke kelas'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 max-w-2xl">
                        {/* Data Enrolment */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Data Enrolment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Member */}
                                <div className="space-y-2">
                                    <Label htmlFor="member_id" className="text-sm">
                                        Member <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="member_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.member_id ? 'border-destructive' : 'border-input'}`}
                                            value={data.member_id}
                                            onChange={(e) => setData('member_id', parseInt(e.target.value))}
                                        >
                                            <option value="">-- Pilih Member --</option>
                                            {members.map((member) => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.member_id && <p className="text-sm text-destructive">{errors.member_id}</p>}
                                </div>

                                {/* Class Session */}
                                <div className="space-y-2">
                                    <Label htmlFor="class_session_id" className="text-sm">
                                        Kelas <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="class_session_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.class_session_id ? 'border-destructive' : 'border-input'}`}
                                            value={data.class_session_id}
                                            onChange={(e) => handleClassSessionChange(parseInt(e.target.value))}
                                        >
                                            <option value="">-- Pilih Kelas --</option>
                                            {class_sessions.map((session) => (
                                                <option key={session.id} value={session.id}>
                                                    {session.title} - {session.course?.title} ({session.coach?.name})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.class_session_id && <p className="text-sm text-destructive">{errors.class_session_id}</p>}
                                </div>

                                {/* Course */}
                                <div className="space-y-2">
                                    <Label htmlFor="course_id" className="text-sm">
                                        Course <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="course_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.course_id ? 'border-destructive' : 'border-input'}`}
                                            value={data.course_id}
                                            onChange={(e) => setData('course_id', parseInt(e.target.value))}
                                        >
                                            <option value="">-- Pilih Course --</option>
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.title} - Rp {course.price.toLocaleString('id-ID')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.course_id && <p className="text-sm text-destructive">{errors.course_id}</p>}
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-sm">
                                        Status <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="state"
                                        className={`w-full h-10 sm:h-11 px-3 border rounded-md bg-background text-sm ${errors.state ? 'border-destructive' : 'border-input'}`}
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                    >
                                        <option value="on_progress">Berlangsung</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Dibatalkan</option>
                                    </select>
                                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-enrolment" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Enrolment' : 'Simpan Enrolment')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
