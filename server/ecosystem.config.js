module.exports = {
    apps: [
        {
            name: "NodeServer",
            script: "npm",
            automation: false,
            args: "run deployScript",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
}
