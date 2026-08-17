const { Scenes, Markup } = require('telegraf');

const skipWizard = new Scenes.WizardScene(
  'skipScene',
  // Step 1: Show upcoming booked meals
  async (ctx) => {
    const user = ctx.state.user;
    if (!user) {
      ctx.reply('Please authenticate first.');
      return ctx.scene.leave();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBookings = await ctx.prisma.mealSchedule.findMany({
      where: {
        user_id: user.id,
        date: { gte: today },
        status: 'booked'
      },
      orderBy: [
        { date: 'asc' },
        { type: 'asc' }
      ]
    });

    if (upcomingBookings.length === 0) {
      ctx.reply('You have no upcoming booked meals to skip.');
      return ctx.scene.leave();
    }

    const buttons = [];
    for (const meal of upcomingBookings) {
      const dateStr = meal.date.toISOString().split('T')[0];
      const displayDate = meal.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const icon = meal.type === 'lunch' ? '☀️' : '🌙';
      
      // Calculate cutoff time
      // For MVP, we use server local time
      const mealDateObj = new Date(dateStr);
      let cutoffHour = meal.type === 'lunch' ? 6 : 12; 
      const cutoffTime = new Date(mealDateObj);
      cutoffTime.setHours(cutoffHour, 0, 0, 0);

      // Only show if we are before cutoff
      if (new Date() < cutoffTime) {
        buttons.push([Markup.button.callback(`Skip ${icon} ${meal.type} on ${displayDate}`, `skip_${meal.id}`)]);
      }
    }

    if (buttons.length === 0) {
      ctx.reply('You have booked meals, but it is too late to skip them (must be 8 hours prior).');
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Cancel', 'cancel')]);
    
    await ctx.reply('Which meal would you like to skip?', Markup.inlineKeyboard(buttons));
    return ctx.wizard.next();
  },
  // Step 2: Confirm skip
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const action = ctx.callbackQuery.data;

    if (action === 'cancel') {
      await ctx.editMessageText('Skipping cancelled.');
      return ctx.scene.leave();
    }

    if (action.startsWith('skip_')) {
      const scheduleId = parseInt(action.replace('skip_', ''));
      const user = ctx.state.user;

      try {
        await ctx.prisma.$transaction(async (tx) => {
          const meal = await tx.mealSchedule.findUnique({ where: { id: scheduleId } });
          if (!meal || meal.user_id !== user.id || meal.status !== 'booked') {
            throw new Error("Meal not found or already skipped.");
          }

          // Double check cutoff time inside transaction
          const dateStr = meal.date.toISOString().split('T')[0];
          const mealDateObj = new Date(dateStr);
          let cutoffHour = meal.type === 'lunch' ? 6 : 12;
          const cutoffTime = new Date(mealDateObj);
          cutoffTime.setHours(cutoffHour, 0, 0, 0);

          if (new Date() >= cutoffTime) {
            throw new Error('Too late to skip. Must be done 8 hours prior.');
          }

          // Mark skipped
          await tx.mealSchedule.update({
            where: { id: scheduleId },
            data: { status: 'skipped' }
          });

          // Refund balance
          const freshUser = await tx.user.findUnique({ where: { id: user.id } });
          await tx.user.update({
            where: { id: user.id },
            data: { meal_balance: freshUser.meal_balance + 1 }
          });

          // Create balance transaction
          await tx.balanceTransaction.create({
            data: {
              user_id: user.id,
              amount: 1,
              reason: `Refund for skipping ${meal.type} on ${dateStr}`
            }
          });
        });

        await ctx.editMessageText(`✅ Successfully skipped the meal and refunded 1 meal to your balance.`);
      } catch (error) {
        await ctx.editMessageText(`❌ Failed to skip: ${error.message}`);
      }

      return ctx.scene.leave();
    }

    return ctx.scene.leave();
  }
);

skipWizard.command('cancel', async (ctx) => {
  await ctx.reply('Skipping cancelled.');
  return ctx.scene.leave();
});



module.exports = skipWizard;
