async function authMiddleware(ctx, next) {
  if (!ctx.from) return next();

  // Allow contact messages to pass through so the handler in bot.js can process them
  if (ctx.message && ctx.message.contact) {
    return next();
  }

  const telegram_chat_id = String(ctx.from.id);
  const user = await ctx.prisma.user.findUnique({
    where: { telegram_chat_id }
  });

  if (user) {
    if (!user.is_active) {
      return ctx.reply('Your account is currently inactive. Please contact admin.');
    }
    ctx.state.user = user;
    return next();
  }

  // Not authenticated
  return ctx.reply(
    "Welcome! To use Aunty Meals bot, you need to link your account by verifying your phone number.",
    {
      reply_markup: {
        keyboard: [
          [{ text: '📱 Share Phone Number', request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    }
  );
}

module.exports = authMiddleware;
