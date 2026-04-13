import { describe, expect, it } from "vitest";
import { validateAllFields } from "../src/utils/validate.js";

describe("validateAllFields", () => {
  it("returns valid=true when all fields are present", () => {
    const result = validateAllFields({
      name: "Pradyumna",
      email: "test@example.com",
      password: "secret",
    });

    expect(result.isValid).toBe(true);
    expect(result.missingFields).toEqual([]);
  });

  it("returns missing fields for null/undefined/empty values", () => {
    const result = validateAllFields({
      name: "",
      email: undefined,
      password: null,
      role: "Member",
    });

    expect(result.isValid).toBe(false);
    expect(result.missingFields).toEqual(["name", "email", "password"]);
  });
});
