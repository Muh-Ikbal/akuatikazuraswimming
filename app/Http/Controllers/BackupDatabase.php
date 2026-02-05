<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;



class BackupDatabase extends Controller
{
    public function index(){
        $dbName = Config::get('database.connections.mysql.database');
        $dbUser = Config::get('database.connections.mysql.username');
        $dbHost = Config::get('database.connections.mysql.host');

        $size = DB::select('
            SELECT 
                ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size
            FROM information_schema.tables
            WHERE table_schema = ?
        ', [$dbName]);

        return Inertia::render('super_admin/backup-database',
            [
                'size' => $size[0]->size,
                'dbName' => $dbName,
            ]
        );

    }

    public function backupDatabase(){
        $filename = 'backup_'. date('Ymd_His'). '.sql';
        $path = storage_path('app/backups/'.$filename);

        if(!file_exists(storage_path('app/backups'))){
            mkdir(storage_path('app/backups'), 0777, true);
        }

        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');
        
        $command = sprintf(
            'mysqldump --user=%s --password=%s --host=%s %s > %s',
            escapeshellarg($dbUser),
            escapeshellarg($dbPass),
            escapeshellarg(config('database.connections.mysql.host')),
            escapeshellarg($dbName),
            escapeshellarg($path)
        );

        exec($command, $output, $resultCode);

        if ($resultCode !== 0) {
             return back()->with('error', 'Backup failed');
        }

        return response()->download($path)->deleteFileAfterSend(true);
    }
        
    
}
