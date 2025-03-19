document.addEventListener('DOMContentLoaded', function () 
{
    let personCounter = 2; //keeps track of how many people have been added

    // add event listener to add person button
    document.getElementById('add-person').addEventListener('click', function (e) 
    {
        e.preventDefault();
        personCounter++; //keeps track of how many people have been added
        const personText = "Person " + personCounter
        const personAttributeValue = personText.toLowerCase().replace(' ', '-');

        //create a new div element
        const formDivider = document.createElement('div');
        //set attributes 
        formDivider.setAttribute('class', 'form-divider');

        //create a new label element
        const personLabel = document.createElement('label');
        //create a new text node
        const personLabelText = document.createTextNode(personText);
        //append the text node to the label element
        personLabel.appendChild(personLabelText);
        //set attributes
        personLabel.setAttribute('for', personText);

        //create a new input element
        const personInput = document.createElement('input');
        //set attributes
        personInput.setAttribute('type', 'text');
        personInput.setAttribute('name', personText);
        personInput.setAttribute('id', personText);

        //append the label and input elements to the formDivider
        formDivider.appendChild(personLabel);
        formDivider.appendChild(personInput);

        //append the formDivider to the person-form before the add person button
        document.querySelector('#name-inputs').appendChild(formDivider);
    })

}) // end DOM Content Loaded