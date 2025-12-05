# Contactor App

This is an [Expo](https://expo.dev) project created with [React Native](https://reactnative.dev), and [Nativewind](https://www.nativewind.dev). This application was fully developed and tested on **iOS** using Expo.
Functionality and layout may vary on Android, as the app was not tested on that platform.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Keep in mind, as stated earlier, this app was only tested for and developed on iOS so it is recommended to select the **iOS simulator** in this case.

---

## Completed Requirements

### **Contacts Screen**
- View all saved contacts (OS contacts + custom contacts)
- Contacts are displayed **alphabetically (A–Z)**
- Shows only **name** and **thumbnail photo**
- Search bar allows searching by name
- Search is **case-insensitive** and matches **any substring**
- Contact list dynamically updates based on search input
- Create a new contact directly from the Contacts screen

### **Create New Contact**
- Full form for adding a new contact:
  - First name  
  - Last name  
  - Phone number  
  - Photo (camera or image picker)
- Contacts are stored using Expo FileSystem:
  - File format: **`<name>-<uuid>.json`**
  - Each file contains: `name`, `phoneNumber`, `photo`
- Contacts persist between app sessions


---

## **Contact Detail Screen**
- View detailed information for a selected contact:
  - Name  
  - Photo  
  - Phone Number  
- Edit existing contact:
  - All properties are fully editable
  - After editing, the old file is deleted
  - A **new file** is created with updated information in the required format

---

## Extra Features

### **OS Contacts Integration**
- Import contacts from the device using Expo Contacts
- Includes fetching avatar, name, and phone numbers

### **Call Functionality**
- Make a phone call directly from inside the app
- Works for both OS contacts and custom contacts

### **Add image with photo import**
- Add a avatar/profile picutre to a created contact

### **Recents Screen**
- Automatically logs all calls to a persistent recents list
- Recents display:
  - Name  
  - Photo  
  - Time of call  
  - Quick-call icon
- Recents persist between sessions
- Supports search (same behavior as the Contacts screen)
- “Clear All Recents” with confirmation popup

---
