import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

interface Payment {
    id: number;
    amount: number;
    amount_paid: number;
    payment_method: string;
    state: string;
    created_at: string;
    enrolment_course?: {
        id: number;
        member?: {
            id: number;
            name: string;
            phone: string;
            address: string;
        };
        course?: {
            id: number;
            title: string;
            price: number;
        };
        class_session?: {
            id: number;
            title: string;
        };
    };
}

interface Props {
    payment: Payment;
    invoiceNumber: string;
}

export default function Invoice({ payment, invoiceNumber }: Props) {
    const printRef = useRef<HTMLDivElement>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoiceNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
                    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
                    .invoice-title { font-size: 28px; font-weight: bold; color: #2563eb; }
                    .invoice-number { color: #6b7280; margin-top: 4px; }
                    .company-info { text-align: right; display: flex; align-items: center; gap: 16px; }
                    .company-name { font-size: 18px; font-weight: bold; }
                    .company-address { font-size: 12px; color: #6b7280; margin-top: 4px; }
                    .logo { width: 60px; height: 60px; object-fit: contain; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px; }
                    .info-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
                    .customer-name { font-size: 16px; font-weight: 600; }
                    .customer-details { color: #6b7280; }
                    .detail-right { text-align: right; }
                    .status-badge { display: inline-flex; align-items: center; gap: 4px; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-weight: 500; font-size: 12px; margin-top: 8px; }
                    .items-table { width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 24px; border-collapse: collapse; }
                    .items-table th { background: #f9fafb; text-align: left; padding: 12px 16px; font-weight: 600; }
                    .items-table th:last-child { text-align: right; }
                    .items-table td { padding: 16px; border-top: 1px solid #e5e7eb; }
                    .items-table td:last-child { text-align: right; font-weight: 500; }
                    .item-title { font-weight: 500; }
                    .item-subtitle { font-size: 12px; color: #6b7280; }
                    .totals { display: flex; justify-content: flex-end; }
                    .totals-box { width: 280px; }
                    .subtotal-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
                    .subtotal-label { color: #6b7280; }
                    .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: bold; }
                    .total-amount { color: #2563eb; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <div>
                        <div class="invoice-title">INVOICE</div>
                        <div class="invoice-number">${invoiceNumber}</div>
                    </div>
                    <div class="company-info">
                        <div>
                            <div class="company-name">Akuatik Azura Swimming</div>
                            <div class="company-address">Jl. Contoh Alamat No. 123<br>Kota, Indonesia<br>Telp: (021) 1234567</div>
                        </div>
                        <img src="/logo.png" alt="Logo" class="logo">
                    </div>
                </div>
                
                <div class="info-grid">
                    <div>
                        <div class="info-label">Tagihan Kepada</div>
                        <div class="customer-name">${payment.enrolment_course?.member?.name || '-'}</div>
                        <div class="customer-details">${payment.enrolment_course?.member?.phone || ''}<br>${payment.enrolment_course?.member?.address || '-'}</div>
                    </div>
                    <div class="detail-right">
                        <div class="info-label">Detail Invoice</div>
                        <div>Tanggal: ${formatDate(payment.created_at)}</div>
                        <div>Metode: ${payment.payment_method}</div>
                        <div class="status-badge">✓ LUNAS</div>
                    </div>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Deskripsi</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="item-title">${payment.enrolment_course?.course?.title || '-'}</div>
                                <div class="item-subtitle">Kelas: ${payment.enrolment_course?.class_session?.title || '-'}</div>
                            </td>
                            <td>${formatCurrency(payment.amount)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="totals">
                    <div class="totals-box">
                        <div class="subtotal-row">
                            <span class="subtotal-label">Subtotal</span>
                            <span>${formatCurrency(payment.amount)}</span>
                        </div>
                        <div class="total-row">
                            <span>Total Dibayar</span>
                            <span class="total-amount">${formatCurrency(payment.amount_paid)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Terima kasih telah mempercayakan kami untuk pendidikan renang Anda.</p>
                    <p>Invoice ini sah tanpa tanda tangan dan stempel.</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <>
            <Head title={`Invoice ${invoiceNumber}`} />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation Bar */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                        <Link href="/management-pembayaran">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <Button onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />
                            Cetak Invoice
                        </Button>
                    </div>
                </div>

                {/* Invoice Preview */}
                <div className="max-w-4xl mx-auto p-6" ref={printRef}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        {/* Header with Logo */}
                        <div className="flex justify-between items-start border-b pb-6 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
                                <p className="text-gray-500 mt-1">{invoiceNumber}</p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Akuatik Azura Swimming</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Jl. Contoh Alamat No. 123<br />
                                        Kota, Indonesia<br />
                                        Telp: (021) 1234567
                                    </p>
                                </div>
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="w-16 h-16 object-contain"
                                />
                            </div>
                        </div>

                        {/* Customer & Invoice Info */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Tagihan Kepada</h3>
                                <p className="font-semibold text-lg text-gray-900 dark:text-white">{payment.enrolment_course?.member?.name}</p>
                                <p className="text-gray-500">
                                    {payment.enrolment_course?.member?.phone}<br />
                                    {payment.enrolment_course?.member?.address || '-'}
                                </p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Detail Invoice</h3>
                                <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500">Tanggal: </span>{formatDate(payment.created_at)}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500">Metode: </span>{payment.payment_method}</p>
                                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium">LUNAS</span>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border rounded-lg overflow-hidden mb-8">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Deskripsi</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900 dark:text-white">{payment.enrolment_course?.course?.title}</p>
                                            <p className="text-sm text-gray-500">
                                                Kelas: {payment.enrolment_course?.class_session?.title || '-'}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Total */}
                        <div className="flex justify-end">
                            <div className="w-72">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</span>
                                </div>
                                <div className="flex justify-between py-3 text-lg font-bold">
                                    <span className="text-gray-900 dark:text-white">Total Dibayar</span>
                                    <span className="text-blue-600">{formatCurrency(payment.amount_paid)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
                            <p>Terima kasih telah mempercayakan kami untuk pendidikan renang Anda.</p>
                            <p className="mt-1">Invoice ini sah tanpa tanda tangan dan stempel.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
