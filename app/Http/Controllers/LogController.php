<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class LogController extends Controller
{
    public function index()
    {
        $logPath = storage_path('logs/laravel.log');
        $logs = [];

        if (File::exists($logPath)) {
            $fileContent = File::get($logPath);
            // Split by lines
            $lines = explode("\n", $fileContent);
            $lines = array_reverse($lines); // Show newest first

            foreach ($lines as $line) {
                // Regex to parse Laravel log format: [Date Time] Env.Level: Message
                if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+)\.(\w+): (.*)/', $line, $matches)) {
                    $level = strtoupper($matches[3]);
                    
                    // Filter: Only ERROR and WARNING
                    if (in_array($level, ['ERROR', 'WARNING'])) {
                        $logs[] = [
                            'timestamp' => $matches[1],
                            'env' => $matches[2],
                            'level' => $level,
                            'message' => substr($matches[4], 0, 500) . (strlen($matches[4]) > 500 ? '...' : ''), // Truncate long messages
                        ];
                    }

                    // Limit to 15 entries as requested
                    if (count($logs) >= 15) {
                        break;
                    }
                }
            }
        }

        return Inertia::render('super_admin/logger-system', [
            'logs' => $logs
        ]);
    }

    public function download()
    {
        $logPath = storage_path('logs/laravel.log');

        if (File::exists($logPath)) {
            return response()->download($logPath);
        }

        return redirect()->back()->with('error', 'Log file not found.');
    }
}
