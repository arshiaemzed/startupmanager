function validateEmail(email) {
  if (typeof email === "string") {
    const atCount = email.split("@").length - 1;

    // will reject if the email includes space characters at all
    // example : emzed cfx@gmail.com
    if (email.includes(" ")) {
      return false;
    }

    // rejects if there is consecutive dots
    // example emzed..@gmail.com or emzed@gmail..com
    if (hasConsecutiveDots(email)) {
      return false;
    }

    if (email.includes("@") && atCount === 1) {
      const atSign = email.indexOf("@");

      const localPart = email.slice(0, atSign);
      const domain = email.slice(atSign + 1, email.length);

      if (!validateLocalPart(localPart)) {
        return false;
      }

      if (!validateDomain(domain)) {
        return false;
      }

      return true;
    }

    return false;
  }
  return false;
}

function validateDomain(domain) {
  if (!domain || typeof domain != "string" || domain.length < 1) {
    return false;
  }

  if (domain.includes(" ")) {
    return false;
  }

  if (domain.includes("@")) {
    return false;
  }

  if (hasConsecutiveDots(domain)) {
    return false;
  }

  if (
    containsSpecialCharacters(domain[0]) ||
    containsSpecialCharacters(domain[domain.length - 1])
  ) {
    return false;
  }

  const dot = domain.split(".");

  for (let i = 0; i < dot.length; i++) {
    const element = dot[i];

    if (
      containsSpecialCharacters(element[0]) ||
      containsSpecialCharacters(element[element.length - 1])
    ) {
      return false;
    }
  }

  return true;
}

function validateLocalPart(localPart) {
  if (!localPart || typeof localPart != "string" || localPart.length < 1) {
    return false;
  }

  if (localPart.includes(" ")) {
    return false;
  }

  if (
    containsSpecialCharacters(localPart[0]) ||
    containsSpecialCharacters(localPart[localPart.length - 1])
  ) {
    return false;
  }

  if (hasConsecutiveDots(localPart)) {
    return false;
  }

  return true;
}

function containsSpecialCharacters(str) {
  const allowedCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (const char of str) {
    if (!allowedCharacters.includes(char)) {
      return true;
    }
  }

  return false;
}

function hasConsecutiveDots(str) {
  for (let i = 0; i < str.length; i++) {
    const character = str[i];

    if (character === ".") {
      const afterDot = str[i + 1];

      if (afterDot === ".") {
        return true;
      }
    }
  }
  return false;
}

console.log(validateEmail("emzed@my-site.com"));

module.exports = validateEmail;
