// Auth fix for RepSpheres main site
// This script should be added to the main site to properly redirect after login

// After successful login, redirect to CRM
async function handleLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (!error && data) {
    // Show success message
    document.getElementById('modal-login-message').textContent = 'Logged in! Redirecting to CRM...';
    
    // Redirect to CRM after a short delay
    setTimeout(() => {
      window.location.href = 'https://crm.repspheres.com/dashboard';
    }, 1000);
  } else {
    document.getElementById('modal-login-message').textContent = error.message;
  }
}

// For OAuth providers (Google, Facebook, GitHub)
async function handleOAuthLogin(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: 'https://crm.repspheres.com/dashboard'
    }
  });
  
  if (error) {
    console.error('OAuth login error:', error);
  }
}

// Override the existing login button handler
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure original handlers are loaded
  setTimeout(() => {
    const modalLoginBtn = document.getElementById('modal-login-btn');
    if (modalLoginBtn) {
      // Remove existing event listeners
      const newLoginBtn = modalLoginBtn.cloneNode(true);
      modalLoginBtn.parentNode.replaceChild(newLoginBtn, modalLoginBtn);
      
      // Add new handler with redirect
      newLoginBtn.addEventListener('click', async function() {
        const email = document.getElementById('modal-login-email').value;
        const password = document.getElementById('modal-login-password').value;
        await handleLogin(email, password);
      });
    }
    
    // Add OAuth button handlers if they exist
    const googleBtn = document.querySelector('[data-provider="google"]');
    const facebookBtn = document.querySelector('[data-provider="facebook"]');
    const githubBtn = document.querySelector('[data-provider="github"]');
    
    if (googleBtn) {
      googleBtn.addEventListener('click', () => handleOAuthLogin('google'));
    }
    if (facebookBtn) {
      facebookBtn.addEventListener('click', () => handleOAuthLogin('facebook'));
    }
    if (githubBtn) {
      githubBtn.addEventListener('click', () => handleOAuthLogin('github'));
    }
  }, 500);
});