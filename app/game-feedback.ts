export type FeedbackCategory =
	| "perfect"
	| "almost"
	| "close"
	| "early"
	| "late";

// All thresholds and times are in hundredths of a second.
export function feedbackCategory(time: number): FeedbackCategory {
	const error = Math.abs(time - 500);
	if (error === 0) return "perfect";
	if (error <= 10) return "almost";
	if (error <= 50) return "close";
	return time < 500 ? "early" : "late";
}

export const feedbackMessages = {
	perfect: [
		"Pode fechar o jogo. O relógio pediu sua bênção.",
		"Cinco cravado. Nem o VAR achou defeito.",
		"Até a capivara levantou pra aplaudir.",
		"Essa merece a última fatia da noite de jogos.",
		"O Brasil do Brasil acaba de acertar o relógio.",
		"Precisão de quem tira o pão de queijo no ponto.",
		"Já pode sincronizar o horário de Brasília por você.",
		"Sextou? Não. Quintou com precisão.",
		"Seu dedo acaba de ganhar um selo do Inmetro imaginário.",
		"A IA tentou explicar. Acabou pedindo aula.",
		"Esse clique veio com firma reconhecida.",
		"Pode soltar o confete. Hoje o centésimo é seu.",
		"O relógio piscou primeiro. Você ganhou.",
		"Cinco segundos de pura arte brasileira.",
		"O café esfriou, mas seu talento tá no ponto.",
		"Alguém em Floripa acabou de gritar: aí, sim!",
		"A capivara tá tranquila. Você tá cirúrgico.",
		"Esse resultado vai pro grupo sem precisar de contexto.",
		"Se fosse churrasco, você seria responsável pelo ponto.",
		"É penta! De segundos. Exatos. Pode comemorar.",
	],
	almost: [
		"O VAR tá procurando um ângulo que te favoreça.",
		"Foi por um fiapinho de queijo no pão de queijo.",
		"Até a capivara fez aquela cara de quase.",
		"Faltou só o temperinho de precisão.",
		"O cinco passou tão perto que deu um oi.",
		"Essa bateu na trave e saiu pedindo desculpa.",
		"Um centésimo aqui, um suspiro coletivo ali.",
		"Seu dedo e o cinco estão quase namorando.",
		"A pizza tava no ponto. Faltou combinar com o relógio.",
		"Não foi gol, mas já levantou a torcida.",
		"Quase virou figurinha de comemoração.",
		"O relógio tá te fazendo charme.",
		"A IA diria 99% de confiança. Você sentiu o 1%.",
		"A distância foi menor que a pausa pro cafezinho.",
		"Já dá pra ouvir o confete sendo aberto.",
		"Quase cravou. O grupo já tava digitando parabéns.",
		"O centésimo deu uma escapadinha na Beira-Mar.",
		"Foi no detalhe. Nem cabe um grão de farofa aí.",
		"Essa doeu mais que perder a última coxinha.",
		"O cinco ficou a uma piscadinha de distância.",
	],
	close: [
		"Tá pegando o ritmo. Já pode ensaiar o passinho.",
		"O caminho é esse. Só falta estacionar no cinco.",
		"Bom aquecimento. A noite de jogos promete.",
		"A capivara acredita. E ela nem se levanta à toa.",
		"Tá mais perto que a próxima pausa pro café.",
		"O pastel tá quase pronto. Segura a ansiedade.",
		"Falta ajustar o sal desse centésimo.",
		"O cinco já te reconheceu de vista.",
		"Tá chegando. Sem precisar perguntar se falta muito.",
		"Essa tentativa já merece um café de incentivo.",
		"Você achou a rua. Agora procura o número cinco.",
		"Tá no bairro certo. O cinco mora logo ali.",
		"Se fosse futebol, essa já contava como chance clara.",
		"Boa! Mais uma rodada e a pizza nem esfria.",
		"O relógio já tá ficando preocupado com você.",
		"Quase no ponto do brigadeiro. Continua mexendo.",
		"Seu dedo tá negociando com o universo.",
		"Tá faltando aquele capricho de vó no acabamento.",
		"A concentração veio. A precisão tá a caminho.",
		"Bora que bora. O cinco não vai se acertar sozinho.",
	],
	early: [
		"Calma, calabreso. O cinco ainda tava chegando.",
		"Você saiu antes de cantarem os parabéns.",
		"Essa pizza ainda tava no forno.",
		"Nem o café ficou pronto nesse tempo.",
		"Que pressa é essa? A capivara tá decepcionada.",
		"Você sextou antes de chegar a quinta.",
		"O pão de queijo saiu cru dessa vez.",
		"O cinco nem tirou o chinelo e você já foi embora.",
		"Foi embora antes da foto da noite de jogos.",
		"Você pulou a introdução e o resto do jogo junto.",
		"Ansiedade pediu pra apertar. Você obedeceu.",
		"O cronômetro tava só ajeitando a cadeira.",
		"Chegou tão cedo que vai ter que ajudar a arrumar.",
		"Nem deu tempo de perguntar: bora sushi?",
		"O churrasco ainda tava acendendo a brasa.",
		"A reunião nem começou e você já mandou valeu, pessoal.",
		"O cinco pediu um minutinho. Você não deu nem isso.",
		"Você arrancou na frente. O alvo ficou pra depois.",
		"Calma. O botão não vai fugir pra praia.",
		"Você apertou como se a última coxinha estivesse acabando.",
	],
	late: [
		"Foi buscar um café e esqueceu o relógio ligado?",
		"A capivara já deu a volta na lagoa e voltou.",
		"O cinco passou. Mandou lembranças.",
		"Já deu tempo de discutir onde pedir a pizza.",
		"Esse cinco pegou trânsito na ponte.",
		"O pão de queijo virou patrimônio arqueológico.",
		"A noite de jogos acabou e você tá embaralhando.",
		"Você deixou o relógio marinar.",
		"A IA terminou o curso enquanto você contava.",
		"O cafezinho já pediu pra esquentar de novo.",
		"Você foi de horário de Brasília pra horário de churrasco.",
		"Era cinco segundos, não cinco minutinhos de reunião.",
		"Até o grupo que nunca decide já escolheu o restaurante.",
		"Você esperou o mel com pimenta chegar na pizza.",
		"O cinco foi pra praia. Deixou você tomando conta.",
		"Essa tentativa veio no fuso do depois eu vejo.",
		"O relógio já tava perguntando se podia ir embora.",
		"Você foi fazer uma pausa e voltou no próximo episódio.",
		"Deu tempo de lavar o copo da última rodada.",
		"Quintou, sextou e você ainda contando.",
	],
} as const satisfies Record<FeedbackCategory, readonly string[]>;

// A separate deck per category gives every line a turn before repeating.
// Selection happens only when a round finishes, never during a render.
export function createFeedbackPicker(random: () => number = Math.random) {
	const decks = new Map<FeedbackCategory, string[]>();
	const previous = new Map<FeedbackCategory, string>();
	return (time: number): string => {
		const category = feedbackCategory(time);
		let deck = decks.get(category);
		if (!deck?.length) {
			deck = [...feedbackMessages[category]];
			decks.set(category, deck);
		}
		// Also avoid repeating the last draw when starting a fresh deck.
		const candidates = deck.filter(
			(message) => message !== previous.get(category),
		);
		const message = candidates[Math.floor(random() * candidates.length)];
		deck.splice(deck.indexOf(message), 1);
		previous.set(category, message);
		return message;
	};
}
