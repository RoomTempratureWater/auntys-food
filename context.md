# Project Features and Context

## End User Features (Telegram Bot)
- **Book Meals**: Book meals for a single day or a range of days.
- **Select Meal Type**: Book lunch or dinner (given enough balance).
- **Skip Meals**: Skip a day or range of days. Must be done 8 hours prior to delivery (before 6 AM for 2 PM lunch, before 12 PM for 8 PM dinner).
- **View Balance**: Check remaining meals balance.
- **View Schedule**: View upcoming meal bookings (ideally a calendar view if possible).
- **Upload Payments**: Upload screenshots of payments for admin approval.

## Admin Features (Next.js Web App)
- **User Management**:
  - Register new users and deactivate old/canceled users.
  - Only registered phone numbers can interact with the Telegram bot.
  - Edit user details (phone number, address, comments/preferences).
- **Daily Schedule Dashboard**:
  - View today's schedule for lunch and dinner.
  - See totals: how many veg, how many non-veg.
  - See details: addresses, special preferences.
- **Delivery Labels**:
  - From the daily view, generate a printable list of people with name, address, phone number, and preferences.
  - Formatted to fit multiple labels on an A4 page (e.g., 12 per page) for easy printing, cutting, and pasting on delivery boxes.
- **Payment & Balance Management**:
  - View uploaded payment screenshots.
  - Add meal balances to users upon confirming payment.
  - Settings to define default meal plan days (e.g., default 26 meals).
  - Ability to add custom meal amounts (e.g., 2 or 5 meals).
