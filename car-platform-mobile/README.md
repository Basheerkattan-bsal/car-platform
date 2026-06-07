# Carvia Mobile

React Native mobile client for Carvia, built with Expo and TypeScript.

## Local Development

```bash
npm install
npm start
```

## API URL

Create a local env file from the example:

```bash
cp .env.example .env
```

Default:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:5050/api
```

If you run the app on a physical phone, `localhost` points to the phone, not
your Mac. Use your Mac's LAN IP instead:

```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_MAC_LAN_IP:5050/api
```
