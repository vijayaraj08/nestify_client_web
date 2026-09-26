# Profile & Settings Module — Implementation Requirements

## 1. Objective

Implement the **Profile** and **Settings** modules for the Hostello multi-tenant PG / Hostel Management Platform.

The application has three roles:

- `SUPER_ADMIN`
- `TENANT`
- `END_USER`

The main architectural requirement is:

> Use one common Profile page and one common Settings page, while rendering role-specific sections and fields based on the authenticated user's role.

Do **not** create separate complete pages such as:

- `SuperAdminProfile`
- `TenantProfile`
- `EndUserProfile`
- `SuperAdminSettings`
- `TenantSettings`
- `EndUserSettings`

Use reusable components and role-based configuration instead.

---

# 2. Profile Route

Use the common route:

```text
/profile
```

The same Profile page must be accessible to:

- Super Admin
- Tenant
- End User

The page should determine the current role from the existing authentication context.

Example:

```js
const { user } = useAuth();
const role = user?.role;
```

Do not hardcode the role inside the Profile page.

---

# 3. Common Personal Information

These fields are common to all three roles.

## Fields

```text
First Name
Last Name
Email
Date of Birth
Sex
Address
Profile Photo
```

## UI Structure

```text
Profile

Personal Information

First Name        Last Name
[___________]     [___________]

Email
[____________________________]

Date of Birth     Sex
[___________]     [Select]

Address
[____________________________]
[____________________________]

Profile Photo
[ Current Photo ]

[ Upload New Photo ]

[ Save Changes ]
```

---

# 4. First Name

Field:

```text
First Name
```

Requirements:

- Required
- Trim whitespace
- Reasonable maximum length
- Use existing form/input components
- Validate before submission

---

# 5. Last Name

Field:

```text
Last Name
```

Requirements:

- Required
- Trim whitespace
- Reasonable maximum length
- Use existing form/input components
- Validate before submission

---

# 6. Email

Field:

```text
Email
```

Requirements:

- Standard email validation
- Follow the existing backend rules
- If email is immutable, show it as read-only
- Do not assume email can be changed unless the backend supports it

---

# 7. Date of Birth

Field:

```text
Date of Birth
```

Use the existing date-picker/date-input component if available.

Store and submit the date using the existing backend/API format.

---

# 8. Sex

Field:

```text
Sex
```

Use a reusable select/dropdown.

If the backend already defines allowed values, use those values.

Do not create a conflicting frontend enum.

---

# 9. Address

Use the existing address model if available.

At minimum support:

```text
Address
```

If the existing backend supports structured addresses, reuse the existing structure rather than creating a new one.

Possible structure:

```text
Address Line 1
Address Line 2
City
State
Postal Code
Country
```

Only implement fields supported by the current backend/data model.

---

# 10. Profile Photo

Profile photo is common to:

- SUPER_ADMIN
- TENANT
- END_USER

Requirements:

- Show current profile image
- Upload new image
- Preview selected image
- Remove image if supported
- Validate file type
- Validate reasonable file size
- Show upload/loading state
- Show upload error
- Do not replace the server image until upload succeeds

Supported formats:

```text
JPG
JPEG
PNG
WEBP
```

Reuse any existing image-upload component/service.

---

# 11. Tenant-Specific Profile

Only show this section when:

```js
user.role === TENANT
```

Section:

```text
Business Information
```

## Required Tenant Fields

```text
Business Name
Business Address
Business Photos
```

The section should appear below the common personal information.

---

# 12. Tenant Business Name

Field:

```text
Business Name
```

This must be separate from:

```text
First Name
Last Name
```

Example:

```text
First Name: Vijayaraj
Last Name: Unnikrishnan
Business Name: ABC Hostels
```

---

# 13. Tenant Business Address

Create a separate business address section.

Do not use the personal address field as the business address.

Use the existing backend address structure.

If supported:

```text
Address Line 1
Address Line 2
City
State
Postal Code
Country
```

---

# 14. Tenant Business Photos

Only TENANT users should see:

```text
Business Photos
```

Requirements:

- Existing photo gallery
- Upload business photos
- Preview photos
- Remove photos if supported
- Loading state
- Error state
- Empty state

Example:

