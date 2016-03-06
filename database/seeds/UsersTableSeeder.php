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
            'email' => 'user0@app.com',
            'password' => bcrypt('user0'),
            'type' => 0
        ]);

        User::create([
            'email' => 'user1@app.com',
            'password' => bcrypt('user1'),
            'type' => 1
        ]);

        User::create([
            'email' => 'user2@app.com',
            'password' => bcrypt('user2'),
            'type' => 2
        ]);

        User::create([
            'email' => 'user3@app.com',
            'password' => bcrypt('user3'),
            'type' => 3
        ]);
    }
}
