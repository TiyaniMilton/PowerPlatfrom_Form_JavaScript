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

if (typeof JS.Entities.Account === 'undefined') {
  JS.Entities.Account = {
    __namespace: true
  };
}

const FORM_TYPE_CREATE = 1;
const FORM_TYPE_UPDATE = 2;
const FORM_TYPE_READ_ONLY = 3;
const FORM_TYPE_DISABLED = 4;
const FORM_TYPE_QUICK_CREATE = 5;
const FORM_TYPE_BULK_EDIT = 6;

JS.Entities.Account = {
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

    await JS.Entities.Account.attachEvents();

  },

  onSave: async function (executionContext) {
    // Your onSave logic here
  },

  attachEvents: async function () {
    //formContext.getAttribute('t365_idnumber').addOnChange(JS.Entities.Account.validateIdNumber);
    //formContext.getAttribute('t365_idnumber').addOnChange(JS.Entities.Account.autoPopulateIdRelatedFields);

  },

  requestLeadScreening: async function () {
    debugger;

    // Get client name and client ID from the form context
    const clientName = formContext.getAttribute('name').getValue();
    const clientId = formContext.data.entity.getId();
    const entityName = formContext.data.entity.getEntityName();

    // Create a lookup value for the client
    var lookupValue = [{
      id: clientId,
      entityType: entityName
    }];

    // Create an object for the leadScreening record
    var leadScreening = {
      t365_name: `${clientName}_${clientId}`,
      t365_requested: true,
      "t365_Client_account@odata.bind": "/accounts(" + clientId.replace("{", "").replace("}", "") + ")",
    };

    try {
      // Create the record
      const result = await Xrm.WebApi.createRecord("t365_leadscreening", leadScreening);

      console.log("Lead screening record created successfully:", result.id);

      // Open the newly created record
      Xrm.Navigation.openForm({
        entityName: "t365_leadscreening",
        entityId: result.id
      });
    } catch (error) {
      console.error("Error creating lead screening record:", error.message);
    }



    /* //const sharePointUrl = "https://v6vsx.sharepoint.com/:x:/s/MicrosoftAppliedSkills/EVu8NueaoZhOrjAKuH88mXwBSGHjWVKIrpqLmFkOAe2FHA?e=siRdcp"
    const clientName = formContext.getAttribute('name').getValue();
    //const accountNumber = formContext.getAttribute('accountNumber').getValue();
    const clientId = formContext.data.entity.getId();

    var entityFormOptions = {};
    entityFormOptions["entityName"] = "t365_leadscreening";

    var formParameters = {};
    formParameters["t365_name"] = `${clientName}_${clientId}`;
    //formParameters["t365_ucrpform"] = sharePointUrl;
    // Set lookup column
    formParameters["t365_client"] = clientId; // ID of the user.
    formParameters["t365_clientname"] = clientName;
    formParameters["t365_clienttype"] = formContext.data.entity.getEntityName(); // Table name. 
    // End of set lookup column

    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
      function (success) {
        console.log(success);
      },
      function (error) {
        console.log(error);
      }); */
  },

  createLeadScreeningRecord: async function (formContext, accountId) {
    // Get client name and client ID from the form context
    const clientName = formContext.getAttribute('name').getValue();
    const clientId = formContext.data.entity.getId();

    // Create a new instance of t365_leadscreening entity
    const leadScreening = new Xrm.WebApi.Record("t365_leadscreening");

    // Set the values for the fields
    leadScreening.attributes.t365_name = `${clientName}_${clientId}`;
    leadScreening.attributes.t365_requested = true;
    leadScreening.attributes.t365_client = [{
      id: accountId,
      entityType: "account"
    }];

    // Create the record
    Xrm.WebApi.createRecord(leadScreening)
      .then(function (result) {
        console.log("Lead screening record created successfully:", result.id);

        // Open the newly created record
        Xrm.Navigation.openForm({
          entityName: "t365_leadscreening",
          entityId: result.id
        });
      })
      .catch(function (error) {
        console.error("Error creating lead screening record:", error);
      });
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

var AccountForm = JS.Entities.Account;