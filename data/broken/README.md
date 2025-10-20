# Broken JSON Test Files

This directory contains various broken JSON files for manual testing of error handling in the JSON i18n Diff Tool.

## Test Files

### Syntax Errors

1. **missing-closing-brace.json**
   - Missing closing brace for root object
   - Error: Unexpected end of JSON input

2. **trailing-comma.json**
   - Trailing commas after last object properties
   - Error: Unexpected token '}' or ','

3. **missing-quotes-on-key.json**
   - Object keys without quotes
   - Error: Unexpected token

4. **single-quotes.json**
   - Uses single quotes instead of double quotes
   - Error: Unexpected token

5. **missing-colon.json**
   - Missing colon between key and value
   - Error: Unexpected token

6. **missing-value.json**
   - Key without a value
   - Error: Unexpected token '}'

7. **missing-comma.json**
   - Missing comma between object properties
   - Error: Unexpected string

8. **unclosed-string.json**
   - String value not properly closed
   - Error: Unterminated string

9. **extra-comma.json**
   - Double comma between properties
   - Error: Unexpected token ','

10. **extra-closing-brace.json**
    - Extra closing brace
    - Error: Unexpected token '}'

11. **invalid-escape-sequence.json**
    - Invalid escape sequence in string
    - Error: Bad escape character

12. **unquoted-value.json**
    - String value without quotes
    - Error: Unexpected token

### Content Errors

13. **empty-file.json**
    - Completely empty file
    - Error: Unexpected end of JSON input

14. **plain-text.json**
    - Plain text content, not JSON
    - Error: Unexpected token

15. **duplicate-keys.json**
    - Duplicate property keys (technically valid JSON but semantically problematic)
    - Note: JSON.parse() will accept this, using the last value

## Testing Instructions

Use these files to verify that:

1. **File Uploader** properly detects and reports JSON parsing errors
2. **Error messages** are clear and helpful to users
3. **Error recovery** allows users to correct and retry
4. **UI remains stable** when invalid files are loaded
5. **Line numbers** are reported when available (if error message includes them)

## Expected Behavior

When loading any of these broken files (except duplicate-keys.json), the application should:

- Show a clear error message indicating the JSON is invalid
- Display the error type/reason if available
- Allow the user to try uploading a different file
- Not crash or enter an invalid state
- Clear any previous valid file data

## Valid Test Files

For comparison testing with valid JSON, use files in `/data/test1/` directory.