```text
Business Photos

[ Photo 1 ] [ Photo 2 ] [ Photo 3 ]

[ + Add Photos ]
```

If business/property photos belong to a property entity rather than the tenant entity in the existing backend, do not force them into the tenant profile. Reuse the existing data model.

---

# 15. Additional Tenant Business Fields

Before adding additional business fields:

1. Inspect the existing backend/data model.
2. Inspect existing tenant forms.
3. Inspect existing API types.
4. Reuse existing field names.

Do not invent duplicate business fields.

Potential fields such as:

```text
Business Type
Business Email
Business Phone
Registration Details
Website
Description
```

should only be added if they are supported by the existing requirements/backend.

---

# 16. End User Profile

Only show this section when:

```js
user.role === END_USER
```

Section:

```text
Resident / End User Information
```

First inspect the existing End User/Resident model and existing forms.

Render the existing End User-specific fields from that model.

Possible fields may include:

```text
Emergency Contact Name
Emergency Contact Phone
Government ID
Occupation
Student/Working Status
```

However:

> Do not invent these fields if they do not exist in the current backend/data model.

Reuse the existing End User/Resident schema.

---

# 17. Super Admin Profile

SUPER_ADMIN should initially receive only the common personal information:

```text
First Name
Last Name
Email
Date of Birth
Sex
Address
Profile Photo
```

Do not add business fields to Super Admin.

Platform-specific Super Admin settings can be added later if required.

---

# 18. Profile Component Architecture

Use one common page:

```text
Profile/
├── Profile.jsx
├── components/
│   ├── PersonalInformation.jsx
│   ├── ProfilePhoto.jsx
│   ├── TenantBusinessInformation.jsx
│   └── EndUserInformation.jsx
└── profile.config.js
```

Recommended rendering:

```jsx
<Profile>
  <PersonalInformation />

  {role === ROLES.TENANT && (
    <TenantBusinessInformation />
  )}

  {role === ROLES.END_USER && (
    <EndUserInformation />
  )}
</Profile>
```

If the conditional logic becomes large, move it into configuration.

---

# 19. Role-Based Profile Configuration

Prefer configuration over large conditional JSX.

Example:

```js
const profileConfig = {
  SUPER_ADMIN: {
    sections: ['personal'],
  },

  TENANT: {
    sections: ['personal', 'business'],
  },

  END_USER: {
    sections: ['personal', 'resident'],
  },
};
```

This should remain extensible for future roles/sections.

---

# 20. Edit / Save Behavior

Profile should support:

```text
View Mode
    ↓
Edit Profile
    ↓
Edit Mode
    ↓
Save / Cancel
```

### Save

When Save succeeds:

- Update displayed profile information
- Update AuthContext/current user if required
- Show success feedback
- Return to view mode

### Cancel

When Cancel is clicked:

- Discard unsaved changes
- Restore original profile values
- Do not call the API

---

# 21. API Architecture

Do not place Axios calls directly inside the Profile component.

Reuse the existing API/service architecture.

Potential service methods:

```js
getProfile()
updateProfile()
uploadProfilePhoto()
deleteProfilePhoto()

getTenantBusinessProfile()
updateTenantBusinessProfile()
uploadBusinessPhotos()
deleteBusinessPhoto()

getEndUserProfile()
updateEndUserProfile()
```

Only implement methods corresponding to APIs that actually exist.

If an API is not available yet, create a clean integration point without inventing backend behavior.

---

# 22. Settings Route

Use:

```text
/settings
```

Settings should also be a common page.

Do not create three complete Settings pages.

---

# 23. Common Settings

Common settings should include:

```text
Account
├── Profile
├── Change Password
└── Security

Preferences
├── Appearance
├── Notifications
└── Language
```

Reuse existing pages/components where they already exist.

---

# 24. Appearance Settings

Reuse the existing theme system.

Support:

```text
Light
Dark
System
```

Do not create another ThemeContext or duplicate theme state.

---

# 25. Notification Settings

Common notification preferences can include:

```text
Email Notifications
Push Notifications
SMS Notifications
```

Use reusable toggle components.

Persist through the existing API when available.

---

# 26. Language Settings

Prepare a reusable language selector.

Example:

```text
Language
[ English ▼ ]
```

Do not implement full internationalization unless the project already supports it.

