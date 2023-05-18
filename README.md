# TODOs

- [x] Write the boilerplate for express server
- [x] Create SQLite database
- [x] Create Alumni and Certificate tables
- [x] write query to insert new alumni to the db [for /api/register route]
- [ ] write query to insert certificate to the db [for /api/register route]
- [x] write query to get certificate from db [for /certificate route]
- [ ] write query to get alumni details [for /profile route]
- [ ]

## Alumni User Registration

- [x] F: Elements & styles
- [x] F: Input validations
- [x] F: Send form to backend if all inputs are valid
- [x] B: Validate the received form data
- [x] B: Hash email, password, mobile
- [ ] B: Generate new certificate for the new alumni user
- [x] B: Authenticate once the registration process is done
- [x] B: Set cookie to the response object
- [x] F: Set cookie in the frontend
- [ ] F: Redirect to the user's page if the registration process is done

## Alumni User Login

- [ ]

## Verify Certificate By External Users

- [x] F: Implement verify certificate form
- [x] F: Validate input in verify certificate form in the frontend
- [x] F: Send certificate id to backend
- [ ] B: Validate input in verify certificate form in the backend
- [ ] B: Response with the certificate file [OPTIONAL]
- [x] Define the routes for the application
