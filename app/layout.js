import { Inter } from "next/font/google";
import "./globals.css";

import NextAuthProvider from "./layouts/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} w-screen h-screen`}>
				<NextAuthProvider>{children}</NextAuthProvider>
			</body>
		</html>
	);
}
