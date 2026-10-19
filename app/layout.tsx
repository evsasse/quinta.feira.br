import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "quinta. — Você tem o timing?",
	description:
		"Pare o relógio em exatamente 5 segundos. Um jogo simples de timing e precisão: aperte espaço para começar e de novo para parar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}
