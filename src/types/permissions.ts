export const ROLES = [
  "admin",
  "editor",
  "contributor",
  "support",
  "commerce_ops",
  "partner",
  "runner",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = {
  // Editorial
  "article.create": true,
  "article.edit_own": true,
  "article.edit_any": true,
  "article.publish": true,
  "article.delete": true,

  // Commerce
  "order.view": true,
  "order.refund": true,
  "product.manage": true,
  "promo.manage": true,

  // Support
  "ticket.view": true,
  "ticket.respond": true,
  "ticket.close": true,

  // Events
  "event.create": true,
  "event.edit_own": true,
  "event.edit_any": true,
  "event.publish": true,
  "event.delete": true,

  // Admin
  "user.manage": true,
  "role.assign": true,
  "audit.view": true,
  "analytics.view": true,
} as const;

export type Permission = keyof typeof PERMISSIONS;
