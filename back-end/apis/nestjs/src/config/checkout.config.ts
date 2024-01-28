export default () => ({
    sandbox_environment: Boolean(parseInt(process.env.SANDBOX_ENVIRONMENT)),
    pagbank_token: process.env.PAG_BANK_SANDBOX_BEARER_TOKEN
});