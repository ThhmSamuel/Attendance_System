##Attendance System

## Project Structure - Files and folders details

- **Root Directory:** The root directory is the main folder in which all the files and folders for that particular application are present, like the entry point file, src folder, public folder, routes, models, views, and controllers.
  
- **Node Modules:** This folder contains the files and folders regarding installed files and dependencies that are used in this project. All the installation files for dependencies are stored in node modules.
  
- **Public:** This folder contains static files that are visible to people, like index.html, script.js, and CDN links and files.
  
- **Source:** This folder present with the name of src which contains all the files required to handle the server like routes, controllers, models, views, etc.
  
- **Routes:** This will contain all the routes and endpoints required for the server and also their required files like for authentication routes we can create a file and setup routes.
  
- **Controllers:** Controllers folder contains the business logic and validations for the input data received by the client side and performs their business logic and sends it to database controllers, which contains logical files and folders.
  
- **Models:** Models contain all the schemas of the database, like which kind of input will be received from client-side and server-side validations. This will contain all files of validations and data schemas that should exist.
  
- **Package.json:** This file contains the data and details of all dependencies installed in your project. Express is a kind of dependency that is used to establish a server, so this file will contain all the details regarding Express, like version and installed.
  
- **App.js:** It is the entry point file of the server, which contains the main routes of the application and server ports from which the server will start listening, as well as the basic routes used in this application.
  
- **.gitignore:** Git ignore is a file that contains files and folders that should not be pushed to the server. The git ignore file is used to stop pushing files from the server, like node module files, which should not be pushed to the server because they can easily be installed with the package.json file.
  
- **Readme.md:** This is a markdown file where we write down information about your project, like all development details about your application.
  
- **env:** The env file stands for Environmental Variables of Application. This file contains details about environment variables like API keys, the private salt of a Payment Gateway, and many other details that should be kept private.
