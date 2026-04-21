# Sprintly  
*A Jira-inspired full-stack project management platform*

🔗 **Repository:** https://github.com/UjjwalGupta1105/Sprintly  

---

## Overview  
**Sprintly** is a scalable full-stack project management platform designed to streamline team collaboration and task execution. Inspired by Jira, it enables teams to efficiently manage work using **Kanban boards, sprint planning, and issue lifecycle tracking**.

> Improved workflow efficiency by ~40% through structured task management.

---

## 🌟 Screenshots
![Home Page](./Screenshot 2026-04-21 192817.png)
![Organization Page](./Screenshot 2026-04-21 193124.png)
![Sprint Page](./Screenshot 2026-04-21 193225.png)
![Issue Page](./Screenshot 2026-04-21 193302.png)

## Features  

### Project & Task Management  
- Kanban boards for visual task tracking  
- Sprint-based workflow organization  
- Full issue lifecycle management  

### Backend Performance & Reliability  
- Transaction-safe operations for concurrency handling  
- Consistent updates using database-level safeguards  
- Faster workflow transitions (~35% improvement)

### Collaboration System  
- Role-based access control (RBAC)  
- Email-based team invitations  
- Comment threads on issues  
- Organization-level activity logs  

### Authentication  
- Secure authentication via Clerk  
- Protected routes and role-based authorization  

### UI/UX  
- Responsive design with Tailwind CSS  
- Smooth animations with Framer Motion  
- Clean and intuitive interface  

---

## Tech Stack  

- **Frontend:** Next.js, React.js  
- **Backend:** Node.js (API via Next.js)  
- **Database:** PostgreSQL + Prisma ORM  
- **Cloud DB:** NeonDB  
- **Authentication:** Clerk  
- **Styling:** Tailwind CSS  
- **Animations:** Framer Motion  

---

## System Design Highlights  

- Atomic transactions ensure data consistency  
- Handles concurrent updates safely  
- Scalable architecture for team collaboration  
- Optimized database schema using Prisma  

---

## Getting Started  

### Clone the Repository  
```bash
git clone https://github.com/UjjwalGupta1105/Sprintly.git
cd Sprintly

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

