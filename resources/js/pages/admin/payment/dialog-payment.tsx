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
import React from "react";
import { useForm } from "@inertiajs/react";
import { CreditCard } from "lucide-react";

interface Payement {
    id: number;
    amount: number;
    amount_paid: number;
    payment_method: string;
    state: 'pending' | 'paid' | 'partial_paid' | 'failed';
}


export default function DialogPayment({ payment }: { payment: Payement }) {
    const { amount, amount_paid } = payment;
    const amountLeft = amount - amount_paid;
    const { put, data, setData, errors } = useForm({
        amount: amount,
        amount_paid: amountLeft,
        payment_method: payment?.payment_method || 'transfer',
    });

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
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="amount">Jumlah</Label>
                            <Input
                                id="amount"
                                name="amount"
                                value={data.amount_paid}
                                onChange={(e) => setData('amount_paid', parseInt(e.target.value))}
                            />
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