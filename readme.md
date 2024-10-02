Here are the details on how to use the provided code, what attributes need to be set, and how to interact with forms:

### Data Attributes for Updating Values

In the code, specific elements use `data-*` attributes to dynamically update their content with API data:

1. **Price**:

   - `data-islm-price`: This attribute is used in an element where the current ISLM price will be displayed. The element will automatically update when the price data is fetched.

   Example:

   ```html
   <p><span data-islm-price>Loading price...</span> ISLM</p>
   ```

2. **Chain Stats**:

   - `data-chain-stats-accounts`: Used to display the number of accounts created on the mainnet.
   - `data-chain-stats-transactions`: Displays the number of transactions in the last 24 hours.
   - `data-chain-stats-finality`: Shows the seconds to consensus finality.
   - `data-chain-stats-cost`: Displays the average cost per transaction.
   - `data-chain-stats-supply`: Shows the total supply of ISLM.
   - `data-chain-stats-circulating-supply`: Displays the circulating supply.
   - `data-chain-stats-staked-amount`: Shows the amount of staked tokens.
   - `data-chain-stats-staked-ratio`: Displays the percentage of staked tokens.
   - `data-chain-stats-validators-count`: Shows the total number of validators.
   - `data-chain-stats-active-validators-count`: Displays the number of active validators.

   Examples:

   ```html
   <p data-chain-stats-accounts>Loading...</p>
   <p data-chain-stats-staked-amount>Loading...</p>
   <p><span data-chain-stats-staked-ratio>Loading...</span> %</p>
   ```

These attributes allow JavaScript to target specific parts of the page and update them with the relevant data fetched from the API.

### Form Usage

1. **Feedback Form**:

   - The feedback form collects user data (name, email, and message) and submits it to the backend using `POST` requests.
   - Fields:
     - `feedback-name`: The user's name.
     - `feedback-email`: The user's email.
     - `feedback-message`: The user's message.

   Example form structure:

   ```html
   <form id="feedback-form">
     <input
       id="feedback-name"
       name="feedback-name"
       placeholder="Name"
       type="text"
       required
     />
     <input
       id="feedback-email"
       name="feedback-email"
       placeholder="Enter your e-mail"
       type="email"
       required
     />
     <textarea
       id="feedback-message"
       name="feedback-message"
       placeholder="Your message"
       required
     ></textarea>
     <input type="submit" value="Submit" disabled />
   </form>
   ```

   - **Captcha (Turnstile)**: The form uses Cloudflare Turnstile for bot protection. The `data-callback="onFeedbackTurnstileSuccess"` attribute handles successful captcha verification, enabling the submit button.

   Example:

   ```html
   <div
     class="cf-turnstile"
     data-sitekey="0x4AAAAAAAJdhpkY-4iZ4A_X"
     data-callback="onFeedbackTurnstileSuccess"
   ></div>
   ```

2. **Subscribe Form**:

   - This form collects the user’s name and email to subscribe to updates. Similar to the feedback form, it uses Turnstile for bot protection.
   - Fields:
     - `subscribe-name`: The subscriber's full name.
     - `subscribe-email`: The subscriber's email.

   Example form structure:

   ```html
   <form id="subscribe-form">
     <input
       id="subscribe-name"
       name="subscribe-name"
       placeholder="Full name"
       type="text"
       required
     />
     <input
       id="subscribe-email"
       name="subscribe-email"
       placeholder="Enter your e-mail"
       type="email"
       required
     />
     <input type="submit" value="Subscribe" disabled />
   </form>
   ```

   - Turnstile is again used to validate that the user is not a bot.

### How the Forms Work

1. **Form Submission**:

   - When a user submits the form, JavaScript intercepts the submission event, validates the Turnstile token, collects the form data, and sends it as a JSON object to the backend via `fetch`.
   - The form data is serialized and sent to the backend API endpoints `/api/feedback` (for feedback) and `/api/subscribe` (for subscriptions).

   Example:

   ```javascript
   fetch(feedbackApiUrl, {
     method: "POST",
     headers: REQUEST_HEADERS,
     body: JSON.stringify(jsonData),
   });
   ```

2. **Form Initialization**:
   - When the page is loaded, `initializeFeedbackForm()` and `initializeSubscribeForm()` are called to set up the forms. These functions attach event listeners to the forms, enabling dynamic submission and interaction with Turnstile.

### How to Add Data Attributes

Simply include the `data-*` attributes in the HTML elements where you want dynamic values to be rendered.

For example, to show the number of mainnet accounts created:

```html
<p data-chain-stats-accounts>Loading...</p>
```

This element will be automatically updated when the chain stats are fetched.

If you have any more questions or need further explanations, feel free to ask!

### Dynamic Link Generation

The code includes functionality to dynamically generate and update links for app download buttons. This is particularly useful for tracking user interactions and providing personalized links.

1. **Button Classes**:

   - `button-app-ios`: Used for iOS app download buttons.
   - `button-app-android`: Used for Android app download buttons.

2. **How it works**:

   - When the page loads, the script searches for buttons with these classes.
   - It then generates a dynamic link for each button based on the user's distinct ID (obtained from PostHog) and the appropriate app store URL.
   - The `href` attribute of these buttons is updated with the newly generated dynamic link.

3. **Usage**:
   Simply add the appropriate class to your app download buttons:

   ```html
   <a href="#" class="button-app-ios">Download for iOS</a>
   <a href="#" class="button-app-android">Download for Android</a>
   ```

   The script will automatically update these links with the dynamically generated URLs when the page loads.

Note: This feature requires PostHog to be properly initialized and the user's distinct ID to be available. If the distinct ID is not available, the links will not be updated, and a warning will be logged to the console.
