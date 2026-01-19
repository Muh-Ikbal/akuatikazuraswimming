<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE payments 
            MODIFY state 
            ENUM('pending', 'partial_paid', 'paid', 'failed') 
            DEFAULT 'pending'
        ");
        Schema::table('payments', function (Blueprint $table) {
            $table->decimal('amount_paid', 10, 2)->nullable()->after('amount');
            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('amount_paid');
        });
        DB::statement("
            ALTER TABLE payments 
            MODIFY state 
            ENUM('pending', 'paid', 'failed') 
            DEFAULT 'pending'
        ");
    }
};
