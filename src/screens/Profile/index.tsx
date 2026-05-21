import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { styles } from './styles';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  universidade: string;
  matricula: string;
  tipo: 'passageiro' | 'motorista';
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  dataCadastro: string;
  telefone?: string;
  bio?: string;
  fotoPerfil?: string;
}

interface CaronaHistorico {
  id: string;
  origem: string;
  destino: string;
  data: string;
  horario: string;
  tipo: 'oferecida' | 'participante';
  status: 'completa' | 'cancelada' | 'pendente';
  vagas?: number;
  preco: number;
  motorista?: string;
}

interface Avaliacao {
  id: number;
  autor: string;
  nota: number;
  comentario: string;
  data: string;
  tipo: string;
}

const Perfil: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isCompact = width < 420;
  const isTablet = width >= 768;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dados' | 'historico' | 'avaliacoes'>('dados');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: '', title: '', message: '' });
  
  // Dados do perfil
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    nome: 'João Silva Santos',
    email: 'joao.silva@universidade.edu.br',
    universidade: 'Universidade Federal do Rio de Janeiro - UFRJ',
    matricula: '2023123456',
    tipo: 'motorista',
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 24,
    dataCadastro: '2024-01-15',
    telefone: '(21) 98765-4321',
    bio: 'Estudante de Engenharia Civil, apaixonado por caronas compartilhadas e sustentabilidade. Sempre busco oferecer viagens seguras e agradáveis! 🚗✨'
  });

  const [editData, setEditData] = useState({
    nome: profile.nome,
    telefone: profile.telefone || '',
    bio: profile.bio || '',
    universidade: profile.universidade,
    matricula: profile.matricula
  });

  // Histórico de caronas
  const [historico] = useState<CaronaHistorico[]>([
    {
      id: '1',
      origem: 'Copacabana',
      destino: 'UFRJ - Cidade Universitária',
      data: '2024-01-20',
      horario: '07:30',
      tipo: 'oferecida',
      status: 'completa',
      vagas: 3,
      preco: 12
    },
    {
      id: '2',
      origem: 'Barra da Tijuca',
      destino: 'UFRJ - Praia Vermelha',
      data: '2024-01-18',
      horario: '08:00',
      tipo: 'participante',
      status: 'completa',
      preco: 15,
      motorista: 'Maria Oliveira'
    },
    {
      id: '3',
      origem: 'Centro',
      destino: 'UFRJ - Cidade Universitária',
      data: '2024-01-25',
      horario: '13:00',
      tipo: 'oferecida',
      status: 'pendente',
      vagas: 2,
      preco: 10
    }
  ]);

  // Avaliações recebidas
  const [avaliacoes] = useState<Avaliacao[]>([
    {
      id: 1,
      autor: 'Ana Beatriz',
      nota: 5,
      comentario: 'Motorista super pontual e educado! Recomendo demais 🚗✨',
      data: '2024-01-20',
      tipo: 'passageiro'
    },
    {
      id: 2,
      autor: 'Carlos Eduardo',
      nota: 4.5,
      comentario: 'Ótima viagem, carro confortável e conversa agradável.',
      data: '2024-01-15',
      tipo: 'passageiro'
    },
    {
      id: 3,
      autor: 'Fernanda Lima',
      nota: 5,
      comentario: 'Excelente motorista, muito atencioso com os passageiros!',
      data: '2024-01-10',
      tipo: 'passageiro'
    }
  ]);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    loadProfile();
  }, []);

  const handleEdit = () => {
    setEditData({
      nome: profile.nome,
      telefone: profile.telefone || '',
      bio: profile.bio || '',
      universidade: profile.universidade,
      matricula: profile.matricula
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setProfile({
        ...profile,
        nome: editData.nome,
        telefone: editData.telefone,
        bio: editData.bio,
        universidade: editData.universidade,
        matricula: editData.matricula
      });
      setIsEditing(false);
      setIsLoading(false);
      
      setModalMessage({
        type: 'success',
        title: 'Perfil atualizado!',
        message: 'Suas informações foram salvas com sucesso.'
      });
      setShowModal(true);
      
      setTimeout(() => setShowModal(false), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'completa':
        return { icon: '✅', color: '#10b981', text: 'Completa' };
      case 'cancelada':
        return { icon: '❌', color: '#ef4444', text: 'Cancelada' };
      default:
        return { icon: '⚠️', color: '#f59e0b', text: 'Pendente' };
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Text key={`full-${i}`} style={styles.starFilled}>★</Text>);
    }
    if (hasHalfStar) {
      stars.push(<Text key="half" style={styles.starHalf}>½</Text>);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Text key={`empty-${i}`} style={styles.starEmpty}>☆</Text>);
    }
    return stars;
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dados':
        return renderDadosTab();
      case 'historico':
        return renderHistoricoTab();
      case 'avaliacoes':
        return renderAvaliacoesTab();
      default:
        return null;
    }
  };

  const renderDadosTab = () => {
    return (
      <View style={[styles.infoGrid, isTablet && styles.infoGridWide]}>
        <View style={[styles.infoCard, isTablet && styles.infoCardWide]}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>📧</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
          </View>
        </View>
        <View style={[styles.infoCard, isTablet && styles.infoCardWide]}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>📚</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Universidade</Text>
            <Text style={styles.infoValue}>{profile.universidade}</Text>
          </View>
        </View>
        <View style={[styles.infoCard, isTablet && styles.infoCardWide]}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>🎓</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Matrícula</Text>
            <Text style={styles.infoValue}>{profile.matricula}</Text>
          </View>
        </View>
        <View style={[styles.infoCard, isTablet && styles.infoCardWide]}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>🔒</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Senha</Text>
            <Text style={styles.infoValue}>********</Text>
            <TouchableOpacity onPress={() => Alert.alert('Alterar senha', 'Funcionalidade em breve')}>
              <Text style={styles.changePasswordBtn}>Alterar senha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHistoricoTab = () => {
    if (historico.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyTitle}>Nenhuma carona encontrada</Text>
          <Text style={styles.emptySubtitle}>Você ainda não participou de nenhuma carona</Text>
        </View>
      );
    }

    return (
      <View style={[styles.historicoContainer, isTablet && styles.historicoContainerWide]}>
        {historico.map(carona => {
          const statusConfig = getStatusConfig(carona.status);
          return (
            <View
              key={carona.id}
              style={[styles.historicoCard, isTablet && styles.historicoCardWide]}
            >
              <View style={styles.historicoHeader}>
                <View style={[
                  styles.historicoType,
                  carona.tipo === 'oferecida' ? styles.historicoTypeOferecida : styles.historicoTypeParticipante
                ]}>
                  <Text>{carona.tipo === 'oferecida' ? '🚗' : '👥'}</Text>
                  <Text style={styles.historicoTypeText}>
                    {carona.tipo === 'oferecida' ? 'Oferecida' : 'Participante'}
                  </Text>
                </View>
                <View style={styles.historicoStatus}>
                  <Text>{statusConfig.icon}</Text>
                  <Text style={[styles.historicoStatusText, { color: statusConfig.color }]}>
                    {statusConfig.text}
                  </Text>
                </View>
              </View>
              
              <View style={styles.historicoBody}>
                <View style={styles.historicoRoute}>
                  <View style={styles.routePoint}>
                    <View style={styles.routeDotOrigin} />
                    <View>
                      <Text style={styles.routeLabel}>Origem</Text>
                      <Text style={styles.routeText}>{carona.origem}</Text>
                    </View>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <View style={styles.routeDotDestiny} />
                    <View>
                      <Text style={styles.routeLabel}>Destino</Text>
                      <Text style={styles.routeText}>{carona.destino}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.historicoDetails}>
                  <View style={styles.detailItem}>
                    <Text>📅</Text>
                    <Text style={styles.detailText}>
                      {new Date(carona.data).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text>📍</Text>
                    <Text style={styles.detailText}>{carona.horario}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.priceText}>R$ {carona.preco}</Text>
                  </View>
                </View>
                
                {carona.tipo === 'participante' && carona.motorista && (
                  <View style={styles.historicoMotorista}>
                    <Text>👤</Text>
                    <Text style={styles.motoristaText}>Motorista: {carona.motorista}</Text>
                  </View>
                )}
                
                {carona.tipo === 'oferecida' && carona.vagas && (
                  <View style={styles.historicoVagas}>
                    <Text>👥</Text>
                    <Text style={styles.vagasText}>{carona.vagas} vagas disponíveis</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.historicoButton}
                onPress={() => Alert.alert('Detalhes', `Detalhes da carona ${carona.id}`)}
              >
                <Text style={styles.historicoButtonText}>Ver detalhes</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        
        <TouchableOpacity
          style={[styles.verMaisButton, isTablet && styles.verMaisButtonWide]}
        >
          <Text>+</Text>
          <Text style={styles.verMaisText}>Carregar mais</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAvaliacoesTab = () => {
    return (
      <View style={styles.avaliacoesContainer}>
        <View style={[styles.avaliacoesSummary, isTablet && styles.avaliacoesSummaryWide]}>
          <View style={[styles.summaryScore, isTablet && styles.summaryScoreWide]}>
            <Text style={styles.summaryScoreNumber}>{profile.avaliacaoMedia}</Text>
            <View style={styles.summaryStars}>
              {renderStars(profile.avaliacaoMedia)}
            </View>
            <Text style={styles.summaryTotal}>
              {profile.totalAvaliacoes} avaliações
            </Text>
          </View>
          <View style={styles.summaryBreakdown}>
            {[5,4,3,2,1].map(star => {
              const count = avaliacoes.filter(a => Math.floor(a.nota) === star).length;
              const percentage = (count / profile.totalAvaliacoes) * 100;
              return (
                <View key={star} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{star} estrelas</Text>
                  <View style={styles.breakdownBar}>
                    <View style={[styles.breakdownFill, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.breakdownCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>
        
        <View style={styles.avaliacoesList}>
          {avaliacoes.map(avaliacao => (
            <View key={avaliacao.id} style={styles.avaliacaoCard}>
              <View style={styles.avaliacaoHeader}>
                <View style={styles.avaliacaoAutor}>
                  <View style={styles.avaliacaoAvatar}>
                    <Text style={styles.avaliacaoAvatarText}>
                      {avaliacao.autor.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.avaliacaoNome}>{avaliacao.autor}</Text>
                    <View style={styles.avaliacaoStars}>
                      {renderStars(avaliacao.nota)}
                    </View>
                  </View>
                </View>
                <Text style={styles.avaliacaoData}>
                  {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <Text style={styles.avaliacaoComentario}>
                "{avaliacao.comentario}"
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.wrapper}
      contentContainerStyle={[
        styles.contentContainer,
        isCompact && styles.contentContainerCompact,
        isTablet && styles.contentContainerWide,
      ]}
    >
      {/* Modal de Notificação */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[
              styles.modalIcon,
              modalMessage.type === 'success' ? styles.modalIconSuccess : styles.modalIconError
            ]}>
              <Text style={styles.modalIconText}>
                {modalMessage.type === 'success' ? '✅' : '⚠️'}
              </Text>
            </View>
            <Text style={styles.modalTitle}>{modalMessage.title}</Text>
            <Text style={styles.modalMessage}>{modalMessage.message}</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Header do Perfil */}
        <View style={[styles.profileHeader, isTablet && styles.profileHeaderWide]}>
          <View style={[styles.avatarWrapper, isTablet && styles.avatarWrapperWide]}>
            {profile.fotoPerfil ? (
              <Image source={{ uri: profile.fotoPerfil }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>👤</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.changePhotoBtn, isEditing && styles.changePhotoBtnActive]}
              onPress={handleEdit}
              disabled={isEditing}
              accessibilityRole="button"
              accessibilityLabel="Editar perfil"
            >
              <Text style={styles.changePhotoBtnText}>✏️</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            {!isEditing ? (
              <>
                <View style={[styles.nameRow, isCompact && styles.nameRowCompact]}>
                  <Text style={[styles.name, isCompact && styles.nameCompact]}>
                    {profile.nome}
                  </Text>
                </View>
                <View style={styles.badgeGroup}>
                  <View style={[
                    styles.badge,
                    profile.tipo === 'motorista' ? styles.badgeMotorista : styles.badgePassageiro
                  ]}>
                    <Text>{profile.tipo === 'motorista' ? '🚗' : '👤'}</Text>
                    <Text style={styles.badgeText}>
                      {profile.tipo === 'motorista' ? 'Motorista' : 'Passageiro'}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text>📅</Text>
                    <Text style={styles.badgeText}>
                      Desde {new Date(profile.dataCadastro).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </View>
                <View style={styles.ratingWrapper}>
                  {renderStars(profile.avaliacaoMedia)}
                  <Text style={styles.ratingValue}>{profile.avaliacaoMedia}</Text>
                  <Text style={styles.ratingCount}>({profile.totalAvaliacoes} avaliações)</Text>
                </View>
                {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
              </>
            ) : (
              <View style={styles.editForm}>
                <View style={[styles.formRow, isMobile && styles.formRowMobile]}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Nome completo</Text>
                    <TextInput
                      value={editData.nome}
                      onChangeText={(text) => setEditData({...editData, nome: text})}
                      style={styles.formInput}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Telefone</Text>
                    <TextInput
                      value={editData.telefone}
                      onChangeText={(text) => setEditData({...editData, telefone: text})}
                      style={styles.formInput}
                      keyboardType="phone-pad"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Universidade</Text>
                  <TextInput
                    value={editData.universidade}
                    onChangeText={(text) => setEditData({...editData, universidade: text})}
                    style={styles.formInput}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
                <View style={[styles.formRow, isMobile && styles.formRowMobile]}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Matrícula</Text>
                    <TextInput
                      value={editData.matricula}
                      onChangeText={(text) => setEditData({...editData, matricula: text})}
                      style={styles.formInput}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Biografia</Text>
                  <TextInput
                    value={editData.bio}
                    onChangeText={(text) => setEditData({...editData, bio: text})}
                    style={[styles.formInput, styles.formTextarea]}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
                <View style={[styles.editActions, isCompact && styles.editActionsCompact]}>
                  <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Text>💾</Text>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Tabs de Navegação */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={[
            styles.tabsContainer,
            isTablet && styles.tabsContainerWide,
          ]}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('dados')}
            style={[
              styles.tabButton,
              isCompact && styles.tabButtonCompact,
              activeTab === 'dados' && styles.tabButtonActive,
            ]}
          >
            <Text>👤</Text>
            <Text style={[styles.tabButtonText, activeTab === 'dados' && styles.tabButtonTextActive]}>
              Dados Pessoais
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('historico')}
            style={[
              styles.tabButton,
              isCompact && styles.tabButtonCompact,
              activeTab === 'historico' && styles.tabButtonActive,
            ]}
          >
            <Text>📅</Text>
            <Text style={[styles.tabButtonText, activeTab === 'historico' && styles.tabButtonTextActive]}>
              Histórico
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('avaliacoes')}
            style={[
              styles.tabButton,
              isCompact && styles.tabButtonCompact,
              activeTab === 'avaliacoes' && styles.tabButtonActive,
            ]}
          >
            <Text>⭐</Text>
            <Text style={[styles.tabButtonText, activeTab === 'avaliacoes' && styles.tabButtonTextActive]}>
              Avaliações
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Conteúdo das Tabs */}
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </View>
    </ScrollView>
  );
};

export default Perfil;