---

# 27. Tenant Settings

TENANT can have additional:

```text
Business Settings
```

Only include settings supported by the existing backend/requirements.

Do not create duplicate tenant-specific settings pages.

---

# 28. End User Settings

END_USER can have additional:

```text
User Preferences
```

Use the existing End User/Resident model and requirements.

Do not invent unsupported settings.

---

# 29. Settings Architecture

Recommended:

```text
Settings/
├── Settings.jsx
├── components/
│   ├── AccountSettings.jsx
│   ├── AppearanceSettings.jsx
│   ├── NotificationSettings.jsx
│   ├── TenantSettings.jsx
│   └── EndUserSettings.jsx
└── settings.config.js
```

The page should render role-specific sections based on the authenticated user.

---

# 30. Loading / Error / Empty States

All API-backed sections must support:

```text
Loading
Success
Error
Empty
Saving
```

Example:

```text
Loading profile...
```

Error:

```text
Unable to load your profile.

[Try Again]
```

Save error:

```text
Unable to save changes.
Please try again.
```

Do not leave a blank screen when an API fails.

---

# 31. Responsive Design

The Profile and Settings modules must work on:

```text
Mobile
Tablet
Desktop
```

Desktop:

```text
Personal Information
2-column fields

Business Information
2-column fields

Business Photos
Gallery
```

Mobile:

```text
Personal Information

First Name
Last Name
Email
Date of Birth
Sex
Address

Business Information
Business Name
Business Address
Business Photos
```

Avoid horizontal scrolling.

---

# 32. Security / Permissions

The frontend should not allow editing of system-controlled fields such as:

```text
User ID
Role
Tenant ID
System-generated timestamps
```

The backend remains the final authorization layer.

Frontend RBAC is only responsible for:

- UI visibility
- Routing
- User experience

---

# 33. Existing Code Must Be Reused

Before implementation, inspect:

1. Existing Profile page
2. Existing Settings page
3. AuthContext
4. Role constants
5. Router
6. User model/type
7. Tenant model/type
8. End User/Resident model/type
9. Existing API services
10. Existing upload components
11. Existing form components
12. Existing theme system

Do not rebuild functionality that already exists.

---

# 34. Target Architecture

```text
                    PROFILE
                       │
                 Authenticated User
                       │
                      Role
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
     SUPER_ADMIN      TENANT     END_USER
          │            │            │
          ↓            ↓            ↓
      Personal      Personal     Personal
       Fields        Fields       Fields
                       │            │
                       ↓            ↓
                   Business      Resident
                    Fields        Fields
```

The final implementation should follow:

```text
ONE COMMON PROFILE PAGE
+
COMMON PERSONAL INFORMATION
+
TENANT-SPECIFIC BUSINESS INFORMATION
+
END-USER-SPECIFIC INFORMATION
+
ONE COMMON SETTINGS PAGE
+
ROLE-SPECIFIC SETTINGS SECTIONS
+
CENTRALIZED RBAC
+
NO DUPLICATE PAGES
```

---

# 35. Acceptance Criteria

## SUPER_ADMIN

Profile shows:

- First Name
- Last Name
- Email
- Date of Birth
- Sex
- Address
- Profile Photo

Does not show:

- Tenant Business Information
- End User/Resident Information

## TENANT

Profile shows:

- First Name
- Last Name
- Email
- Date of Birth
- Sex
- Address
- Profile Photo
- Business Name
- Business Address
- Business Photos
- Existing supported business fields

## END_USER

Profile shows:

- First Name
- Last Name
- Email
- Date of Birth
- Sex
- Address
- Profile Photo
- Existing supported End User/Resident fields

## Settings

All roles share the same Settings page structure.

Role-specific sections are displayed based on the authenticated user's role.

---

# 36. Important Implementation Rule

Do not create:

```text
SuperAdminProfile.jsx
TenantProfile.jsx
EndUserProfile.jsx
```

Do not create:

```text
SuperAdminSettings.jsx
TenantSettings.jsx
EndUserSettings.jsx
```

Instead use:

```text
Profile.jsx
Settings.jsx
```

with reusable role-specific sections/components.

The goal is:

**Common page + role-based rendering + reusable components + centralized RBAC + no unnecessary duplication.**
