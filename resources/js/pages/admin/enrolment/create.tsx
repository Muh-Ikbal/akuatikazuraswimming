import { useState, useRef, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, User, Building, BookOpen, Search, ChevronDown, X } from 'lucide-react';

interface Member {
    id: number;
    name: string;
}

interface ClassSession {
    id: number;
    title: string;
    course_id: number;
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
    meeting_count: number;
    state: string;
    state_member: string;
}

interface Props {
    enrolment?: Enrolment;
    members: Member[];
    class_sessions: ClassSession[];
    courses: Course[];
}

export default function CreateEnrolment({ enrolment, members, class_sessions = [], courses = [] }: Props) {
    const isEdit = !!enrolment;
    const [selectedCourse, setSelectedCourse] = useState<number | ''>(enrolment?.course_id || '');
    const [selectedClassSession, setSelectedClassSession] = useState<number | ''>(enrolment?.class_session_id || '');

    // Member search states
    const [memberSearch, setMemberSearch] = useState('');
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const memberDropdownRef = useRef<HTMLDivElement>(null);

    // Get selected member name
    const selectedMember = members.find(m => m.id === enrolment?.member_id);
    const [selectedMemberName, setSelectedMemberName] = useState(selectedMember?.name || '');

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
        meeting_count: enrolment?.meeting_count || 0,
        state: enrolment?.state || 'on_progress',
        state_member: enrolment?.state_member || 'new',
    });

    // Filter members based on search
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase())
    );

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
                setIsMemberDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMemberSelect = (member: Member) => {
        setData('member_id', member.id);
        setSelectedMemberName(member.name);
        setMemberSearch('');
        setIsMemberDropdownOpen(false);
    };

    const handleClearMember = () => {
        setData('member_id', '');
        setSelectedMemberName('');
        setMemberSearch('');
    };

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
            <Head title={isEdit ? "Edit Membership" : "Perpanjang Membership"} />
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
                            {isEdit ? 'Edit Membership' : 'Tambah Membership Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data membership' : 'Tambahkan member ke membership'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 ">
                        {/* Data Enrolment */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Data Membership
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Member - Searchable Select */}
                                <div className="space-y-2">
                                    <Label htmlFor="member_id" className="text-sm">
                                        Member <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative" ref={memberDropdownRef}>
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />

                                        {/* Selected value or search input */}
                                        {selectedMemberName && !isMemberDropdownOpen ? (
                                            <div
                                                className={`w-full h-10 sm:h-11 pl-10 pr-10 border rounded-md bg-background text-sm flex items-center cursor-pointer ${errors.member_id ? 'border-destructive' : 'border-input'}`}
                                                onClick={() => setIsMemberDropdownOpen(true)}
                                            >
                                                {selectedMemberName}
                                            </div>
                                        ) : (
                                            <Input
                                                id="member_search"
                                                placeholder="Cari member..."
                                                className={`pl-10 pr-10 ${errors.member_id ? 'border-destructive' : ''}`}
                                                value={memberSearch}
                                                onChange={(e) => setMemberSearch(e.target.value)}
                                                onFocus={() => setIsMemberDropdownOpen(true)}
                                            />
                                        )}

                                        {/* Clear button */}
                                        {selectedMemberName && (
                                            <button
                                                type="button"
                                                onClick={handleClearMember}
                                                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                                            >
                                                <X className="w-3 h-3 text-muted-foreground" />
                                            </button>
                                        )}

                                        <ChevronDown
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform ${isMemberDropdownOpen ? 'rotate-180' : ''}`}
                                        />

                                        {/* Dropdown list */}
                                        {isMemberDropdownOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                                                {filteredMembers.length > 0 ? (
                                                    filteredMembers.map((member) => (
                                                        <div
                                                            key={member.id}
                                                            className="px-4 py-2 hover:bg-muted cursor-pointer text-sm flex items-center gap-2"
                                                            onClick={() => handleMemberSelect(member)}
                                                        >
                                                            <User className="w-4 h-4 text-muted-foreground" />
                                                            {member.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                                        Tidak ada member ditemukan
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {errors.member_id && <p className="text-sm text-destructive">{errors.member_id}</p>}
                                </div>

                                {/* Course */}
                                <div className="space-y-2">
                                    <Label htmlFor="course_id" className="text-sm">
                                        Kursus <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="course_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.course_id ? 'border-destructive' : 'border-input'}`}
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
                                                    {course.title} - Rp {course.price.toLocaleString('id-ID')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.course_id && <p className="text-sm text-destructive">{errors.course_id}</p>}
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
                                            value={selectedClassSession}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSelectedClassSession(value ? Number(value) : '');
                                                setData('class_session_id', value);
                                            }}
                                        >
                                            <option value="">-- Pilih Kelas --</option>
                                            {class_sessions.map((session) => (
                                                <option key={session.id} value={session.id}>
                                                    {session.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.class_session_id && <p className="text-sm text-destructive">{errors.class_session_id}</p>}
                                </div>

                                {/* Meeting Count */}
                                <div className="space-y-2">
                                    <Label htmlFor="meeting_count" className="text-sm">
                                        Jumlah Pertemuan <span className="text-destructive">*</span>
                                    </Label>
                                    <input
                                        type="number"
                                        id="meeting_count"
                                        className={`w-full h-10 sm:h-11 px-3 border rounded-md bg-background text-sm ${errors.meeting_count ? 'border-destructive' : 'border-input'}`}
                                        min={0}
                                        value={data.meeting_count}
                                        onChange={(e) => setData('meeting_count', parseInt(e.target.value))}
                                    />
                                    {errors.meeting_count && <p className="text-sm text-destructive">{errors.meeting_count}</p>}
                                </div>
                                {/* State Member*/}
                                <div className="space-y-2">
                                    <Label htmlFor="state_member" className="text-sm">
                                        Status Member <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="state_member"
                                        className={`w-full h-10 sm:h-11 px-3 border rounded-md bg-background text-sm ${errors.state_member ? 'border-destructive' : 'border-input'}`}
                                        value={data.state_member}
                                        onChange={(e) => setData('state_member', e.target.value)}
                                    >
                                        <option value="new">Baru</option>
                                        <option value="old">Lama</option>
                                    </select>
                                    {errors.state_member && <p className="text-sm text-destructive">{errors.state_member}</p>}
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
