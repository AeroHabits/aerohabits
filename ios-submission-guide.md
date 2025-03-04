
# iOS App Store Submission Guide for AeroHabits

This document provides guidance for preparing AeroHabits for App Store submission, ensuring compliance with Apple's guidelines.

## Pre-Submission Checklist

### App Metadata
- [ ] App name: AEROHABITS
- [ ] Bundle identifier: com.aerohabits.app
- [ ] App icon in all required sizes
- [ ] Screenshots for all supported device sizes
- [ ] App description
- [ ] Keywords for App Store search
- [ ] Support URL: https://aerohabits.com/support
- [ ] Marketing URL: https://aerohabits.com
- [ ] Privacy Policy URL: https://aerohabits.com/privacy

### App Review Information
- [ ] Contact information
- [ ] Notes for App Review team
- [ ] Demo account credentials

### In-App Purchases
- [ ] Premium Subscription ($9.99/month with 3-day free trial) configured
- [ ] Subscription information displayed within the app
- [ ] Appropriate privacy disclosures for payment information
- [ ] Tested purchases in Sandbox environment

## App Store Guidelines Compliance

### 2. Business
- [x] 2.1 App includes clear Terms of Service and Privacy Policy
- [x] 2.2 In-app purchase mechanics are clearly disclosed
- [x] 2.3.8 Subscription terms include duration, pricing, and auto-renewal disclosures

### 3. Design
- [x] 3.1 App meets Apple's Human Interface Guidelines
- [x] 3.2 App is accessible to users with disabilities

### 4. Hardware Compatibility
- [x] 4.2 App uses permissions APIs for camera, location, and notifications
- [x] 4.5 App handles different screen sizes and orientations properly

### 5. Software Requirements
- [x] 5.1.1 App has complete functionality without requiring login
- [x] 5.1.2 App handles network connectivity issues gracefully

## Building for Production

To prepare for production build:

1. Open Xcode project:
```bash
npx cap open ios
```

2. In Xcode:
   - Select "Generic iOS Device" as build target
   - Select Product > Archive from the menu
   - In the Organizer window that appears, click "Distribute App"
   - Select "App Store Connect" and follow the prompts

## App Store Connect Setup

1. Create a new app in App Store Connect
2. Complete all required metadata fields
3. Configure in-app purchase for Premium subscription
4. Set up App Privacy information
5. Provide App Review Information

## TestFlight Testing

Before final submission:
1. Upload build to TestFlight
2. Test all features, especially subscription flows
3. Verify all screens render correctly on different devices
4. Test network connectivity handling
5. Invite external testers to validate user experience

## Common Rejection Reasons

- Missing subscription terms and conditions
- Incomplete app functionality
- Bugs or crashes
- Misleading app description
- Inadequate privacy disclosures
- Poor performance on older devices

## Submission Support

For assistance with your submission, contact:
Support@AeroHabits.com
