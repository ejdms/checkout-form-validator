//------------------------------- INFO ----------------------------------//
// Name: Checkout Form Validator
// Author: Adam Sliwinski
// Date: 17-10-19

//----------------------------- IMPORTANT --------------------------------//
// 1. Always create a new message and regular expressions for fields in checkout forms! - it's just for a better UX, I've set up error handling
// 2. Persistence of HTML structure is required, some functions use parentElement method, so don't break it
// 3. If you want a field to not be checked, just don't give it a js-validation class
// 4. Always use Babel to compile the development version into the pro version!
// 5. You can minify the output by the same minifier I use: https://javascript-minifier.com/ - for better and quicker working

//------------------------ HOW TO ADD RULESET? ---------------------------//
// 1. Create new Regex in "REGEXES" section
// 2. Create new rule in ifelse tree, where you write class of input (regex and messages are optional)
// 3. Add new rule in regex object destructuring line (you can find it in "THIS IS WHERE REGEXES ARE IMPORTED" section)
// 4. In HTML do everything according to the pattern used

//------------------------ HOW MESSAGES WORKS? ---------------------------//
// * is the name of checking value (firstname, email etc.)
//
// 1. There are 4 types of messages:
//  - js-validation-message-*-pl        - message appear if customer does not want a VAT document and Poland is the selected country
//  - js-validation-message-*-en        - message appear if customer does not want VAT document and Poland is not the selected country
//  - js-validation-message-*-pl-vat    - message appear if customer wants VAT document and Poland is the selected country
//  - js-validation-message-*-en-vat    - message appear if customer wants VAT document and Poland is not the selected country
//
// 2. These messages must be preceded by the class js-validation-message-*
// 3. If you only need one message, just do not enter any of these classes (leave this message as js-validation-message-*). The algorithm will take care of this.
// 4. If you don't need a message with a VAT number, just don't use it. The algorithm will adopt the PL or EN version if there are no VAT equivalents.

//----------------- HOW BLOCKING SUBMIT BUTTON WORKS? --------------------//
//
// 1. There is true submit button and false submit button. False one is on top on true one.
// 2. On mouse enter .js-validation-disable-submit-button true submit button becomes disabled
// 3. On click on false submit button, forms are validated. If everything is correct, true submit button becomes enabled and clicked
// 4. Error message is showing on when false submit button was clicked and validation failed

