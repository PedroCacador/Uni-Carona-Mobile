import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
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

const statusConfig = {
  ativa: {
    label: 'Disponível',
    badge: styles.statusAtiva,
    badgeText: styles.statusAtivaText,
    dot: styles.statusAtivaDot,
  },
  completa: {
    label: 'Completa',
    badge: styles.statusCompleta,
    badgeText: styles.statusCompletaText,
    dot: styles.statusCompletaDot,
  },
  cancelada: {
    label: 'Cancelada',
    badge: styles.statusCancelada,
    badgeText: styles.statusCanceladaText,
    dot: styles.statusCanceladaDot,
  },
};

const CardCarona: React.FC<CardCaronaProps> = ({ carona, onVerDetalhes }) => {
  const getVagas = () => carona.vagas ?? carona.vagasDisponiveis ?? 0;
  const getAvaliacao = () => carona.motorista.avaliacao ?? carona.motorista.avaliacaoMedia ?? 0;
  const getHorario = () => carona.horario ?? carona.horarioPartida ?? '';

  const formatarData = (data: string) => {
    try {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return data;
    }
  };

  const isDisponivel = () => {
    if (carona.status === 'cancelada' || carona.status === 'completa') return false;
    return getVagas() > 0;
  };

  const getInitials = () => (
    carona.motorista.nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name[0])
      .join('')
      .toUpperCase() || 'UC'
  );

  const renderEstrelas = (avaliacao: number) => (
    <View style={styles.avaliacao}>
      <View style={styles.estrelas}>
        {Array.from({ length: 5 }).map((_, index) => (
          <FontAwesome
            key={index}
            name="star"
            size={11}
            color={index < Math.floor(avaliacao) ? '#E8EE3B' : '#E2E8F0'}
          />
        ))}
      </View>
      <Text style={styles.avaliacaoTexto}>({avaliacao.toFixed(1)})</Text>
    </View>
  );

  const vagas = getVagas();
  const avaliacao = getAvaliacao();
  const horario = getHorario();
  const status = carona.status ?? 'ativa';
  const statusStyles = statusConfig[status] ?? statusConfig.ativa;
  const disponivel = isDisponivel();

  return (
    <View style={[styles.card, disponivel && styles.cardDisponivel]}>
      <View style={[styles.accentBar, disponivel && styles.accentBarActive]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.driverBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>

            <View style={styles.driverText}>
              <Text style={styles.motoristaNome} numberOfLines={1}>
                {carona.motorista.nome}
              </Text>
              <Text style={styles.universidade} numberOfLines={1}>
                {carona.motorista.universidade}
              </Text>
              {avaliacao > 0 ? renderEstrelas(avaliacao) : null}
            </View>
          </View>

          <View style={[styles.statusBadge, statusStyles.badge]}>
            <View style={[styles.statusDot, statusStyles.dot]} />
            <Text style={[styles.statusText, statusStyles.badgeText]}>
              {statusStyles.label}
            </Text>
          </View>
        </View>

        <View style={styles.rotaBox}>
          <View style={styles.rotaTimeline}>
            <View style={styles.origemDot} />
            <View style={styles.rotaLine} />
            <Feather name="map-pin" size={13} color="#0A44B1" />
          </View>

          <View style={styles.rotaTexts}>
            <View>
              <Text style={styles.rotaLabel}>Saída</Text>
              <Text style={styles.rotaOrigem} numberOfLines={1}>
                {carona.origem}
              </Text>
            </View>
            <View>
              <Text style={styles.rotaLabel}>Chegada</Text>
              <Text style={styles.rotaDestino} numberOfLines={1}>
                {carona.destino}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoChip}>
            <Feather name="calendar" size={14} color="#0A44B1" />
            <Text style={styles.infoText} numberOfLines={2}>
              {formatarData(carona.data)}
            </Text>
          </View>

          {horario ? (
            <View style={styles.infoChip}>
              <Feather name="clock" size={14} color="#0A44B1" />
              <Text style={styles.infoText} numberOfLines={1}>
                {horario}
              </Text>
            </View>
          ) : null}

          <View style={[
            styles.infoChip,
            styles.vagasChip,
            vagas > 0 ? styles.vagasChipDisponivel : styles.vagasChipIndisponivel,
            !horario && styles.vagasChipSemHorario,
          ]}>
            <Feather
              name="users"
              size={14}
              color={vagas > 0 ? '#059669' : '#EF4444'}
            />
            <Text style={[
              styles.vagasText,
              vagas > 0 ? styles.vagasTextDisponivel : styles.vagasTextIndisponivel,
            ]}>
              {vagas > 0 ? `${vagas} vaga${vagas > 1 ? 's' : ''}` : 'Esgotado'}
            </Text>
          </View>
        </View>

        {carona.observacoes ? (
          <View style={styles.observacoes}>
            <Feather name="alert-circle" size={14} color="#0A44B1" />
            <Text style={styles.observacoesTexto} numberOfLines={3}>
              {carona.observacoes}
            </Text>
          </View>
        ) : null}

        {carona.status === 'cancelada' ? (
          <View style={styles.canceladoBox}>
            <Feather name="alert-triangle" size={14} color="#EF4444" />
            <Text style={styles.canceladoTexto}>Esta carona foi cancelada</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.precoBlock}>
            <Text style={styles.precoLabel}>Por pessoa</Text>
            <Text style={styles.preco}>R$ {carona.preco.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !disponivel && styles.buttonDisabled]}
            onPress={() => disponivel && onVerDetalhes(carona.id)}
            disabled={!disponivel}
            activeOpacity={0.82}
          >
            <Text style={[styles.buttonText, !disponivel && styles.buttonTextDisabled]}>
              {disponivel ? 'Ver detalhes' : 'Indisponível'}
            </Text>
            {disponivel ? (
              <Feather name="arrow-right" size={15} color="#FFFFFF" />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CardCarona;
