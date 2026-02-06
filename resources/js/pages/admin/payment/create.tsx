import { useState, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Promo } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User, Banknote, CreditCard, Tag, Calendar } from 'lucide-react';

interface Enrolment {
    id: number;
    member?: {
        id: number;
        name: string;
    };
    course?: {
        id: number;
        title: string;
        price: number;
    };
}

interface Payment {
    id: number;
    enrolment_course_id: number;
    amount: number;
    payment_method: string;
    amount_paid: number;
    state: string;
    created_at?: string;
}

interface Props {
    payment?: Payment;
    enrolments: Enrolment[];
    promos?: Promo[];
}

export default function CreatePayment({ payment, enrolments, promos = [] }: Props) {
    const isEdit = !!payment;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pemasukan',
            href: '/management-pembayaran',
        },
        {
            title: isEdit ? 'Edit Payment' : 'Tambah Payment',
            href: isEdit ? `/management-pembayaran/edit/${payment?.id}` : '/management-pembayaran/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        enrolment_course_id: payment?.enrolment_course_id || '',
        amount: payment?.amount || '',
        payment_method: payment?.payment_method || 'transfer',
        amount_paid: payment?.amount_paid || '',
        state: payment?.state || 'pending',
        promo_id: '',
        created_at: payment?.created_at ? new Date(payment.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    const [discountAmount, setDiscountAmount] = useState(0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        if (data.promo_id) {
            const promo = promos.find(p => p.id.toString() === data.promo_id.toString());
            const amountVal = Number(data.amount) || 0;
            if (promo && amountVal > 0) {
                let discount = 0;
                if (promo.discount_type === 'percentage') {
                    discount = (amountVal * promo.discount_value) / 100;
                } else {
                    discount = promo.discount_value;
                }

                if (discount > amountVal) discount = amountVal;

                setDiscountAmount(discount);

                // Adjust amount_paid if it matches full amount (convenience)
                // or just let user adjust.
                // Let's suggest paid amount = amount - discount
                setData('amount_paid', Math.max(0, amountVal - discount));
            }
        } else {
            setDiscountAmount(0);
            if (!isEdit && data.amount) {
                setData('amount_paid', data.amount);
            }
        }
    }, [data.promo_id, data.amount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-pembayaran/update/${payment?.id}`);
        } else {
            post('/management-pembayaran/store');
        }
    };

    // Auto-fill amount when enrolment is selected
    const handleEnrolmentChange = (enrolmentId: number) => {
        setData('enrolment_course_id', enrolmentId);
        const enrolment = enrolments.find(e => e.id === enrolmentId);
        if (enrolment?.course?.price) {
            setData('amount', enrolment.course.price);
        }
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Pembayaran" : "Tambah Pembayaran"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-pembayaran" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Pembayaran' : 'Tambah Pembayaran Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data pembayaran' : 'Catat pembayaran dari member'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 ">
                        {/* Data Pembayaran */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Banknote className="w-5 h-5" />
                                    Data Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* Enrolment */}
                                <div className="space-y-2">
                                    <Label htmlFor="enrolment_course_id" className="text-sm">
                                        Pendaftar <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="enrolment_course_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.enrolment_course_id ? 'border-destructive' : 'border-input'}`}
                                            value={data.enrolment_course_id}
                                            onChange={(e) => handleEnrolmentChange(parseInt(e.target.value))}
                                        >
                                            <option value="">-- Pilih Pendaftar --</option>
                                            {enrolments.map((enrolment) => (
                                                <option key={enrolment.id} value={enrolment.id}>
                                                    {enrolment.member?.name} - {enrolment.course?.title} ({formatCurrency(enrolment.course?.price || 0)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.enrolment_course_id && <p className="text-sm text-destructive">{errors.enrolment_course_id}</p>}
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-sm">
                                        Jumlah <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                                            className={`h-10 sm:h-11 pl-10 ${errors.amount ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                                    {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                                </div>

                                {/* Promo */}
                                <div className="space-y-2">
                                    <Label htmlFor="promo_id" className="text-sm">
                                        Promo
                                    </Label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="promo_id"
                                            className="w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm border-input"
                                            value={data.promo_id}
                                            onChange={(e) => setData('promo_id', e.target.value)}
                                        >
                                            <option value="">Pilih Promo (Opsional)</option>
                                            {promos.map((promo) => (
                                                <option key={promo.id} value={promo.id}>
                                                    {promo.title} - {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : formatCurrency(promo.discount_value)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-100 flex justify-between items-center">
                                            <span>Potongan Harga:</span>
                                            <span className="font-bold">{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                </div>
                                {/* Amount paid*/}
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-sm">
                                        Bayar <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                                        <Input
                                            id="amount_paid"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={data.amount_paid}
                                            onChange={(e) => setData('amount_paid', parseFloat(e.target.value))}
                                            className={`h-10 sm:h-11 pl-10 ${errors.amount_paid ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.amount_paid && <p className="text-sm text-destructive">{errors.amount_paid}</p>}
                                </div>

                                {/* Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="created_at" className="text-sm">
                                        Tanggal Pembayaran <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground flex items-center justify-center">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <Input
                                            id="created_at"
                                            type="date"
                                            className={`pl-10 ${errors.created_at ? 'border-destructive' : ''}`}
                                            value={data.created_at}
                                            onChange={(e) => setData('created_at', e.target.value)}
                                        />
                                    </div>
                                    {errors.created_at && <p className="text-sm text-destructive">{errors.created_at}</p>}
                                </div>


                                {/* Payment Method */}
                                <div className="space-y-2">
                                    <Label htmlFor="payment_method" className="text-sm">
                                        Metode Pembayaran <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="payment_method"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.payment_method ? 'border-destructive' : 'border-input'}`}
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                        >
                                            <option value="transfer">Transfer Bank</option>
                                            <option value="cash">Tunai</option>
                                            <option value="qris">QRIS</option>
                                            <option value="e-wallet">E-Wallet</option>
                                        </select>
                                    </div>
                                    {errors.payment_method && <p className="text-sm text-destructive">{errors.payment_method}</p>}
                                </div>

                                {/* State */}
                                {/* <div className="space-y-2">
                                    <Label htmlFor="state" className="text-sm">
                                        Status <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="state"
                                        className={`w-full h-10 sm:h-11 px-3 border rounded-md bg-background text-sm ${errors.state ? 'border-destructive' : 'border-input'}`}
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Lunas</option>
                                        <option value="failed">Gagal</option>
                                    </select>
                                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                                </div> */}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-pembayaran" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Payment' : 'Simpan Payment')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
