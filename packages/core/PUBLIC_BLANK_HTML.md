# Blank Page for Popup Authentication

To fix the issue where your app loads in the popup window after authentication, you need to create a blank HTML page that MSAL can use as the redirect URI for popup authentication.

## Create blank.html

Create this file in your `public` folder:

```html
<!-- public/blank.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Authentication Complete</title>
</head>
<body>
    <!-- This page is used by MSAL for popup authentication -->
    <!-- It will close automatically -->
</body>
</html>
```

## Update Azure AD Configuration

In your Azure AD App Registration, add this redirect URI:
- `http://localhost:3000/blank.html` (for development)
- `https://yourdomain.com/blank.html` (for production)

## Update Your Code

When initializing MSALProvider, specify the blank page as the redirect URI:

```tsx
<MSALProvider
  clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
  tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
  redirectUri={`${window.location.origin}/blank.html`}
>
  {children}
</MSALProvider>
```

This ensures that popup authentication redirects to a blank page instead of your full app, and the popup closes immediately after authentication.
