# Task-Manager
*****Andrea Gularte Herrera*****

First web developement assignment

This project was developed as part of a homework assignment to demonstrate knowledge of:
- HTTP methods (GET, POST, PUT, DELETE)
- Express.js for server-side logic
- Express Handlebars for templating
- Static files (CSS, JS, Images)
- File-based data storage using JSON
- Filtering, sorting, and managing tasks
- Proper error handling with custom 404 & 500 pages

Feautures:
- User Authentication: Login system with automatic user creation
- Task Management: Users can add, edit, complete, and cancel tasks
- Task Filtering: Filter tasks by title, status, and due date
- Task Actions: Mark tasks as Complete or Cancel
- Custom Validation: Tasks with a Completed status or past due date must have a completion date
- Persistent Storage: Uses JSON files instead of a database
- Error Handling: Includes custom 404 & 500 error pages

Installation instructions

1. Clone the repository
   - git clone https://github.com/andreaghh/Task-Manager.git
   - cd Task-Manager
2. Install dependecies (npm install)
3. Start the application (npm run dev)

How to use:
1. Login:
    - Enter a name and username on the login page. 
    - If the username does not exist, an account is automatically created.
    - test user= name: "Andrea" username: "andrea1999"

2. Add a task:
    - Click "Add New Task".
    - Fill in the title, description, due date, priority, and status. Tasks with a Completed status or past due date must have a completion date
    - Click "Add Task"

3. Manage tasks:
    - Edit a task using the "Edit" button. 
    - Mark as Complete or Cancel a task using the buttons.
    - Filter tasks by title, status, and due date.