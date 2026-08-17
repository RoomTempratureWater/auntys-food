const { Scenes, Markup } = require('telegraf');

const bookingWizard = new Scenes.WizardScene(
  'bookingScene',
  // Step 1: Ask meal type
  async (ctx) => {
    const user = ctx.state.user;
    if (!user) {
      ctx.reply('Please authenticate first.');
      return ctx.scene.leave();
    }
    if (user.meal_balance <= 0) {
      ctx.reply('Your meal balance is zero or negative. Please upload a payment to add balance.');
      return ctx.scene.leave();
    }

    await ctx.reply('Which meal would you like to book?', Markup.inlineKeyboard([
      [Markup.button.callback('☀️ Lunch', 'book_lunch'), Markup.button.callback('🌙 Dinner', 'book_dinner')],
      [Markup.button.callback('Cancel', 'cancel')]
    ]));
    return ctx.wizard.next();
  },
  // Step 2: Ask date
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const action = ctx.callbackQuery.data;
    
    if (action === 'cancel') {
      await ctx.reply('Booking cancelled.');
      return ctx.scene.leave();
    }

    if (action === 'book_lunch' || action === 'book_dinner') {
      ctx.scene.session.mealType = action === 'book_lunch' ? 'lunch' : 'dinner';
      
      // Generate next 7 days for inline keyboard
      const buttons = [];
      const today = new Date();
      for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        const dateStr = nextDate.toISOString().split('T')[0];
        const displayDate = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        buttons.push([Markup.button.callback(displayDate, `date_${dateStr}`)]);
      }
      buttons.push([Markup.button.callback('Cancel', 'cancel')]);

      await ctx.editMessageText(`You selected ${ctx.scene.session.mealType}. Which date?`, Markup.inlineKeyboard(buttons));
      return ctx.wizard.next();
    }
    
    return ctx.scene.leave();
  },
  // Step 3: Confirm and save
  async (ctx) => {
    if (!ctx.callbackQuery) return;
    const action = ctx.callbackQuery.data;

    if (action === 'cancel') {
      await ctx.reply('Booking cancelled.');
      return ctx.scene.leave();
    }

    if (action.startsWith('date_')) {
      const dateStr = action.replace('date_', '');
      const mealType = ctx.scene.session.mealType;
      const user = ctx.state.user;
      
      const selectedDate = new Date(dateStr);

      try {
        // Run in transaction to ensure consistency
        await ctx.prisma.$transaction(async (tx) => {
          // Check if already booked
          const existing = await tx.mealSchedule.findFirst({
            where: {
              user_id: user.id,
              date: selectedDate,
              type: mealType,
              status: 'booked'
            }
          });

          if (existing) {
            throw new Error('You already have a booking for this date and meal.');
          }

          // Check balance again
          const freshUser = await tx.user.findUnique({ where: { id: user.id } });
          if (freshUser.meal_balance <= 0) {
            throw new Error('Insufficient balance.');
          }

          // Deduct balance
          await tx.user.update({
            where: { id: user.id },
            data: { meal_balance: freshUser.meal_balance - 1 }
          });

          // Create balance transaction
          await tx.balanceTransaction.create({
            data: {
              user_id: user.id,
              amount: -1,
              reason: `Booked ${mealType} on ${dateStr}`
            }
          });

          // Create schedule
          await tx.mealSchedule.create({
            data: {
              user_id: user.id,
              date: selectedDate,
              type: mealType,
              status: 'booked'
            }
          });
        });

        await ctx.editMessageText(`✅ Successfully booked ${mealType} for ${dateStr}. 1 meal deducted from your balance.`);
      } catch (error) {
        console.error("Booking error:", error);
        await ctx.editMessageText(`❌ Booking failed: ${error.message}`);
      }

      return ctx.scene.leave();
    }

    return ctx.scene.leave();
  }
);

bookingWizard.command('cancel', async (ctx) => {
  await ctx.reply('Booking cancelled.');
  return ctx.scene.leave();
});



module.exports = bookingWizard;
