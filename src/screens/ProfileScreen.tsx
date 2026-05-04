import React from 'react';
import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { theme } from '../theme';

export default function ProfileScreen() {
  return (
    <Container centered>
      <Typography variant="h2">Perfil</Typography>
      <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.sm }}>
        Gerencie sua conta e preferências
      </Typography>
    </Container>
  );
}
