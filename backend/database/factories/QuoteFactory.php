<?php

namespace Database\Factories;

use App\Models\Quote;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuoteFactory extends Factory
{
    protected $model = Quote::class;

    public function definition(): array
    {
        return [
            'client_name' => $this->faker->name(),
            'client_email' => $this->faker->safeEmail(),
            'client_phone' => '+221770000000',
            'client_city' => $this->faker->city(),
            'description' => $this->faker->paragraph(),
            'surface_m2' => $this->faker->randomFloat(2, 10, 200),
            'estimated_budget' => $this->faker->numberBetween(50000, 5000000),
            'status' => 'pending',
        ];
    }
}
