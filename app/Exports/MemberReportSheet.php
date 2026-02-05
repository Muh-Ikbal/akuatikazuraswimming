<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithTitle;

class MemberReportSheet implements FromCollection, WithHeadings, ShouldAutoSize, WithMapping, WithEvents, WithTitle
{
    protected $data;
    protected $startDate;
    protected $endDate;
    protected $title;

    public function __construct($title, $data, $startDate, $endDate)
    {
        $this->title = $title;
        $this->data = $data;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        return $this->data;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                $event->sheet->insertNewRowBefore(1, 3);

                $event->sheet->mergeCells('A1:G1');
                $event->sheet->setCellValue('A1', 'LAPORAN MEMBER - ' . strtoupper($this->title));
                $event->sheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 14,
                    ],
                    'alignment' => [
                        'horizontal' => 'center',
                    ],
                ]);

                $event->sheet->mergeCells('A2:G2');
                $event->sheet->setCellValue(
                    'A2',
                    'Periode: ' .
                    date('d F Y', strtotime($this->startDate)) .
                    ' – ' .
                    date('d F Y', strtotime($this->endDate))
                );
                $event->sheet->getStyle('A2')->getAlignment()->setHorizontal('center');

                $event->sheet->getStyle('A4:G4')->getFont()->setBold(true);

                $event->sheet->setAutoFilter('A4:G4');
            },
        ];
    }


    public function headings(): array
    {
        return [
            'Tanggal Pembayaran',
            'Nama Member',
            'Keterangan',
            'Jumlah Bayar',
            'Nomor Telepon',
            'Jumlah Pertemuan',
            'Status'
        ];
    }

    public function map($row): array
    {
        return [
            $row['joined_date'],
            $row['name'],
            $row['description'],
            $row['amount'],
            $row['phone_number'],
            $row['remaining_sessions'],
            $row['status'] == 'on_progress' ? 'Berlangsung' : 'Selesai',
        ];
    }
}
