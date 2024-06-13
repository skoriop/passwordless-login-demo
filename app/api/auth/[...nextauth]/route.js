import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "@prisma/client";
import { CustomAdapter } from "@/app/lib/adapter";

const prisma = new PrismaClient();

async function auth(req, res) {
	return await NextAuth(req, res, {
		providers: [
			EmailProvider({
				server: {
					host: process.env.SMTP_HOST,
					port: process.env.SMTP_PORT,
					auth: {
						user: process.env.SMTP_USER,
						pass: process.env.SMTP_PASSWORD,
					},
				},
				from: process.env.SMTP_FROM,
				maxAge: 5 * 60,
			}),
		],
		adapter: CustomAdapter(prisma, req),
	});
}

export { auth as GET, auth as POST };
