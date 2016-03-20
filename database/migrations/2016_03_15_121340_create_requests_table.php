<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->timestamps();

            $table->char('type', 1);
            $table->date('document_date');

            $table->string('name', 30);
            $table->string('surname', 30);
            $table->string('workplace', 50);

            $table->string('for_place', 50);
            $table->string('for_faculty', 50)->nullable();
            $table->string('for_subject', 50)->nullable();

            $table->timestamp('start_timestamp');
            $table->timestamp('end_timestamp');
            $table->string('duration', 20);

            $table->string('advance_payment', 10)->nullable();

            $table->text('description');

            $table->string('transportation', 50);
            $table->string('expenses_responsible', 50);
            $table->text('expenses_explanation');

            $table->text('applicant_signature');
            $table->text('approver_signature')->nullable();

            $table->boolean('quality_check')->nullable();
            $table->timestamp('quality_check_timestamp')->nullable();
            $table->text('invalidity_reason')->nullable();
            $table->boolean('approved')->nullable();
            $table->timestamp('approved_timestamp')->nullable();
            $table->text('disapproval_reason')->nullable();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('requests');
    }
}
