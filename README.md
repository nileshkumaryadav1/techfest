# 🎉 CentreFest - Centre Org. Technical + Cultural Fest Platform

A modern and **fully-featured web application** built with **Next.js 15 App Router**, designed to manage **all activities of your college’s annual technical fest and workshops**.  

> 🔧 Organize events, handle registrations, manage speakers, post announcements, and showcase your fest — all from a single platform!

---

## 🚀 Features

* 🎪 **Event Management:** Add, edit, and display all technical fest events with detailed pages.
* 📝 **Workshop Registrations:** Smooth registration flow for workshops with confirmation emails.
* 🎤 **Speakers & Guests:** Showcase keynote speakers and special guests.
* 🗕️ **Dynamic Schedule:** Real-time event and workshop schedule view.
* 🧽 **Certificate Generator (Optional):** Auto-generate certificates for participants and winners.
* 📢 **Announcements:** Post live updates, notices, and promotions.
* 📸 **Gallery:** Upload and showcase photos from past fests.
* 👩‍💻 **Admin Panel:** Role-based secure panel for organizers to manage content.
* 🌙 **Dark Mode:** Fully responsive UI with light/dark theme toggle.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)  
* **Styling & Animations:** Tailwind CSS, Framer Motion  
* **Database:** MongoDB (via Mongoose or Prisma)  
* **Authentication:** NextAuth.js or custom JWT system  
* **Media:** Cloudinary / ImageKit  
* **Email Notifications:** Nodemailer (for registrations and announcements)  
* **Deployment:** Vercel / Railway / Render  

---

## 📁 Project Structure

```
/app
  /events          - All CentreFest events
  /workshops       - Workshops with registration flow
  /admin           - Admin dashboard (protected)
  /api             - Backend API routes
  /gallery         - Fest images and media
  /about           - About the fest, team, vision
  /contact         - Contact form and location map
```

---

## ✨ Screenshots

| Event Listing    | Workshop Page  | Admin Panel       |
| ---------------- | -------------- | ----------------- |
| ![Event List](#) | ![Workshop](#) | ![Admin Panel](#) |

*(Screenshots coming soon...)*

---

## 🔒 Admin Credentials

Admins can be added manually via database or during registration with a `role` field:

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

Add your `.env.local`:

```env
MONGODB_URI=your_mongodb_url
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
JWT_SECRET=your_jwt_secret
EMAIL_SERVER=your_email_server_config
NEXTAUTH_SECRET=your_nextauth_secret
```

---

## 🥉 Possible Extensions

* Payment gateway for paid workshops  
* Live chat / helpdesk support  
* Leaderboards for competitions  
* QR code check-in system  

---

## 🙌 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss your ideas.

---

## 📜 License

[MIT](LICENSE)

---

## 💡 Built For

> This platform was created to streamline **CentreFest**, the **annual technical + cultural fest**, offering a seamless digital experience for students, organizers, and guests.

---

## 🧐 Author

Developed by [Nilesh Kumar](https://github.com/nileshkumaryadav1)

