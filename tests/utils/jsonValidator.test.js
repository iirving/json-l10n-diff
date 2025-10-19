import { describe, it, expect } from "vitest";
import { validateJson } from "../../src/utils/jsonValidator.js";

describe("validateJson", () => {
  describe("invalid input handling", () => {
    it("should return invalid for null input", () => {
      const result = validateJson(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Input must be a non-empty string");
      expect(result.line).toBeNull();
    });

    it("should return invalid for undefined input", () => {
      const result = validateJson(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Input must be a non-empty string");
      expect(result.line).toBeNull();
    });

    it("should return invalid for empty string", () => {
      const result = validateJson("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Input must be a non-empty string");
      expect(result.line).toBeNull();
    });

    it("should return invalid for non-string input", () => {
      const result = validateJson(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Input must be a non-empty string");
      expect(result.line).toBeNull();
    });

    it("should return invalid for object input", () => {
      const result = validateJson({ key: "value" });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Input must be a non-empty string");
      expect(result.line).toBeNull();
    });
  });

  describe("valid JSON", () => {
    it("should validate simple JSON object", () => {
      const result = validateJson('{"key": "value"}');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.line).toBeUndefined();
    });

    it("should validate empty JSON object", () => {
      const result = validateJson("{}");
      expect(result.isValid).toBe(true);
    });

    it("should validate empty JSON array", () => {
      const result = validateJson("[]");
      expect(result.isValid).toBe(true);
    });

    it("should validate nested JSON object", () => {
      const result = validateJson('{"app": {"title": "My App"}}');
      expect(result.isValid).toBe(true);
    });

    it("should validate JSON with arrays", () => {
      const result = validateJson('{"items": [1, 2, 3]}');
      expect(result.isValid).toBe(true);
    });

    it("should validate JSON with multiple types", () => {
      const json =
        '{"string": "text", "number": 42, "bool": true, "null": null}';
      const result = validateJson(json);
      expect(result.isValid).toBe(true);
    });

    it("should validate multiline JSON", () => {
      const json = `{
        "app": {
          "title": "My App",
          "welcome": "Hello"
        }
      }`;
      const result = validateJson(json);
      expect(result.isValid).toBe(true);
    });
  });

  describe("invalid JSON syntax", () => {
    it("should detect missing closing brace", () => {
      const result = validateJson('{"key": "value"');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should detect trailing comma", () => {
      const result = validateJson('{"key": "value",}');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should detect missing quotes on key", () => {
      const result = validateJson('{key: "value"}');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should detect single quotes instead of double quotes", () => {
      const result = validateJson("{'key': 'value'}");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should detect missing value", () => {
      const result = validateJson('{"key": }');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should detect missing colon", () => {
      const result = validateJson('{"key" "value"}');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should detect plain text as invalid JSON", () => {
      const result = validateJson("not json");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("error line extraction", () => {
    it("should extract line number when present in error message", () => {
      // Note: This is browser-dependent, so we test the logic
      // The actual line extraction may return null if browser doesn't provide line info
      const result = validateJson('{"invalid": }');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
      // Line may be null or a number depending on browser
      expect(result.line === null || typeof result.line === "number").toBe(
        true
      );
    });

    it("should handle multiline invalid JSON", () => {
      const json = `{
        "key": "value",
        "invalid":
      }`;
      const result = validateJson(json);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("edge cases", () => {
    it("should handle very large valid JSON", () => {
      const largeObj = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = `value${i}`;
      }
      const result = validateJson(JSON.stringify(largeObj));
      expect(result.isValid).toBe(true);
    });

    it("should handle JSON with unicode characters", () => {
      const result = validateJson('{"emoji": "😀", "chinese": "你好"}');
      expect(result.isValid).toBe(true);
    });

    it("should handle JSON with escaped characters", () => {
      const result = validateJson('{"escaped": "line1\\nline2"}');
      expect(result.isValid).toBe(true);
    });

    it("should handle whitespace-only string", () => {
      const result = validateJson("   \n\t   ");
      expect(result.isValid).toBe(false);
    });
  });
});
