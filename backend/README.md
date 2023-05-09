# Getting Started

Clone the repository to your local machine.

Install Node.js (v. 16) and PostgreSQL if you haven't already.

Run `yarn install` to install the dependencies.

Copy the `.env.example` file in the root directory of the project, change the name of the copy to `.env` and add the following environment variables:

`PORT` - number of the port that will be used to run the app  
`HOST` - the host of the database  
`USER` - database user name  
`PASSWORD` - user password  
`DB` - database name  
`DIALECT` - database dialect  
`TOKEN_SECRET` - jwt token secret

Start the PostgreSQL server and create a database with the name you specified in the `.env` file.

Run `yarn start:dev` to start the server in development mode.

# Available Scripts

In the project directory, you can run:

### `yarn run:dev`

Runs the server in development mode.

### `yarn start`

Runs the built project in production mode.

Contributing
Feel free to submit pull requests or open issues. Any contributions are welcome!

License
This project is licensed under the MIT license.
