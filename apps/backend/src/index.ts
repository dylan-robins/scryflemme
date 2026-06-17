import { createApp } from './app.js';
import { prisma } from './lib/prisma.js';

const app = createApp(prisma);
const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
