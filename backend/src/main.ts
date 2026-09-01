import { Logger } from '@nestjs/common';
import { createApp } from './create-app';

async function bootstrap() {
  const app = await createApp();
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  new Logger('Bootstrap').log(`API on http://localhost:${port}/api`);
}

void bootstrap();
