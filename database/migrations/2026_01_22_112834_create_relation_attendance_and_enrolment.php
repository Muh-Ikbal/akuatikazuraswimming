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
        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('enrolment_course_id')
            ->nullable()
            ->after('user_id')
            ->constrained('enrolment_courses')
            ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['enrolment_course_id']);
            $table->dropIndex(['enrolment_course_id']);
            $table->dropColumn('enrolment_course_id');
        });
    }
};
