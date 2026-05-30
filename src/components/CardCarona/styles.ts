import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const { spacing, typography } = theme;

const blue = '#0A44B1';
const surface = '#FAFAF7';
const slate900 = '#0F172A';
const slate800 = '#1E293B';
const slate600 = '#475569';
const slate500 = '#64748B';
const slate400 = '#94A3B8';
const slate200 = '#E2E8F0';
const neutral100 = '#F5F5F0';
const emerald50 = '#ECFDF5';
const emerald100 = '#D1FAE5';
const emerald500 = '#10B981';
const emerald700 = '#047857';
const red50 = '#FEF2F2';
const red100 = '#FEE2E2';
const red200 = '#FECACA';
const red500 = '#EF4444';
const red600 = '#DC2626';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(229, 229, 223, 0.9)',
    borderRadius: 24,
    borderWidth: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  cardDisponivel: {
    borderColor: 'rgba(10, 68, 177, 0.18)',
  },

  accentBar: {
    backgroundColor: 'transparent',
    height: 4,
    width: '100%',
  },

  accentBarActive: {
    backgroundColor: blue,
  },

  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },

  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },

  driverBlock: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },

  avatar: {
    alignItems: 'center',
    backgroundColor: blue,
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
    ...Platform.select({
      ios: {
        shadowColor: blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: typography.weights.bold,
  },

  driverText: {
    flex: 1,
    minWidth: 0,
  },

  motoristaNome: {
    color: slate900,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    lineHeight: 20,
  },

  universidade: {
    color: blue,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },

  avaliacao: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },

  estrelas: {
    flexDirection: 'row',
    gap: 1,
  },

  avaliacaoTexto: {
    color: slate400,
    fontSize: 11,
    fontWeight: typography.weights.medium,
  },

  statusBadge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },

  statusDot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },

  statusAtiva: {
    backgroundColor: emerald50,
    borderColor: emerald100,
  },

  statusAtivaText: {
    color: emerald700,
  },

  statusAtivaDot: {
    backgroundColor: emerald500,
  },

  statusCompleta: {
    backgroundColor: '#F1F5F9',
    borderColor: slate200,
  },

  statusCompletaText: {
    color: slate500,
  },

  statusCompletaDot: {
    backgroundColor: slate400,
  },

  statusCancelada: {
    backgroundColor: red50,
    borderColor: red200,
  },

  statusCanceladaText: {
    color: red600,
  },

  statusCanceladaDot: {
    backgroundColor: red500,
  },

  rotaBox: {
    backgroundColor: surface,
    borderColor: neutral100,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },

  rotaTimeline: {
    alignItems: 'center',
    paddingTop: 5,
  },

  origemDot: {
    backgroundColor: emerald500,
    borderColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    height: 11,
    width: 11,
  },

  rotaLine: {
    backgroundColor: '#D4D4D0',
    height: 22,
    marginVertical: 4,
    width: 1,
  },

  rotaTexts: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },

  rotaLabel: {
    color: slate400,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  rotaOrigem: {
    color: slate800,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },

  rotaDestino: {
    color: blue,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },

  infoGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
  },

  infoChip: {
    alignItems: 'center',
    backgroundColor: surface,
    borderColor: neutral100,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },

  infoText: {
    color: slate500,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    lineHeight: 14,
    textAlign: 'center',
  },

  vagasChip: {
    backgroundColor: emerald50,
    borderColor: emerald100,
  },

  vagasChipDisponivel: {
    backgroundColor: emerald50,
    borderColor: emerald100,
  },

  vagasChipIndisponivel: {
    backgroundColor: red50,
    borderColor: red100,
  },

  vagasChipSemHorario: {
    flex: 2,
  },

  vagasText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    lineHeight: 14,
    textAlign: 'center',
  },

  vagasTextDisponivel: {
    color: emerald700,
  },

  vagasTextIndisponivel: {
    color: red600,
  },

  observacoes: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(10, 68, 177, 0.04)',
    borderColor: 'rgba(10, 68, 177, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },

  observacoesTexto: {
    color: slate600,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },

  canceladoBox: {
    alignItems: 'center',
    backgroundColor: red50,
    borderColor: red200,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },

  canceladoTexto: {
    color: red500,
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },

  footer: {
    alignItems: 'center',
    borderTopColor: neutral100,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },

  precoBlock: {
    flex: 1,
    minWidth: 0,
  },

  precoLabel: {
    color: slate400,
    fontSize: 11,
    fontWeight: typography.weights.medium,
    marginBottom: 2,
  },

  preco: {
    color: blue,
    fontSize: 25,
    fontWeight: typography.weights.bold,
    lineHeight: 30,
  },

  button: {
    alignItems: 'center',
    backgroundColor: blue,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  buttonDisabled: {
    backgroundColor: '#F1F5F9',
    elevation: 0,
    shadowOpacity: 0,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: typography.weights.bold,
  },

  buttonTextDisabled: {
    color: slate400,
  },
});
