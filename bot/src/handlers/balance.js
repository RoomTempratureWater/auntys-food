async function balanceHandler(ctx) {
  const user = ctx.state.user;
  
  if (!user) {
    return ctx.reply('Please authenticate first.');
  }

  // Fetch latest balance from DB just to be sure it's fresh
  const freshUser = await ctx.prisma.user.findUnique({
    where: { id: user.id },
    select: { meal_balance: true }
  });

  const balance = freshUser ? freshUser.meal_balance : user.meal_balance;

  ctx.reply(
    `💰 **Your Current Balance**\n\n` +
    `You have **${balance}** meals remaining.\n\n` +
    `To add more meals, upload a payment screenshot using the /pay command or '💳 Upload Payment' button.`,
    { parse_mode: 'Markdown' }
  );
}

module.exports = balanceHandler;
