import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { StatusCarona, type Carona, type Usuario } from '../../services/caronaApi';
import { styles } from './styles';

const USER_STORAGE_KEY = '@unicarona_user';

type ReservaStatus = 'CONFIRMADA' | 'PENDENTE' | 'CANCELADA';

interface Reserva {
  id: string;
  usuarioId: string;
  caronaId: string;
  status: ReservaStatus;
  carona?: Carona;
}

type PerfilUsuario = Partial<Usuario> & {
  id: string;
  nome: string;
  email: string;
  curso?: string;
};

const statusMap = {
  CONFIRMADA: {
    label: 'Confirmada',
    icon: 'check-circle' as const,
    wrapper: styles.statusConfirmada,
    text: styles.statusConfirmadaText,
  },
  PENDENTE: {
    label: 'Pendente',
    icon: 'clock' as const,
    wrapper: styles.statusPendente,
    text: styles.statusPendenteText,
  },
  CANCELADA: {
    label: 'Cancelada',
    icon: 'x-circle' as const,
    wrapper: styles.statusCancelada,
    text: styles.statusCanceladaText,
  },
};

const Perfil: React.FC = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [user, setUser] = useState<PerfilUsuario | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [avaliarModalAberto, setAvaliarModalAberto] = useState(false);
  const [reservaParaAvaliar, setReservaParaAvaliar] = useState<Reserva | null>(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const [editModalAberto, setEditModalAberto] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editCurso, setEditCurso] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');

  const initials = useMemo(() => {
    if (!user?.nome) return 'UC';

    return user.nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  }, [user?.nome]);

  const carregarReservas = useCallback(async (usuarioId: string) => {
    try {
      const response = await api.get<Reserva[]>(`/reservas/usuario/${usuarioId}`);
      setReservas([...response.data].reverse());
    } catch (error) {
      console.error('Erro ao buscar reservas', error);
      setReservas([]);
    }
  }, []);

  const carregarPerfil = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (!storedUser) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser) as PerfilUsuario;
      setUser(parsedUser);
      await carregarReservas(parsedUser.id);
    } catch (error) {
      console.error('Erro ao carregar perfil', error);
      setUser(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [carregarReservas]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarPerfil();
  };

  const abrirModalAvaliacao = (reserva: Reserva) => {
    setReservaParaAvaliar(reserva);
    setNota(0);
    setComentario('');
    setAvaliarModalAberto(true);
  };

  const enviarAvaliacao = async () => {
    if (!reservaParaAvaliar || !user || !reservaParaAvaliar.carona?.motoristaId) return;

    if (nota === 0) {
      Alert.alert('Avaliação', 'Por favor, dê uma nota de 1 a 5 estrelas.');
      return;
    }

    setEnviandoAvaliacao(true);
    try {
      await api.post('/reservas/avaliar-motorista', {
        caronaId: reservaParaAvaliar.caronaId,
        passageiroId: user.id,
        motoristaId: reservaParaAvaliar.carona.motoristaId,
        nota,
        comentario,
      });
      Alert.alert('Obrigado!', 'Avaliação enviada com sucesso.');
      setAvaliarModalAberto(false);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao enviar avaliação.');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const abrirModalEdicao = () => {
    if (!user) return;

    setEditNome(user.nome);
    setEditCurso(user.curso || '');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
    setErroEdicao('');
    setEditModalAberto(true);
  };

  const salvarEdicao = async () => {
    if (!user) return;

    setErroEdicao('');
    if (!editNome.trim()) {
      setErroEdicao('O nome não pode ser vazio.');
      return;
    }

    if (novaSenha) {
      if (novaSenha !== confirmarNovaSenha) {
        setErroEdicao('A nova senha e a confirmação não conferem.');
        return;
      }
      if (!senhaAtual) {
        setErroEdicao('Para alterar a senha, digite a senha atual.');
        return;
      }
    }

    setSalvandoEdicao(true);
    try {
      if (novaSenha) {
        await api.post('/auth/login', { email: user.email, senha: senhaAtual });
      }

      const payload: { nome: string; curso: string; senha?: string } = {
        nome: editNome.trim(),
        curso: editCurso.trim(),
      };

      if (novaSenha) payload.senha = novaSenha;

      const response = await api.put<PerfilUsuario>(`/usuarios/${user.id}`, payload);
      const updatedUser = { ...user, ...response.data, ...payload };

      setUser(updatedUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      Alert.alert('Perfil atualizado!', 'Suas informações foram salvas com sucesso.');
      setEditModalAberto(false);
    } catch (error: any) {
      setErroEdicao(error.response?.data?.message || 'Erro ao atualizar informações.');
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const irParaCaronas = () => {
    (navigation as any).navigate('Caronas');
  };

  const renderReserva = (reserva: Reserva) => {
    const carona = reserva.carona;
    const status = statusMap[reserva.status] ?? statusMap.PENDENTE;
    const isFinalizada = carona?.status === StatusCarona.FINALIZADA;
    const dataSaida = carona?.dataHoraSaida ? new Date(carona.dataHoraSaida) : null;

    return (
      <View key={reserva.id} style={[styles.reservaCard, isTablet && styles.reservaCardWide]}>
        <View style={styles.reservaHeader}>
          <View style={[styles.statusBadge, status.wrapper]}>
            <Feather name={status.icon} size={13} style={status.text} />
            <Text style={[styles.statusText, status.text]}>{status.label}</Text>
          </View>

          {isFinalizada ? (
            <View style={styles.finalizadaBadge}>
              <Text style={styles.finalizadaText}>Viagem Finalizada</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.routeBox}>
          <View style={styles.routeTimeline}>
            <View style={styles.originDot} />
            <View style={styles.routeLine} />
            <View style={styles.destinationDot} />
          </View>

          <View style={styles.routeTexts}>
            <Text style={styles.routeOrigin} numberOfLines={1}>
              {carona?.origem || 'Origem'}
            </Text>
            <Text style={styles.routeDestination} numberOfLines={1}>
              {carona?.destino || 'Destino'}
            </Text>
          </View>
        </View>

        <View style={styles.reservaDetails}>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={14} color="#64748B" />
            <Text style={styles.detailText}>
              {dataSaida ? dataSaida.toLocaleDateString('pt-BR') : '--/--/----'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Feather name="clock" size={14} color="#64748B" />
            <Text style={styles.detailText}>
              {dataSaida
                ? dataSaida.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </Text>
          </View>
        </View>

        {isFinalizada && reserva.status !== 'CANCELADA' ? (
          <TouchableOpacity
            style={styles.avaliarButton}
            onPress={() => abrirModalAvaliacao(reserva)}
            activeOpacity={0.82}
          >
            <Feather name="star" size={17} color="#0A44B1" />
            <Text style={styles.avaliarButtonText}>Avaliar Motorista</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#0A44B1" />
        <Text style={styles.loadingText}>Carregando seu perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.loggedOutCard}>
          <View style={styles.loggedOutIcon}>
            <Feather name="user" size={30} color="#0A44B1" />
          </View>
          <Text style={styles.loggedOutTitle}>Ops, você não está logado!</Text>
          <Text style={styles.loggedOutText}>
            Faça login para acessar suas informações e reservas.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <View style={styles.heroPattern} />
          <View style={styles.heroInner}>
            <Text style={styles.heroTitle}>Meu Perfil</Text>
            <Text style={styles.heroSubtitle}>Gerencie suas viagens e informações.</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.profileCard, isTablet && styles.profileCardWide]}>
            <View style={styles.profileMain}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.nome}</Text>
                <View style={styles.profileMeta}>
                  <View style={styles.metaRow}>
                    <Feather name="mail" size={14} color="#0A44B1" />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Feather name="book-open" size={14} color="#0A44B1" />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {user.curso || 'Curso não informado'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={abrirModalEdicao} activeOpacity={0.82}>
              <Feather name="edit-3" size={16} color="#475569" />
              <Text style={styles.editButtonText}>Editar Informações</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Minhas Reservas</Text>

          {reservas.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Feather name="map-pin" size={25} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma reserva encontrada</Text>
              <Text style={styles.emptyText}>
                Você ainda não reservou nenhuma carona. Que tal buscar a sua primeira viagem?
              </Text>
              <TouchableOpacity style={styles.buscarButton} onPress={irParaCaronas} activeOpacity={0.82}>
                <Text style={styles.buscarButtonText}>Buscar Caronas</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.reservasGrid, isTablet && styles.reservasGridWide]}>
              {reservas.map(renderReserva)}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={avaliarModalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => !enviandoAvaliacao && setAvaliarModalAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ratingModal}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setAvaliarModalAberto(false)}
              disabled={enviandoAvaliacao}
            >
              <Feather name="x" size={21} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.ratingIcon}>
              <FontAwesome name="star" size={30} color="#E8EE3B" />
            </View>
            <Text style={styles.modalTitle}>Como foi a viagem?</Text>
            <Text style={styles.modalDescription}>
              Avalie o motorista para ajudar a manter a qualidade da comunidade.
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setNota(star)} activeOpacity={0.7}>
                  <FontAwesome
                    name="star"
                    size={38}
                    color={nota >= star ? '#E8EE3B' : '#E2E8F0'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Deixe um comentário (opcional)..."
              placeholderTextColor="#94A3B8"
              value={comentario}
              onChangeText={setComentario}
              multiline
              style={styles.commentInput}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.primaryModalButton, nota === 0 && styles.buttonDisabled]}
              onPress={enviarAvaliacao}
              disabled={enviandoAvaliacao || nota === 0}
              activeOpacity={0.82}
            >
              {enviandoAvaliacao ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryModalButtonText}>Enviar Avaliação</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => !salvandoEdicao && setEditModalAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.editModalHeader}>
              <View style={styles.editModalTitleRow}>
                <Feather name="edit-3" size={18} color="#0A44B1" />
                <Text style={styles.editModalTitle}>Editar Perfil</Text>
              </View>
              <TouchableOpacity onPress={() => setEditModalAberto(false)} disabled={salvandoEdicao}>
                <Feather name="x" size={21} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editModalBody} showsVerticalScrollIndicator={false}>
              {erroEdicao ? (
                <View style={styles.errorBox}>
                  <Feather name="alert-circle" size={16} color="#DC2626" />
                  <Text style={styles.errorText}>{erroEdicao}</Text>
                </View>
              ) : null}

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Nome Completo</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={17} color="#94A3B8" />
                  <TextInput
                    value={editNome}
                    onChangeText={setEditNome}
                    editable={!salvandoEdicao}
                    style={styles.textInput}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Curso / Universidade</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="book-open" size={17} color="#94A3B8" />
                  <TextInput
                    value={editCurso}
                    onChangeText={setEditCurso}
                    editable={!salvandoEdicao}
                    style={styles.textInput}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.passwordTitleRow}>
                <Feather name="lock" size={16} color="#0A44B1" />
                <Text style={styles.passwordTitle}>Alterar Senha</Text>
                <Text style={styles.optionalText}>(Opcional)</Text>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Nova Senha</Text>
                <TextInput
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  editable={!salvandoEdicao}
                  secureTextEntry
                  placeholder="Digite apenas se quiser alterar"
                  placeholderTextColor="#94A3B8"
                  style={styles.passwordInput}
                />
              </View>

              {novaSenha ? (
                <>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Confirmar Nova Senha</Text>
                    <View style={styles.passwordWrapper}>
                      <TextInput
                        value={confirmarNovaSenha}
                        onChangeText={setConfirmarNovaSenha}
                        editable={!salvandoEdicao}
                        secureTextEntry={!mostrarConfirmarSenha}
                        placeholder="Repita a nova senha"
                        placeholderTextColor="#94A3B8"
                        style={styles.passwordInput}
                      />
                      <TouchableOpacity
                        style={styles.passwordEyeButton}
                        onPress={() => setMostrarConfirmarSenha((value) => !value)}
                        disabled={salvandoEdicao}
                        accessibilityRole="button"
                        accessibilityLabel={
                          mostrarConfirmarSenha
                            ? 'Ocultar confirmaÃ§Ã£o da senha'
                            : 'Mostrar confirmaÃ§Ã£o da senha'
                        }
                      >
                        <Feather
                          name={mostrarConfirmarSenha ? 'eye-off' : 'eye'}
                          size={19}
                          color="#94A3B8"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Senha Atual</Text>
                    <TextInput
                      value={senhaAtual}
                      onChangeText={setSenhaAtual}
                      editable={!salvandoEdicao}
                      secureTextEntry
                      placeholder="Obrigatória para salvar a nova senha"
                      placeholderTextColor="#94A3B8"
                      style={styles.passwordInput}
                    />
                  </View>
                </>
              ) : null}
            </ScrollView>

            <View style={styles.editModalFooter}>
              <TouchableOpacity
                style={styles.saveChangesButton}
                onPress={salvarEdicao}
                disabled={salvandoEdicao}
                activeOpacity={0.82}
              >
                {salvandoEdicao ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveChangesText}>Salvar Alterações</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Perfil;
