import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Scaffold",
	description:
		"Learn from daily curiosities. Plan with AI, get roadmaps and materials, stay supported.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">{children}</body>
		</html>
	);
}
