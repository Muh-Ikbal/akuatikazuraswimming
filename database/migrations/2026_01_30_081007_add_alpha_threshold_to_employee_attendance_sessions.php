<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employee_attendance_sessions', function (Blueprint $table) {
            $table->time('alpha_threshold')->after('late_threshold')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_attendance_sessions', function (Blueprint $table) {
            $table->dropColumn('alpha_threshold');
        });
    }
};
