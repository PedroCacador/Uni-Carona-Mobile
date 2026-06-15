# UniCarona Mobile

Aplicativo mobile do UniCarona (React Native + Expo + TypeScript).

## Pré-requisitos

- Node.js 18+
- npm
- Expo Go (para testes em dispositivo físico)
- Backend UniCarona rodando na porta 3333

## Configuração da API

O app comunica com o backend exclusivamente via variável de ambiente `EXPO_PUBLIC_API_URL`.

### 1. Criar o arquivo `.env`

Na raiz do projeto (`Uni-Carona-Mobile/`):

```bash
cp .env.example .env
```

### 2. Definir a URL da API

Edite `.env` e substitua `SEU_IP` pelo IP local da máquina onde o backend está rodando:

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3333
```

Você pode informar com ou sem protocolo (`192.168.x.x:3333` também funciona).

### 3. Descobrir o IP local

**Windows (PowerShell ou CMD):**

```bash
ipconfig
```

Use o **Endereço IPv4** da interface Wi-Fi ou Ethernet conectada à mesma rede do celular.

**macOS / Linux:**

```bash
ip addr
# ou
ifconfig
```

### 4. Rede e backend

- O **celular** e o **computador** devem estar na **mesma rede Wi-Fi**.
- O backend deve estar em execução (`Back_end`, porta 3333).
- Em dispositivo físico, **não use** `localhost` ou `127.0.0.1` — use o IP LAN da máquina.

### 5. Reiniciar o Expo após alterar `.env`

O Metro bundler lê as variáveis na inicialização. Após mudar `.env`:

```bash
npx expo start -c
```

O flag `-c` limpa o cache e garante que a nova URL seja aplicada.

### Quando atualizar o IP

- Ao mudar de rede Wi-Fi
- Ao trocar de computador de desenvolvimento
- Se o app exibir erro de conexão com o servidor após funcionar antes

## Scripts

```bash
npm install
npm start          # expo start
npm run android
npm run ios
npm test
```

## Estrutura relevante

| Arquivo | Responsabilidade |
|---------|------------------|
| `.env` | URL da API (não versionado) |
| `.env.example` | Modelo de configuração |
| `src/config/apiConfig.ts` | Resolução e validação de `EXPO_PUBLIC_API_URL` |
| `src/services/api.ts` | Instância Axios |
| `src/utils/apiError.ts` | Mensagens de erro de rede/API |
