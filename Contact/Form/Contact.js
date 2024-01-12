if (typeof JS === 'undefined') {
  JS = {
    __namespace: true
  };
}

if (typeof JS.Entities === 'undefined') {
  JS.Entities = {
    __namespace: true
  };
}

if (typeof JS.Entities.Contact === 'undefined') {
  JS.Entities.Contact = {
    __namespace: true
  };
}

const FORM_TYPE_CREATE = 1;
const FORM_TYPE_UPDATE = 2;
const FORM_TYPE_READ_ONLY = 3;
const FORM_TYPE_DISABLED = 4;
const FORM_TYPE_QUICK_CREATE = 5;
const FORM_TYPE_BULK_EDIT = 6;

JS.Entities.Contact = {
  formContext: null,
  formType: null,

  onLoad: async function (executionContext) {
    formContext = executionContext.getFormContext();

    formType = formContext.ui.getFormType();

    if (formType === FORM_TYPE_CREATE) {
      console.log('FORM_TYPE_CREATE');
    } else if (formType === FORM_TYPE_UPDATE) {
      console.log('FORM_TYPE_UPDATE');
    }

    await JS.Entities.Contact.attachEvents();

    await JS.Entities.Contact.validateIdNumber();
    await JS.Entities.Contact.autoPopulateIdRelatedFields();
  },

  onSave: async function (executionContext) {
    // Your onSave logic here
  },

  attachEvents: async function () {
    formContext.getAttribute('t365_idnumber').addOnChange(JS.Entities.Contact.validateIdNumber);
    formContext.getAttribute('t365_idnumber').addOnChange(JS.Entities.Contact.autoPopulateIdRelatedFields);

  },

  callCustomApi_SayHello: async function () {
    var execute_t365_SayHelloAPI_Request = {
      // Parameters
      t365_Name: "Tiyani", // Edm.String

      getMetadata: function () {
        return {
          boundParameter: null,
          parameterTypes: {
            t365_Name: {
              typeName: "Edm.String",
              structuralProperty: 1
            }
          },
          operationType: 0,
          operationName: "t365_SayHelloAPI"
        };
      }
    };

    Xrm.WebApi.execute(execute_t365_SayHelloAPI_Request).then(
      function success(response) {
        if (response.ok) {
          return response.json();
        }
      }
    ).then(function (responseBody) {
      var result = responseBody;
      console.log(result);
      // Return Type: mscrm.t365_SayHelloAPIResponse
      // Output Parameters
      var t356_sayhellotome = result["t356_SayHelloToMe"]; // Edm.String
    }).catch(function (error) {
      console.log(error.message);
    });
  },

  hideTabAndShowMessage: async function () {
    formContext.ui.tabs.get("details").setVisible(false);
    alert('Details Tab is hidden')
  },


  validateIdNumber: async function () {
    console.log('validateIdNumber called');
  },

  autoPopulateIdRelatedFields: async function () {
    const idNumber = formContext.getAttribute('t365_idnumber').getValue();
    const ageAttribute = formContext.getAttribute('t365_age');
    const genderAttribute = formContext.getAttribute('gendercode');

    if (ageAttribute && genderAttribute) {
      ageAttribute.setValue(null);
      genderAttribute.setValue(null);
    }

    if (idNumber === undefined || idNumber === null) {
      return
    };

    if (idNumber.length >= 13) {
      const dateOfBirth = idNumber.substr(0, 6);
      const genderCode = idNumber.substr(6, 4);

      const birthYear = '19' + dateOfBirth.substr(0, 2);
      const birthMonth = dateOfBirth.substr(2, 2);
      const birthDay = dateOfBirth.substr(4, 2);
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear() + 1;
      const monthDiff = today.getMonth() - birthDate.getMonth() + 1;

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const gender = (parseInt(genderCode) >= 5000) ? 1 : 2; // 1= 'Male' : 2='Female';

      // const ageAttribute = formContext.getAttribute('t365_age');
      // const genderAttribute = formContext.getAttribute('gendercode');

      if (ageAttribute && genderAttribute) {
        ageAttribute.setValue(parseInt(age));
        genderAttribute.setValue(gender);
      } else {
        console.error('One or both attributes are null or undefined.');
      }
    }
  },
};

var ContactForm = JS.Entities.Contact;