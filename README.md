#book_record_management

This is a book record management API Backend for the management of records and books

# Routes and Endpoints

## /users ✅
POST: Create a new user 
GET: Get all list of users


## /users/{id} ✅
GET: get a user by id
PUT: update a user by id
DELETE: delete a user by id(check if they still have an issued book.)(is there any fine to be paid)

## /users/subscription-details/{id} ✅
GET: get user subscription details
1. Date of subscription
2. Valid till
3. Fine if any


## /books ✅
GET: get all books
POST: Create/add a new book

## /books/{id} ✅
GET: get a book by id
PUT: update a book by id

## /books/issued ✅
GET: get all issued books

## /books/issued/wihtFine ✅
GET: all issued books with Fine

## Subscription Types ✅
Basic(3 months)
Standard(6 months)
Premium(12 months)

If the subscription date is 01/08/22
and Subsciption type is Standard
the valid till date will be 01/11/22

If he has an issued book and the issued book is to be returned at 01/01/23
If he missed it, then he gets a fine of Rs. 100.

If he has an issued book and the issued book is to be returned at 01/01/23
If he missed the date of return, and his subsciption also expires, then he will get a fine of Rs. 200.