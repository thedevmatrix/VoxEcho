import {z} from "zod";

export const envSchema = z.object ({
    PORT: z.string().default('3000'),
    POSTGRES_DATABASE: z.string(),
    POSTGRES_PORT: z.string().default('5432'),
    POSTGRES_USER:z.string(),
    POSTGRES_PASSWORD:z.string(),
    JWT_SECRET: z.string().min(1, "JWT_SECRET required "),
    JWT_EXPIRES_IN: z.string(),
    DEST: z.string()

});