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
        // Changing enum is tricky in Doctrine/Laravel, raw SQL is often safer/easier for simple adds
        DB::statement("ALTER TABLE attandance_employees MODIFY COLUMN state ENUM('present', 'late', 'alpha') DEFAULT 'present'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original
        DB::statement("UPDATE attandance_employees SET state = 'present' WHERE state = 'alpha'");
        DB::statement("ALTER TABLE attandance_employees MODIFY COLUMN state ENUM('present', 'late') DEFAULT 'present'");
    }
};
