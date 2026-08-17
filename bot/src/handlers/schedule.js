async function scheduleHandler(ctx) {
  const user = ctx.state.user;
  
  if (!user) {
    return ctx.reply('Please authenticate first.');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeals = await ctx.prisma.mealSchedule.findMany({
    where: {
      user_id: user.id,
      date: {
        gte: today
      }
    },
    orderBy: [
      { date: 'asc' },
      { type: 'asc' }
    ]
  });

  if (upcomingMeals.length === 0) {
    return ctx.reply("📅 You have no upcoming meals scheduled.\nUse '🍽 Book Meals' to schedule some!");
  }

  // Format the schedule
  let message = `📅 **Your Upcoming Meals**\n\n`;
  
  // Group by date
  const grouped = {};
  for (const meal of upcomingMeals) {
    const dateStr = meal.date.toISOString().split('T')[0];
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(meal);
  }

  for (const [dateStr, meals] of Object.entries(grouped)) {
    const dateObj = new Date(dateStr);
    const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    message += `**${displayDate}**\n`;
    
    for (const meal of meals) {
      const icon = meal.type === 'lunch' ? '☀️' : '🌙';
      const statusIcon = meal.status === 'booked' ? '✅' : '❌';
      message += `  ${icon} ${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}: ${statusIcon} ${meal.status}\n`;
    }
    message += `\n`;
  }

  ctx.reply(message, { parse_mode: 'Markdown' });
}

module.exports = scheduleHandler;
