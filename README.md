# Blog work

# _About_

User can register himself on site and his mail address and password(hashed) saved in our database and he also get error message like password doesn’t match, email already registered etc. After registration is complete he can go to login page where his email and password get authenticated and also get error messages if authentication fails and he gets back to login section, once authentication is completed he can go to feed page.

**_Feed page contain_**:

-	All blog posts of different users
-	Profile Section

**_A single blog contain (on feed page)_**:

-	Name of the author, one can go to author profile by clicking on it.
-	Title (given by author), one can see the markdown section by clicking on it
-	Description (given by the author)
-	Date on which the blog is created
-	Number of likes
-	Like and comment button
-	Uploaded picture

**_Profile Section_**:

-	User name and other details.
-	All the posts created by user (this posts also contain edit and delete button for editing and deleting the post)
-	Create button(for creating new blog)
-	Logout button

**_Creating new post section_**:

-	Takes 4 inputs
-	Title: Heading of blog
-	Description
-	Markdown: Detailed content
-	Image

**_Readmore section contain_**:

-	Title
-	Description
-	createdAt(date)
-	Mardown
-	Number of likes

All section except for feed section contain home button so user can go to feed section easily.

# _Frontend-Backend_

**_Langauges used_**: html, css, javascript, node.js

**_Database_**: mongodb

**_Frameworks used_**: Express.js, Mongoose.js

**_Templating engine_**: EJS

**_Dependancies used_**: Passport.js, Bcrypt, connect-flash, Multer, Socket.io, Slugify, Markdown

**_Modules used_**: path, method-override, fs


