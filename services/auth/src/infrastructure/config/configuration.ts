export default () => ({
  api: {
    port: parseInt(process.env.API_PORT!, 10),
    isProduction: process.env.NODE_ENV === 'production',
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
