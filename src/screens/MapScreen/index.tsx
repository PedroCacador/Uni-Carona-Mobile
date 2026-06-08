import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, TextInput, FlatList, TouchableOpacity, Modal, ScrollView, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';

import { theme } from '../../theme';
import { Typography } from '../../components/Typography';
import { styles } from './styles';
import api, { mapsService, RouteResult, GeocodingResult } from '../../services/api';
import { caronaApi, StatusCarona } from '../../services/caronaApi';
import localDatabase from '../../services/localDatabase';
import institutionsGeoJSON from '../../constants/muriae-institutions.json';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState<string | undefined>();
  const [destination, setDestination] = useState<any>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  const [matchingRides, setMatchingRides] = useState<any[]>([]);
  const [loadingRides, setLoadingRides] = useState(false);
  const [ridesModalVisible, setRidesModalVisible] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [bookingRideId, setBookingRideId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const user = await localDatabase.getUser();
      if (user) {
        setCurrentUser(user);
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para funcionar.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let reverse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      if (reverse && reverse.length > 0) {
        setCity(reverse[0].city || reverse[0].subregion || undefined);
      }
    })();
  }, []);

  useEffect(() => {
    if (location && destination) {
      fetchRoute();
    }
  }, [destination]);

  const fetchRoute = async () => {
    setLoadingRoute(true);
    try {
      const result = await mapsService.getRoute(
        { lat: location!.coords.latitude, lng: location!.coords.longitude },
        { lat: destination.location.latitude, lng: destination.location.longitude }
      );
      setRoute(result);
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
      Alert.alert('Erro', 'Não foi possível calcular a rota até o destino.');
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (searchTimer) clearTimeout(searchTimer);

    if (text.trim().length > 1) {
      const query = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const localMatches = institutionsGeoJSON.features
        .filter(feature => {
          const name = feature.properties.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const address = feature.properties.address.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return name.includes(query) || address.includes(query);
        })
        .map(feature => ({
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          address: `🎓 ${feature.properties.name}`,
          fullAddress: feature.properties.address
        }));

      setSearchResults(localMatches as any);
      setShowResults(true);

      const timer = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await mapsService.searchPlaces(
            text,
            location?.coords.latitude,
            location?.coords.longitude,
            city || 'Muriaé'
          );

          const remoteMatches = results.map(item => ({
            latitude: item.latitude,
            longitude: item.longitude,
            address: item.address,
            fullAddress: item.address
          }));

          setSearchResults([...localMatches, ...remoteMatches] as any);
        } catch (error) {
          console.error('Erro na busca remota:', error);
        } finally {
          setIsSearching(false);
        }
      }, 400);

      setSearchTimer(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const selectDestination = (item: GeocodingResult) => {
    const cleanAddress = item.address.replace(/^🎓\s*/, '');
    setDestination({
      location: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
      description: cleanAddress,
    });
    setSearchQuery(cleanAddress);
    setShowResults(false);
  };

  const calculatePrice = () => {
    if (!route) return '0,00';
    const distanceKm = route.distanceMetros / 1000;
    const price = 5 + distanceKm * 2;
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSolicitar = async () => {
    if (!destination) return;

    setLoadingRides(true);
    setRidesModalVisible(true);
    setSelectedRideId(null);
    try {
      const caronas = await caronaApi.buscarDisponiveis({
        apenasFuturas: true,
        status: StatusCarona.AGENDADA,
        destino: destination.description,
      });
      setMatchingRides(caronas);
    } catch (error) {
      console.error('Erro ao buscar caronas:', error);
      Alert.alert('Erro', 'Não foi possível buscar caronas para este destino.');
      setRidesModalVisible(false);
    } finally {
      setLoadingRides(false);
    }
  };

  const handleBookRide = async () => {
    if (!selectedRideId) {
      Alert.alert('Selecione uma carona', 'Por favor, selecione uma carona da lista para continuar.');
      return;
    }

    const user = await localDatabase.getUser();
    if (!user) {
      Alert.alert('Login necessário', 'Você precisa estar logado para solicitar uma carona.');
      return;
    }

    const selectedRide = matchingRides.find(r => r.id === selectedRideId);
    const isOwnRide = selectedRide && (selectedRide.motoristaId === user.id || selectedRide.motorista?.id === user.id);
    if (selectedRide && isOwnRide) {
      Alert.alert('Ação inválida', 'Você não pode reservar sua própria carona.');
      return;
    }

    setBookingRideId(selectedRideId);
    try {
      await api.post('/reservas', {
        caronaId: selectedRideId,
        usuarioId: user.id,
        quantidadePessoas: 1,
      });

      Alert.alert('Sucesso!', 'Sua vaga foi reservada com sucesso. Acompanhe o status no seu Perfil.');
      setRidesModalVisible(false);
      setDestination(null);
      setRoute(null);
      setSearchQuery('');
    } catch (error: any) {
      console.error('Erro ao reservar carona:', error);
      Alert.alert('Erro ao reservar', error.response?.data?.message || 'Não foi possível reservar a carona.');
    } finally {
      setBookingRideId(null);
    }
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Typography variant="body" style={{ marginTop: 10 }}>Carregando mapa...</Typography>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {institutionsGeoJSON.features.map((feature, idx) => {
          const coordinates = {
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0]
          };

          return (
            <Marker
              key={idx}
              coordinate={coordinates}
              title={feature.properties.name}
              description={feature.properties.address}
              pinColor="orange"
              onPress={() => {
                selectDestination({
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  address: feature.properties.name
                } as any);
              }}
            />
          );
        })}

        {destination && (
          <Marker coordinate={destination.location} title="Destino" pinColor="red" />
        )}

        {route && (
          <Polyline
            coordinates={route.coordinates}
            strokeWidth={4}
            strokeColor={theme.colors.primary}
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.searchCard}>
          <View style={styles.markerDecoration}>
            <View style={styles.dot} /><View style={styles.line} /><View style={styles.square} />
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.inputWrapper}>
              <Typography variant="caption" color={theme.colors.textSecondary}>Saindo de</Typography>
              <Typography variant="body" numberOfLines={1}>Minha localização atual</Typography>
            </View>

            <View style={[styles.inputWrapper, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 }]}>
              <Typography variant="caption" color={theme.colors.textSecondary}>Para onde vamos?</Typography>
              <TextInput
                style={styles.textInput}
                placeholder="Digite o destino..."
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
              />
              {isSearching && <ActivityIndicator size="small" color={theme.colors.primary} style={{ position: 'absolute', right: 10, bottom: 10 }} />}
            </View>

            {showResults && searchResults.length > 0 && (
              <View style={styles.resultsList}>
                <FlatList
                  data={searchResults}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.resultItem} onPress={() => selectDestination(item)}>
                      <Typography variant="body" numberOfLines={2}>{item.address}</Typography>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      {destination && (
        <View style={styles.bottomContainer}>
          <View style={styles.priceCard}>
            <View>
              {loadingRoute ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <>
                  <Typography variant="h2">{calculatePrice()}</Typography>
                  <Typography variant="caption" color={theme.colors.textSecondary}>
                    {(route?.distanceMetros ? (route.distanceMetros / 1000).toFixed(1) : 0)} km • {route?.duracaoSegundos ? Math.round(route.duracaoSegundos / 60) : 0} min
                  </Typography>
                </>
              )}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleSolicitar}>
              <Typography variant="body" color="#fff" style={{ fontWeight: 'bold' }}>Solicitar</Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={ridesModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !bookingRideId && setRidesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography style={styles.modalTitle}>Caronas Disponíveis</Typography>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setRidesModalVisible(false)}
                disabled={!!bookingRideId}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {loadingRides ? (
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#0A44B1" />
                  <Typography variant="body" style={{ marginTop: 10 }}>Buscando caronas no servidor...</Typography>
                </View>
              ) : matchingRides.length === 0 ? (
                <Text style={styles.noRidesText}>Não há caronas disponíveis para este destino no momento.</Text>
              ) : (
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  {matchingRides.map((carona) => {
                    const isSelected = selectedRideId === carona.id;
                    const isOwnRide = carona.motoristaId === currentUser?.id || carona.motorista?.id === currentUser?.id;
                    const date = new Date(carona.dataHoraSaida);
                    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <TouchableOpacity
                        key={carona.id}
                        style={[
                          styles.rideOptionCard,
                          isSelected && styles.rideOptionCardSelected,
                          isOwnRide && { opacity: 0.6, backgroundColor: '#f1f5f9' }
                        ]}
                        onPress={() => {
                          if (isOwnRide) {
                            Alert.alert('Ação inválida', 'Você não pode reservar sua própria carona.');
                            return;
                          }
                          setSelectedRideId(carona.id);
                        }}
                      >
                        <View style={styles.rideDriverAvatar}>
                          <Text style={styles.rideDriverAvatarText}>
                            {carona.motorista?.nome
                              ? carona.motorista.nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
                              : 'MC'}
                          </Text>
                        </View>
                        <View style={styles.rideDetails}>
                          <Text style={styles.rideDriverName}>{carona.motorista?.nome ?? 'Motorista'} {isOwnRide && '(Você)'}</Text>
                          <Text style={styles.rideDriverUni}>{carona.motorista?.curso ?? 'Faminas'}</Text>
                          <View style={styles.rideMeta}>
                            <Text style={styles.rideMetaText}>{time}</Text>
                            <Text style={styles.rideMetaText}>•</Text>
                            <Text style={styles.rideMetaText}>{carona.assentosDisponiveis} vagas</Text>
                          </View>
                        </View>
                        <Text style={styles.ridePrice}>R$ {Number(carona.valorAjuda ?? 0).toFixed(2)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            <View style={styles.modalFooter}>
              {selectedRideId && (matchingRides.find(r => r.id === selectedRideId)?.motoristaId === currentUser?.id || matchingRides.find(r => r.id === selectedRideId)?.motorista?.id === currentUser?.id) ? (
                <View style={[styles.reserveButton, styles.reserveButtonDisabled]}>
                  <Text style={styles.reserveButtonText}>Sua Carona (Como Motorista)</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.reserveButton,
                    (!selectedRideId || !!bookingRideId) && styles.reserveButtonDisabled,
                  ]}
                  onPress={handleBookRide}
                  disabled={!selectedRideId || !!bookingRideId}
                  activeOpacity={0.82}
                >
                  {bookingRideId ? (
                    <>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={styles.reserveButtonText}>Processando reserva...</Text>
                    </>
                  ) : (
                    <Text style={styles.reserveButtonText}>Confirmar e Reservar</Text>
                  )}
                </TouchableOpacity>
              )}
              {selectedRideId && (matchingRides.find(r => r.id === selectedRideId)?.motoristaId !== currentUser?.id && matchingRides.find(r => r.id === selectedRideId)?.motorista?.id !== currentUser?.id) && (
                <Text style={styles.modalFooterNote}>
                  Sua reserva será enviada e confirmada na hora.
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
