const validateField = require("../utils/validateField");

const res = {
  statusCode: 200,

  status: jest.fn(function (code) {
    this.statusCode = code;
    return this;
  }),

  json: jest.fn(function (data) {
    console.log(data);
  }),
};

test("return error if not valid", () => {
  validateField(null, res, 400, "Missing param");

  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalledWith({
    success: false,
    error: { message: "Missing param", code: 400 },
  });
});
