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
        Schema::table('enrolment_courses', function (Blueprint $table) {
            $table->dropForeign(['class_session_id']);
            $table->dropForeign(['course_id']);
            $table->dropForeign(['member_id']);

            $table->foreign('class_session_id')
                ->nullable()
                ->references('id')->on('class_sessions')
                ->onDelete('restrict');

            $table->foreign('course_id')
                ->nullable()
                ->references('id')->on('courses')
                ->onDelete('restrict');

            $table->foreign('member_id')
                ->nullable()
                ->references('id')->on('members')
                ->onDelete('restrict');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrolment_courses', function (Blueprint $table) {
            $table->dropForeign(['class_session_id']);
            $table->dropForeign(['course_id']);
            $table->dropForeign(['member_id']);

            $table->foreign('class_session_id')
                ->references('id')->on('class_sessions')
                ->onDelete('cascade');

            $table->foreign('course_id')
                ->references('id')->on('courses')
                ->onDelete('cascade');

            $table->foreign('member_id')
                ->references('id')->on('members')
                ->onDelete('cascade');
        });

        
    }
};
