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

}) // end DOM Content Loaded