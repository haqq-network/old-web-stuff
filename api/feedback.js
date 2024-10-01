
function handleSubmit(event) {
  event.preventDefault();

  // Get form values
  const name = document.getElementById('develop-name').value;
  const email = document.getElementById('develop-email').value;
  const message = document.getElementById('develop-message').value;
  const captchaToken = document.querySelector('#feedback-form input[name="cf-turnstile-response"]').value;

  if (!captchaToken) {
    alert('Please complete the captcha first.');
    return;
  }

  // Create feedback request object
  const feedbackRequest = {
    domain: "haqq.network",
    ip: "unknown", // IP will be set on the server side
    email,
    name,
    message,
    captcha_token: captchaToken,
  };

  if (!feedbackRequest.captcha_token) {
    alert('Please complete the captcha first.');
    return;
  }

  // Send POST request to the feedback endpoint
  const feedbackUrl = new URL("/feedback/send", "https://falconer.haqq.sh");
  fetch(feedbackUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackRequest),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Feedback sent successfully!');
      // Clear form fields
      document.getElementById('develop-name').value = '';
      document.getElementById('develop-email').value = '';
      document.getElementById('develop-message').value = '';
    } else {
      alert('Error: ' + data.error_description);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while sending feedback.');
  });
}

window.addEventListener("DOMContentLoaded", (event) => {
  // Add event listener to the submit button
	document.getElementById('develop-submit').addEventListener('click', handleSubmit);
});
