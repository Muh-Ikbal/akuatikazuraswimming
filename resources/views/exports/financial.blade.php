<table>
    <thead>
    <tr>
        <th colspan="4" style="text-align: center; font-weight: bold; font-size: 16px;">Laporan Keuangan Akuatik Azura</th>
    </tr>
    <tr>
        <th colspan="4" style="text-align: center; font-style: italic;">Periode: {{ $name_period }}</th>
    </tr>
    <tr></tr>
    </thead>
    <tbody>
    {{-- Summary --}}
    <tr>
        <td colspan="4" style="font-weight: bold; background-color: #f3f4f6;">Ringkasan</td>
    </tr>
    <tr>
        <td>Total Pemasukan</td>
        <td>{{ $summary['totalIncome'] }}</td>
        <td>Total Pengeluaran</td>
        <td>{{ $summary['totalExpense'] }}</td>
    </tr>
    <tr>
        <td>Laba Bersih</td>
        <td style="{{ $summary['netProfit'] < 0 ? 'color: red;' : 'color: green;' }}">{{ $summary['netProfit'] }}</td>
        <td>Piutang</td>
        <td>{{ $summary['receivables'] }}</td>
    </tr>
    <tr></tr>

    {{-- Income Breakdown --}}
    <tr>
        <td colspan="4" style="font-weight: bold; background-color: #d1fae5;">Pemasukan per Course</td>
    </tr>
    <tr>
        <th colspan="2">Nama Course</th>
        <th colspan="2">Jumlah</th>
    </tr>
    @foreach($incomeBySource as $income)
        <tr>
            <td colspan="2">{{ $income['name'] }}</td>
            <td colspan="2">{{ $income['amount'] }}</td>
        </tr>
    @endforeach
    <tr></tr>

    {{-- Expense Breakdown --}}
    <tr>
        <td colspan="4" style="font-weight: bold; background-color: #fee2e2;">Pengeluaran per Kategori</td>
    </tr>
    <tr>
        <th colspan="2">Kategori</th>
        <th colspan="2">Jumlah</th>
    </tr>
    @foreach($expenseByCategory as $expense)
        <tr>
            <td colspan="2">{{ $expense['name'] }}</td>
            <td colspan="2">{{ $expense['amount'] }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
