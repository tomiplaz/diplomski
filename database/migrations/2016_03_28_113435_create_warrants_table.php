<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarrantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warrants', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('user_id')->unsigned();

            $table->char('mark', 10);
            $table->char('type', 1);
            $table->date('document_date');

            $table->string('name', 30);
            $table->string('surname', 30);
            $table->string('workplace', 50);
            $table->string('for_place', 50);
            $table->timestamp('start_timestamp');
            $table->timestamp('end_timestamp');
            $table->string('duration', 20);
            $table->smallInteger('advance_payment')->unsigned();
            $table->text('description');
            $table->string('transportation', 50);
            $table->string('expenses_responsible', 50);

            $table->text('approver_start_signature');

            $table->timestamp('sent')->nullable();

            $table->smallInteger('wage')->unsigned()->nullable();
            $table->mediumInteger('wages_total')->unsigned()->nullable();
            for ($i = 0; $i < 7; $i++) {
                $table->string('routes_from_' . $i, 50)->nullable();
                $table->string('routes_to_' . $i, 50)->nullable();
                $table->string('routes_transportation_' . $i, 30)->nullable();
                $table->smallInteger('routes_cost_' . $i)->unsigned()->nullable();
            }
            $table->mediumInteger('routes_total')->unsigned()->nullable();
            for ($i = 0; $i < 4; $i++) {
                $table->string('other_description_' . $i, 100)->nullable();
                $table->smallInteger('other_cost_' . $i)->unsigned()->nullable();
            }
            $table->mediumInteger('other_total')->unsigned()->nullable();
            $table->mediumInteger('all_total')->unsigned()->nullable();

            $table->text('report')->nullable();

            $table->boolean('quality_check')->nullable();
            $table->timestamp('quality_check_timestamp')->nullable();
            $table->text('invalidity_reason')->nullable();
            $table->boolean('accounting_check')->nullable();
            $table->timestamp('accounting_check_timestamp')->nullable();
            $table->text('accounting_reason')->nullable();
            $table->boolean('approved')->nullable();
            $table->timestamp('approved_timestamp')->nullable();
            $table->text('disapproval_reason')->nullable();

            $table->text('applicant_signature');
            $table->text('accountant_signature')->nullable();
            $table->text('approver_signature')->nullable();

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
        Schema::drop('warrants');
    }
}
