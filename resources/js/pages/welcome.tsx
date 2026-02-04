import { dashboard, login } from '@/routes';
import { motion } from 'framer-motion';
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
    Sparkles,
    Instagram,
    History,
    Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

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
    contact_instagram: string | null;
    visi_title: string | null;
    visi_content: string | null;
    misi_title: string | null;
    misi_content: string | null;
    sejarah_title: string | null;
    sejarah_content: string | null;
    sejarah_image: string | null;
}

interface Stats {
    members_count: number;
    coaches_count: number;
    satisfaction_rate: string;
}

interface Gallery {
    id: number;
    title: string | null;
    image: string;
}

interface WelcomeProps {
    canRegister?: boolean;
    settings?: Settings;
    features?: Feature[];
    courses?: Course[];
    coaches?: Coach[];
    galleries?: Gallery[];
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
    galleries = [],
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
    const contactInstagram = settings?.contact_instagram || '@akuatikazura';

    // Visi Misi defaults
    const visiTitle = settings?.visi_title || 'Visi Kami';
    const visiContent = settings?.visi_content || 'Menjadi lembaga kursus renang terdepan yang menghasilkan perenang handal dan berkarakter, serta berkontribusi dalam memasyarakatkan olahraga renang di Indonesia.';
    const misiTitle = settings?.misi_title || 'Misi Kami';
    const misiContent = settings?.misi_content || 'Menyediakan pelatihan renang berkualitas dengan metode yang aman dan menyenangkan.\nMengembangkan kemampuan renang dari dasar hingga mahir untuk semua usia.\nMenciptakan lingkungan belajar yang nyaman dan mendukung perkembangan peserta.';

    // Sejarah defaults
    const sejarahTitle = settings?.sejarah_title || 'Sejarah Kami';
    const sejarahContent = settings?.sejarah_content || 'Akuatik Azura didirikan pada tahun 2010 dengan semangat untuk memajukan olahraga renang di Indonesia.\n\nBerawal dari sebuah komunitas kecil, kini kami telah berkembang menjadi salah satu akademi renang terkemuka dengan ratusan siswa aktif dan puluhan pelatih bersertifikasi.';
    const sejarahImage = settings?.sejarah_image ? `/storage/${settings.sejarah_image}` : null;

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

