<?php

namespace ATLauncher\Providers;

use Carbon\Carbon;
use Laravel\Passport\Passport;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Mockery\Generator\StringManipulation\Pass\Pass;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'ATLauncher\Model' => 'ATLauncher\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Passport::pruneRevokedTokens();

        Passport::enableImplicitFlow();

        Passport::tokensExpireIn(Carbon::now()->addDays(15));

        Passport::tokensCan([
            'self:read' => 'Read own user credentials (except password)',
            'self:write' => 'Change own user credentials (including password)',
            'users:read' => 'Read other users credentials (except password)',
            'users:write' => 'Change other users credentials (including password)',
        ]);
    }
}
