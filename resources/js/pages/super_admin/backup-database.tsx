import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const BackupDatabase = ({ size, dbName }: { size: number; dbName: string }) => {
    return (
        <AppLayout breadcrumbs={[{ title: 'Backup Database', href: '/super_admin/backup-database' }]}>
            <Head title="Backup Database" />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Database Sistem</h1>
                        <p className="text-muted-foreground">Menampilkan database sistem</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{dbName}</TableCell>
                                    <TableCell>{size} MB</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => window.location.href = "/download-backup"}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>

                </Card>
            </div>
        </AppLayout>
    );
};

export default BackupDatabase;
