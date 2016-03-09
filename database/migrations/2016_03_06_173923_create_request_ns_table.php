<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRequestNsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_ns', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->date('document_date');
            $table->string('name', 20);
            $table->string('surname', 20);
            $table->string('workplace', 50);
            $table->string('for_place', 50);
            $table->string('for_faculty', 50);
            $table->string('for_subject', 50);
            $table->timestamp('start_timestamp');
            $table->timestamp('end_timestamp');
            $table->text('purpose');
            $table->string('transportation', 50);
            $table->string('expenses_responsible', 50);
            $table->string('expenses_explanation', 100);
            // $table->string('applicant', 50);
            // $table->string('approved_by', 50);

            $table->boolean('quality_check')->nullable();
            $table->timestamp('quality_check_timestamp')->nullable();
            $table->boolean('approved')->nullable();
            $table->timestamp('approved_timestamp')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('request_ns');
    }
}
