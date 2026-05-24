import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, TextInput, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../theme';
import { Typography } from '../../components/Typography';
import { styles } from './styles';
import { mapsService, RouteResult, GeocodingResult } from '../../services/api';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState<string | undefined>();
  const [destination, setDestination] = useState<any>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    (async () => {
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

  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (searchTimer) clearTimeout(searchTimer);

    if (text.length > 3) {
      const timer = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await mapsService.searchPlaces(
            text,
            location?.coords.latitude,
            location?.coords.longitude,
            city
          );
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Erro na busca:', error);
        } finally {
          setIsSearching(false);
        }
      }, 600);

      setSearchTimer(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const selectDestination = (item: GeocodingResult) => {
    setDestination({
      location: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
      description: item.address,
    });
    setSearchQuery(item.address);
    setShowResults(false);
  };

  const calculatePrice = () => {
    if (!route) return '0,00';
    const distanceKm = route.distanceMetros / 1000;
    const price = 5 + distanceKm * 2;
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
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
                onFocus={() => searchQuery.length > 3 && setShowResults(true)}
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
            <TouchableOpacity style={styles.confirmButton} onPress={() => Alert.alert('Sucesso', 'Carona solicitada!')}>
              <Typography variant="body" color="#fff" style={{ fontWeight: 'bold' }}>Solicitar</Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
