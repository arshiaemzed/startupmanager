const validateField = require("../utils/validateField");
const errorCodes = require("../utils/errorCodes");

function expectInvalidField(mockRes) {
  expect(mockRes.status).toHaveBeenCalledWith(400);

  expect(mockRes.json).toHaveBeenCalledWith({
    success: false,
    error: {
      message: "test error message",
      code: errorCodes.INVALID_FIELD,
    },
  });
}

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

test("return undefined if field is valid", () => {
  const mockRes = createResponse();

  validateField("test field", mockRes, "test error message");

  expect(mockRes.status).not.toHaveBeenCalled();

  expect(mockRes.json).not.toHaveBeenCalled();
});

test.each([null, undefined, {}, [], "    ", "", 5])(
  "throws error if field is not valid",
  (field) => {
    const mockRes = createResponse();

    validateField(field, mockRes, "test error message");

    expectInvalidField(mockRes);
  },
);
