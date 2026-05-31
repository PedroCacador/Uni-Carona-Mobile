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
import api, { mapsService } from '../../services/api';
import {
  caronaApi,
  StatusCarona,
  type Carona as ApiCarona,
  type CaronaFilters,
} from '../../services/caronaApi';
import { styles } from './styles';
import institutionsGeoJSON from '../../constants/muriae-institutions.json';

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

  // Estado para Criar/Oferecer Carona
  const [oferecerModalAberto, setOferecerModalAberto] = useState(false);
  const [oferecerOrigem, setOferecerOrigem] = useState('');
  const [oferecerDestino, setOferecerDestino] = useState('');
  const [oferecerData, setOferecerData] = useState('');
  const [oferecerHora, setOferecerHora] = useState('');
  const [oferecerVagas, setOferecerVagas] = useState(4);
  const [oferecerValor, setOferecerValor] = useState('5.00');
  const [oferecerLoading, setOferecerLoading] = useState(false);

  // Lista de faculdades locais para seleção no formulário
  const [showOrigemList, setShowOrigemList] = useState(false);
  const [showDestinoList, setShowDestinoList] = useState(false);
  const [oferecerOrigemResults, setOferecerOrigemResults] = useState<any[]>([]);
  const [oferecerOrigemSearching, setOferecerOrigemSearching] = useState(false);
  const [oferecerOrigemTimer, setOferecerOrigemTimer] = useState<NodeJS.Timeout | null>(null);
  const [oferecerDestinoResults, setOferecerDestinoResults] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
            id: caronaApi.motorista?.id ?? caronaApi.motoristaId,
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
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    loadUser();
  }, []);

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

    const user = JSON.parse(userStr);
    const isOwnRide = selectedCarona.motorista.id === user.id;
    if (isOwnRide) {
      Alert.alert('Ação inválida', 'Você não pode reservar sua própria carona.');
      return;
    }

    setReservaLoading(true);
    try {
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

  const handleOferecerDataChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    if (digits.length <= 2) {
      setOferecerData(day);
      return;
    }

    if (digits.length <= 4) {
      setOferecerData(`${day}-${month}`);
      return;
    }

    setOferecerData(`${day}-${month}-${year}`);
  };

  const handleOferecerHoraChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2, 4);

    if (digits.length <= 2) {
      setOferecerHora(hours);
      return;
    }

    setOferecerHora(`${hours}:${minutes}`);
  };

  const handleOferecerOrigemSearch = (text: string) => {
    setOferecerOrigem(text);

    if (oferecerOrigemTimer) clearTimeout(oferecerOrigemTimer);

    if (text.trim().length > 1) {
      // 1. Local filter GeoJSON for institutions
      const query = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const localMatches = institutionsGeoJSON.features
        .filter(feature => {
          const name = feature.properties.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const address = feature.properties.address.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return name.includes(query) || address.includes(query);
        })
        .map(feature => ({
          address: `🎓 ${feature.properties.name}`,
          fullAddress: feature.properties.address
        }));

      setOferecerOrigemResults(localMatches);
      setShowOrigemList(true);

      // 2. Remote search for other points
      setOferecerOrigemSearching(true);
      const timer = setTimeout(async () => {
        try {
          const results = await mapsService.searchPlaces(
            text,
            undefined,
            undefined,
            'Muriaé'
          );

          const remoteMatches = results.map((item: any) => ({
            address: item.address,
            fullAddress: item.address
          }));

          setOferecerOrigemResults([...localMatches, ...remoteMatches]);
        } catch (error) {
          console.error('Erro ao buscar endereços de origem:', error);
        } finally {
          setOferecerOrigemSearching(false);
        }
      }, 400);

      setOferecerOrigemTimer(timer);
    } else {
      setOferecerOrigemResults([]);
      setShowOrigemList(false);
    }
  };

  const handleOferecerDestinoSearch = (text: string) => {
    setOferecerDestino(text);

    if (text.trim().length > 1) {
      // Strict local filter from institutions ONLY
      const query = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtered = institutionsGeoJSON.features
        .filter(feature => {
          const name = feature.properties.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const address = feature.properties.address.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return name.includes(query) || address.includes(query);
        })
        .map(feature => ({
          address: `🎓 ${feature.properties.name}`,
          fullAddress: feature.properties.address
        }));
      setOferecerDestinoResults(filtered);
      setShowDestinoList(true);
    } else {
      setOferecerDestinoResults([]);
      setShowDestinoList(false);
    }
  };

  const handleOferecerCarona = async () => {
    if (!oferecerOrigem.trim() || !oferecerDestino.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, informe a origem e o destino da carona.');
      return;
    }

    if (oferecerData.length !== 10) {
      Alert.alert('Data inválida', 'A data deve estar no formato DD-MM-AAAA.');
      return;
    }

    if (oferecerHora.length !== 5) {
      Alert.alert('Horário inválido', 'O horário de saída deve estar no formato HH:MM.');
      return;
    }

    const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (!userStr) {
      Alert.alert('Login necessário', 'Você precisa estar logado para oferecer uma carona.');
      return;
    }

    const user = JSON.parse(userStr);

    // Parse Date and Time
    const [day, month, year] = oferecerData.split('-');
    const [hours, minutes] = oferecerHora.split(':');
    const departureDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));

    if (isNaN(departureDate.getTime()) || departureDate <= new Date()) {
      Alert.alert('Data e hora inválidas', 'A data e hora de saída devem ser futuras.');
      return;
    }

    setOferecerLoading(true);
    try {
      let veiculoId = '';
      try {
        const vResponse = await api.get(`/veiculos/motorista/${user.id}`);
        veiculoId = vResponse.data.id;
      } catch (err: any) {
        if (err.response?.status === 404 || err.message?.includes('Nenhum veículo') || err.response?.data?.message?.includes('Nenhum veículo')) {
          const createVResponse = await api.post('/veiculos', {
            placa: 'UNI-' + Math.floor(1000 + Math.random() * 9000),
            marca: 'Volkswagen',
            modelo: 'Gol',
            cor: 'Branco',
            proprietarioId: user.id
          });
          veiculoId = createVResponse.data.id;
        } else {
          throw err;
        }
      }

      await caronaApi.create({
        motoristaId: user.id,
        veiculoId,
        origem: oferecerOrigem.replace(/^🎓\s*/, '').trim(),
        destino: oferecerDestino.replace(/^🎓\s*/, '').trim(),
        dataHoraSaida: departureDate.toISOString(),
        assentosDisponiveis: oferecerVagas,
        valorAjuda: Number(oferecerValor)
      });

      Alert.alert('Sucesso!', 'Sua carona foi cadastrada e está disponível na lista.');

      setOferecerOrigem('');
      setOferecerDestino('');
      setOferecerData('');
      setOferecerHora('');
      setOferecerVagas(4);
      setOferecerValor('5.00');
      setOferecerModalAberto(false);

      buscarCaronas();
    } catch (error: any) {
      console.error('Erro ao cadastrar carona:', error);
      Alert.alert('Erro ao oferecer carona', error.response?.data?.message || 'Não foi possível cadastrar sua carona.');
    } finally {
      setOferecerLoading(false);
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

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setOferecerModalAberto(true)}
        activeOpacity={0.82}
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.fabButtonText}>Oferecer</Text>
      </TouchableOpacity>

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
                {currentUser?.id === selectedCarona.motorista.id ? (
                  <View style={[styles.reserveButton, styles.reserveButtonDisabled]}>
                    <Text style={styles.reserveButtonText}>Sua Carona (Como Motorista)</Text>
                  </View>
                ) : (
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
                )}
                {currentUser?.id !== selectedCarona.motorista.id && (
                  <Text style={styles.modalFooterNote}>
                    Você será notificado assim que o motorista confirmar.
                  </Text>
                )}
              </View>
            </View>
          </View>
        ) : null}
      </Modal>

      {/* Modal Oferecer Carona */}
      <Modal
        visible={oferecerModalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => !oferecerLoading && setOferecerModalAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.oferecerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Oferecer Carona</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setOferecerModalAberto(false)}
                disabled={oferecerLoading}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Origem */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Origem</Text>
                <View style={styles.formInputWrapper}>
                  <Feather name="map-pin" size={16} color="#94A3B8" />
                  <TextInput
                    placeholder="De onde você está saindo?"
                    placeholderTextColor="#94A3B8"
                    value={oferecerOrigem}
                    onChangeText={handleOferecerOrigemSearch}
                    style={styles.formInput}
                    editable={!oferecerLoading}
                  />
                  {oferecerOrigem ? (
                    <TouchableOpacity onPress={() => { setOferecerOrigem(''); setShowOrigemList(false); }}>
                      <Feather name="x" size={15} color="#94A3B8" />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {oferecerOrigemSearching && (
                  <ActivityIndicator size="small" color="#0A44B1" style={{ marginTop: 5, alignSelf: 'flex-start' }} />
                )}
                {showOrigemList && oferecerOrigemResults.length > 0 && (
                  <ScrollView style={styles.institutionsScroll} nestedScrollEnabled>
                    {oferecerOrigemResults.map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.institutionSelectItem}
                        onPress={() => {
                          setOferecerOrigem(item.address);
                          setShowOrigemList(false);
                        }}
                      >
                        <Text style={styles.institutionSelectText}>{item.address}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Destino */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Destino</Text>
                <View style={styles.formInputWrapper}>
                  <Feather name="map-pin" size={16} color="#94A3B8" />
                  <TextInput
                    placeholder="Para onde você vai?"
                    placeholderTextColor="#94A3B8"
                    value={oferecerDestino}
                    onChangeText={handleOferecerDestinoSearch}
                    style={styles.formInput}
                    editable={!oferecerLoading}
                  />
                  {oferecerDestino ? (
                    <TouchableOpacity onPress={() => { setOferecerDestino(''); setShowDestinoList(false); }}>
                      <Feather name="x" size={15} color="#94A3B8" />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {showDestinoList && oferecerDestinoResults.length > 0 && (
                  <ScrollView style={styles.institutionsScroll} nestedScrollEnabled>
                    {oferecerDestinoResults.map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.institutionSelectItem}
                        onPress={() => {
                          setOferecerDestino(item.address);
                          setShowDestinoList(false);
                        }}
                      >
                        <Text style={styles.institutionSelectText}>{item.address}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Data e Hora */}
              <View style={[styles.pickerRow, { marginBottom: 16 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Data de Saída</Text>
                  <View style={styles.formInputWrapper}>
                    <Feather name="calendar" size={16} color="#94A3B8" />
                    <TextInput
                      placeholder="DD-MM-AAAA"
                      placeholderTextColor="#94A3B8"
                      value={oferecerData}
                      onChangeText={handleOferecerDataChange}
                      maxLength={10}
                      keyboardType="number-pad"
                      style={styles.formInput}
                      editable={!oferecerLoading}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Horário</Text>
                  <View style={styles.formInputWrapper}>
                    <Feather name="clock" size={16} color="#94A3B8" />
                    <TextInput
                      placeholder="HH:MM"
                      placeholderTextColor="#94A3B8"
                      value={oferecerHora}
                      onChangeText={handleOferecerHoraChange}
                      maxLength={5}
                      keyboardType="number-pad"
                      style={styles.formInput}
                      editable={!oferecerLoading}
                    />
                  </View>
                </View>
              </View>

              {/* Assentos Disponíveis */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Assentos Disponíveis</Text>
                <View style={styles.pickerRow}>
                  {[1, 2, 3, 4].map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={[styles.pickerButton, oferecerVagas === v && styles.pickerButtonActive]}
                      onPress={() => setOferecerVagas(v)}
                      disabled={oferecerLoading}
                    >
                      <Text style={[styles.pickerButtonText, oferecerVagas === v && styles.pickerButtonTextActive]}>
                        {v} {v === 1 ? 'vaga' : 'vagas'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ajuda de Custo */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Ajuda de Custo (R$)</Text>
                <View style={styles.formInputWrapper}>
                  <FontAwesome name="money" size={16} color="#94A3B8" />
                  <TextInput
                    placeholder="5.00"
                    placeholderTextColor="#94A3B8"
                    value={oferecerValor}
                    onChangeText={setOferecerValor}
                    keyboardType="decimal-pad"
                    style={styles.formInput}
                    editable={!oferecerLoading}
                  />
                </View>
              </View>

              {/* Ações */}
              <TouchableOpacity
                style={[styles.formSubmitButton, oferecerLoading && styles.reserveButtonDisabled]}
                onPress={handleOferecerCarona}
                disabled={oferecerLoading}
                activeOpacity={0.82}
              >
                {oferecerLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.formSubmitButtonText}>Cadastrar Carona</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.formCancelButton}
                onPress={() => setOferecerModalAberto(false)}
                disabled={oferecerLoading}
                activeOpacity={0.82}
              >
                <Text style={styles.formCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListagemCaronas;
