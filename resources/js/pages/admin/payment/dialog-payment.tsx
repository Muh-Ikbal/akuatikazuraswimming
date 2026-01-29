import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
// import { Form } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { CreditCard, Tag } from "lucide-react";
import { Promo } from "@/types";

interface Payement {
    id: number;
    amount: number;
    amount_paid: number;
    payment_method: string;
    state: 'pending' | 'paid' | 'partial_paid' | 'failed';
}


export default function DialogPayment({ payment, promos = [] }: { payment: Payement, promos?: Promo[] }) {
    const { amount, amount_paid } = payment;
    const amountLeft = amount - amount_paid;

    const { put, data, setData, errors } = useForm({
        amount: amount,
        amount_paid: amountLeft,
        payment_method: payment?.payment_method || 'transfer',
        promo_id: '',
    });

    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        if (data.promo_id) {
            const promo = promos.find(p => p.id.toString() === data.promo_id.toString());
            if (promo) {
                let discount = 0;
                if (promo.discount_type === 'percentage') {
                    discount = (amount * promo.discount_value) / 100;
                } else {
                    discount = promo.discount_value;
                }

                // Cap discount at amount
                if (discount > amount) discount = amount;

                setDiscountAmount(discount);

                // Update amount_paid to reflect remaining after discount if it was equal to full amount
                // But better logic: amount_to_pay = amountLeft - discount.
                // If existing payments exist (partial), we apply discount to TOTAL amount.
                // So remaining = amount - amount_paid - discount.

                const newAmountLeft = Math.max(0, amountLeft - discount);
                setData('amount_paid', newAmountLeft);
            }
        } else {
            setDiscountAmount(0);
            setData('amount_paid', amountLeft);
        }
    }, [data.promo_id]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/management-pembayaran/bayar/${payment?.id}`);
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <CreditCard />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleSubmit}>

                    <DialogHeader>
                        <DialogTitle>Bayar</DialogTitle>
                        <DialogDescription>
                            Bayar kursus
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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

                        <div className="grid gap-3">
                            <Label htmlFor="amount">Jumlah Bayar</Label>
                            <Input
                                id="amount"
                                name="amount"
                                value={data.amount_paid}
                                onChange={(e) => setData('amount_paid', parseInt(e.target.value) || 0)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Sisa tagihan: {formatCurrency(Math.max(0, amountLeft - discountAmount))}
                            </p>
                        </div>
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
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit">Bayar</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}