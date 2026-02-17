# Real-Time Poll Rooms

A simple web app where anyone can create a poll, share a link, and watch votes update live.
Built as a full-stack assignment project to demonstrate real-time systems, backend design, fairness handling, and deployment.

---

## 🔗 Project Links

**Live App:**
https://leskar-pollweb.vercel.app/

**Backend Health:**
https://pollweb.onrender.com/health

**GitHub:**
https://github.com/leskarx

---

## 🧩 What this app does

The idea is straightforward:

* Create a poll (question + at least 2 options)
* Get a shareable link
* Send it to others
* People vote once
* Results update instantly for everyone watching

Polls and votes are stored in the database, so refreshing or coming back later doesn’t reset anything.

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Socket.IO client
* Axios

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* Socket.IO
* Custom rate limiting

### Hosting

* Frontend: Vercel
* Backend: Render (free tier)
* Database: MongoDB Atlas

Note: Since the backend is on Render’s free tier, it may take a few seconds to wake up after inactivity.

---

## ✅ Features

### Create a poll

Enter a question, add options, and generate a shareable link instantly.

### Vote via link

Open the poll link, select one option, and submit your vote. No login required.

### Real-time results

When someone votes, everyone currently viewing the poll sees the results update immediately.
This is handled using Socket.IO rooms.

### Persistent data

Polls and votes are stored in MongoDB.
You can refresh, close the tab, or revisit later — everything stays intact.

---

## 🔒 Fairness / Anti-Abuse Approach

Since this is an anonymous voting system, I added multiple layers to reduce repeat voting:

* **IP-based restriction:**
  Each vote stores the client IP. Only one vote per IP per poll is allowed.

* **Database-level protection:**
  A unique index on `(pollId + ipAddress)` prevents duplicate entries even if two requests hit at the same time.

* **Rate limiting:**
  Stops rapid repeated requests and protects the server from spam.

* **Browser lock (localStorage):**
  After voting, the browser stores a flag so the user is shown results instead of voting again.

This doesn’t make the system perfect, but it makes casual abuse much harder while keeping the experience simple and anonymous.

---

## 🧪 Edge Cases Handled

Some scenarios I tested and handled:

* Invalid or non-existent poll links → shows “Poll not found”
* Voting without selecting an option → blocked on frontend
* Double-clicking the vote button → button disables + backend checks
* Two votes at the same moment → database unique index prevents duplicates
* Refresh after voting → UI stays correct using localStorage + backend validation
* Multiple users watching the same poll → results stay in sync in real time

---

## ⚠️ Known Limitations

This project intentionally keeps voting anonymous, so a few trade-offs exist:

* Users using VPNs or switching networks can bypass IP-based restrictions
* No authentication system, so votes aren’t tied to identities
* Mobile networks sometimes assign different public IPs per device/request

These are acceptable limitations for a lightweight, no-login poll system.

---

## 💭 If I had more time

A few improvements I’d explore next:

* Poll expiry (auto close after a set time)
* CAPTCHA for stronger bot protection
* Multi-select polls
* Optional login system for stricter fairness
* Cleaner mobile UI polish
* Basic analytics (total voters, activity trends)

---

## 🎯 Why I built it this way

The goal was to show end-to-end full-stack capability:

* Frontend UI + state handling
* Backend APIs
* Database design
* Real-time updates using sockets
* Fairness logic
* Deployment

Instead of only focusing on features, I tried to think about edge cases and how users might try to misuse the system, then added simple protections around that.

---

## 👨‍💻 Built by

**Gouri Shankar Konwar**
