if (typeof JS === "undefined") {
  JS = {
    __namespace: true
  }
};
if (typeof JS.Entities === 'undefined') {
  JS.Entities = {
    __namespace: true
  }
};
if (typeof JS.Entities.Contact === 'undefined') {
  JS.Entities.Contact = {
    __namespace: true
  }
};

const FORM_TYPE_CREATE = 1;
const FORM_TYPE_UPDATE = 2;
const FORM_TYPE_READ_ONLY = 3;
const FORM_TYPE_DISABLED = 4;
const FORM_TYPE_QUICK_CREATE = 5;
const FORM_TYPE_BULK_EDIT = 6;
debugger;
JS.Entities.Contact = {
  formContext: null,
  formType: null,

  onLoad: async (executionContext) => {
    formContext = executionContext.getFormContext();

    formType = formContext.ui.getFormType();

    if (formType === FORM_TYPE_CREATE) {
      console.log('FORM_TYPE_CREATE');
    } else if (formType === FORM_TYPE_UPDATE) {
      console.log('FORM_TYPE_UPDATE');
    }

    ContactForm.attachEvents();

    ContactForm.validateIdNumber();
  },

  onSave: async (executionContext) => {
    // Your onSave logic here
  },

  attachEvents: async () => {
    formContext.getAttribute('t365_idnumber').addOnChange(ContactForm.validateIdNumber);
  },

  validateIdNumber: async (executionContext) => {
    console.log('validateIdNumber called');
  },

  autoPopulateIdRelatedFields: async () => {
    let formContext = executionContext.getFormContext();
    let idNumber = formContext.getAttribute('t365_idnumber').getValue();

    if (idNumber.lenght >= 12) {

      let dateOfBirth = idNumber.substr(0, 6);
      let genderCode = idNumber.substr(6, 4);

      let birthYear = '19' + dateOfBirth.substr(0, 2);
      let birthMonth = dateOfBirth.substr(2, 2);
      let birthDay = dateOfBirth.substr(4, 2);
      let birthDate = new Date(birthYear, birthMonth - 1, birthDay);

      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      let monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      let gender = (parseInt(genderCode) >= 5000) ? 'Male' : 'Female';

      let ageAttribute = formContext.getAttribute('t365_age');
      let genderAttribute = formContext.getAttribute('gendercode');

      if (ageAttribute && genderAttribute) {
        ageAttribute.setValue(parseInt(age));
        genderAttribute.setValue(gender);
      } else {
        console.error('One or both attributes are null or undefined.');
      }
    }
  },
};

const ContactForm = JS.Entities.Contact;