declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'development' | 'test';
    readonly PORT: number;
    readonly CORS_ORIGIN: string;
    readonly HOST: string;
    readonly ACCESS_TOKEN_EXPIRE: string;
    readonly ACCESS_TOKEN_SECRET: string;
    readonly MYSQL_DATABASE: string;
    readonly MYSQL_ROOT_PASSWORD: string;
    readonly MYSQL_USER: string;
    readonly MYSQL_PASSWORD: string;
    readonly MYSQL_PORT: number;
    readonly DATABASE_URL: string;
  }
}
