import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { styles } from './styles';
import CardCarona, { type Carona } from '../../components/CardCarona';
import {
  caronaApi,
  StatusCarona,
  type Carona as ApiCarona,
  type CaronaFilters,
} from '../../services/caronaApi';

const ListagemCaronas: React.FC = () => {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;
  const isTablet = width >= 768;
  const isWide = width >= 1024;
  const [caronasFiltradas, setCaronasFiltradas] = useState<Carona[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filtros que condizem com o endpoint
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [data, setData] = useState('');
  const [apenasComVagas, setApenasComVagas] = useState(false);

  // Chamada real para o backend
  const buscarCaronas = async () => {
    setLoading(true);
    
    try {
      const filters: CaronaFilters = {};
      
      if (origem) filters.origem = origem;
      if (destino) filters.destino = destino;
      filters.apenasFuturas = true;
      filters.status = StatusCarona.AGENDADA;
      if (apenasComVagas) filters.vagasDisponiveis = 1;

      const caronasApi = await caronaApi.buscarDisponiveis(filters);
      
      // Converter resposta do backend para a interface do componente.
      const caronasConvertidas: Carona[] = caronasApi.map((caronaApi: ApiCarona) => {
        const dataSaida = new Date(caronaApi.dataHoraSaida);

        return {
          id: caronaApi.id,
        motorista: {
          nome: caronaApi.motorista?.nome ?? 'Motorista',
          universidade: caronaApi.motorista?.curso ?? 'Universidade não informada',
        },
        origem: caronaApi.origem,
        destino: caronaApi.destino,
          data: dataSaida.toISOString().split('T')[0],
          horario: dataSaida.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          vagas: caronaApi.assentosDisponiveis,
          preco: caronaApi.valorAjuda ?? 0,
          status:
            caronaApi.status === StatusCarona.CANCELADA
              ? 'cancelada'
              : caronaApi.status === StatusCarona.FINALIZADA
                ? 'completa'
                : 'ativa',
        };
      });
      
      // Aplicar filtro de data localmente se necessário
      let resultados = caronasConvertidas;
      if (data) {
        resultados = resultados.filter(carona => carona.data === data);
      }
      
      // Filtro adicional de vagas (backend não tem esse filtro específico)
      if (apenasComVagas) {
        resultados = resultados.filter(carona => (carona.vagas ?? 0) > 0);
      }
      
      setCaronasFiltradas(resultados);
    } catch (error: any) {
      console.error('Erro ao buscar caronas:', error.response?.data ?? error);
      Alert.alert('Erro', 'Não foi possível carregar as caronas. Tente novamente mais tarde.');
      setCaronasFiltradas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    buscarCaronas();
  };

  // Busca caronas quando os filtros mudarem
  useEffect(() => {
    buscarCaronas();
  }, [origem, destino, data, apenasComVagas]);

  const handleVerDetalhes = (id: string) => {
    console.log('Ver detalhes da carona:', id);
    Alert.alert('Detalhes', `Detalhes da carona ${id} - Em breve!`);
  };

  const limparFiltros = () => {
    setOrigem('');
    setDestino('');
    setData('');
    setApenasComVagas(false);
  };

  const Checkbox = ({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkboxCheck}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.wrapper}
      contentContainerStyle={[
        styles.contentContainer,
        isCompact && styles.contentContainerCompact,
        isWide && styles.contentContainerWide,
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={[styles.header, isCompact && styles.headerCompact]}>
          <Text style={[styles.titulo, isCompact && styles.tituloCompact]}>
            Caronas disponíveis
          </Text>
          <Text style={[styles.subtitulo, isCompact && styles.subtituloCompact]}>
            Encontre uma carona para sua universidade
          </Text>
        </View>

        <View style={[styles.filtros, isCompact && styles.filtrosCompact]}>
          <View style={[styles.filterFields, isTablet && styles.filterFieldsWide]}>
          <TextInput
            placeholder="📍 Origem..."
            placeholderTextColor="#94a3b8"
            value={origem}
            onChangeText={setOrigem}
            style={[styles.filtroInput, isTablet && styles.filtroInputWide]}
          />
          <TextInput
            placeholder="🎯 Destino..."
            placeholderTextColor="#94a3b8"
            value={destino}
            onChangeText={setDestino}
            style={[styles.filtroInput, isTablet && styles.filtroInputWide]}
          />
          <TextInput
            placeholder="📅 Data (YYYY-MM-DD)"
            placeholderTextColor="#94a3b8"
            value={data}
            onChangeText={setData}
            style={[styles.filtroInput, isTablet && styles.filtroInputWide]}
          />
          </View>
          
          {/* Filtro de vagas disponíveis */}
          <Checkbox 
            checked={apenasComVagas}
            onToggle={() => setApenasComVagas(!apenasComVagas)}
            label="🚗 Apenas com vagas disponíveis"
          />
          
          {(origem || destino || data || apenasComVagas) && (
            <TouchableOpacity onPress={limparFiltros} style={styles.limparButton}>
              <Text style={styles.limparButtonText}>Limpar filtros</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Buscando caronas...</Text>
          </View>
        ) : caronasFiltradas.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>🚗</Text>
            </View>
            <Text style={styles.emptyTitle}>Nenhuma carona encontrada</Text>
            <Text style={styles.emptySubtitle}>Tente ajustar os filtros ou volte mais tarde</Text>
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
                <CardCarona
                  carona={carona}
                  onVerDetalhes={handleVerDetalhes}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ListagemCaronas;
