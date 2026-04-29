<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EnrolmentCourse;
use Carbon\Carbon;

class CheckExpiredEnrolment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enrolment:check-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and update enrolments that have passed their end_date to completed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today()->format('Y-m-d');
        
        $updated = EnrolmentCourse::where('state', 'on_progress')
            ->whereNotNull('end_date')
            ->whereDate('end_date', '<', $today)
            ->update(['state' => 'completed']);

        $this->info("Updated {$updated} expired enrolments to completed.");
    }
}
