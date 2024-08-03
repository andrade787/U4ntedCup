import React from 'react';

export default function Rules() {
  return (
    <div className="bg-zinc-800 rounded-xl">
      <h2 className="font-semibold text-2xl mb-2 bg-zinc-900 p-4 rounded-t-xl">Regulamento do Campeonato</h2>
      <div className="p-4 space-y-4 text-zinc-300">
        <div>
          <h3 className="font-semibold">Estrutura do Campeonato</h3>
          <p>O campeonato será dividido em fase de grupos e playoffs.</p>
        </div>
        <div>
          <h3 className="font-semibold">Fase de Grupos</h3>
          <p>A fase de grupos consistirá de 2 grupos com 5 times cada. Os 2 melhores times de cada grupo avançarão para os playoffs. As partidas serão realizadas no formato MD1.</p>
        </div>
        <div>
          <h3 className="font-semibold">Critério de Desempate</h3>
          <p>Em caso de empate em pontos, o critério de desempate será o resultado do confronto direto entre os times empatados.</p>
        </div>
        <div>
          <h3 className="font-semibold">W.O. na Fase de Grupos</h3>
          <p>Os jogos serão realizados em horários previamente acordados e confirmados pelos capitães das equipes. O tempo limite para que todos os membros entrem na sala é de 7 minutos após o horário marcado, caso contrário, será decretado W.O.</p>
        </div>
        <div>
          <h3 className="font-semibold">Transmissões na Fase de Grupos</h3>
          <p>Devido à possibilidade de jogos simultâneos, nem todas as partidas serão transmitidas. No entanto, garantiremos que todos os times sejam transmitidos ao menos uma vez.</p>
        </div>
        <div>
          <h3 className="font-semibold">Horários Disponíveis para Jogos da Fase de Grupos</h3>
          <ul className="list-disc list-inside">
            <li>Segunda a quinta: 19h, 20h, 21h, 22h</li>
            <li>Sexta: 19h, 20h, 21h, 22h, 23h</li>
            <li>Sábado: 15h, 16h, 17h, 18h</li>
          </ul>
          <p>Permitimos até 3 jogos simultâneos por horário.</p>
        </div>
        <div>
          <h3 className="font-semibold">Agendamento dos Jogos</h3>
          <p>Os capitães agendarão os jogos através de um grupo no WhatsApp, com um membro da comissão para cada grupo.</p>
        </div>
        <div>
          <h3 className="font-semibold">Playoffs</h3>
          <p>Os playoffs seguirão o formato padrão de semifinais e final, todas as partidas serão no formato MD3. O primeiro colocado do grupo A enfrentará o segundo do grupo B, e vice-versa.</p>
        </div>
        <div>
          <h3 className="font-semibold">Agendamento dos Playoffs</h3>
          <p>As partidas dos playoffs terão horários definidos pela organização:</p>
          <ul className="list-disc list-inside">
            <li>Sábado: 19h (1ª semifinal)</li>
            <li>Domingo: 15h (2ª semifinal), 18h (Final)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Inscrição</h3>
          <p>Os jogadores devem se registrar em nosso site e formar uma equipe para participar. Cada time pode ter até 7 jogadores e 1 coach. O pagamento da inscrição será realizado via PIX, com o prazo de até 10 dias antes do início do campeonato.</p>
        </div>
        <div>
          <h3 className="font-semibold">Cancelamento</h3>
          <p>O prazo máximo para cancelamento é de 8 dias antes do início do campeonato.</p>
        </div>
        <div>
          <h3 className="font-semibold">Transmissões e VODs</h3>
          <p>As transmissões ao vivo terão um atraso de 50 segundos. As gravações das partidas estarão disponíveis no canal da Twitch. Também publicaremos conteúdo no YouTube, TikTok e Instagram, incluindo partidas completas, melhores momentos e jogadas destacadas.</p>
        </div>
        <div>
          <h3 className="font-semibold">Regras Durante a Partida</h3>
          <ul className="list-disc list-inside">
            <li>O limite de pausa é de 7 minutos. Se um jogador não conseguir retornar dentro desse tempo, a partida continuará.</li>
            <li>Respeito no chat é obrigatório, sob pena de expulsão do time.</li>
            <li>É possível retornar um round apenas se nenhum dano foi causado.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
