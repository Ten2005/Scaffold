import { env } from "@shared/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(env.database.url, { prepare: false });
export const db = drizzle(client, { schema });
