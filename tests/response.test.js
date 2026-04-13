import { describe, expect, it, vi } from "vitest";
import { InternalServerError, notFoundInDatabase } from "../src/utils/response.js";

function createResMock() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe("response utils", () => {
  it("InternalServerError sends 500 payload", () => {
    const res = createResMock();
    const error = new Error("boom");

    InternalServerError(error, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });

  it("notFoundInDatabase sends 404 payload", () => {
    const res = createResMock();

    notFoundInDatabase(res, "Book");

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Book not found",
    });
  });
});
