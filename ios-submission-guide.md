
# iOS App Store Submission Guide for AeroHabits

This document provides a comprehensive guide for taking AeroHabits from GitHub to the App Store, ensuring compliance with Apple's guidelines.

## Step 1: Export and Set Up Your Local Environment

1. **Export from Lovable to GitHub**
   - Click the "Export to GitHub" button in your Lovable IDE
   - Create a new repository or select an existing one
   - Complete the export process

2. **Clone the Repository Locally**
   ```bash
   git clone https://github.com/yourusername/aerohabits.git
   cd aerohabits
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Ensure Capacitor is Set Up**
   ```bash
   npx cap sync
   ```

## Step 2: Build the App for Production

1. **Create a Production Build**
   ```bash
   npm run build
   ```

2. **Sync the Build with Capacitor**
   ```bash
   npx cap sync ios
   ```

3. **Open the Project in Xcode**
   ```bash
   npx cap open ios
   ```

## Step 3: Configure Xcode Project Settings

1. **General Project Settings in Xcode**
   - Select the project in the Project Navigator (blue icon)
   - Select the "AEROHABITS" target
   - In the "General" tab:
     - Verify Bundle Identifier: `com.aerohabits.app`
     - Set appropriate Version and Build numbers (e.g., 1.0.0 and 1)
     - Ensure Deployment Info settings are correct
     - Verify Signing & Capabilities (Apple Developer account must be connected)

2. **Configure App Icons**
   - Select Assets.xcassets in the Project Navigator
   - Select AppIcon and ensure all required sizes are populated

3. **Configure App Store Connect Settings**
   - Set Privacy Policy URL in the Info tab
   - Add required usage descriptions for permissions (camera, location, etc.)

## Step 4: Create Archive for App Store

1. **Set Device Target to Generic iOS Device**
   - At the top of Xcode, change from simulator to "Any iOS Device" or "Generic iOS Device"

2. **Create Archive**
   - Select Product > Archive from the menu
   - Wait for the archiving process to complete

## Step 5: Distribute via App Store Connect

1. **Open the Organizer**
   - After archiving completes, the Organizer window will automatically appear
   - If not, select Window > Organizer from the menu

2. **Distribute the App**
   - Select your new archive
   - Click "Distribute App" button
   - Select "App Store Connect" as the distribution method
   - Select "Upload" to submit to App Store Connect
   - Follow the prompts to complete the upload
   - Choose options:
     - Include bitcode: No
     - Upload symbols: Yes
     - Automatically manage signing: Yes

3. **Wait for Processing**
   - Wait for the upload to complete
   - App Store Connect will process your build (can take 15-30 minutes)

## Step 6: Complete App Store Connect Submission

1. **Sign in to App Store Connect**
   - Visit [App Store Connect](https://appstoreconnect.apple.com)
   - Sign in with your Apple Developer account

2. **Create a New App (if first submission)**
   - Go to "My Apps"
   - Click the "+" button to create a new app
   - Fill in the required details:
     - Platform: iOS
     - App Name: AEROHABITS
     - Primary Language: English
     - Bundle ID: com.aerohabits.app
     - SKU: aerohabits2025

3. **Set Up App Information**
   - Complete all required metadata fields:
     - App screenshots (for all required devices)
     - App description
     - Keywords
     - Support URL
     - Marketing URL
     - Privacy Policy URL

4. **Configure Pricing and Availability**
   - Set price tier
   - Select availability regions

5. **Set Up In-App Purchases**
   - Go to the "In-App Purchases" section
   - Click "+" to add a new purchase
   - Create your Premium Subscription:
     - Type: Auto-Renewable Subscription
     - Reference Name: AeroHabits Premium Monthly
     - Product ID: com.aerohabits.app.premium_monthly
     - Price: $9.99 (Tier 10)
     - Add 3-day free trial
   - Complete all required metadata for the subscription

6. **App Privacy Information**
   - Complete the App Privacy section
   - Indicate what data your app collects

7. **Submit for Review**
   - Ensure all required sections are complete
   - Click "Submit for Review" button
   - Answer the questions about content and compliance
   - Confirm submission

## Step 7: App Review Process

1. **Monitor Review Status**
   - Check App Store Connect regularly for the status of your review
   - Average review time is 1-3 days

2. **Respond to Reviewer Questions**
   - Be prepared to respond quickly if the reviewer has questions

3. **Address Any Rejections**
   - If your app is rejected, carefully read the rejection reasons
   - Make necessary changes and resubmit

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
