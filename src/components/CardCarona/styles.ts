import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme';

const { colors, spacing, typography, radius } = theme;

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  motoristaInfo: {
    flex: 1,
    marginRight: spacing.md,
  },

  motoristaNome: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  universidade: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  avaliacaoEstrelas: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  estrelaCheia: {
    fontSize: typography.sizes.md,
    color: '#FFD700',
  },

  estrelaVazia: {
    fontSize: typography.sizes.md,
    color: colors.textLight,
  },

  avaliacaoTexto: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },

  vagasBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },

  vagasBadgeDisponivel: {
    backgroundColor: colors.success + '20',
  },

  vagasBadgeIndisponivel: {
    backgroundColor: colors.error + '20',
  },

  vagasBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },

  vagasBadgeTextDisponivel: {
    color: colors.success,
  },

  vagasBadgeTextIndisponivel: {
    color: colors.error,
  },

  rota: {
    marginBottom: spacing.md,
  },

  rotaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ponto: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },

  pontoVerde: {
    backgroundColor: colors.success,
  },

  pontoVermelho: {
    backgroundColor: colors.error,
  },

  rotaTexto: {
    fontSize: typography.sizes.md,
    color: colors.text,
    flex: 1,
  },

  rotaLabel: {
    fontWeight: typography.weights.bold,
  },

  linhaContainer: {
    paddingLeft: 5,
    marginVertical: spacing.xs,
  },

  linhaDivisor: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
  },

  dataHora: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.lg,
    flexWrap: 'wrap',
  },

  dataHoraItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dataHoraIcon: {
    fontSize: typography.sizes.md,
    marginRight: spacing.xs,
  },

  dataHoraTexto: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },

  observacoes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.textLight + '10',
    borderRadius: radius.sm,
  },

  observacoesIcon: {
    fontSize: typography.sizes.md,
    marginRight: spacing.xs,
    marginTop: 2,
  },

  observacoesTexto: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },

  statusCancelado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.error + '10',
    borderRadius: radius.sm,
  },

  statusCanceladoIcon: {
    fontSize: typography.sizes.md,
    marginRight: spacing.xs,
  },

  statusCanceladoTexto: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    fontWeight: typography.weights.bold,
  },

  precoVagas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    gap: spacing.md,
    flexWrap: 'wrap',
  },

  precoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  preco: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  vagasContainer: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },

  vagasLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  vagasRestantesContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary + '10',
    borderRadius: radius.pill,
  },

  vagasRestantes: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: colors.textLight,
  },

  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
});
