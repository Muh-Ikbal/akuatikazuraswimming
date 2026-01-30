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
        Schema::table('attandance_employees', function (Blueprint $table) {
            $table->foreignId('employee_attendance_session_id')->nullable()->constrained('employee_attendance_sessions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attandance_employees', function (Blueprint $table) {
            $table->dropForeign(['employee_attendance_session_id']);
            $table->dropColumn('employee_attendance_session_id');
        });
    }
};
