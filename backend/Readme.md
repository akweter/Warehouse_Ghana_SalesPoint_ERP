### Silence is Golden

## Routes
```Backend server routes```

# Woocommerce 
## Get requests
1. /customers - return all wc customers
2. /orders - return all wc orders
3. /products - return all products
4. /pendinvoice - return all pending invoices
5. /proinvoice - return all processing invoices
6. /failinvoice - return all failed invoices


# User MGT
## Get requests
1. /user - get all users ()
2. /user/{id} - get only one user
3. /active - get all active users from the DB
4. /inactive - Get all inactive users from the DB
5. /admin - Get all admin users  
6. /accounts -- Get all accounts users
7. /procurement - Get all procurement users
8. /sales - Get all sales users
9. /marketing - Get all marketing users
10. /hr - Get all hr users
11. /legal - Get all legal users
12. /logistic - Get all logistic users
13. /IT - Get it admin users
14. /superAdmin - Get all superAdmin users
16. /default - Get all default users
17. /intern - Get all intern users
18. /guest - Get all guest users
19. /CSM - Get all csm users
20. /temporal - Get all temporal users


# Sales
## Get requests
1. /allsales - all success invoices
2. /sale/{id} - one successful invoice
3. /allinvoices - all invoices
4. /invoice/{id} - particular invoice
5. /refund - all refund invoices
8. /profoma - all profoma invoices
8. /purorder - all purchase order invoices
9. /original - all original invoices
10. /purchase - all purchase invoices
11. /refcancel - all refund cancellation invoices
12. /purrefund - all purchase refunded invoices
13. /partialref - all partiallly refunded invoices


# Inventory
## Get requests
1. /items - all products
2. /item/{id} - particular item
3. /status - all products based on status in stock
7. /exempt - all products based on exemption
11. /user/add - the user who added the product
13. /suppliers - Get all products based on a suppliers

# Suppliers
1. /supplier - get all suppliers ()
2. /supplier/{id} - get only one supplier
3. /status - get all active || non active suppliers
4. /type - Get all local or foreign suppliers
5. /email - Get a supplier by email address
6. /search - Get a supplier based on the input (name, tin, phone email, address, type, email)
7. /rate - Get all suppliers with their rating points
8. /rateone - Get all suppliers with specific rating point
9. /exempt - Get all exempted suppliers
10. /product/{id} - Get a supplier based on a product id
11. /product - Get all suppliers based on a product id
12. /tin/{id} - Get a supplier based on the id
13. /sales - Get all sales from the customer
14. /sales/{id} - Get a sales from customer

# Customers
## Get requests
1. /customer - get all customers ()
2. /customer/{id} - get only one customer
3. /status - get all active || inactive customers
4. /type - Get either local or fereign customers
5. /exempt - Get customers based on exemption
6. /rate - Get customer/customer based on their rating
7. /search - Get customer based on their name || phone || tine || email (%LIKE%)

# Search/Query
