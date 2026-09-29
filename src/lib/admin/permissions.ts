import type { AdminRecord, AdminRole } from "./types";

export type Permission =
  // Content permissions
  | "blogs.read"
  | "blogs.create"
  | "blogs.edit"
  | "blogs.delete"
  | "blog.read"
  | "blog.create"
  | "blog.edit"
  | "blog.delete"
  | "categories.create"
  | "categories.manage"
  | "updates.read"
  | "updates.create"
  | "updates.edit"
  | "updates.delete"
  | "update.read"
  | "update.create"
  | "update.edit"
  | "update.delete"
  | "press.read"
  | "press.create"
  | "press.edit"
  | "press.delete"
  | "careers.read"
  | "careers.create"
  | "careers.edit"
  | "careers.delete"
  | "career.read"
  | "career.create"
  | "career.edit"
  | "career.delete"
  // Leads & Submissions
  | "contacts.read"
  | "contacts.update"
  | "contacts.delete"
  | "contact.read"
  | "contact.update"
  | "contact.delete"
  | "applications.read"
  | "applications.update"
  | "applications.delete"
  | "application.read"
  | "application.update"
  | "application.delete"
  | "earlyAccess.read"
  | "earlyAccess.delete"
  | "newsletter.read"
  | "newsletter.delete"
  // Media
  | "media.read"
  | "media.upload"
  | "media.delete"
  // System / Administration
  | "settings.manage"
  | "logs.read"
  | "admins.manage";

const SUPER_ADMIN_PERMISSIONS: readonly Permission[] = [
  "blogs.read",
  "blogs.create",
  "blogs.edit",
  "blogs.delete",
  "blog.read",
  "blog.create",
  "blog.edit",
  "blog.delete",
  "categories.create",
  "categories.manage",
  "updates.read",
  "updates.create",
  "updates.edit",
  "updates.delete",
  "update.read",
  "update.create",
  "update.edit",
  "update.delete",
  "press.read",
  "press.create",
  "press.edit",
  "press.delete",
  "careers.read",
  "careers.create",
  "careers.edit",
  "careers.delete",
  "career.read",
  "career.create",
  "career.edit",
  "career.delete",
  "contacts.read",
  "contacts.update",
  "contacts.delete",
  "contact.read",
  "contact.update",
  "contact.delete",
  "applications.read",
  "applications.update",
  "applications.delete",
  "application.read",
  "application.update",
  "application.delete",
  "earlyAccess.read",
  "earlyAccess.delete",
  "newsletter.read",
  "newsletter.delete",
  "media.read",
  "media.upload",
  "media.delete",
  "settings.manage",
  "logs.read",
  "admins.manage",
];

const EDITOR_PERMISSIONS: readonly Permission[] = [
  "blogs.read",
  "blogs.create",
  "blogs.edit",
  "blog.read",
  "blog.create",
  "blog.edit",
  "categories.create",
  "updates.read",
  "updates.create",
  "updates.edit",
  "update.read",
  "update.create",
  "update.edit",
  "press.read",
  "press.create",
  "press.edit",
  "careers.read",
  "careers.create",
  "careers.edit",
  "career.read",
  "career.create",
  "career.edit",
  "contacts.read",
  "contacts.update",
  "contact.read",
  "contact.update",
  "applications.read",
  "applications.update",
  "application.read",
  "application.update",
  "earlyAccess.read",
  "newsletter.read",
  "media.read",
  "media.upload",
];

const ROLE_PERMISSIONS: Record<AdminRole, readonly Permission[]> = {
  super_admin: SUPER_ADMIN_PERMISSIONS,
  editor: EDITOR_PERMISSIONS,
};

/**
 * Checks whether an admin user has a specific permission.
 * Security fails closed: returns false if admin is nullish, role is invalid/missing,
 * or permission is not explicitly granted to that role.
 */
export function can(
  admin: AdminRecord | null | undefined,
  permission: Permission,
): boolean {
  if (!admin || !admin.role) return false;
  const permissions = ROLE_PERMISSIONS[admin.role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function isSuperAdmin(admin: AdminRecord | null | undefined): boolean {
  return admin?.role === "super_admin";
}

export function isEditor(admin: AdminRecord | null | undefined): boolean {
  return admin?.role === "editor" || admin?.role === "super_admin";
}
