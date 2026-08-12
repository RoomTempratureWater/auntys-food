# Aunty's Meal Service Manager

A meal subscription and tracking platform built to help independent meal service providers (like "Aunty") manage their daily orders and customer balances. 

## The Problem
Currently, tracking meal subscriptions, daily orders (lunch vs. dinner), and remaining balances is done manually. People pay upfront for a set amount of meals (e.g., 26 meals), and they can opt to skip meals if they inform in advance. Tracking who gets a meal today, how many meals they have left, and special preferences is tedious and error-prone.

## The Solution
This project streamlines the process by providing:
1. **A Telegram Bot for Users**: Customers can book meals, skip meals, check their balance, and upload payment screenshots.
2. **A Web App for the Admin**: The service provider can manage users, view daily schedules, print delivery labels, track payments, and update meal balances.

## Tech Stack
- **Frontend/Admin Panel**: Next.js (React)
- **Bot**: Telegram Bot API (Node.js/TypeScript)
- **Database**: PostgreSQL
- **Infrastructure**: Docker & Docker Compose
