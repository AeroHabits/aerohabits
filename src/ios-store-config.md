
# iOS App Store Configuration Guide

This file provides guidance for setting up in-app purchases in App Store Connect for AEROHABITS.

## In-App Purchase Configuration

When setting up your subscription in App Store Connect, use the following details:

### Premium Subscription

- **Product ID**: com.aerohabits.app.premium_monthly
- **Subscription Group**: AeroHabits Premium
- **Reference Name**: AeroHabits Premium Monthly
- **Subscription Type**: Auto-renewable
- **Price**: $9.99 (Tier 10)
- **Subscription Duration**: 1 Month
- **Free Trial**: 3 days

### Subscription Localization

Ensure you provide localized descriptions for major markets:

**English (Default)**
- **Display Name**: AeroHabits Premium
- **Description**: Unlock premium features, detailed insights, and personalized tracking

### App Review Information

For Apple's review team, include the following:

- **Demo Account**: Provide test account credentials
- **Demo Notes**: 
  - The app includes onboarding quiz flow and subscription after quiz completion
  - Premium features unlock advanced habit tracking, challenges, and personalized insights
  - The 3-day free trial converts to a monthly subscription automatically

### Receipt Validation

We use server-side validation with StoreKit and our backend to validate subscriptions.

### Sandbox Testing

Remember to test your in-app purchases in the Sandbox environment before submission:
1. Create a Sandbox test account in App Store Connect
2. Sign out of the App Store on your test device
3. Launch the app and use the sandbox account when prompted

## App Store Submission Checklist

- [ ] App icon in all required sizes
- [ ] Screenshots for all supported device sizes
- [ ] App Privacy details completed
- [ ] Age rating information provided
- [ ] App description and keywords optimized
- [ ] Support URL and privacy policy URL active and accessible
- [ ] Contact information up to date
- [ ] In-App Purchase configuration complete
