<?php

use Illuminate\Database\Seeder;
use App\RequestN;

class RequestNsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RequestN::create([
            'document_date' => date('Y-m-d'),
            'name' => 'Tomislav',
            'surname' => 'Plazonić',
            'workplace' => 'ETFOS',
            'for_place' => 'Villigen',
            'for_faculty' => 'ETH Zurich',
            'for_subject' => 'Meko računarstvo',
            'start_timestamp' => Carbon\Carbon::create(2016, 8, 12, 8, 0, 0),
            'end_timestamp' => Carbon\Carbon::create(2016, 8, 29, 15, 0, 0),
            'purpose' => "Pa tamo malo da se ide i predaje prezanimljiv predmet zainteresiranim učenicima i ostalima" .
                " koji su željni slušati moja predavanja.",
            'transportation' => 'Autobus, zrakoplov, vlak',
            'expenses_responsible' => 'ETFOS',
            'expenses_explanation' => 'Financiranje službenog putovanja'
        ]);
    }
}
