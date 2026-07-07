export const splitFullName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || name.trim();
  const lastName = parts.join(" ") || ".";

  return { firstName, lastName };
};

export const getInitials = (name?: string | null, email?: string | null) => {
  const label = name?.trim() || email?.trim() || "User";

  return label
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

