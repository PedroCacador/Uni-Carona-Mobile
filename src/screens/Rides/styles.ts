import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
    ...Platform.select({
      web: {
        padding: 32,
      },
    }),
  },
  contentContainerCompact: {
    padding: 12,
  },
  contentContainerWide: {
    paddingHorizontal: 40,
  },
  container: {
    flex: 1,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  headerCompact: {
    marginBottom: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
      android: {
        letterSpacing: -0.3,
      },
    }),
  },
  tituloCompact: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  subtituloCompact: {
    fontSize: 14,
  },
  filtros: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  filtrosCompact: {
    padding: 14,
    marginBottom: 24,
    borderRadius: 12,
  },
  filterFields: {
    width: '100%',
  },
  filterFieldsWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filtroInput: {
    backgroundColor: '#fafbfc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    marginBottom: 12,
    color: '#1e293b',
  },
  filtroInputWide: {
    flex: 1,
    minWidth: 180,
    marginBottom: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2563eb',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
  },
  checkboxCheck: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1e293b',
  },
  limparButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  limparButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    width: '100%',
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  cardColumn: {
    width: '100%',
  },
  cardColumnTablet: {
    width: '50%',
    paddingHorizontal: 8,
  },
  cardColumnWide: {
    width: '33.3333%',
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 64,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 72,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
