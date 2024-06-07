"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const IndexPage = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<div className="h-full flex flex-row items-center justify-center text-5xl">
				Loading...
			</div>
		);
	}

	if (session) {
		return (
			<div className="h-full flex flex-col items-center justify-center gap-12">
				<div className="text-4xl">
					Hello, {session.user?.email ?? session.user?.name}!
				</div>
				<button
					className="text-2xl border rounded-lg py-2 px-4"
					onClick={() => signOut()}
				>
					Sign out
				</button>
			</div>
		);
	} else {
		return (
			<div className="h-full flex flex-col items-center justify-center gap-12">
				<div className="text-4xl">You are not logged in!</div>
				<button
					className="text-2xl border rounded-lg py-2 px-4"
					onClick={() => signIn()}
				>
					Sign in
				</button>
			</div>
		);
	}
};

export default IndexPage;
