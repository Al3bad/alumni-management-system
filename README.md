# TODOs

- [x] Write the boilerplate for express server
- [x] Create SQLite database
- [x] Create Alumni and Certificate tables
- [x] write query to insert new alumni to the db [for /api/register route]
- [x] write query to get certificate from db [for /certificate route]
- [x] write query to get alumni details [for /profile route]
- [ ]

## Admin User Registration

- [ ] B: Input validations
- [ ] B: Hash email, password, mobile
- [ ] B: Store in DB

## Alumni User Registration

- [x] F: Elements & styles
- [x] F: Input validations
- [x] F: Send form to backend if all inputs are valid
- [x] B: Validate the received form data
- [x] B: Hash email, password, mobile
- [x] B: Generate new certificate for the new alumni user
- [x] B: Authenticate once the registration process is done
- [x] B: Set cookie to the response object
- [x] F: Set cookie in the frontend
- [x] F: Redirect to the user's page if the registration process is done

## Admin User Login

- [x] F: Elements & styles
- [x] F: Input validations
- [x] F: Send form to backend if all inputs are valid
- [x] B: Validate the received form data [Probably we don't need to]
- [x] B: Hash email then check if record exist in DB. If not, res with error
- [x] B: Hash password then check with the one in the found record
- [x] B: Set cookie to the response object
- [x] F: Set cookie in the frontend
- [x] F: Redirect to the admin user's page

## Alumni User Login

- [x] F: Elements & styles (same login page)
- [x] F: Input validations (same logic)
- [x] F: Send form to backend if all inputs are valid (same logic)
- [x] B: Validate the received form data (same logic)
- [x] B: Hash email then check if record exist in DB. If not, res with error (same logic)
- [x] B: Hash password then check with the one in the found record (same logic)
- [x] B: Set cookie to the response object (same logic)
- [x] F: Set cookie in the frontend (same logic)
- [x] F: Redirect to the alumni user's profile page

## Verify Certificate By External Users

- [x] F: Implement verify certificate form
- [x] F: Validate input in verify certificate form in the frontend
- [x] F: Send certificate id to backend
- [ ] B: Validate input in verify certificate form in the backend
- [ ] B: Respond with the certificate file [OPTIONAL]
- [x] Define the routes for the application

## Alumni Profile Page

- [x] F: Elements & styles
- [x] F: Send request with the existing session
- [ ] B: If the received session is valid, res with the user's info + links to docs,
      otherwise res with error
- [x] F: Redirect unauthorised user to the home page
- [x] F: Redirect authorized user to the user's page

## Alumni Profile Page - Download

- [ ] F: Call /download path with the info related to the docs
- [ ] B: Check if the user is authenticated first, then res with the requested docs
- [ ] F: Download the docs to the local machine

## Admin Page

- [ ] F: Elements & styles
- [ ] F: Request all alumni from server
- [ ] B: Respond with all alumni data

## Admin Page - Getting Alumni Details

- [ ] F: Open modal when alumni is selected
- [ ] F: Request alumni details from server
- [ ] B: Respond with alumni details

## Admin Page - Reset Email for an Alumni User

- [ ] F: Hit a button with confirmation
- [ ] F: Request alumni reset action from server
- [ ] B: Delete email, password, salt from DB
- [ ] F: Respond with success

## Admin Page - Add Document for a user

- [ ] F: Hit "add new document" button
- [ ] F: Select type of document
- [ ] F: Send request data to the server
- [ ] B: Check if user is admin
- [ ] B: Handle uploaded document from frontend
- [ ] F: Respond with success
