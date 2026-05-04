import React from 'react';
import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { theme } from '../theme';

export default function RidesScreen() {
  return (
    <Container centered>
      <Typography variant="h2">Minhas Caronas</Typography>
      <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.sm }}>
        Histórico e caronas ativas
      </Typography>
    </Container>
  );
}