(function() {
  const validationForms = document.querySelectorAll(".js-validation-form");

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ////////////////  REGEXES  ////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  // regexes if customer dont want VAT document
  const regexs = {
    pl: {
      regEmail: /^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9_-]+(\.[a-z]{2,})+$/,

      regFirstName: /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ -]+$/,
      regLastName: /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ -]+$/,
      regTelNumber: /^[0-9]{9}$/,
      regStreet: /^[^@]+$/,
      regApartmentNumber: /^./,
      regZipCode: /^[0-9]{2}-[0-9]{3}$/,
      regCity: /^./
    },
    en: {
      regFirstName: /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ -]+$/,
      regLastName: /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ -]+$/,
      regTelNumber: /^./,
      regStreet: /^[^@]+$/,
      regApartmentNumber: /^./,
      regZipCode: /^./,
      regCity: /^./
    }
  };

  // regexes if customer want VAT document
  const regexsVAT = {
    pl: {
      regCompany: /^./,
      regVat: /^[0-9]{10}$/,
      regTelNumber: /^[0-9]{9}$/,
      regStreet: /^[^@]+$/,
      regApartmentNumber: /^./,
      regZipCode: /^[0-9]{2}-[0-9]{3}$/,
      regCity: /^./
    },
    en: {
      regCompany: /^./,
      regVat: /^./,
      regTelNumber: /^./,
      regStreet: /^[^@]+$/,
      regApartmentNumber: /^./,
      regZipCode: /^./,
      regCity: /^./
    }
  };

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  //////////  VALIDATING FUNCTION  //////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  function validate(element, form) {
    const countrySelect = form.querySelector(".js-validation-country");

    // check if customer wants VAT document
    const VATCheckbox = form.querySelector(".js-validation-wants-vat-checkbox"); // check VAT checkbox in document range NOT in form range
    let customerWantsVAT = null;

    if (VATCheckbox) {
      customerWantsVAT = VATCheckbox.checked;
    }

    //--------- THIS IS WHERE REGEXES ARE IMPORTED ---------

    // Check isPoland (if no countrySelect then is false)
    const isPoland = countrySelect
      ? countrySelect.value.toLowerCase() === "pl"
      : true;

    // Destructuring regexs depending on isPoland AND on customerWantsVAT
    const objectToDestruct = customerWantsVAT ? regexsVAT : regexs; // choose regexs object with VAT or not
    const {
      regCompany,
      regFirstName,
      regLastName,
      regEmail,
      regTelNumber,
      regStreet,
      regApartmentNumber,
      regPlace,
      regZipCode,
      regCity,
      regVat
    } = isPoland ? objectToDestruct.pl : objectToDestruct.en; // choose language - EN or PL - and destruct regex object

    //--------- THIS IS WHERE REGEXES STOP IMPORTING ---------

    // Variables
    let messageClassName; // message class
    let testResult = true; // validation result

    // Previous validation reset
    element.classList.remove(
      "js-validation-correct",
      "js-validation-incorrect"
    );

    //
    ///
    ////   all supported types of validated class names
    /////  DELETE/COMMENT LAST ELSE IN PRODUCTION
    //////
    ///////
    if (element.classList.contains("js-validation-company")) {
      //Company

      messageClassName = "js-validation-message-company";
      if (regCompany) testResult = regCompany.test(element.value);
    } else if (element.classList.contains("js-validation-firstname")) {
      //Firstname

      messageClassName = "js-validation-message-firstname";
      if (regFirstName) testResult = regFirstName.test(element.value);
    } else if (element.classList.contains("js-validation-lastname")) {
      //Lastname

      messageClassName = "js-validation-message-lastname";
      if (regLastName) testResult = regLastName.test(element.value);
    } else if (element.classList.contains("js-validation-email")) {
      //Email

      messageClassName = "js-validation-message-email";
      if (regEmail) testResult = regEmail.test(element.value.toLowerCase());
    } else if (element.classList.contains("js-validation-telnumber")) {
      //Telnumber

      messageClassName = "js-validation-message-telnumber";
      if (regTelNumber) testResult = regTelNumber.test(element.value);
    } else if (element.classList.contains("js-validation-street")) {
      //Street

      messageClassName = "js-validation-message-street";
      if (regStreet) testResult = regStreet.test(element.value);
    } else if (element.classList.contains("js-validation-apartmentnumber")) {
      //apartmentnumber

      messageClassName = "js-validation-message-apartmentnumber";
      if (regApartmentNumber)
        testResult = regApartmentNumber.test(element.value);
    } else if (element.classList.contains("js-validation-place")) {
      //Place

      messageClassName = "js-validation-message-place";
      if (regPlace) testResult = regPlace.test(element.value);
    } else if (element.classList.contains("js-validation-zipcode")) {
      //Zipcode

      messageClassName = "js-validation-message-zipcode";
      if (regZipCode) testResult = regZipCode.test(element.value);
    } else if (element.classList.contains("js-validation-city")) {
      //City

      messageClassName = "js-validation-message-city";
      if (regCity) testResult = regCity.test(element.value);
    } else if (element.classList.contains("js-validation-vatnumber")) {
      //VAT number

      messageClassName = "js-validation-message-vatnumber";
      if (regVat) testResult = regVat.test(element.value);
    } else {
      // console.log(element, ' has no validation ruleset');
    }
    ///////
    //////
    /////
    ////
    ///
    //

    // Color change
    testResult
      ? element.classList.add("js-validation-correct")
      : element.classList.add("js-validation-incorrect");

    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////  MESSAGES  ////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////

    // if this input has own messages
    if (messageClassName) {
      // Message show/close
      let message;
      const messages = Array.from(
        form.querySelectorAll(`.${messageClassName}`)
      );

      // Remove show class form every message for this input
      messages.forEach(message => message.classList.remove("show"));

      // Check if there are more than one message for input, if yes - check which one
      if (messages.length === 1) {
        message = messages[0];
      } else {
        let messageQuery = `${messageClassName}`;
        // Check for isPoland
        isPoland ? (messageQuery += "-pl") : (messageQuery += "-en");
        // Check for customerWantsVAT and if vat message exist (if vat message dont exist, then it will just take normal message)
        if (customerWantsVAT && form.querySelector(`.${messageQuery}-vat`))
          messageQuery += "-vat";
        message = form.querySelector(`.${messageQuery}`);
      }

      // Hide message container if there is any error (message does not exist)
      // This will make sense if dev forget to write message for field
      if (!message) {
        const messageContainer = form.querySelector(`.${messageClassName}`)
          .parentElement;

        if (messageContainer) {
          messageContainer.classList.remove("show");

          // Uncomment this code, if you want to restore default color if theres no message
          // const input = messageContainer.parentElement.querySelector('input');
          // input.classList.remove('js-validation-incorrect');
        }
      }

      // Show message container
      if (
        message &&
        message.parentElement.classList.contains(
          "js-validation-message-container"
        )
      ) {
        if (testResult) {
          message.parentElement.classList.remove("show");
        } else {
          message.parentElement.classList.add("show");
        }
      }

      // Show message
      if (message) {
        message.classList.remove("show");
        if (!testResult) {
          message.classList.add("show");
        }
      }
    }
  }

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  //////  HIDE ERROR MESSAGE FUNCTION  //////
  /// (error message under submit button) ///
  ///////////////////////////////////////////
  function hideErrorMessageIfNoErrors() {
    let hideErrorMessage = true;

    validationForms.forEach(form => {
      Array.from(form.querySelectorAll(".js-validation")).forEach(
        validateField => {
          if (!validateField.disabled && form.style.disabled !== "none") {
            if (validateField.classList.contains("js-validation-incorrect")) {
              hideErrorMessage = false;
            }
          }
        }
      );
    });

    if (hideErrorMessage) {
      document
        .querySelector(".js-validation-blockade-message")
        .classList.remove("show");
    }
  }

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  /////////  SETTING EVERYTHING UP //////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  if (validationForms.length) {
    validationForms.forEach(form => {
      const validationFields = Array.from(
        form.querySelectorAll(".js-validation")
      );

      if (validationFields.length) {
        // Input event handle
        validationFields.forEach(validateField => {
          // if element is text input add event listener to validate on input
          if (validateField instanceof HTMLInputElement) {
            validateField.addEventListener("input", e =>
              validate(e.target, form)
            );
          }
        });
        // end of fields foreach
      }

      ////////////////////////////////////////////////////////////////////
      /////////// FORCE VALIDATING (SELECT OR CHECKBOX CHANGE) ///////////
      ////////////////////////////////////////////////////////////////////

      // force validating on country select change
      const countrySelect = form.querySelector(".js-validation-country");

      // if select exists and inputs exists
      if (countrySelect && validationFields) {
        countrySelect.addEventListener("change", () => {
          validationFields.forEach(validateField => {
            // if this input was validated before
            if (
              validateField.classList.contains("js-validation-correct") ||
              validateField.classList.contains("js-validation-incorrect")
            ) {
              validate(validateField, form);
            }
          });

          hideErrorMessageIfNoErrors();
        });
      }

      // force validating on customerWantsVAT checkbox change
      const VATCheckbox = form.querySelector(
        ".js-validation-wants-vat-checkbox"
      );

      // if VAT checkbox and inputs exists
      if (VATCheckbox && validationFields) {
        VATCheckbox.addEventListener("change", () => {
          validationFields.forEach(validateField => {
            if (validateField.value !== "") {
              // revalidate
              if (
                validateField.classList.contains("js-validation-correct") ||
                validateField.classList.contains("js-validation-incorrect")
              ) {
                validate(validateField, form);
              }
            } else {
              // unvalidate
              validateField.classList.remove("js-validation-correct");
              validateField.classList.remove("js-validation-incorrect");

              console.log(validateField);
              const messageContainer = validateField.parentElement.querySelector(
                ".js-validation-message-container"
              );
              messageContainer.classList.remove("show");

              const messages = Array.from(
                messageContainer.querySelectorAll(".show")
              );
              messages.forEach(message => {
                message.classList.remove("show");
              });
            }
          });

          hideErrorMessageIfNoErrors();
        });
      }

      // handle fields validation on address select change

      const addressSelect = form.querySelector(
        ".js-validate-address-change-select"
      );
      const activeMessageContainers = Array.from(
        form.querySelectorAll(".js-validation-message-container")
      );

      if (addressSelect) {
        addressSelect.addEventListener("change", () => {
          // remove validation classes
          validationFields.forEach(validationField => {
            validationField.classList.remove("js-validation-incorrect");
            validationField.classList.remove("js-validation-correct");
          });

          // deactivate active messages
          activeMessageContainers.forEach(activeMessageContainer => {
            activeMessageContainer.classList.remove("show");

            const activeMessages = Array.from(
              activeMessageContainer.querySelectorAll(".js-validation-message")
            );
            activeMessages.forEach(activeMessage => {
              activeMessage.classList.remove("show");
            });
          });

          // validate fields with value

          validationFields.forEach(validationField => {
            if (validationField.value !== "") {
              validate(validationField, form);
            }
          });
        });
      }

      // end of forms foreach
    });

    // force validating on shipping checkbox change
    const shippingCheckbox = document.querySelector(
      ".js-validation-different-address"
    );

    // if shipping checkbox exists
    if (shippingCheckbox) {
      shippingCheckbox.addEventListener("change", () => {
        const shippingForm = document.querySelector(
          ".js-validation-shipping-address-form"
        );
        const shippingFields = Array.from(
          shippingForm.querySelectorAll(".js-validation")
        );

        // timeout on 0s to be on the end of call stack
        setTimeout(() => {
          shippingFields.forEach(shippingField => {
            validate(shippingField, shippingForm);
          });

          hideErrorMessageIfNoErrors();
        }, 0);
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      // validate inputs on page load
      validationForms.forEach(form => {
        const validationFields = Array.from(
          form.querySelectorAll(".js-validation")
        );

        if (validationFields.length) {
          validationFields.forEach(validateField => {
            // validate if element is text input and not empty
            if (
              validateField instanceof HTMLInputElement &&
              validateField.value !== ""
            ) {
              validate(validateField, form);
            }
          });
          // end of fields foreach
        }
      });
    });

    ////////////////////////////////////////////////////////////////////
    ////////////////////// CHECKOUT BUTTON HANDLE //////////////////////
    ////////////////////////////////////////////////////////////////////

    const button = document.querySelector(".js-validation-submit-button");
    const handleToDisableButton = document.querySelector(
      ".js-validation-disable-submit-button"
    );
    const blockade = document.querySelector(".js-validation-blockade");
    const errorMessage = document.querySelector(
      ".js-validation-blockade-message"
    );

    handleToDisableButton.addEventListener("mouseenter", () => {
      button.disabled = true;
    });

    blockade.addEventListener("click", () => {
      // disable error message
      errorMessage.classList.remove("show");

      // validate proper inputs
      const elementsToValidate = [];
      const elementsThatHasBeenValidated = [];

      validationForms.forEach(form => {
        Array.from(form.querySelectorAll(".js-validation")).forEach(
          validateField => {
            // add input to array if not disabled or form is hidden
            if (!validateField.disabled && form.style.display !== "none") {
              elementsToValidate.push(validateField);
            }
          }
        );

        // validate elements and add it to elementsThatHasBeenValidated
        elementsToValidate.forEach(element => {
          validate(element, form);
          elementsThatHasBeenValidated.push(element);
        });

        // clear array
        elementsToValidate.length = 0;
      });

      // check if any input is incorrectly validated
      let enableButton = true;
      elementsThatHasBeenValidated.forEach(element => {
        if (element.classList.contains("js-validation-incorrect")) {
          enableButton = false;
        }
      });

      // enable checkout button
      if (enableButton) {
        button.disabled = false;
        button.click();
      } else {
        errorMessage.classList.add("show");
      }
    });

    // on change in every validating inputs: check for incorrectly validated fields, if zero then hide errorMessage

    validationForms.forEach(form => {
      Array.from(form.querySelectorAll(".js-validation")).forEach(
        validateField => {
          validateField.addEventListener("input", () => {
            hideErrorMessageIfNoErrors();
          });
        }
      );
    });
  }
})();
