# 🎉 TechFest System - College Annual Technical Fest Platform

A powerful and modern web application built using **Next.js 15 App Router** to manage the end-to-end activities of your **college’s annual tech fest** and **technical workshops**.

> 🔧 Designed for organizing events, handling registrations, managing speakers and workshops, and showcasing fest updates — all in one place!

---

## 🚀 Features

* 🎪 **Event Management:** Add, edit, and view technical fest events with detailed pages.
* 📝 **Workshop Registrations:** Seamless registration and confirmation system for tech workshops.
* 🎤 **Speaker/Guest Section:** Highlight keynote speakers and invited guests.
* 🗕️ **Dynamic Schedule:** Real-time event and workshop schedule.
* 🧽 **Certificate Generator (Optional):** Auto-generate certificates post-event.
* 📢 **Announcements Section:** Post live updates, notices, and promotions.
* 📸 **Gallery:** Upload photos from previous fests.
* 👩‍💻 **Admin Panel:** Secure, role-based panel for organizing committee to manage content.
* 🌙 **Dark Mode:** Fully responsive with light/dark theme toggle.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) with App Router
* **Styling:** Tailwind CSS, Framer Motion for animations
* **Database:** MongoDB (via Mongoose or Prisma)
* **Authentication:** NextAuth.js or custom JWT-based
* **Media:** Cloudinary/ImageKit for images
* **Email:** Nodemailer for event/workshop confirmations
* **Deployment:** Vercel / Render / Railway

---

## 📁 Project Structure (App Router)

```
/app
  /events          - All tech fest events
  /workshops       - Tech workshops with registration
  /admin           - Admin panel (protected route)
  /api             - API routes for backend logic
  /gallery         - Fest images
  /about           - About the fest, team, and vision
  /contact         - Contact form and map
```

---

## ✨ Screenshots

| Event Listing    | Workshop Page  | Admin Panel       |
| ---------------- | -------------- | ----------------- |
| ![Event List](#) | ![Workshop](#) | ![Admin Panel](#) |

*(Screenshots coming soon...)*

---

## 🔒 Admin Credentials

You can manually create admin accounts via database or registration logic with a role field.

```js
role: "admin"
```

---

## 🧑‍💻 Running Locally

```bash
git clone https://github.com/nileshkumaryadav1/techfest.git
cd techfest
npm install
npm run dev
```

Make sure to add your `.env.local` with the following variables:

```env
MONGODB_URI=your_mongodb_url
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
JWT_SECRET=your_jwt_secret
EMAIL_SERVER=...
NEXTAUTH_SECRET=...
```

---

## 🥉 Possible Extensions

* Payment integration (for paid workshops)
* Live chat or help desk support
* Fest leaderboard system
* QR code check-in for events

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

[MIT](LICENSE)

---

## 💡 Built For

> This platform was built to streamline the management of our **College Annual Technical Fest** and **Tech Workshops**, aiming to provide an engaging and organized digital experience to students, organizers, and guests.

---

## 🧐 Author

Developed by [Nilesh Kumar](https://github.com/nileshkumaryadav1)

---
