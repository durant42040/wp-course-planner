# Course Planner

## Install

After cloning the repo, run

``` sh
pnpm install
```

To run the app on localhost, run

``` sh
pnpm dev
```

To test it on the cloud, visit <https://wp-course-planner.vercel.app/>

## Features

### Homepage
The homepage shows all available courses, displaying the course name, instructor, serial number, time, classroom, and credit. Clicking on the **Google** button searches Google for reviews of the course. You can leave comments by clicking on the comment icon. The comments are saved to local storage and will persist after reloading the webpage. You can search for courses by typing in the search bar, which searches for the course name, instructor name, serial number, and classroom. To filter for a specific time slot, click on the **Filter By Time** button. Click and drag the mouse to select a time period. 
<img width="1467" height="768" alt="Course Planner" src="https://github.com/user-attachments/assets/93f0e8e9-a833-493e-b1fb-8210a0dea575" />

Pagination is implemented to display 10 courses at a time.
### My Courses
To add a course to favorites, click on the **Add** button. The course will be added to My Courses, which is also saved to local storage. It can be removed by navigating to My Courses and clicking the **Remove** button. Click on the **Calendar** button to enter calendar view. If there are multiple courses in a single time slot, they are stacked vertically.

<img width="1348" height="715" alt="Screenshot 2025-09-03 at 10 05 15 AM" src="https://github.com/user-attachments/assets/633541dc-6e0d-49b6-9090-bc2efb29aaad" />

## Implementation
* **Frontend:** React + TypeScript + Vite
* **Styling:** Tailwind CSS
* **UI Library:** Shadcn UI
* **Icons:** Lucide React
* **Code Quality:** ESLint + Prettier + Husky

The Excel data is preprocessed to save only the most relevant information. This reduces the loading time of the webpage. Most UI components are Shadcn components, including the cards, buttons, dialog, pagination, and comment sheet. For each course, a hash is created to determine the color of the course in calendar view. Responsive web design is implemented to support mobile views.

The project uses ESLint with Airbnb configuration for linting, Prettier for code formatting, and Husky with lint-staged to automatically run these tools on staged files before commits.

