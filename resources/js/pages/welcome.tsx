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
    User,
    Heart,
    Zap,
    Target,
    Clock,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Certificate {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
}

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    total_meeting: number;
    image: string | null;
}

interface Coach {
    id: number;
    name: string;
    image: string | null;
    gender: string;
    certificate_coaches: Certificate[];
}

interface Settings {
    hero_title: string | null;
    hero_subtitle: string | null;
    hero_image: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    contact_address: string | null;
}

interface Stats {
    members_count: number;
    coaches_count: number;
    satisfaction_rate: string;
}

interface WelcomeProps {
    canRegister?: boolean;
    settings?: Settings;
    features?: Feature[];
    courses?: Course[];
    coaches?: Coach[];
    stats?: Stats;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Award,
    Shield,
    Users,
    Calendar,
    CheckCircle,
    Heart,
    Zap,
    Target,
    Clock,
    Star,
};

const getIcon = (iconName: string) => {
    return iconMap[iconName] || Award;
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function Welcome({
    canRegister = true,
    settings,
    features,
    courses = [],
    coaches = [],
    stats,
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    // Default values if settings are not set
    const heroTitle = settings?.hero_title || 'Belajar Berenang dengan Menyenangkan';
    const heroSubtitle = settings?.hero_subtitle || 'Kursus renang profesional untuk semua usia. Didampingi coach bersertifikasi dalam lingkungan yang aman dan menyenangkan.';
    const heroImage = settings?.hero_image ? `/storage/${settings.hero_image}` : null;
    const contactPhone = settings?.contact_phone || '+62 812 3456 7890';
    const contactEmail = settings?.contact_email || 'info@akuatikazura.com';
    const contactAddress = settings?.contact_address || 'Jl. Renang No. 123, Jakarta';

    // Default features if none in database
    const displayFeatures = features && features.length > 0 ? features : [
        { id: 1, icon: 'Award', title: 'Coach Bersertifikasi', description: 'Pelatih profesional dengan sertifikasi PRSI dan pengalaman bertahun-tahun' },
        { id: 2, icon: 'Shield', title: 'Keamanan Terjamin', description: 'Fasilitas kolam renang yang aman dengan pengawasan ketat' },
        { id: 3, icon: 'Users', title: 'Kelas Kecil', description: 'Maksimal 8 peserta per kelas untuk perhatian maksimal' },
        { id: 4, icon: 'Calendar', title: 'Jadwal Fleksibel', description: 'Pilihan waktu yang beragam sesuai kesibukan Anda' },
    ];

    // Stats
    const membersCount = stats?.members_count || 0;
    const coachesCount = stats?.coaches_count || 0;
    const satisfactionRate = stats?.satisfaction_rate || '98';

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
                                    <Link href={dashboard().url}>
                                        <Button>Dashboard</Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={login().url}>
                                            <Button className='bg-primary'>Masuk</Button>
                                        </Link>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/15 to-sky-300/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 shadow-sm">
                                    <Waves className="w-4 h-4" />
                                    <span>Kursus Renang Terbaik di Kota</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                    {heroTitle.includes('Menyenangkan') ? (
                                        <>
                                            <span className="text-gray-900">{heroTitle.split('Menyenangkan')[0]}</span>
                                            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">Menyenangkan</span>
                                            <span className="text-gray-900">{heroTitle.split('Menyenangkan')[1]}</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-900">{heroTitle}</span>
                                    )}
                                </h1>
                                <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                                    {heroSubtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="#courses">
                                        <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300">
                                            Lihat Program
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </a>
                                    <a href="#contact">
                                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                                            Hubungi Kami
                                        </Button>
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 mt-12">
                                    <div className="px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-100/50 border border-blue-100">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{membersCount > 0 ? `${membersCount}+` : '500+'}</div>
                                        <div className="text-sm text-gray-600 font-medium">Peserta Aktif</div>
                                    </div>
                                    <div className="px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-100/50 border border-blue-100">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{coachesCount > 0 ? `${coachesCount}+` : '15+'}</div>
                                        <div className="text-sm text-gray-600 font-medium">Coach Profesional</div>
                                    </div>
                                    <div className="px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-100/50 border border-blue-100">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{satisfactionRate}%</div>
                                        <div className="text-sm text-gray-600 font-medium">Tingkat Kepuasan</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl rotate-3 scale-105 opacity-20"></div>
                                <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 flex items-center justify-center overflow-hidden shadow-2xl shadow-blue-500/30 relative">
                                    {heroImage ? (
                                        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                                            <Waves className="w-32 h-32 text-white/40 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                {/* Floating Card */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl shadow-blue-500/20 p-5 border border-blue-100 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">Garansi Bisa Berenang</div>
                                            <div className="text-sm text-gray-500">Dalam 12 sesi pertemuan</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Additional floating element */}
                                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl shadow-blue-500/20 p-4 border border-blue-100 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <Award className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">Coach Bersertifikasi</div>
                                            <div className="text-xs text-gray-500">PRSI & Internasional</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                                <Star className="w-4 h-4" />
                                <span>Keunggulan Kami</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Memilih Kami?</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Kami berkomitmen memberikan pengalaman belajar renang terbaik dengan pendekatan yang aman dan menyenangkan
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayFeatures.map((feature, index) => {
                                const IconComponent = getIcon(feature.icon);
                                const gradients = [
                                    'from-blue-500 to-cyan-500',
                                    'from-cyan-500 to-teal-500',
                                    'from-blue-600 to-blue-400',
                                    'from-sky-500 to-blue-500'
                                ];
                                return (
                                    <div
                                        key={feature.id}
                                        className="group bg-white rounded-2xl border border-blue-100 p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[index % 4]} flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section id="courses" className="py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                                <Target className="w-4 h-4" />
                                <span>Program Pilihan</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Program Kursus</h2>
                            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                                Pilih program yang sesuai dengan level dan kebutuhan Anda
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {courses.length > 0 ? (
                                courses.map((course, index) => (
                                    <div
                                        key={course.id}
                                        className="group bg-white rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-2 border border-blue-100"
                                    >
                                        {course.image ? (
                                            <img
                                                src={`/storage/${course.image}`}
                                                alt={course.title}
                                                className="w-full h-44 object-cover rounded-2xl mb-5 shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-44 rounded-2xl mb-5 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                                <Waves className="w-16 h-16 text-blue-400" />
                                            </div>
                                        )}
                                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-3">
                                            <Calendar className="w-3 h-3" />
                                            <span>{course.total_meeting} pertemuan</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <div className="text-sm text-gray-500">Mulai dari</div>
                                                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{formatPrice(course.price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-12">
                                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                                        <Waves className="w-10 h-10 text-white/60" />
                                    </div>
                                    <p className="text-white/80 text-lg">Belum ada program kursus tersedia</p>
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
                <section id="contact" className="py-20 px-4 bg-gradient-to-b from-blue-50/50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                                <Phone className="w-4 h-4" />
                                <span>Kontak</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Ada pertanyaan? Jangan ragu untuk menghubungi kami
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="group text-center bg-white rounded-2xl p-8 border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">Telepon</h3>
                                <p className="text-gray-600">{contactPhone}</p>
                            </div>
                            <div className="group text-center bg-white rounded-2xl p-8 border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">Email</h3>
                                <p className="text-gray-600">{contactEmail}</p>
                            </div>
                            <div className="group text-center bg-white rounded-2xl p-8 border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">Lokasi</h3>
                                <p className="text-gray-600">{contactAddress}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-4 bg-gradient-to-r from-blue-600 to-cyan-500">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center p-1.5">
                                    <img src="/logo.png" alt="Akuatik Azura" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-white text-lg">Akuatik Azura</span>
                            </div>
                            <p className="text-sm text-blue-100">
                                © 2024 Akuatik Azura. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
