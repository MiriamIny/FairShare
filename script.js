document.addEventListener('DOMContentLoaded', function () 
{
    const nameForm = document.getElementById('name-form');
    let personCounter = 2; //keeps track of how many people have been added

    // add event listener to add person button
    document.getElementById('add-person').addEventListener('click', function (e) 
    {
        e.preventDefault();
        personCounter++; //keeps track of how many people have been added
        const personText = "Person " + personCounter
        const personAttributeValue = personText.toLowerCase().replace(' ', '-');

        //create a new label element
        const personLabel = document.createElement('label');
        //create a new text node
        const personLabelText = document.createTextNode(personText);
        //append the text node to the label element
        personLabel.appendChild(personLabelText);
        //set attributes
        personLabel.setAttribute('for', personAttributeValue);

        //create a new input element
        const personInput = document.createElement('input');
        //set attributes
        personInput.setAttribute('type', 'text');
        personInput.setAttribute('name', personAttributeValue);
        personInput.setAttribute('id', personAttributeValue);

        //append the label and input to the person-form before the add person button
        document.querySelector('#name-inputs').appendChild(personLabel);
        document.querySelector('#name-inputs').appendChild(personInput);
    })

    document.getElementById('next').addEventListener('click', function (e)
    {
        e.preventDefault();

        //hide the first form
        document.getElementById('name-form').style.display = 'none';
        document.getElementById('money-form').style.display = 'flex';

        //get all the inputs
        const nameInputs = document.querySelectorAll('#name-inputs input');
        const names = [];

        nameInputs.forEach(function (input) 
        {
            names.push(input.value);
        })

        for (let name of names){
            //create label element
            const moneyFormLabel = document.createElement('label');
            //create text node
            const moneyFormLabelText = document.createTextNode("How much money did " + name + " spend?");
            moneyFormLabel.appendChild(moneyFormLabelText);
            //set attributes
            moneyFormLabel.setAttribute('for', name);

            //create input element
            const moneyFormInput = document.createElement('input');
            //set attributes
            moneyFormInput.setAttribute('type', 'number');
            moneyFormInput.setAttribute('name', name);
            moneyFormInput.setAttribute('id', name);

            //append the label and input to the money-form
            const moneyForm = document.querySelector('#money-inputs');
            moneyForm.appendChild(moneyFormLabel);
            moneyForm.appendChild(moneyFormInput);
        }

    })

}) // end DOM Content Loaded