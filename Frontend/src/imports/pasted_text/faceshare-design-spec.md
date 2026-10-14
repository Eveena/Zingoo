Project Name: FaceShare - AI Social Media Platform

Prompt

Design a modern, premium, responsive social media website called FaceShare. The website is part of an ML project called Sentry, whose purpose is to detect unauthorized use of people's faces online.

FaceShare is not a real social media platform but a demo website where users upload only photos. Every uploaded photo is permanently stored in the database and later processed by an external AI system that calculates face embeddings. Those embeddings are stored in the database and accessed by the Sentry platform for facial similarity matching. The embedding values are never shown to users.

The UI should look similar to Instagram but much simpler, modern, clean, and professional.

Design Style
Modern minimalistic UI
Rounded cards
Glassmorphism where appropriate
Soft shadows
White background
Primary Color:
#4F46E5 (Indigo)
Accent Color:
#6366F1
Success:
#10B981
Warning:
#F59E0B
Error:
#EF4444
Border Radius:
16px
Font:
Inter
Smooth animations
Mobile-first responsive layout
Professional startup appearance
Pages Required
1. Landing Page

Top Navigation

Logo:
FaceShare

Menu

Home
Explore
About
Login
Sign Up

Hero Section

Large heading

Share Your Moments Securely

Subheading

Upload photos, connect with others, and experience a simplified social platform powered by AI.

Buttons

Primary

Create Account

Secondary

Learn More

Illustration

Modern social media artwork

Footer

Links

Privacy

Terms

Contact

GitHub

2. Login Page

Centered Card

Fields

Email

Password

Remember Me checkbox

Forgot Password

Login button

Divider

OR

Google Login button (UI only)

Bottom

Don't have an account?

Sign Up

Background

Gradient with abstract shapes

3. Sign Up Page

Fields

Profile Picture

Username

Full Name

Email

Password

Confirm Password

Create Account

Terms Checkbox

Professional form validation styling

4. Home Dashboard

Top Navbar

Logo

Search Bar

Notifications

Messages

Profile Avatar

Left Sidebar

Home

Explore

Upload

Messages

Bookmarks

Settings

Logout

Main Area

Grid of image posts

Each card contains

Large image

Username

Upload Date

Like Button

Comment Button

Share Button

No reels

No videos

Only photos

Hover effects

Right Sidebar

Suggested Users

Trending Tags

Recent Uploads

5. Upload Photo Page

Large upload card

Drag and Drop

Browse Files

Preview Image

Caption textbox

Location textbox

Upload Button

Progress Bar

After upload

Success Animation

Status

Photo Uploaded Successfully

Small note

Your image is securely stored and automatically processed by our AI detection system.

(No embedding information shown.)

6. User Profile

Large cover image

Circular profile picture

Username

Bio

Followers

Following

Posts Count

Edit Profile

Grid Gallery

Uploaded Images

Photo only

Statistics

Total Uploads

Total Likes

Member Since

7. Explore Page

Pinterest-style masonry grid

Large Search Bar

Filter Chips

People

Nature

Travel

Technology

Animals

Portrait

Latest

Popular

Clicking image opens

Image Details Modal

8. Image Details Modal

Large image

Uploader Name

Upload Date

Caption

Comments

Like Button

Report Button

Download Disabled

9. Messages

Simple chat UI

Conversation List

Chat Window

Message Input

Attachment disabled

Minimal functionality

10. Notifications

List View

Photo Liked

Comment Added

New Follower

Image Uploaded Successfully

Newest First

11. Settings

Profile Settings

Password

Theme

Privacy

Delete Account

Logout

Database Awareness (UI only)

Every uploaded image should internally represent

Image ID

Uploader ID

Upload Timestamp

Storage Path

Processing Status

Face Embedding Generated (hidden)

Embedding Vector Stored (hidden)

The UI should never expose these values.

Backend Integration Notes (For Developers)

Each uploaded image should call an API endpoint

POST /upload

Backend stores

Original Image

Image Metadata

Face Embedding Vector

Embedding Stored in Database

The Sentry backend later reads the embedding table for similarity matching.

No AI inference is performed inside the UI.

Components Required

Buttons

Cards

Navbar

Sidebar

Upload Component

Search Bar

Notification Badge

Profile Avatar

Image Card

Gallery Grid

Modal

Toast Notification

Loading Spinner

Progress Bar

Forms

Dropdown

Tabs

Pagination

Infinite Scroll UI

UX Requirements

Responsive

Desktop

Tablet

Mobile

Smooth transitions

Hover animations

Loading skeletons

Empty states

Error pages

404 page

Success popups

Confirmation dialogs

Modern spacing

Accessible colors

AI Design Instructions

Generate a polished SaaS-quality interface similar to Instagram, Threads, and Pinterest but simplified.

Focus on image uploads, user profiles, gallery browsing, and secure content storage.

Avoid reels, stories, live streaming, and video uploads.

Create reusable components using Auto Layout.

Organize the design system with colors, typography, spacing, icons, buttons, inputs, cards, and navigation.

Use clean spacing, subtle shadows, rounded corners, and professional typography.

The final output should be a high-fidelity, developer-ready Figma file with desktop, tablet, and mobile layouts.