            <div className="min-h-screen bg-slate-50">
                {/* Custom CSS for animations */}
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    @keyframes pulse-soft {
                        0%, 100% { opacity: 0.5; }
                        50% { opacity: 0.8; }
                    }
                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }
                    .pulse-soft {
                        animation: pulse-soft 4s ease-in-out infinite;
                    }
                    .card-hover:hover {
                        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
                    }
                    .gradient-text {
                        color: #2563eb;
                    }
                `}</style>

                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform duration-300">
                                    <img src="/logo.png" alt="Akuatik Azura" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-lg text-slate-800">Akuatik Azura</span>
                            </Link>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#visi-misi" className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Visi & Misi</a>
                                <a href="#sejarah" className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Sejarah</a>
                                <a href="#features" className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Keunggulan</a>
                                <a href="#courses" className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Program</a>
                                <a href="#coaches" className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Coach</a>
                                <a href="#contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Kontak</a>
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link href={dashboard().url}>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={login().url}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300">
                                                Masuk
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-28 pb-20 px-4 relative overflow-hidden">
                    {/* Soft Background */}
                    <div className="absolute inset-0 bg-blue-50"></div>

                    {/* Soft glowing orbs */}
                    <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] pulse-soft"></div>
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[80px] pulse-soft" style={{ animationDelay: '1s' }}></div>

                    {/* Subtle pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-70"></div>

                    <div className="max-w-7xl mx-auto relative z-10"><FadeInUp>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/50 text-blue-700 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Kursus Renang Terbaik di Kota Kendari</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                    {heroTitle.includes('Menyenangkan') ? (
                                        <>
                                            <span className="text-slate-800">{heroTitle.split('Menyenangkan')[0]}</span>
                                            <span className="text-blue-600">Menyenangkan</span>
                                            <span className="text-slate-800">{heroTitle.split('Menyenangkan')[1]}</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-800">{heroTitle}</span>
                                    )}
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed text-justify">
                                    {heroSubtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="#courses">
                                        <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                                            Lihat Program
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </a>
                                    <a href="#contact">
                                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                            Hubungi Kami
                                        </Button>
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-4 mt-12">
                                    <div className="px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/60 transition-all duration-300 card-hover">
                                        <div className="text-3xl font-bold text-blue-600">{membersCount > 0 ? `${membersCount}+` : '500+'}</div>
                                        <div className="text-sm text-slate-500 font-medium">Peserta Aktif</div>
                                    </div>
                                    <div className="px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/60 transition-all duration-300 card-hover">
                                        <div className="text-3xl font-bold text-blue-600">{coachesCount > 0 ? `${coachesCount}+` : '15+'}</div>
                                        <div className="text-sm text-slate-500 font-medium">Coach Profesional</div>
                                    </div>
                                    <div className="px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/60 transition-all duration-300 card-hover">
                                        <div className="text-3xl font-bold text-blue-600">{satisfactionRate}%</div>
                                        <div className="text-sm text-slate-500 font-medium">Tingkat Kepuasan</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative float-animation">
                                <div className="absolute inset-0 bg-blue-100 rounded-3xl rotate-3 scale-105 blur-xl"></div>
                                <div className="rounded-3xl bg-blue-100 flex items-center justify-center overflow-hidden shadow-2xl shadow-blue-500/20 relative border border-white/20">
                                    {heroImage ? (
                                        <img src={heroImage} alt="Hero" className="w-full h-auto object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-blue-600/10"></div>
                                            <Waves className="w-32 h-32 text-blue-200 animate-pulse relative z-10" />
                                        </div>
                                    )}
                                </div>
                                {/* Floating Card */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl shadow-blue-100/60 p-5 border border-blue-100 hover:scale-105 transition-transform duration-300 card-hover">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">Garansi Bisa Berenang</div>
                                            <div className="text-sm text-slate-500">Dalam 12 sesi pertemuan</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Additional floating element */}
                                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-blue-100/60 p-4 border border-blue-100 hover:scale-105 transition-transform duration-300 card-hover">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                            <Award className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">Coach Bersertifikasi</div>
                                            <div className="text-xs text-slate-500">PRSI & Internasional</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                    </div>
                </section>

                {/* Visi Misi Section */}
                <section id="visi-misi" className="py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white"></div>
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-100/50 rounded-full blur-[80px]"></div>

                    <div className="max-w-7xl mx-auto relative z-10"><FadeInUp>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/50 text-blue-700 text-sm font-medium mb-4 shadow-sm">
                                <Target className="w-4 h-4" />
                                <span>Tentang Kami</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Visi & Misi</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                                Komitmen kami untuk memberikan yang terbaik dalam pendidikan renang
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Visi Card */}
                            <div className="group bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                                    <Waves className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{visiTitle}</h3>
                                <ul className="space-y-3">
                                    {visiContent.split('\n').map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 text-blue-100">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white text-sm font-bold flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Misi Card */}
                            <div className="group bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100/50 hover:shadow-blue-200/60 transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">{misiTitle}</h3>
                                <ul className="space-y-3 text-justify">
                                    {misiContent.split('\n').map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 text-slate-600">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </FadeInUp>
                    </div>
                </section>

                {/* Sejarah Section */}
                <section id="sejarah" className="py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50"></div>
                    <div className="max-w-7xl mx-auto relative z-10"><FadeInUp>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/50 text-blue-700 text-sm font-medium mb-6 shadow-sm">
                                    <History className="w-4 h-4" />
                                    <span>Perjalanan Kami</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{sejarahTitle}</h2>
                                <div className="space-y-4 text-slate-600 text-lg leading-relaxed text-justify">
                                    {sejarahContent.split('\n\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-3xl rotate-3 scale-105 opacity-20 blur-lg"></div>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 aspect-video bg-white">
                                        {sejarahImage ? (
                                            <img
                                                src={sejarahImage}
                                                alt="Sejarah Akuatik Azura"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                                <History className="w-20 h-20 text-blue-200" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white"></div>
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px]"></div>

                    <div className="max-w-7xl mx-auto relative z-10"><FadeInUp>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/50 text-blue-700 text-sm font-medium mb-4 shadow-sm">
                                <Star className="w-4 h-4" />
                                <span>Keunggulan Kami</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Mengapa Memilih Kami?</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                                Kami berkomitmen memberikan pengalaman belajar renang terbaik dengan pendekatan yang aman dan menyenangkan
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayFeatures.map((feature, index) => {
                                const IconComponent = getIcon(feature.icon);
                                const gradients = [
                                    'bg-blue-600',
                                    'bg-blue-600',
                                    'bg-blue-600',
                                    'bg-blue-600'
                                ];
                                const shadows = [
                                    'shadow-blue-500/25',
                                    'shadow-blue-500/25',
                                    'shadow-blue-500/25',
                                    'shadow-blue-500/25'
                                ];
                                return (
                                    <div
                                        key={feature.id}
                                        className="group bg-white rounded-2xl border border-blue-100 p-6 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 shadow-lg shadow-blue-50 card-hover"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${gradients[index % 4]} flex items-center justify-center mb-5 shadow-lg ${shadows[index % 4]} group-hover:scale-110 transition-all duration-300`}>
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2 text-lg group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                                        <p className="text-slate-600 leading-relaxed text-justify">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </FadeInUp>
                    </div>
                </section>

                {/* Courses Section */}
                <section id="courses" className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>

                    <div className="max-w-7xl mx-auto relative z-10 px-4"><FadeInUp>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
                                <Target className="w-4 h-4" />
                                <span>Program Pilihan</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Program Kursus</h2>
                            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                                Pilih program yang sesuai dengan level dan kebutuhan Anda
                            </p>
                        </div>
                    </FadeInUp>
                    </div>

                    {/* Course Cards - Horizontal Scroll on Mobile, Grid on Desktop */}
                    <div className="relative z-10">
                        <FadeInUp>
                            {courses.length > 0 ? (
                                <>
                                    {/* Mobile: Horizontal Scroll Carousel */}
                                    <div className="md:hidden">
                                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 pb-4 -mx-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {courses.map((course) => (
                                                <div
                                                    key={course.id}
                                                    className="flex-shrink-0 w-[85%] snap-center"
                                                >
                                                    <div className="group bg-white rounded-3xl p-5 transition-all duration-300 shadow-xl shadow-blue-900/10 h-full">
                                                        {course.image ? (
                                                            <img
                                                                src={`/storage/${course.image}`}
                                                                alt={course.title}
                                                                className="w-full h-36 object-cover rounded-2xl mb-4 shadow-lg"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-36 rounded-2xl mb-4 bg-blue-50 flex items-center justify-center border border-blue-200">
                                                                <Waves className="w-12 h-12 text-blue-400" />
                                                            </div>
                                                        )}
                                                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-2">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{course.total_meeting} pertemuan</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-slate-800 mb-1.5">{course.title}</h3>
                                                        <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed text-sm">{course.description}</p>
                                                        <div>
                                                            <div className="text-xs text-slate-500">Mulai dari</div>
                                                            <div className="text-xl font-bold text-blue-600">{formatPrice(course.price)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Pagination Dots */}
                                        <div className="flex justify-center gap-2 mt-4 px-4">
                                            {courses.map((_, idx) => (
                                                <div key={idx} className="w-2 h-2 rounded-full bg-white/40"></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Desktop: Horizontal Carousel with 2 rows */}
                                    <div className="hidden md:block max-w-7xl mx-auto px-4">
                                        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide">
                                            {/* Group courses into pairs for 2 rows */}
                                            {Array.from({ length: Math.ceil(courses.length / 2) }).map((_, colIndex) => (
                                                <div key={colIndex} className="flex-shrink-0 w-[350px] lg:w-[380px] snap-start flex flex-col gap-6">
                                                    {courses.slice(colIndex * 2, colIndex * 2 + 2).map((course) => (
                                                        <div
                                                            key={course.id}
                                                            className="group bg-white rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 h-[330px] flex flex-col"
                                                        >
                                                            {course.image ? (
                                                                <img
                                                                    src={`/storage/${course.image}`}
                                                                    alt={course.title}
                                                                    className="w-full h-36 object-cover rounded-2xl mb-4 shadow-lg flex-shrink-0"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-36 rounded-2xl mb-4 bg-blue-50 flex items-center justify-center border border-blue-200 flex-shrink-0">
                                                                    <Waves className="w-12 h-12 text-blue-400" />
                                                                </div>
                                                            )}
                                                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-2 w-fit flex-shrink-0">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{course.total_meeting} pertemuan</span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 flex-shrink-0">{course.title}</h3>
                                                            <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed flex-grow">{course.description}</p>
                                                            <div className="mt-auto flex-shrink-0 pt-2">
                                                                <div className="text-xs text-slate-500">Mulai dari</div>
                                                                <div className="text-xl font-bold text-blue-600">{formatPrice(course.price)}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border border-white/20">
                                            <Waves className="w-10 h-10 text-white/70" />
                                        </div>
                                        <p className="text-white/80 text-lg">Belum ada program kursus tersedia</p>
                                    </div>
                                </div>
                            )}
                        </FadeInUp>
                    </div>
                </section>

                {/* Coach Section */}
                <section id="coaches" className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50"></div>
                    <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px]"></div>

                    <div className="max-w-7xl mx-auto relative z-10 px-4"><FadeInUp>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/50 text-blue-700 text-sm font-medium mb-4 shadow-sm">
                                <Users className="w-4 h-4" />
                                <span>Tim Kami</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Tim Coach Kami</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                                Didampingi oleh pelatih berpengalaman dan bersertifikasi
                            </p>
                        </div>
                    </FadeInUp>
                    </div>

                    {/* Coach Cards - Horizontal Scroll on Mobile, Grid on Desktop */}
                    <div className="relative z-10">
                        <FadeInUp>
                            {coaches.length > 0 ? (
                                <>
                                    {/* Mobile: Horizontal Scroll Carousel */}
                                    <div className="md:hidden">
                                        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {coaches.map((coach) => (
                                                <div
                                                    key={coach.id}
                                                    className="flex-shrink-0 w-[45%] snap-center"
                                                >
                                                    <div className="group bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-lg shadow-blue-50 h-full">
                                                        <div className="aspect-[4/5] bg-blue-50 flex items-center justify-center overflow-hidden">
                                                            {coach.image ? (
                                                                <img
                                                                    src={`/storage/${coach.image}`}
                                                                    alt={coach.name}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className={`w-full h-full flex items-center justify-center ${coach.gender === 'male'
                                                                    ? 'bg-blue-100'
                                                                    : 'bg-pink-100'
                                                                    }`}>
                                                                    <User className={`w-12 h-12 ${coach.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
                                                                        }`} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-3 text-center">
                                                            <h3 className="font-semibold text-slate-800 mb-0.5 text-sm truncate">{coach.name}</h3>
                                                            <p className="text-xs text-blue-600 font-medium">Coach</p>
                                                            {coach.certificate_coaches && coach.certificate_coaches.length > 0 && (
                                                                <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
                                                                    {coach.certificate_coaches.slice(0, 2).map((cert, idx) => (
                                                                        <Badge key={idx} variant="secondary" className="text-[8px] px-1.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                                                                            {cert.title}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Pagination Dots */}
                                        <div className="flex justify-center gap-2 mt-4 px-4">
                                            {coaches.map((_, idx) => (
                                                <div key={idx} className="w-2 h-2 rounded-full bg-blue-200"></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Desktop: Horizontal Carousel with 2 rows */}
                                    <div className="hidden md:block max-w-7xl mx-auto px-4">
                                        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide">
                                            {/* Group coaches into pairs for 2 rows */}
                                            {Array.from({ length: Math.ceil(coaches.length / 2) }).map((_, colIndex) => (
                                                <div key={colIndex} className="flex-shrink-0 w-[220px] lg:w-[260px] snap-start flex flex-col gap-5">
                                                    {coaches.slice(colIndex * 2, colIndex * 2 + 2).map((coach) => (
                                                        <div key={coach.id} className="group bg-white rounded-2xl border border-blue-100 overflow-hidden hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-blue-50 card-hover">
                                                            <div className="aspect-[4/3] bg-blue-50 flex items-center justify-center overflow-hidden">
                                                                {coach.image ? (
                                                                    <img
                                                                        src={`/storage/${coach.image}`}
                                                                        alt={coach.name}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                        loading="lazy"
                                                                    />
                                                                ) : (
                                                                    <div className={`w-full h-full flex items-center justify-center ${coach.gender === 'male'
                                                                        ? 'bg-blue-100'
                                                                        : 'bg-pink-100'
                                                                        }`}>
                                                                        <User className={`w-12 h-12 ${coach.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
                                                                            }`} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-4 text-center">
                                                                <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors text-sm">{coach.name}</h3>
                                                                <p className="text-xs text-blue-600 font-medium">Coach</p>
                                                                {coach.certificate_coaches && coach.certificate_coaches.length > 0 && (
                                                                    <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
                                                                        {coach.certificate_coaches.slice(0, 2).map((cert, idx) => (
                                                                            <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                                                                                {cert.title}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="text-center py-12 text-slate-500">
                                        <p>Belum ada coach tersedia</p>
                                    </div>
                                </div>
                            )}
                        </FadeInUp>
                    </div>
                </section>


                {/* Gallery Section */}
                <section id="gallery" className="py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50"></div>
                    <div className="max-w-7xl mx-auto relative z-10"><FadeInUp>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/50 text-blue-700 text-sm font-medium mb-4 shadow-sm">
                                <ImageIcon className="w-4 h-4" />
                                <span>Galeri</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Galeri Kegiatan</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                                Momen-momen seru dan berkesan di Akuatik Azura
                            </p>
                        </div>

                        {galleries.length > 0 ? (
                            <div className="columns-2 md:columns-3 lg:columns-4 gap-0 space-y-0">
                                {galleries.map((gallery) => (
                                    <div key={gallery.id} className="break-inside-avoid group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                        <img
                                            src={`/storage/${gallery.image}`}
                                            alt={gallery.title || 'Gallery Image'}
                                            className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-500 block"
                                        />
                                        {gallery.title && (
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-20">
                                                <p className="text-white font-medium text-sm truncate">{gallery.title}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon className="w-8 h-8 text-blue-200" />
                                </div>
                                <p className="font-medium">Belum ada foto galeri</p>
                            </div>
                        )}
                    </FadeInUp>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white"></div>
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[100px]"></div>

                    <div className="max-w-7xl mx-auto relative z-10"><FadeInUp>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/50 text-blue-700 text-sm font-medium mb-4 shadow-sm">
                                <Phone className="w-4 h-4" />
                                <span>Kontak</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Hubungi Kami</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                                Ada pertanyaan? Jangan ragu untuk menghubungi kami
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="group text-center bg-white rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 shadow-lg shadow-blue-50 card-hover">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2 text-lg group-hover:text-blue-600 transition-colors">Telepon</h3>
                                <p className="text-slate-600">{contactPhone}</p>
                            </div>
                            <div className="group text-center bg-white rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 shadow-lg shadow-blue-50 card-hover">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2 text-lg group-hover:text-blue-600 transition-colors">Email</h3>
                                <p className="text-slate-600">{contactEmail}</p>
                            </div>
                            <div className="group text-center bg-white rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 shadow-lg shadow-blue-50 card-hover">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2 text-lg group-hover:text-blue-600 transition-colors">Lokasi</h3>
                                <p className="text-slate-600">{contactAddress}</p>
                            </div>
                            <a href={`https://instagram.com/${contactInstagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="group text-center bg-white rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 shadow-lg shadow-blue-50 card-hover">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                                    <Instagram className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2 text-lg group-hover:text-blue-600 transition-colors">Instagram</h3>
                                <p className="text-slate-600">{contactInstagram}</p>
                            </a>
                        </div>
                    </FadeInUp>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 px-4 bg-slate-900 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
                    <div className="absolute top-0 left-0 w-full h-px bg-blue-800"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            {/* Brand */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg">
                                        <img src="/logo.png" alt="Akuatik Azura" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="font-bold text-2xl tracking-tight text-white">Akuatik Azura</span>
                                </div>
                                <p className="text-slate-400 mb-8 leading-relaxed max-w-sm text-justify">
                                    {heroSubtitle ? heroSubtitle : 'Akuatik Azura Swimming'}
                                </p>

                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="font-bold text-lg mb-6 text-blue-400">Tautan Cepat</h3>
                                <ul className="space-y-4">
                                    <li><a href="#visi-misi" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:w-3 transition-all duration-300"></span> Visi & Misi</a></li>
                                    <li><a href="#features" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:w-3 transition-all duration-300"></span> Keunggulan</a></li>
                                    <li><a href="#courses" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:w-3 transition-all duration-300"></span> Program</a></li>
                                    <li><a href="#gallery" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:w-3 transition-all duration-300"></span> Galeri</a></li>
                                    <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:w-3 transition-all duration-300"></span> Kontak</a></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="font-bold text-lg mb-6 text-blue-400">Hubungi Kami</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-400 group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors duration-300">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="text-sm leading-relaxed">{contactAddress}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-400 group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors duration-300">
                                            <Phone className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="text-sm">{contactPhone}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-400 group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors duration-300">
                                            <Mail className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="text-sm">{contactEmail}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-slate-500 text-sm">
                                © {new Date().getFullYear()} Akuatik Azura. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-sm text-slate-500">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
