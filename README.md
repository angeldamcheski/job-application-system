# Job Application Management System

A full-stack web application built to streamline the recruitment process for both candidates and administrators.  
The system enables users to browse, save, and apply to job postings, while administrators can manage listings and monitor applications efficiently.

---

## 📌 Overview

The **Job Application Management System** provides a centralized platform for:

- Publishing and managing job postings
- Allowing candidates to apply with CV uploads
- Saving job listings for later review
- Tracking applicants per job post
- Activating/deactivating job posts

The platform is designed with a clean, responsive user interface and a secure, scalable backend architecture.

---

## 🚀 Features

### 👤 User (Candidate) Features

- Browse active job postings
- View detailed job descriptions
- Save job listings for later
- Apply to job postings with CV/resume upload
- View previously applied jobs
- Secure authentication and authorization

### 🛠️ Admin Features

- Create job postings
- Edit existing job postings
- Activate / deactivate job posts
- View all job postings (active and inactive)
- View all applicants for a specific job post
- Monitor application activity

---

## 🏗️ System Roles

### 1. User (Candidate)
- Can browse and apply to active job posts
- Can upload CV during application
- Can save job listings
- Can track their applications

### 2. Admin
- Full job post management
- Access to applicants per job post
- Control over job post status (ACTIVE / INACTIVE)

---

## 🧩 Core Modules

### 📌 Job Management
- Create job posts (Admin)
- Edit job posts (Admin)
- Activate / deactivate job posts (Admin)
- List active job posts (User)

### 📎 Application Management
- Submit application with CV upload
- Associate users with job posts
- View applicants per job post (Admin)

### 💾 Saved Jobs
- Save job listings
- Remove saved jobs
- View saved jobs list

---


---

## 🔐 Authentication & Authorization

- Role-Based Access Control (RBAC)
- Secure login & registration
- Protected routes for admin functionality
- JWT-based authentication (if applicable)
- Secure file upload handling for CVs

---

## 🔄 Application Workflow

1. Admin creates a new job post.
2. Job post is marked as **ACTIVE**.
3. Users browse available job listings.
4. User submits an application with CV.
5. Admin reviews applicants.
6. Admin deactivates the job post when hiring is complete.

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **TypeScript**
- Axios (API communication)
- React Router (routing)
- State management (Context API / React Query if used)

### Backend
- **Java Spring Boot**
- Spring Security
- RESTful API architecture
- File upload handling
- DTO-based request/response structure

### Database
- **PostgreSQL**
- JPA / Hibernate ORM
- Relational data model

---

