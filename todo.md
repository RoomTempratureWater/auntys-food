# Project Tasks

## Setup & Infrastructure
- [ ] Initialize Git repository
- [ ] Setup Next.js web application
- [ ] Setup Node.js Telegram bot project
- [ ] Setup PostgreSQL database
- [ ] Create Dockerfiles for web and bot
- [ ] Create `docker-compose.yml` for local development

## Database & Models
- [ ] Design database schema (Users, Meals, Bookings, Payments, Settings)
- [ ] Setup Prisma/Drizzle ORM for database access
- [ ] Run initial migrations

## Admin Web App (Next.js)
- [ ] Implement Admin Authentication
- [ ] Build User Management interface (CRUD users)
- [ ] Build Daily Schedule Dashboard (Lunch/Dinner split, Veg/Non-Veg totals)
- [ ] Implement Delivery Label printing view
- [ ] Build Payment Verification and Balance Update interface
- [ ] Create Settings page (default meal counts)

## Telegram Bot
- [ ] Setup bot framework (Telegraf or grammY)
- [ ] Implement User Authentication (verify registered number)
- [ ] Implement `/balance` command
- [ ] Implement Meal Booking flow (Lunch/Dinner, single/range)
- [ ] Implement Meal Skipping flow (with 8-hour restriction logic)
- [ ] Implement Payment Screenshot upload flow
- [ ] Implement Schedule viewing (Calendar view via Inline Keyboard)

## Integration & Polish
- [ ] Connect bot actions to database
- [ ] Connect web dashboard to real database data
- [ ] Test end-to-end flows

## Future Upgrades
- [ ] Create an on-demand web link for a visual calendar view (from Telegram bot)
