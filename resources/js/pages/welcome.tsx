import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Waves,
    Users,
    Award,
    Shield,
    Calendar,
    CheckCircle,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Certificate {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

interface Course {
    id: number;
    title: string;
    description: string;
    total_meeting: number;
    price: number;
    image: string | null;
}

interface Coach {
    id: number;
    name: string;
    image: string | null;
    gender: string;
    certificate_coaches: Certificate[];
}

interface Stats {
    memberCount: number;
    coachCount: number;
}

interface WelcomeProps {
    canRegister?: boolean;
    courses?: Course[];
    coaches?: Coach[];
    stats?: Stats;
}

export default function Welcome({
    canRegister = true,
    courses = [],
    coaches = [],
    stats = { memberCount: 0, coachCount: 0 }
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Award,
            title: "Coach Bersertifikasi",
            description: "Pelatih profesional dengan sertifikasi PRSI dan pengalaman bertahun-tahun"
        },
        {
            icon: Shield,
            title: "Keamanan Terjamin",
            description: "Fasilitas kolam renang yang aman dengan pengawasan ketat"
        },
        {
            icon: Users,
            title: "Kelas Kecil",
            description: "Maksimal 8 peserta per kelas untuk perhatian maksimal"
        },
        {
            icon: Calendar,
            title: "Jadwal Fleksibel",
            description: "Pilihan waktu yang beragam sesuai kesibukan Anda"
        }
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <Head title="Akuatik Azura - Kursus Renang Profesional">
                <meta name="description" content="Kursus renang profesional untuk semua usia. Belajar berenang dengan coach bersertifikasi dalam lingkungan yang aman dan menyenangkan." />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Navigation */}

                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center p-1.5">
                                    <img src="/logo.png" alt="Akuatik Azura" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-lg text-foreground">Akuatik Azura</span>
                            </Link>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Keunggulan</a>
                                <a href="#courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">Program</a>
                                <a href="#coaches" className="text-sm text-muted-foreground hover:text-primary transition-colors">Coach</a>
                                <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Kontak</a>
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button>Dashboard</Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={login()}>
                                            <Button className='bg-primary'>Masuk</Button>
                                        </Link>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                                    Belajar Berenang dengan
                                    <span className="text-primary"> Menyenangkan</span>
                                </h1>
                                <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                                    Kursus renang profesional untuk semua usia. Didampingi coach bersertifikasi
                                    dalam lingkungan yang aman dan menyenangkan.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">

                                    <a href="#courses">
                                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                            Lihat Program
                                        </Button>
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-8 mt-12">
                                    <div>
                                        <div className="text-3xl font-bold text-primary">{stats.memberCount}+</div>
                                        <div className="text-sm text-muted-foreground">Peserta Aktif</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-primary">{stats.coachCount}+</div>
                                        <div className="text-sm text-muted-foreground">Coach Profesional</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-primary">98%</div>
                                        <div className="text-sm text-muted-foreground">Tingkat Kepuasan</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative">
                                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden">
                                    <Waves className="w-32 h-32 text-primary/30" />
                                </div>
                                {/* Floating Card */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">Garansi Bisa Berenang</div>
                                            <div className="text-xs text-muted-foreground">Dalam 12 sesi pertemuan</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Mengapa Memilih Kami?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Kami berkomitmen memberikan pengalaman belajar renang terbaik dengan pendekatan yang aman dan menyenangkan
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section id="courses" className="py-20 px-4 bg-muted/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Program Kursus</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Pilih program yang sesuai dengan level dan kebutuhan Anda
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-2xl border border-border p-8 hover:shadow-xl transition-shadow"
                                    >
                                        {course.image && (
                                            <img
                                                src={`/storage/${course.image}`}
                                                alt={course.title}
                                                className="w-full h-40 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                        <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{course.description}</p>
                                        <div className="text-3xl font-bold text-primary mb-1">{formatPrice(course.price)}</div>
                                        <div className="text-sm text-muted-foreground mb-6">{course.total_meeting} pertemuan</div>
                                        {/* <Link href={register()}>
                                            <Button className="w-full">Daftar Sekarang</Button>
                                        </Link> */}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-12 text-muted-foreground">
                                    <p>Belum ada program kursus tersedia</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Coach Section */}
                <section id="coaches" className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Tim Coach Kami</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Didampingi oleh pelatih berpengalaman dan bersertifikasi
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {coaches.length > 0 ? (
                                coaches.map((coach) => (
                                    <div key={coach.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden">
                                            {coach.image ? (
                                                <img
                                                    src={`/storage/${coach.image}`}
                                                    alt={coach.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center ${coach.gender === 'male'
                                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                                    : 'bg-pink-100 dark:bg-pink-900/30'
                                                    }`}>
                                                    <User className={`w-16 h-16 ${coach.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
                                                        }`} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 text-center">
                                            <h3 className="font-semibold text-foreground mb-1">{coach.name}</h3>
                                            <p className="text-sm text-primary font-medium mb-2">Coach</p>
                                            {coach.certificate_coaches && coach.certificate_coaches.length > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    {coach.certificate_coaches.map(c => c.title).slice(0, 2).join(' • ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-12 text-muted-foreground">
                                    <p>Belum ada coach tersedia</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>


                {/* Contact Section */}
                <section id="contact" className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Hubungi Kami</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Ada pertanyaan? Jangan ragu untuk menghubungi kami
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Telepon</h3>
                                <p className="text-muted-foreground">+62 812 3456 7890</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                                <p className="text-muted-foreground">info@akuatikazura.com</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Lokasi</h3>
                                <p className="text-muted-foreground">Jl. Renang No. 123, Jakarta</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-4 border-t border-border">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center p-1">
                                    <img src="/logo.png" alt="Akuatik Azura" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-semibold text-foreground">Akuatik Azura</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                © 2024 Akuatik Azura. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

