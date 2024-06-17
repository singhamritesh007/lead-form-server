document.getElementById('leadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const company = document.getElementById('company').value;
    const whatDescribesYou = document.getElementById('whatDescribesYou').value;
    const howCanWeHelp = document.getElementById('howCanWeHelp').value;
    const country = document.getElementById('country').value;
    const stateProvince = document.getElementById('stateProvince').value;
    const notes = document.getElementById('notes').value;
    const postalCode = document.getElementById('postalCode').value;

    const data = JSON.stringify({
        First_Name__c: firstName,
        Last_Name__c: lastName,
        Email__c: email,
        Phone__c: phone,
        Company__c: company,
        Type__c: whatDescribesYou,
        How_Can_We_Help_You__c: howCanWeHelp,
        Address__CountryCode__s: country,
        Address__StateCode__s: stateProvince,
        Address__PostalCode__s: postalCode,
        Notes__c: notes,
    });

    fetch('https://singhamritesh007.github.io/lead-form-server/create-lead', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            alert('Error creating lead: ' + result.error);
        } else {
            alert('Lead created successfully');
            window.location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating lead');
    });
});
