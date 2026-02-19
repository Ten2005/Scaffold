import { env } from "@shared/config";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
	createBrowserClient(env.supabase.url, env.supabase.publishableKey);
