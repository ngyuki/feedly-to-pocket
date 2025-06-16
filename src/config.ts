function env(name: string): string {
    const val = process.env[name];
    if (!val) {
        throw new Error(`Must be set ${name}`);
    }
    if (val.length === 0) {
        throw new Error(`Must be set ${name}`);
    }
    return val;
}

export const config = {
    ssm_parameter_feedly: env('SSM_PARAMETER_FEEDLY'),
    ssm_parameter_raindrop: env('SSM_PARAMETER_RAINDROP'),
    feedly_client_id: env('FEEDLY_CLIENT_ID'),
    feedly_client_secret: env('FEEDLY_CLIENT_SECRET'),
    raindrop_client_id: env('RAINDROP_CLIENT_ID'),
    raindrop_client_secret: env('RAINDROP_CLIENT_SECRET'),
} as const;
