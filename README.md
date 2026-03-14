Social Media Interaction & Notification System
Overview
This project is a sophisticated, real-time Social Media Dashboard built using Angular 17+. It is designed to handle core social interactions such as post commenting and user notifications with a focus on seamless user experience, high performance, and clean architecture. The application demonstrates the power of standalone components, reactive programming with RxJS, and modern styling with Tailwind CSS.

Core Features
1. Dynamic Notification Management
The notification system is built to keep users engaged with real-time updates.

Filtering Logic: Users can switch between "All" and "Unread" notifications. This involves complex state management to ensure that the UI reflects the correct data subset fetched from the REST API.

Visual Cues: Notifications are categorized by type (Likes, Comments, Shares) using distinct icons and color-coded indicators for better accessibility.

2. Advanced Commenting System (CRUD)
A fully functional comment module that allows users to interact with posts dynamically.

Operations: Supports full Create, Read, Update, and Delete operations.

Interactive UI: Features a custom-built, context-aware action menu for editing and deleting comments, designed to mimic major social platforms like Facebook and LinkedIn.

User-Centric Design: Implemented "Click-Outside" logic and transparent backdrops to ensure menus close intuitively.

3. Custom Data Transformation
To enhance readability, I developed custom Angular Pipes:

TimeAgo Pipe: Automatically transforms UTC timestamps into human-readable formats (e.g., "5 minutes ago").

Date Formatting: Precise formatting for older notifications to display specific dates and times clearly.

Technical Implementation
Tech Stack
Frontend: Angular 17 (Standalone Components, Signals, and Control Flow Syntax).

Styling: Tailwind CSS for responsive and utility-first design.

State Management: RxJS Observables for handling asynchronous data streams.

HTTP Client: Integrated with Interceptors for global error handling and authentication token injection.

Challenges & Solutions
During development, I encountered a significant challenge with GitHub Pages deployment regarding base-href paths. I resolved this by configuring the build process to recognize the subfolder structure of GitHub repositories. Additionally, I optimized API calls by implementing local UI updates (Optimistic UI) to ensure the application feels snappy even on slower connections.

How to Run
Clone the repository.

Run npm install to install dependencies.

Use ng serve for a dev server.

Navigate to http://localhost:4200/.
