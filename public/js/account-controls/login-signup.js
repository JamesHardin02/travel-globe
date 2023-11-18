async function loginFormHandler(event) {
  event.preventDefault();
  const emailInput = document.querySelector('#email-login');
  const passwordInput = document.querySelector('#password-login');
  const eValid = emailInput.checkValidity();
  const pValid = passwordInput.checkValidity();
  emailInput.reportValidity();
  passwordInput.reportValidity();
  if (eValid && pValid) {
    // get email and password input values
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    //creates session data
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    // goes to user's profile dashboard
    if (response.ok) {
      document.location.replace('/dashboard/itinerary');
    } else {
      alert("Invalid email or password!");
    }
  }
}

async function signupFormHandler(event) {
  event.preventDefault();
  // gets inputed user info
  const usernameInput = document.querySelector('#username-signup');
  const emailInput = document.querySelector('#email-signup');
  const passwordInput = document.querySelector('#password-signup');
  const uValid = usernameInput.checkValidity();
  const eValid = emailInput.checkValidity();
  const pValid = passwordInput.checkValidity();
  usernameInput.reportValidity();
  emailInput.reportValidity();
  passwordInput.reportValidity();
  if (uValid && eValid && pValid) {
    // gets inputed user info
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    // creates user in db
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    // goes to user's profile dashboard
    if (response.ok) {
      document.location.replace('/dashboard/itinerary');
    } else {
      alert("Something went wrong... Please try again");
    }
  }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);