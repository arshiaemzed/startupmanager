const validateParam = require("../utils/validateParam");

const res = {
  statusCode: 200,

  status: jest.fn(function (code) {
    {
      this.statusCode = code;
      return this;
    }
  }),

  json: jest.fn(function (data) {
    console.log(data);
  }),
};

test("returns error if not valid", () => {
  validateParam(null, res, 400, "Missing param");

  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalledWith({
    success: false,
    error: {
      message: "Missing param",
      code: 400,
    },
  });
});
