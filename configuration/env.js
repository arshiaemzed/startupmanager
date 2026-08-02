const requiredEnv = [
  "DATABASE_USER",
  "DATABASE_HOST",
  "DATABASE_NAME",
  "DATABASE_PASSWORD",
  "DATABASE_PORT",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
];

for (const element in requiredEnv) {
  if (!process.env[requiredEnv[element]]) {
    console.log(
      `Missing enviroment variable: ${process.env[requiredEnv[element]]}`,
    );
    process.exit(1);
  }
}
