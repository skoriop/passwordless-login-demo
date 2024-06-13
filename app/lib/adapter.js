export function CustomAdapter(prisma, req) {
	const p = prisma;
	return {
		createUser: ({ id: _id, ...data }) => {
			return p.user.create({ data });
		},
		getUser: (id) => p.user.findUnique({ where: { id } }),
		getUserByEmail: (email) => p.user.findUnique({ where: { email } }),
		async getUserByAccount(provider_providerAccountId) {
			const account = await p.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true },
			});
			return account?.user ?? null;
		},
		updateUser: ({ id, ...data }) => p.user.update({ where: { id }, data }),
		deleteUser: (id) => p.user.delete({ where: { id } }),
		linkAccount: (data) => p.account.create({ data }),
		unlinkAccount: (provider_providerAccountId) =>
			p.account.delete({
				where: { provider_providerAccountId },
			}),
		async getSessionAndUser(sessionToken) {
			const userAndSession = await p.session.findUnique({
				where: { sessionToken },
				include: { user: true },
			});
			if (!userAndSession) return null;
			const { user, ...session } = userAndSession;
			return { user, session };
		},
		createSession: (data) => p.session.create({ data }),
		updateSession: (data) =>
			p.session.update({
				where: { sessionToken: data.sessionToken },
				data,
			}),
		deleteSession: (sessionToken) =>
			p.session.delete({ where: { sessionToken } }),
		async createVerificationToken(data) {
			const metadata = {
				ip: req.headers?.get("x-forwarded-for"),
				userAgent: req.headers?.get("user-agent"),
			};
			const verificationToken = await p.verificationToken.create({
				data: { ...data, ...metadata },
			});
			if (verificationToken.id) delete verificationToken.id;
			return verificationToken;
		},
		async useVerificationToken(identifier_token, params) {
			try {
				const metadata = {
					ip: params.headers["x-forwarded-for"],
					userAgent: params.headers["user-agent"],
				};
				const verificationToken = await p.verificationToken.delete({
					where: { identifier_token },
				});
				if (verificationToken.id) delete verificationToken.id;
				if (verificationToken.ip !== metadata.ip || verificationToken.userAgent !== metadata.userAgent) {
					throw new Error("Invalid metadata");
				}
				return verificationToken;
			} catch (error) {
				if (error.code === "P2025") return null;
				throw error;
			}
		},
		async getAccount(providerAccountId, provider) {
			return p.account.findFirst({
				where: { providerAccountId, provider },
			});
		},
		async createAuthenticator(authenticator) {
			return p.authenticator.create({
				data: authenticator,
			});
		},
		async getAuthenticator(credentialID) {
			return p.authenticator.findUnique({
				where: { credentialID },
			});
		},
		async listAuthenticatorsByUserId(userId) {
			return p.authenticator.findMany({
				where: { userId },
			});
		},
		async updateAuthenticatorCounter(credentialID, counter) {
			return p.authenticator.update({
				where: { credentialID },
				data: { counter },
			});
		},
	};
}
