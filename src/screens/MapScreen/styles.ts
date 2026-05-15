import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  markerDecoration: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  line: {
    width: 1,
    height: 30,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  square: {
    width: 6,
    height: 6,
    backgroundColor: '#000',
  },
  inputsContainer: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -5 },
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  textInput: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  resultsList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export const autocompleteStyles = {
  container: { flex: 0 },
  textInput: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  listView: {
    position: 'absolute',
    top: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    zIndex: 1000,
  }
};
