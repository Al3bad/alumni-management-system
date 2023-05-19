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
- [x] F: Redirect to the user's page if the registration process is done

## Alumni User Login

- [x] F: Elements & styles
- [x] F: Input validations
- [x] F: Send form to backend if all inputs are valid
- [ ] B: Validate the received form data [Probably we don't need to]
- [x] B: Hash email then check if record exist in DB. If not, res with error
- [x] B: Hash password then check with the one in the found record
- [x] B: Set cookie to the response object
- [x] F: Set cookie in the frontend
- [x] F: Redirect to the user's page if the registration process is done

## Verify Certificate By External Users

- [x] F: Implement verify certificate form
- [x] F: Validate input in verify certificate form in the frontend
- [x] F: Send certificate id to backend
- [ ] B: Validate input in verify certificate form in the backend
- [ ] B: Response with the certificate file [OPTIONAL]
- [x] Define the routes for the application

## Alumni Profile Page

- [ ] F: Elements & styles
- [x] F: Send request with the existing session
- [ ] B: If the received session is valid, res with the user's info + links to docs,
      otherwise res with error
- [x] F: Redirect unauthorised user to the home page
- [x] F: Redirect authorized user to the user's page

## Alumni Profile Page

- [ ] F: Call /download path with the info related to the docs
- [ ] B: Check if the user is authenticated first, then res with the requested docs
- [ ] F: Download the docs to the local machine
