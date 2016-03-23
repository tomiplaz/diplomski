<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Tomislav',
            'surname' => 'Plazonić',
            'email' => 'tomo@app.com',
            'password' => bcrypt('tomo'),
            'type' => 0
        ]);

        User::create([
            'name' => 'Tamara',
            'surname' => 'Miljuš',
            'email' => 'tami@app.com',
            'password' => bcrypt('tami'),
            'type' => 0
        ]);

        User::create([
            'name' => 'User',
            'surname' => 'One',
            'email' => 'user1@app.com',
            'password' => bcrypt('user1'),
            'type' => 1
        ]);

        User::create([
            'name' => 'User',
            'surname' => 'Two',
            'email' => 'user2@app.com',
            'password' => bcrypt('user2'),
            'type' => 2
        ]);

        User::create([
            'name' => 'User',
            'surname' => 'Three',
            'email' => 'user3@app.com',
            'password' => bcrypt('user3'),
            'type' => 3
        ]);
    }
}
