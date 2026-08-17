require('dotenv').config();
const { prisma } = require('db');
const { initMinio } = require('./src/lib/minio');
const setupBot = require('./src/bot');

async function main() {
  console.log('Starting Aunty Meals Telegram Bot...');
  
  // Initialize MinIO bucket
  await initMinio();
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('ERROR: TELEGRAM_BOT_TOKEN is not set in environment.');
    process.exit(1);
  }

  const bot = setupBot(prisma);

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  await bot.launch();
  console.log('Telegram Bot is running.');
}

main().catch(e => {
  console.error('Fatal error in bot main:', e);
  process.exit(1);
});
