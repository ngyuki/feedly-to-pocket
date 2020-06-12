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
    ssm_parameter: env('SSM_PARAMETER'),
    feedly_client_id: env('FEEDLY_CLIENT_ID'),
    feedly_client_secret: env('FEEDLY_CLIENT_SECRET'),
    post_target_url: env('POST_TARGET_URL'),
    post_field_name: env('POST_FIELD_NAME'),
} as const;
