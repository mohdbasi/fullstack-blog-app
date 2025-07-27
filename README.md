# 📝 Blog App

A modern full-stack blog application built using **Django REST Framework** (DRF) and **vanilla JavaScript with Bootstrap 5**.

Users can **register**, **login**, **create/edit/delete posts**, **like posts**, and **comment** with proper user-based access control.

---

##  Features

-  User Registration & Token-based Login
-  Create, Read, Update, Delete (CRUD) for Blog Posts
-  Like / Unlike Posts
-  Comment on Posts
-  Edit / Delete Your Own Comments
-  Only post/comment owners can edit/delete their content
-  Responsive and modern UI using Bootstrap 5

---

##  Tech Stack

### Backend
- Python 3
- Django
- Django REST Framework
- Django Token Authentication

### Frontend
- HTML5 + CSS3
- Bootstrap 5
- JavaScript (Vanilla)

---


## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mohdbasi/fullstack-blog-app
cd blog-project
```
### 2. Backend Setup

# Create a virtual environment
python -m venv venv
`venv\Scripts\activate` 

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run the server
python manage.py runserver

### 3. Frontend Setup
- Pages are rendered directly via Django templates.
- Frontend is located in:
      ```templates/frontend/ (HTML)```
      ```static/frontend/ (JavaScript)```


--- 


## API Endpoints
| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/api/register/`            | Register new user            |
| POST   | `/api/login/`               | Login user and get token     |
| POST   | `/api/logout/`              | Logout and destroy token     |
| GET    | `/api/posts/`               | List all posts               |
| POST   | `/api/posts/`               | Create a new post            |
| PUT    | `/api/posts/<id>/`          | Update a post (owner only)   |
| DELETE | `/api/posts/<id>/`          | Delete a post (owner only)   |
| POST   | `/api/posts/<id>/like/`     | Toggle like on a post        |
| GET    | `/api/posts/<id>/comments/` | List all comments for a post |
| POST   | `/api/posts/<id>/comments/` | Create comment for a post    |
| PUT    | `/api/comments/<id>/`       | Edit comment (owner only)    |
| DELETE | `/api/comments/<id>/`       | Delete comment (owner only)  |


---

## Screenshots

<img width="1920" height="1020" alt="Screenshot 2025-07-27 225110" src="https://github.com/user-attachments/assets/38da49c1-27f9-4232-8613-9642c2e89f00" />
<img width="1920" height="1020" alt="Screenshot 2025-07-27 225232" src="https://github.com/user-attachments/assets/3e199c3e-d5c2-4a75-8674-354d1b656987" />
<img width="1920" height="1020" alt="Screenshot 2025-07-27 225250" src="https://github.com/user-attachments/assets/a057e19b-2317-4941-bf9a-2d90a79f7b5f" />
<img width="1920" height="1020" alt="Screenshot 2025-07-27 225344" src="https://github.com/user-attachments/assets/eed678d0-539f-4673-ba04-b2bc52891039" />
 
