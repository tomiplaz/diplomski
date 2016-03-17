<?php

use Illuminate\Database\Seeder;

use App\Request as Request;

class RequestsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Request::create([
            'type' => 'n',
            'document_date' => date('Y-m-d'),
            'name' => "Tomislav",
            'surname' => "Plazonić",
            'workplace' => "ETF Osijek",
            'for_place' => "Villigen, Švicarska",
            'for_faculty' => "ETH Zurich",
            'for_subject' => "Soft Computing",
            'start_timestamp' => Carbon\Carbon::create(2016, 8, 12, 8, 0, 0),
            'end_timestamp' => Carbon\Carbon::create(2016, 8, 29, 15, 0, 0),
            'duration' => "12 dana i 17 sati",
            'description' => "Aliquam fringilla vulputate auctor. Donec et justo et sapien viverra viverra finibus vel odio. Proin tempus sapien leo, ut finibus lorem imperdiet ut. Quisque gravida nisi dui, nec ultricies turpis aliquam ac. In et consequat velit. Nunc pulvinar metus ut lacinia fermentum. Nunc ultrices odio id.",
            'transportation' => "Autobus, zrakoplov, vlak",
            'expenses_responsible' => "ETF Osijek",
            'expenses_explanation' => "Aliquam fringilla vulputate auctor. Donec et justo et sapien viverra viverra finibus vel odio. Proin tempus sapien leo, ut finibus lorem imperdiet.",
            'applicant_signature' => "data:image/png;base64,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"
        ]);

        Request::create([
            'type' => 'z',
            'document_date' => date('Y-m-d'),
            'name' => "Tamara",
            'surname' => "Miljuš",
            'workplace' => "PSI",
            'for_place' => "Keystone, SAD",
            'start_timestamp' => Carbon\Carbon::create(2016, 8, 12, 8, 0, 0),
            'end_timestamp' => Carbon\Carbon::create(2016, 8, 29, 15, 0, 0),
            'duration' => "12 dana i 17 sati",
            'advance_payment' => "500 USD",
            'description' => "Aliquam fringilla vulputate auctor. Donec et justo et sapien viverra viverra finibus vel odio. Proin tempus sapien leo, ut finibus lorem imperdiet ut. Quisque gravida nisi dui, nec ultricies turpis aliquam ac. In et consequat velit. Nunc pulvinar metus ut lacinia fermentum. Nunc ultrices odio id.",
            'transportation' => "Autobus, zrakoplov, vlak",
            'expenses_responsible' => "PSI",
            'expenses_explanation' => "Aliquam fringilla vulputate auctor. Donec et justo et sapien viverra viverra finibus vel odio. Proin tempus sapien leo, ut finibus lorem imperdiet.",
            'applicant_signature' => "data:image/png;base64,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"
        ]);
    }
}
