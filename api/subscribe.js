function handleSubmitSubscribe(event) {
  event.preventDefault();

  // Get form values
  const email = document.getElementById('subscribe-email').value;
  const name = document.getElementById('subscribe-name').value;
  const country = document.getElementById('subscribe-country').value;
  const captchaToken = document.querySelector('#subscribe-form input[name="cf-turnstile-response"]').value;

  if (!captchaToken) {
    alert('Please complete the captcha first.');
    return;
  }

  // Create subscribe request object
  const subscribeRequest = {
    domain: "haqq.network",
    ip: "unknown", // IP will be set on the server side
    email,
    name,
    country,
    captcha_token: captchaToken,
  };

  if (!subscribeRequest.captcha_token) {
    alert('Please complete the captcha first.');
    return;
  }

  // Send POST request to the subscribe endpoint
  const subscribeUrl = new URL("/email/subscribe", "https://falconer.haqq.sh");
  fetch(subscribeUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscribeRequest),
  })
  .then(response => response.json())
  .then(data => {
    if (!data.error) {
      alert('Subscription successful!');
      // Clear form field
      document.getElementById('subscribe-email').value = '';
    } else {
      alert('Error: ' + data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while subscribing.');
  });
}

window.addEventListener("DOMContentLoaded", (event) => {
  // Add event listener to the submit button
  document.getElementById('subscribe-submit').addEventListener('click', handleSubmitSubscribe);
});
