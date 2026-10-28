# SauceDemo Core User Operations Test Plan

## Application Overview

Test the five primary SauceDemo user operations observed at https://www.saucedemo.com: sign in, browse products, manage the cart, complete checkout, and sign out. Observed login page credentials: standard_user / secret_sauce; locked_out_user is also listed as an accepted username but is expected to be denied access. Run each scenario independently in a fresh browser context with no prior session or cart state. For positive order flows, use a standard_user account and disposable sample checkout values.

## Test Scenarios

### 1. Sign in

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in with valid credentials

**File:** `tests/saucedemo/sign-in.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com in a fresh browser context.
    - expect: The Swag Labs login form shows Username, Password, and Login controls.
    - expect: The page lists accepted demo usernames and the shared password.
  2. Enter standard_user and secret_sauce, then select Login.
    - expect: The user is taken to /inventory.html.
    - expect: The Products heading, inventory items, sort control, and empty cart control are visible.

#### 1.2. Reject invalid and locked-out credentials

**File:** `tests/saucedemo/sign-in.spec.ts`

**Steps:**
  1. Open the login page, enter standard_user with an incorrect password, and select Login.
    - expect: The user remains on the login page and an authentication error is shown.
  2. Replace the password with secret_sauce and select Login.
    - expect: The inventory page opens and the previous error is cleared.
  3. In a fresh context, enter locked_out_user and secret_sauce and select Login.
    - expect: Access is denied with a locked-out account error.
    - expect: The user remains on the login page.

#### 1.3. Validate required login fields

**File:** `tests/saucedemo/sign-in.spec.ts`

**Steps:**
  1. Open the login page and select Login without entering either field.
    - expect: Login is rejected and an informative required-username error is shown.
  2. Enter standard_user, leave the password blank, and select Login.
    - expect: Login is rejected and an informative required-password error is shown.

### 2. Browse products

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse inventory and inspect product details

**File:** `tests/saucedemo/product-browsing.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce.
    - expect: The Products page lists six products with names, descriptions, prices, images, and add-to-cart actions.
  2. Open Sauce Labs Backpack by selecting its product image or View details control.
    - expect: The product detail page shows the matching product image, name, description, $29.99 price, and Add to cart action.
  3. Select Back to products.
    - expect: The user returns to the inventory list and the cart remains empty.

#### 2.2. Sort inventory by name and price

**File:** `tests/saucedemo/product-browsing.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce and select each of the four sort choices in turn: Name (A to Z), Name (Z to A), Price (low to high), and Price (high to low).
    - expect: The product list updates to match each selected sort order.
    - expect: The displayed selected option matches the active ordering.
    - expect: Prices are ordered numerically rather than lexicographically.

### 3. Manage cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add two products and verify cart contents

**File:** `tests/saucedemo/cart.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce and add Sauce Labs Backpack and Sauce Labs Bike Light.
    - expect: Both product actions change from Add to cart to Remove.
    - expect: The cart badge shows 2 items.
  2. Open the cart.
    - expect: Your Cart lists the Backpack and Bike Light, each with quantity 1 and the expected product details.
    - expect: The cart badge shows 2 items.
    - expect: Continue Shopping and Checkout actions are available.

#### 3.2. Remove an item and continue shopping

**File:** `tests/saucedemo/cart.spec.ts`

**Steps:**
  1. Sign in and add Sauce Labs Backpack and Sauce Labs Bike Light, then open the cart.
    - expect: The cart contains both selected items.
  2. Remove Sauce Labs Bike Light.
    - expect: The Bike Light disappears from the cart and the badge drops to 1.
  3. Select Continue Shopping and remove Sauce Labs Backpack from the inventory.
    - expect: The inventory page opens with the remaining cart state preserved.
    - expect: The cart becomes empty and the Backpack action returns to Add to cart.

### 4. Complete checkout

**Seed:** `tests/seed.spec.ts`

#### 4.1. Complete a valid order and verify confirmation

**File:** `tests/saucedemo/checkout.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce, add Sauce Labs Backpack, open the cart, and select Checkout.
    - expect: The Checkout: Your Information form shows First Name, Last Name, Zip/Postal Code, Cancel, and Continue controls.
  2. Enter Taylor, Tester, and 12345 in the three information fields and select Continue.
    - expect: The Checkout: Overview page shows the Backpack and order summary.
    - expect: For the observed $29.99 Backpack price, item total is $29.99, tax is $2.40, and total is $32.39.
  3. Select Finish.
    - expect: The Checkout: Complete! page displays Thank you for your order! and the dispatch message.
    - expect: The cart is empty.
  4. Select Back Home.
    - expect: The inventory page opens and the cart remains empty.

#### 4.2. Validate required checkout fields

**File:** `tests/saucedemo/checkout.spec.ts`

**Steps:**
  1. Sign in, add one product, open the cart, select Checkout, and leave all three fields blank.
    - expect: The checkout information form is displayed.
  2. Select Continue without entering information.
    - expect: Checkout does not advance and the UI reports that First Name is required.
  3. Enter only a first name and select Continue.
    - expect: Checkout does not advance and the UI reports that Last Name is required.
  4. Enter a last name but leave Zip/Postal Code blank, then select Continue.
    - expect: Checkout does not advance and the UI reports that Postal Code is required.

#### 4.3. Cancel checkout without placing an order

**File:** `tests/saucedemo/checkout.spec.ts`

**Steps:**
  1. Sign in, add one product, open the cart, select Checkout, and select Cancel on the information form.
    - expect: The user returns to the cart without placing an order.
    - expect: The previously selected item remains in the cart.

### 5. Sign out

**Seed:** `tests/seed.spec.ts`

#### 5.1. Sign out from the authenticated storefront

**File:** `tests/saucedemo/sign-out.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce and open the navigation menu.
    - expect: The menu exposes All Items, Dynamic Catalog, About, Logout, Reset App State, and Close Menu.
  2. Select Logout.
    - expect: The login page is displayed and authenticated inventory content is no longer available.
  3. Use browser Back to attempt to revisit the inventory page.
    - expect: Protected inventory content is not available in the signed-out state.
