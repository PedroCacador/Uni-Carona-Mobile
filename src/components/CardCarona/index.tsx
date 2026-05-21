import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styles } from './styles';

export interface Carona {
  id: string;
  motorista: {
    id?: string;
    nome: string;
    universidade: string;
    avaliacao?: number;
    avaliacaoMedia?: number;
  };
  origem: string;
  destino: string;
  data: string;
  horario?: string;
  horarioPartida?: string;
  vagas?: number;
  vagasDisponiveis?: number;
  preco: number;
  observacoes?: string;
  status?: 'ativa' | 'completa' | 'cancelada';
}

interface CardCaronaProps {
  carona: Carona;
  onVerDetalhes: (id: string) => void;
}

const CardCarona: React.FC<CardCaronaProps> = ({ carona, onVerDetalhes }) => {
  const getVagas = () => {
    return carona.vagas ?? carona.vagasDisponiveis ?? 0;
  };

  const getAvaliacao = () => {
    return carona.motorista.avaliacao ?? carona.motorista.avaliacaoMedia ?? 0;
  };

  const getHorario = () => {
    return carona.horario ?? carona.horarioPartida ?? '';
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderEstrelas = (avaliacao: number) => {
    const estrelasCheias = Math.floor(avaliacao);
    const estrelasVazias = 5 - estrelasCheias;
    
    return (
      <View style={styles.avaliacaoEstrelas}>
        {[...Array(estrelasCheias)].map((_, i) => (
          <Text key={`cheia-${i}`} style={styles.estrelaCheia}>★</Text>
        ))}
        {[...Array(estrelasVazias)].map((_, i) => (
          <Text key={`vazia-${i}`} style={styles.estrelaVazia}>☆</Text>
        ))}
        <Text style={styles.avaliacaoTexto}>({avaliacao.toFixed(1)})</Text>
      </View>
    );
  };

  const isDisponivel = () => {
    if (carona.status === 'cancelada') return false;
    if (carona.status === 'completa') return false;
    return getVagas() > 0;
  };

  const vagas = getVagas();
  const avaliacao = getAvaliacao();
  const horario = getHorario();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => isDisponivel() && onVerDetalhes(carona.id)}
      disabled={!isDisponivel()}
    >
      <View style={styles.header}>
        <View style={styles.motoristaInfo}>
          <Text style={styles.motoristaNome} numberOfLines={1}>
            {carona.motorista.nome}
          </Text>
          <Text style={styles.universidade} numberOfLines={1}>
            {carona.motorista.universidade}
          </Text>
          {avaliacao > 0 && renderEstrelas(avaliacao)}
        </View>
        <View style={[
          styles.vagasBadge,
          vagas > 0 ? styles.vagasBadgeDisponivel : styles.vagasBadgeIndisponivel
        ]}>
          <Text style={[
            styles.vagasBadgeText,
            vagas > 0 ? styles.vagasBadgeTextDisponivel : styles.vagasBadgeTextIndisponivel
          ]}>
            {vagas > 0 ? vagas : '0'}
          </Text>
        </View>
      </View>

      <View style={styles.rota}>
        <View style={styles.rotaItem}>
          <View style={[styles.ponto, styles.pontoVerde]} />
          <Text style={styles.rotaTexto}>
            <Text style={styles.rotaLabel}>Origem:</Text> {carona.origem}
          </Text>
        </View>
        <View style={styles.linhaContainer}>
          <View style={styles.linhaDivisor} />
        </View>
        <View style={styles.rotaItem}>
          <View style={[styles.ponto, styles.pontoVermelho]} />
          <Text style={styles.rotaTexto}>
            <Text style={styles.rotaLabel}>Destino:</Text> {carona.destino}
          </Text>
        </View>
      </View>

      <View style={styles.dataHora}>
        <View style={styles.dataHoraItem}>
          <Text style={styles.dataHoraIcon}>📅</Text>
          <Text style={styles.dataHoraTexto}>{formatarData(carona.data)}</Text>
        </View>
        {horario ? (
          <View style={styles.dataHoraItem}>
            <Text style={styles.dataHoraIcon}>🕐</Text>
            <Text style={styles.dataHoraTexto}>{horario}</Text>
          </View>
        ) : null}
      </View>

      {carona.observacoes ? (
        <View style={styles.observacoes}>
          <Text style={styles.observacoesIcon}>ℹ️</Text>
          <Text style={styles.observacoesTexto} numberOfLines={2}>
            {carona.observacoes}
          </Text>
        </View>
      ) : null}

      {carona.status === 'cancelada' ? (
        <View style={styles.statusCancelado}>
          <Text style={styles.statusCanceladoIcon}>🚫</Text>
          <Text style={styles.statusCanceladoTexto}>Carona cancelada</Text>
        </View>
      ) : null}

      <View style={styles.precoVagas}>
        <View>
          <Text style={styles.precoLabel}>Preço por pessoa</Text>
          <Text style={styles.preco}>R$ {carona.preco.toFixed(2)}</Text>
        </View>
        <View style={styles.vagasContainer}>
          <Text style={styles.vagasLabel}>Vagas restantes</Text>
          <View style={styles.vagasRestantesContainer}>
            <Text style={styles.vagasRestantes}>{vagas}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !isDisponivel() && styles.buttonDisabled,
        ]}
        onPress={() => isDisponivel() && onVerDetalhes(carona.id)}
        disabled={!isDisponivel()}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {!isDisponivel() ? 'Indisponível' : 'Ver detalhes'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default CardCarona;
