# Comprehensive Test Scenarios for v3.0.7

## Critical User Flows

### 1. Popup Login Flow
- [ ] Click sign-in button → popup opens
- [ ] Complete authentication in popup → popup closes
- [ ] Main window receives auth state
- [ ] URL remains clean (no hash with code)
- [ ] Button re-enables immediately
- [ ] User can interact with app

### 2. Redirect Login Flow
- [ ] Click sign-in with redirect
- [ ] Redirect to Microsoft login
- [ ] Complete authentication
- [ ] Redirect back to app
- [ ] URL is cleaned after redirect
- [ ] User is authenticated

### 3. User Cancellation
- [ ] Click sign-in button
- [ ] Close popup without signing in
- [ ] Button re-enables
- [ ] No error thrown
- [ ] Can try again

### 4. Page Refresh Scenarios
- [ ] Refresh during popup open → popup closes, no error
- [ ] Refresh after login → user stays logged in
- [ ] Refresh with auth code in URL → code is cleaned, user authenticated

### 5. Multiple Tabs
- [ ] Login in tab 1 → tab 2 sees auth state
- [ ] Logout in tab 1 → tab 2 sees logout
- [ ] Open new tab while logged in → new tab shows logged in state

### 6. Token Acquisition
- [ ] Silent token acquisition works
- [ ] Token refresh works
- [ ] Fallback to popup when silent fails
- [ ] No infinite loops

### 7. Logout Flows
- [ ] Logout popup works
- [ ] Logout redirect works
- [ ] Session cleared properly
- [ ] Can login again after logout

### 8. Error Scenarios
- [ ] Network error during login → proper error message
- [ ] Invalid credentials → proper error message
- [ ] Popup blocked → proper error message
- [ ] Token expired → automatic refresh

### 9. SSR/Hydration
- [ ] Server-side rendering works
- [ ] No hydration errors
- [ ] Loading state shows properly
- [ ] Client-side initialization works

### 10. Concurrent Operations
- [ ] Multiple login attempts blocked
- [ ] Token acquisition doesn't race
- [ ] State updates are atomic

## Edge Cases to Test

### Browser Scenarios
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers
- [ ] Private/Incognito mode
- [ ] Popup blockers enabled

### Network Scenarios
- [ ] Slow network
- [ ] Network interruption during auth
- [ ] Offline → online transition

### State Management
- [ ] No active account set → first account used
- [ ] Multiple accounts in cache → correct one selected
- [ ] Account switching works

### URL Scenarios
- [ ] Base URL with no path
- [ ] Deep link URLs
- [ ] URLs with query parameters
- [ ] URLs with existing hash

### Timing Issues
- [ ] Rapid button clicks
- [ ] Login during page navigation
- [ ] Component unmount during auth

## Regression Tests (What Worked Before)

### v2.x Compatibility
- [ ] Existing apps don't break
- [ ] Migration path is clear
- [ ] Breaking changes documented

### Known Working Scenarios
- [ ] Basic popup login
- [ ] Basic redirect login
- [ ] Token acquisition
- [ ] Logout
- [ ] Protected routes

## Performance Tests
- [ ] Bundle size acceptable
- [ ] No memory leaks
- [ ] No infinite re-renders
- [ ] Fast initialization

## Security Tests
- [ ] PKCE enabled
- [ ] State parameter validated
- [ ] No token leakage in URL
- [ ] Secure token storage
