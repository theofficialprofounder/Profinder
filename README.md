<p>
    <h1>PROFINDER</h1>
</p>

![profinder](https://user-images.githubusercontent.com/94105990/145556852-0492521e-6752-468a-9191-ea04ff793284.png)

<p>
    A website to help connect programmers and help find project mates 🧑🏻‍💻👩🏻‍💻 Checkout the deployment <a href="https://profinder-app.herokuapp.com/users/sign-in">here </a>
</p>
<br>

- [Features](#features)
- [Directory Structure](#directory)
  - [Folders](#fold)
  - [Each Folder](#eachFold)
- [Setup](#setup)
- [Bug Reporting](#bug)
- [Feature Request](#feature-request)


<a id="features"></a>

## 🚀 Features

- Sign in and Sign up with email authentication
- Post a project with the project name, tech-stack and details of the project
- Comment on the posts
- An editable Profile page with respective posts and details
- Change password using the Forgot password feature
- Flash messages to ackowledge user's steps on the website


<a id="directory"></a>
## 📦 Directory Structure

<a id="fold"></a>
### Folders

 - assests
 - config
 - controllers
 - mailers
 - models
 - routes
 - views

<a id="eachFold"></a>
### Each Folder

 ## Assets:
 
      This folder contains all the CSS, Fonts, JS folders that contain files to enhance the frontend part of the website.
      
 ## Config:
 
      This contains all the configuration folders of mongoose, mailer, passportJS, flash messages.
      
 ## Controllers:
 
      This folder contains the files that contain the functions/controllers that need to be called for each route.
    
 ## Mailers:
 
      This folder contains the file that contains the controllers of the email authentication etc. 
      
 ## Models:
 
      This folder contains the files that contain the models of comments, users, posts.
 
 ## Routes:
 
      This folder contains all the routes.
 
 ## Views:
 
      This folder contains all the expressJS files. 

<a id="setup"></a>
### Installation

  ## Step 1:
  
  Use `git clone https://https://github.com/theofficialprofounder` on your terminal to clone this repository in your local computer.
  
  ## Step 2:
    
  Go to the local cloned repo and use `npm install` to install all the packages used.  
  
  ## Step 3:
  
  We use MongoDB as our Database and the project needs you to have that installed in your local computer. You would need to add the URL of your local mongodb connection to connect to the database. The file would be inside `config/mongoose.js`
  
  ## Step 4:
  
  Once your MongoDB is setup and you have added the url in the `config/mongoose.js` file, you can use `nodemon index.js` to run the project. We use `nodemon` which is why you would not need to restart the server everytime you make any change. Once you save the file you are making changes in, the server restarts automatically.

<a id="bug"></a>
## 🐛 Bug Reporting

Feel free to [open an issue](https://github.com/theofficialprofounder/Profinder/issues) on GitHub if you find any bug.

<a id="feature-request"></a>

## ⭐ Feature Request

- We are looking to work to make this project better.
- Feel free to [Open an issue](https://github.com/theofficialprofounder/Profinder/issues) on GitHub to request any additional features that you think would be nice. 
- Connect with us on mail! [Sreelaya](mailto:sreelayavuyyuru@gmail.com) and [Aman](mailto:aman.amanjolly@gmail.com). We'd love ❤️️ to hear any new ideas that would make our initiative better.
