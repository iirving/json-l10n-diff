import { describe, it, expect } from "vitest";
import { countKeys } from "./keyCounter.js";

describe("countKeys", () => {
  it("should return 0 for null input", () => {
    expect(countKeys(null)).toBe(0);
  });

  it("should return 0 for undefined input", () => {
    expect(countKeys(undefined)).toBe(0);
  });

  it("should return 0 for non-object input", () => {
    expect(countKeys("string")).toBe(0);
    expect(countKeys(123)).toBe(0);
    expect(countKeys(true)).toBe(0);
  });

  it("should return 0 for array input", () => {
    expect(countKeys([1, 2, 3])).toBe(0);
    expect(countKeys(["a", "b"])).toBe(0);
  });

  it("should return 0 for empty object", () => {
    expect(countKeys({})).toBe(0);
  });

  it("should count single-level keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(countKeys(obj)).toBe(3);
  });

  it("should count nested keys including parent keys", () => {
    const obj = {
      app: {
        title: "My App",
        welcome: "Hello",
      },
    };
    // Should count: app (1) + title (1) + welcome (1) = 3
    expect(countKeys(obj)).toBe(3);
  });

  it("should count deeply nested keys", () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            value: "deep",
          },
        },
      },
    };
    // Should count: level1 (1) + level2 (1) + level3 (1) + value (1) = 4
    expect(countKeys(obj)).toBe(4);
  });

  it("should count keys in complex nested structure", () => {
    const obj = {
      app: {
        title: "My App",
        welcome: "Hello",
      },
      user: {
        profile: {
          name: "John",
          email: "john@example.com",
        },
      },
    };
    // app (1) + title (1) + welcome (1) + user (1) + profile (1) + name (1) + email (1) = 7
    expect(countKeys(obj)).toBe(7);
  });

  it("should not count array elements as keys", () => {
    const obj = {
      list: [1, 2, 3],
      nested: {
        items: ["a", "b"],
      },
    };
    // list (1) + nested (1) + items (1) = 3 (arrays are not counted)
    expect(countKeys(obj)).toBe(3);
  });

  it("should handle objects with null values", () => {
    const obj = {
      a: null,
      b: {
        c: null,
      },
    };
    // a (1) + b (1) + c (1) = 3
    expect(countKeys(obj)).toBe(3);
  });

  it("should handle objects with undefined values", () => {
    const obj = {
      a: undefined,
      b: {
        c: undefined,
      },
    };
    // a (1) + b (1) + c (1) = 3
    expect(countKeys(obj)).toBe(3);
  });

  it("should handle mixed value types", () => {
    const obj = {
      string: "text",
      number: 42,
      boolean: true,
      nullValue: null,
      nested: {
        array: [1, 2, 3],
        obj: {
          deep: "value",
        },
      },
    };
    // string (1) + number (1) + boolean (1) + nullValue (1) + nested (1) + array (1) + obj (1) + deep (1) = 8
    expect(countKeys(obj)).toBe(8);
  });

  it("should handle objects with numeric keys", () => {
    const obj = {
      1: "one",
      2: {
        nested: "two",
      },
    };
    // 1 (1) + 2 (1) + nested (1) = 3
    expect(countKeys(obj)).toBe(3);
  });

  it("should handle empty nested objects", () => {
    const obj = {
      empty: {},
      notEmpty: {
        key: "value",
      },
    };
    // empty (1) + notEmpty (1) + key (1) = 3
    expect(countKeys(obj)).toBe(3);
  });
});
