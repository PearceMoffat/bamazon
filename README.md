# bamazonCustomer
When a user signs on as a customer, a table of all products available is displayed. Product name, department name, price, and number in stock are all listed. User is prompted for an ID of an item they would like to buy, program will not allow user to submit an ID that is not listed. When a user successfully selects an item, they are prompted for a quantity. If the user selects 0, the program quits. Otherwise, the user will be shown their total payment and prompted with the menu again. Repeat until user quits.

![Image of Customer Flow](https://github.com/PearceMoffat/bamazon/blob/master/images/customer-flow.png)

# bamazonManager
When a user signs on as a manager, they are presented with a menu with 5 options.
- View Products
  - Display a list of all the prodcuts available.
- View Low Inventory
  - Display a list of all the products with an inventory count of 5 or less.
- Add to Inventory
  - Display all products and prompt for an ID number, when the user selects a valid ID number, prompt for an amount to add to inventory, then add that amount to the inventory of the selected item.
- Add New Product
  - Allow the user to add a new product to the product list. When choosing departments, must choose one that already exists, as only Supervisors have the authority to create a new department.
- Quit
  - Quit the program.

![Image of Manager Flow](https://github.com/PearceMoffat/bamazon/blob/master/images/manager-flow.png)

 # bamazonSupervisor
When a user signs on as a supervisor, they are presented with a menu with 3 options.
- View Product Sales by Department
  - Display a list of all the departments and their respective over head costs, product sales, and total profits.
- Create New Department
  - Allow the user to create a new department and set the over head costs for that department. When a department is created, the user then create an item to be sold in that department so that no department is product-less.
- Quit
  - Quit the program.

  ![Image of Supervisor Flow](https://github.com/PearceMoffat/bamazon/blob/master/images/supervisor-flow.png  )