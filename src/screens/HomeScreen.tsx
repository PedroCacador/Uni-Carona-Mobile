import React from 'react';
import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { theme } from '../theme';

export default function HomeScreen() {
  return (
    <Container centered>
      <Typography variant="h2">Início</Typography>
      <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.sm }}>
        Encontre ou ofereça uma carona
      </Typography>
    </Container>
  );
}
