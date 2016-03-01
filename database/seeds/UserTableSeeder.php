<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'User Zero',
            'email' => 'user0@app.com',
            'password' => 'user0',
            'type' => 0
        ]);

        User::create([
            'name' => 'User One',
            'email' => 'user1@app.com',
            'password' => 'user1',
            'type' => 1
        ]);

        User::create([
            'name' => 'User Two',
            'email' => 'user2@app.com',
            'password' => 'user2',
            'type' => 2
        ]);

        User::create([
            'name' => 'User Three',
            'email' => 'user3@app.com',
            'password' => 'user3',
            'type' => 3
        ]);
    }
}
