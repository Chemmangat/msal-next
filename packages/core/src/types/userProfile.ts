/**
 * Complete Microsoft Graph User Profile Types
 * Based on Microsoft Graph /me endpoint
 * 
 * @see https://learn.microsoft.com/en-us/graph/api/user-get
 */

/**
 * Complete user profile from Microsoft Graph /me endpoint
 * 
 * @remarks
 * This interface includes all common fields returned by the Microsoft Graph /me endpoint.
 * You can extend this interface with custom fields specific to your organization.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { profile } = useUserProfile();
 * console.log(profile?.department); // Now type-safe!
 * 
 * // With custom fields
 * interface MyUserProfile extends UserProfile {
 *   customField: string;
 * }
 * 
 * const { profile } = useUserProfile<MyUserProfile>();
 * console.log(profile?.customField);
 * ```
 */
export interface UserProfile {
  /** Unique identifier for the user */
  id: string;

  /** User's display name */
  displayName: string;

  /** User's first name */
  givenName: string;

  /** User's last name */
  surname: string;

  /** User principal name (UPN) - typically the email used for login */
  userPrincipalName: string;

  /** Primary email address */
  mail: string;

  /** Job title */
  jobTitle?: string;

  /** Department name */
  department?: string;

  /** Company name */
  companyName?: string;

  /** Office location */
  officeLocation?: string;

  /** Mobile phone number */
  mobilePhone?: string;

  /** Business phone numbers */
  businessPhones?: string[];

  /** Preferred language (e.g., "en-US") */
  preferredLanguage?: string;

  /** Employee ID */
  employeeId?: string;

  /** Employee hire date */
  employeeHireDate?: string;

  /** Employee type (e.g., "Employee", "Contractor") */
  employeeType?: string;

  /** Country/region */
  country?: string;

  /** City */
  city?: string;

  /** State or province */
  state?: string;

  /** Street address */
  streetAddress?: string;

  /** Postal code */
  postalCode?: string;

  /** Usage location (ISO 3166 country code) */
  usageLocation?: string;

  /** Manager's user ID */
  manager?: string;

  /** About me / bio */
  aboutMe?: string;

  /** Birthday */
  birthday?: string;

  /** Interests */
  interests?: string[];

  /** Skills */
  skills?: string[];

  /** Schools attended */
  schools?: string[];

  /** Past projects */
  pastProjects?: string[];

  /** Responsibilities */
  responsibilities?: string[];

  /** My site URL */
  mySite?: string;

  /** Fax number */
  faxNumber?: string;

  /** Account enabled status */
  accountEnabled?: boolean;

  /** Age group (e.g., "Adult", "Minor") */
  ageGroup?: string;

  /** User type (e.g., "Member", "Guest") */
  userType?: string;

  /** Profile photo URL (blob URL created by the library) */
  photo?: string;
}

/**
 * Return type for useUserProfile hook
 */
export interface UseUserProfileReturn<T extends UserProfile = UserProfile> {
  /**
   * User profile data
   */
  profile: T | null;

  /**
   * Whether profile is loading
   */
  loading: boolean;

  /**
   * Error if profile fetch failed
   */
  error: Error | null;

  /**
   * Refetch user profile
   */
  refetch: () => Promise<void>;

  /**
   * Clear cached profile
   */
  clearCache: () => void;
}
