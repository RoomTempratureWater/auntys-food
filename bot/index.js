console.log("Telegram Bot service started.");
// Keep process alive if bot token isn't provided yet
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.log("No TELEGRAM_BOT_TOKEN set. Waiting for configuration...");
  setInterval(() => {}, 60000);
}
