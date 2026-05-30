import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome } from '@expo/vector-icons';
import CardCarona, { type Carona } from '../../components/CardCarona';
import api from '../../services/api';
import {
  caronaApi,
  StatusCarona,
  type Carona as ApiCarona,
  type CaronaFilters,
} from '../../services/caronaApi';
import { styles } from './styles';

const USER_STORAGE_KEY = '@unicarona_user';

const ListagemCaronas: React.FC = () => {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;
  const isTablet = width >= 768;
  const isWide = width >= 1024;

  const [caronasFiltradas, setCaronasFiltradas] = useState<Carona[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [data, setData] = useState('');
  const [apenasComVagas, setApenasComVagas] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [selectedCarona, setSelectedCarona] = useState<Carona | null>(null);
  const [reservaLoading, setReservaLoading] = useState(false);

  const temFiltrosAtivos = Boolean(origem || destino || data || apenasComVagas);

  const totalLabel = useMemo(
    () => (caronasFiltradas.length === 1 ? 'carona encontrada' : 'caronas encontradas'),
    [caronasFiltradas.length],
  );

  const buscarCaronas = async () => {
    setLoading(true);
    setErro('');

    try {
      const filters: CaronaFilters = {
        apenasFuturas: true,
        status: StatusCarona.AGENDADA,
      };

      if (origem) filters.origem = origem;
      if (destino) filters.destino = destino;
      if (apenasComVagas) filters.vagasDisponiveis = 1;

      const caronasApi = await caronaApi.buscarDisponiveis(filters);

      const caronasConvertidas: Carona[] = caronasApi.map((caronaApi: ApiCarona) => {
        const dataSaida = new Date(caronaApi.dataHoraSaida);
        const status =
          caronaApi.status === StatusCarona.CANCELADA
            ? 'cancelada'
            : caronaApi.status === StatusCarona.FINALIZADA
              ? 'completa'
              : 'ativa';

        return {
          id: caronaApi.id,
          motorista: {
            id: caronaApi.motoristaId,
            nome: caronaApi.motorista?.nome ?? 'Desconhecido',
            universidade: caronaApi.motorista?.curso ?? 'Faminas',
            avaliacao: (caronaApi.motorista as any)?.mediaAvaliacao ?? 5,
          },
          origem: caronaApi.origem,
          destino: caronaApi.destino,
          data: dataSaida.toISOString().split('T')[0],
          horario: dataSaida.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          vagas: caronaApi.assentosDisponiveis,
          preco: Number(caronaApi.valorAjuda ?? 0),
          observacoes: (caronaApi as any).observacoes || '',
          status,
        };
      });

      let resultados = caronasConvertidas;
      if (data.length === 10) {
        const [day, month, year] = data.split('-');
        const dataFiltroApi = `${year}-${month}-${day}`;
        resultados = resultados.filter((carona) => carona.data === dataFiltroApi);
      }
      if (apenasComVagas) resultados = resultados.filter((carona) => (carona.vagas ?? 0) > 0);

      setCaronasFiltradas(resultados);
    } catch (error: any) {
      console.error('Erro ao buscar caronas:', error.response?.data ?? error);
      setErro('Não foi possível carregar as caronas. Verifique sua conexão e tente novamente.');
      setCaronasFiltradas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    buscarCaronas();
  }, [origem, destino, data, apenasComVagas]);

  const onRefresh = () => {
    setRefreshing(true);
    buscarCaronas();
  };

  const handleVerDetalhes = (id: string) => {
    const carona = caronasFiltradas.find((item) => item.id === id);
    if (carona) setSelectedCarona(carona);
  };

  const handleReservar = async () => {
    if (!selectedCarona) return;

    const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (!userStr) {
      Alert.alert('Login necessário', 'Você precisa estar logado para reservar uma carona.');
      return;
    }

    setReservaLoading(true);
    try {
      const user = JSON.parse(userStr);
      await api.post('/reservas', {
        caronaId: selectedCarona.id,
        usuarioId: user.id,
        quantidadePessoas: 1,
      });

      Alert.alert('Reserva solicitada!', 'Acompanhe a solicitação no seu Perfil.');
      setSelectedCarona(null);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao realizar reserva.');
    } finally {
      setReservaLoading(false);
    }
  };

  const limparFiltros = () => {
    setOrigem('');
    setDestino('');
    setData('');
    setApenasComVagas(false);
  };

  const handleDataChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    if (digits.length <= 2) {
      setData(day);
      return;
    }

    if (digits.length <= 4) {
      setData(`${day}-${month}`);
      return;
    }

    setData(`${day}-${month}-${year}`);
  };

  const formatarDataFiltro = (value: string) => {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return day && month && year ? `${day}/${month}/${year}` : value;
  };

  const FieldIcon = ({ name, field }: { name: keyof typeof Feather.glyphMap; field: string }) => (
    <Feather
      name={name}
      size={17}
      color={focusedField === field ? '#0A44B1' : '#94A3B8'}
      style={styles.fieldIcon}
    />
  );

  const renderFilterPill = (
    label: string,
    icon: keyof typeof Feather.glyphMap,
    onPress: () => void,
    highlight = false,
  ) => (
    <View style={[styles.filterPill, highlight && styles.filterPillHighlight]}>
      <Feather name={icon} size={12} color={highlight ? '#6B5E00' : '#0A44B1'} />
      <Text style={[styles.filterPillText, highlight && styles.filterPillTextHighlight]} numberOfLines={1}>
        {label}
      </Text>
      <TouchableOpacity onPress={onPress} hitSlop={8}>
        <Feather name="x" size={12} color={highlight ? '#6B5E00' : '#0A44B1'} />
      </TouchableOpacity>
    </View>
  );

  const renderLoadingSkeleton = () => (
    <View style={[styles.grid, isTablet && styles.gridWide]}>
      {Array.from({ length: isWide ? 6 : 3 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.cardColumn,
            isTablet && styles.cardColumnTablet,
            isWide && styles.cardColumnWide,
          ]}
        >
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonAvatar} />
              <View style={styles.skeletonLines}>
                <View style={styles.skeletonLineLarge} />
                <View style={styles.skeletonLineSmall} />
              </View>
            </View>
            <View style={styles.skeletonRoute} />
            <View style={styles.skeletonInfoRow}>
              <View style={styles.skeletonInfo} />
              <View style={styles.skeletonInfo} />
              <View style={styles.skeletonInfo} />
            </View>
            <View style={styles.skeletonButton} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <View style={styles.heroYellowCircle} />
          <View style={styles.heroInner}>
            <View style={styles.heroTop}>
              <View style={styles.heroTextBlock}>
                <View style={styles.badge}>
                  <Feather name="search" size={12} color="#E8EE3B" />
                  <Text style={styles.badgeText}>Busca em tempo real</Text>
                </View>
                <Text style={[styles.titulo, isCompact && styles.tituloCompact]}>
                  Caronas disponíveis
                </Text>
                <Text style={styles.subtitulo}>Encontre sua carona universitária perfeita</Text>
              </View>

              {!loading ? (
                <View style={styles.counterBox}>
                  <Text style={styles.counterNumber}>{caronasFiltradas.length}</Text>
                  <Text style={styles.counterText}>{totalLabel}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.filtros}>
            <View style={[styles.filterRow, isTablet && styles.filterRowWide]}>
              <View
                style={[
                  styles.field,
                  focusedField === 'origem' && styles.fieldFocused,
                  isTablet && styles.fieldWide,
                ]}
              >
                <FieldIcon name="map-pin" field="origem" />
                <TextInput
                  placeholder="Origem"
                  placeholderTextColor="#CBD5E1"
                  value={origem}
                  onChangeText={setOrigem}
                  onFocus={() => setFocusedField('origem')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                />
                {origem ? (
                  <TouchableOpacity onPress={() => setOrigem('')} hitSlop={8}>
                    <Feather name="x" size={15} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {isTablet ? (
                <View style={styles.arrowDivider}>
                  <Feather name="arrow-right" size={17} color="#0A44B1" />
                </View>
              ) : null}

              <View
                style={[
                  styles.field,
                  focusedField === 'destino' && styles.fieldFocused,
                  isTablet && styles.fieldWide,
                ]}
              >
                <FieldIcon name="map-pin" field="destino" />
                <TextInput
                  placeholder="Destino"
                  placeholderTextColor="#CBD5E1"
                  value={destino}
                  onChangeText={setDestino}
                  onFocus={() => setFocusedField('destino')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                />
                {destino ? (
                  <TouchableOpacity onPress={() => setDestino('')} hitSlop={8}>
                    <Feather name="x" size={15} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View
                style={[
                  styles.field,
                  focusedField === 'data' && styles.fieldFocused,
                  isTablet && styles.dateFieldWide,
                ]}
              >
                <FieldIcon name="calendar" field="data" />
                <TextInput
                  placeholder="DD-MM-AAAA"
                  placeholderTextColor="#CBD5E1"
                  value={data}
                  onChangeText={handleDataChange}
                  onFocus={() => setFocusedField('data')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                  maxLength={10}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity
                style={[styles.vagasToggle, apenasComVagas && styles.vagasToggleActive]}
                onPress={() => setApenasComVagas((value) => !value)}
                activeOpacity={0.82}
              >
                <Feather name="users" size={16} color={apenasComVagas ? '#0A44B1' : '#64748B'} />
                <Text style={[styles.vagasToggleText, apenasComVagas && styles.vagasToggleTextActive]}>
                  Com vagas
                </Text>
              </TouchableOpacity>

              {temFiltrosAtivos ? (
                <TouchableOpacity style={styles.clearButton} onPress={limparFiltros} activeOpacity={0.82}>
                  <Feather name="x" size={15} color="#64748B" />
                  <Text style={styles.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {temFiltrosAtivos ? (
            <View style={styles.activeFilters}>
              {origem ? renderFilterPill(`De: ${origem}`, 'map-pin', () => setOrigem('')) : null}
              {destino ? renderFilterPill(`Para: ${destino}`, 'map-pin', () => setDestino('')) : null}
              {data ? renderFilterPill(formatarDataFiltro(data), 'calendar', () => setData('')) : null}
              {apenasComVagas
                ? renderFilterPill('Apenas com vagas', 'users', () => setApenasComVagas(false), true)
                : null}
            </View>
          ) : null}

          {loading ? (
            renderLoadingSkeleton()
          ) : erro ? (
            <View style={styles.stateBlock}>
              <View style={styles.errorIcon}>
                <Feather name="alert-circle" size={29} color="#F87171" />
              </View>
              <Text style={styles.stateTitle}>Ops! Algo deu errado</Text>
              <Text style={styles.stateText}>{erro}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={buscarCaronas} activeOpacity={0.82}>
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : caronasFiltradas.length === 0 ? (
            <View style={styles.stateBlock}>
              <View style={styles.emptyIcon}>
                <FontAwesome name="car" size={38} color="rgba(10,68,177,0.4)" />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma carona encontrada</Text>
              <Text style={styles.stateText}>
                {temFiltrosAtivos
                  ? 'Tente ajustar os filtros para encontrar mais resultados.'
                  : 'Não há caronas disponíveis no momento. Volte mais tarde.'}
              </Text>
              {temFiltrosAtivos ? (
                <TouchableOpacity style={styles.emptyClearButton} onPress={limparFiltros} activeOpacity={0.82}>
                  <Text style={styles.emptyClearText}>Limpar filtros</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View style={[styles.grid, isTablet && styles.gridWide]}>
              {caronasFiltradas.map((carona) => (
                <View
                  key={carona.id}
                  style={[
                    styles.cardColumn,
                    isTablet && styles.cardColumnTablet,
                    isWide && styles.cardColumnWide,
                  ]}
                >
                  <CardCarona carona={carona} onVerDetalhes={handleVerDetalhes} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={Boolean(selectedCarona)}
        transparent
        animationType="fade"
        onRequestClose={() => !reservaLoading && setSelectedCarona(null)}
      >
        {selectedCarona ? (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalhes da Carona</Text>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setSelectedCarona(null)}
                  disabled={reservaLoading}
                >
                  <Feather name="x" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.driverInfo}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>
                      {selectedCarona.motorista.nome
                        .split(' ')
                        .slice(0, 2)
                        .map((name) => name[0])
                        .join('')
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.driverInfoText}>
                    <Text style={styles.modalDriverName}>{selectedCarona.motorista.nome}</Text>
                    <Text style={styles.modalUniversity}>{selectedCarona.motorista.universidade}</Text>
                    <View style={styles.modalRating}>
                      <FontAwesome name="star" size={13} color="#E8EE3B" />
                      <Text style={styles.modalRatingText}>
                        {(selectedCarona.motorista.avaliacao ?? 5).toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalRoute}>
                  <View style={styles.modalRouteLine} />
                  <View style={styles.modalRoutePoint}>
                    <View style={styles.modalOriginIcon}>
                      <View style={styles.modalOriginDot} />
                    </View>
                    <View style={styles.modalRouteTextBlock}>
                      <Text style={styles.modalRouteLabel}>Origem</Text>
                      <Text style={styles.modalRouteText}>{selectedCarona.origem}</Text>
                    </View>
                  </View>

                  <View style={styles.modalRoutePoint}>
                    <View style={styles.modalDestinationIcon}>
                      <Feather name="map-pin" size={17} color="#0A44B1" />
                    </View>
                    <View style={styles.modalRouteTextBlock}>
                      <Text style={styles.modalRouteLabel}>Destino</Text>
                      <Text style={styles.modalRouteDestination}>{selectedCarona.destino}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalInfoGrid}>
                  <View style={styles.modalInfoCard}>
                    <Text style={styles.modalInfoLabel}>Data da viagem</Text>
                    <View style={styles.modalInfoValueRow}>
                      <Feather name="calendar" size={16} color="#0A44B1" />
                      <Text style={styles.modalInfoValue}>{formatarDataFiltro(selectedCarona.data)}</Text>
                    </View>
                  </View>
                  <View style={styles.modalInfoCard}>
                    <Text style={styles.modalInfoLabel}>Horário de saída</Text>
                    <View style={styles.modalInfoValueRow}>
                      <Feather name="clock" size={16} color="#0A44B1" />
                      <Text style={styles.modalInfoValue}>{selectedCarona.horario || 'Combinar'}</Text>
                    </View>
                  </View>
                  <View style={styles.modalInfoCard}>
                    <Text style={styles.modalInfoLabel}>Vagas livres</Text>
                    <View style={styles.modalInfoValueRow}>
                      <Feather name="users" size={16} color="#0A44B1" />
                      <Text style={styles.modalInfoValue}>{selectedCarona.vagas ?? 0} lugares</Text>
                    </View>
                  </View>
                  <View style={styles.modalInfoCard}>
                    <Text style={styles.modalInfoLabel}>Valor por pessoa</Text>
                    <Text style={styles.modalPrice}>R$ {selectedCarona.preco.toFixed(2)}</Text>
                  </View>
                </View>

                {selectedCarona.observacoes ? (
                  <View style={styles.modalWarning}>
                    <View style={styles.modalWarningTitle}>
                      <Feather name="alert-circle" size={15} color="#0A44B1" />
                      <Text style={styles.modalWarningLabel}>Avisos do Motorista</Text>
                    </View>
                    <Text style={styles.modalWarningText}>{selectedCarona.observacoes}</Text>
                  </View>
                ) : null}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[
                    styles.reserveButton,
                    (reservaLoading || !selectedCarona.vagas) && styles.reserveButtonDisabled,
                  ]}
                  onPress={handleReservar}
                  disabled={reservaLoading || !selectedCarona.vagas}
                  activeOpacity={0.82}
                >
                  {reservaLoading ? (
                    <>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={styles.reserveButtonText}>Processando reserva...</Text>
                    </>
                  ) : (
                    <Text style={styles.reserveButtonText}>Reservar Carona</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.modalFooterNote}>
                  Você será notificado assim que o motorista confirmar.
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
  );
};

export default ListagemCaronas;
