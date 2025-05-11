export async function renderSignInView() {
  const app = document.getElementById("app");
  const signInContainer = document.createElement("div");
  signInContainer.className = "signin-container";
  signInContainer.id = "signInContainer";

  signInContainer.innerHTML = `
  <p class="message-popup" id="messagePopup"></p>
      <div class="form-container">
        <h2 class="container-header">Sign In</h2>
        <form id="signinForm">
          <div class="input-group">
            <label for="email-or-username">Email or Username</label>
            <input
              type="text"
              id="emailOrUsername"
              name="email-or-username"
              required
            />
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input type="password" id="password" name="password" required />
              <button
                type="button"
                class="toggle-password-visibility"
                data-target="password"
              >
                <box-icon name="show"></box-icon>
              </button>
            </div>
          </div>

          <button type="submit" class="sign-in-btn btn">Sign In</button>
        </form>
      </div>
  `;
  app.appendChild(signInContainer)
}
