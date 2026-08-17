const { Telegraf, session, Scenes } = require('telegraf');
const authMiddleware = require('./middleware/auth');
const balanceHandler = require('./handlers/balance');
const scheduleHandler = require('./handlers/schedule');
const bookingScene = require('./scenes/bookingScene');
const skipScene = require('./scenes/skipScene');
const paymentScene = require('./scenes/paymentScene');

function setupBot(prisma) {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  
  // Inject prisma into context
  bot.context.prisma = prisma;

  const stage = new Scenes.Stage([bookingScene, skipScene, paymentScene]);

  // Middleware
  bot.use(session());

  // Auth Middleware runs first to populate ctx.state.user for all scenes and commands
  bot.use(authMiddleware);

  bot.use(stage.middleware());

  // Wait for contact sharing before full auth middleware
  bot.on('contact', async (ctx, next) => {
    // This runs when a user shares their contact
    return next();
  });

  // Commands
  bot.start((ctx) => {
    ctx.reply('Welcome to Aunty Meals! How can I help you today?', {
      reply_markup: {
        keyboard: [
          [{ text: '🍽 Book Meals' }, { text: '⏭ Skip Meals' }],
          [{ text: '💳 Upload Payment' }, { text: '📅 My Schedule' }],
          [{ text: '💰 My Balance' }]
        ],
        resize_keyboard: true
      }
    });
  });

  bot.command('balance', balanceHandler);
  bot.hears('💰 My Balance', balanceHandler);

  bot.command('schedule', scheduleHandler);
  bot.hears('📅 My Schedule', scheduleHandler);

  bot.command('book', (ctx) => ctx.scene.enter('bookingScene'));
  bot.hears('🍽 Book Meals', (ctx) => ctx.scene.enter('bookingScene'));

  bot.command('skip', (ctx) => ctx.scene.enter('skipScene'));
  bot.hears('⏭ Skip Meals', (ctx) => ctx.scene.enter('skipScene'));

  bot.command('pay', (ctx) => ctx.scene.enter('paymentScene'));
  bot.hears('💳 Upload Payment', (ctx) => ctx.scene.enter('paymentScene'));

  // Catch-all for contact sharing logic when not registered
  bot.on('contact', async (ctx) => {
    const contact = ctx.message.contact;
    if (contact.user_id !== ctx.from.id) {
      return ctx.reply("Please share your own contact.");
    }
    
    // Auth middleware usually handles this, but if we get here, it means they shared it
    // Let's verify the phone number
    let phoneNumber = contact.phone_number;
    if (!phoneNumber.startsWith('+')) phoneNumber = '+' + phoneNumber;

    // Check if phone number exists
    const user = await prisma.user.findFirst({
      where: {
        phone_number: {
          endsWith: contact.phone_number.replace(/^\+/, '').slice(-10) // match last 10 digits
        }
      }
    });

    if (user) {
      // Link the telegram ID
      await prisma.user.update({
        where: { id: user.id },
        data: { telegram_chat_id: String(ctx.from.id) }
      });
      ctx.reply(`Thank you, ${user.name}! Your account is now linked. You can start using the bot.`);
    } else {
      ctx.reply("Sorry, we couldn't find a registered user with this phone number. Please contact admin.");
    }
  });

  return bot;
}

module.exports = setupBot;
