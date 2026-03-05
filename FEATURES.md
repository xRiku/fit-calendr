# FitCalendr — Viral Feature Ideas

Features designed to generate organic social media sharing and free marketing.

---

## Tier 1 — Highest Viral Potential 🔥

### 1. Year-in-Review Shareable Card (Spotify Wrapped effect)
Auto-generate a beautiful image at year-end (and on demand) showing total workouts, longest streak, cheat meals, busiest month, and fun personality badges (e.g. "The Streak Machine", "Weekend Warrior", "The Balanced One").
- Add a **Share to Twitter/Instagram** button with FitCalendr watermark
- Prompt users automatically in December/January
- Accessible year-round at `/recap`

**Why it spreads:** Same mechanic as Spotify Wrapped. People love sharing their fitness year.

---

### 2. Streak Milestone Celebration Cards
When a user hits a streak milestone (7, 14, 30, 60, 90, 100, 365 days), show a beautiful animated celebration card with a pre-filled share message: *"I just hit a 30-day workout streak with @FitCalendr 🔥 #FitCalendr #Streak30"*

**Why it spreads:** Milestones feel earned. The fitness Twitter/X community is huge and loves streak content.

---

### 3. One-Click Heatmap Export
Let users export their GitHub-style yearly heatmap as a PNG with branding. Caption template auto-fills: *"My 2025 fitness journey 🟩🟩🟩 — tracked with FitCalendr"*

**Why it spreads:** Fitness Twitter loves heatmap visuals. Taps the same energy as GitHub contribution graphs.

---

## Tier 2 — Strong Engagement 💪

### 4. Public Profile Page ⬅️ (Next to build)
Opt-in public profile page at `fitcalendR.com/u/username` showing:
- Yearly heatmap
- Current streak + longest streak
- Monthly workout count
- No private data — only activity patterns

Users can link it in their bio. Fitness influencers use it as a proof-of-consistency page. Accountability partners share each other's links.

**Why it spreads:** Word-of-mouth growth. Influencers drive traffic. Accountability culture in fitness communities.

> See discussion notes below ↓

---

### 5. 30-Day Challenge Mode
Users start a named challenge (e.g. "Work out 25 of the next 30 days"). They get:
- A shareable "I just started" card
- A shareable "I completed it" card

Two organic share moments per user per challenge.

**Why it spreads:** Challenges are inherently social. Start + completion = 2 posts per user.

---

### 6. Balance Score & Personality Badge
Calculate a weekly/monthly "Balance Score" based on workout consistency vs. cheat meal ratio. Generate a fun personality label:
- "The Disciplined Athlete"
- "The Balanced One"
- "The Weekend Warrior"
- "The Streak Machine"
- "The Guilt-Free Foodie"

Displayed as a shareable card.

**Why it spreads:** Personality-type content always goes viral. Low effort to share, high identity relevance.

---

## Tier 3 — Community Growth 🌱

### 7. Accountability Pairs
Users invite one specific friend. Both see each other's current streak (no full data). Get notified if your partner breaks their streak.

**Why it spreads:** Guaranteed new user per invite. Accountability culture drives retention.

---

### 8. Opt-in Monthly Leaderboard
Anonymous opt-in global leaderboard showing top streaks and workout counts for the month. Users can see their rank.

**Why it spreads:** Competition drives sharing. "I'm #47 this month on FitCalendr" is a brag worth posting.

---

### 9. Referral Badges / "Invited by" Chain
When someone signs up via a referral link, both users get a badge. Referral chain visible on profile.

**Why it spreads:** Social proof + reciprocity. Referral links get shared naturally.

---

## Implementation Stack Notes
- `html-to-image` or `dom-to-image-more` — Convert DOM nodes to PNG for sharing
- Web Share API — `navigator.share()` for native mobile sharing
- Pre-filled tweet links — `https://twitter.com/intent/tweet?text=...`
- Canvas API — Custom card rendering

---

## Feature 4 — Discussion Notes

### Open Questions
- What data should be visible on the public profile?
- Should the username be the same as the account email username, or let users pick a custom handle?
- Should there be a way to password-protect or restrict the profile?
- Should the public profile be indexable by search engines, or only accessible via direct link?
- What happens if a user wants to delete their public profile but keep their account?
