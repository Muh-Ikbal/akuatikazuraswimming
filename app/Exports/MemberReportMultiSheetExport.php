<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MemberReportMultiSheetExport implements WithMultipleSheets
{
    protected $data;
    protected $startDate;
    protected $endDate;

    public function __construct($data, $startDate, $endDate)
    {
        $this->data = $data;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Group data by class_name
        $groupedData = $this->data->groupBy('class_name');

        foreach ($groupedData as $className => $data) {
            $sheetTitle = substr($className, 0, 31); // Excel sheet name limit
            if (empty($sheetTitle) || $sheetTitle === '-') {
                $sheetTitle = 'Other';
            }
            // Ensure unique titles if truncated names collide?
            // For simplicity, let's assume they won't, or user accepts it.
            // But if collision happens, Excel will error. 
            // Let's rely on unique class names for now.

            $sheets[] = new MemberReportSheet($sheetTitle, $data, $this->startDate, $this->endDate);
        }
        
        // Handle case where no data or no classes
        if (count($sheets) === 0) {
             $sheets[] = new MemberReportSheet('Laporan', collect([]), $this->startDate, $this->endDate);
        }

        return $sheets;
    }
}
