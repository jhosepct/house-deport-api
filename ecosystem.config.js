module.exports = {
  apps : [{
    name: "next-app",
    script: "npm",
    args: "start",
    cwd: "/Desarollo/BACKEND/house-deport-api",
    watch: true,
    env: {
      NODE_ENV: "production",
    }
  }]
};