document.addEventListener('DOMContentLoaded', function () 
{
    // Removed unused variable 'contributors form'
    let personCounter = 2; //keeps track of how many people have been added

    function addFieldset(fieldsetId){
        //create fieldset element
        const fieldsetName = document.createElement('fieldset');
        //create attributes
        fieldsetName.setAttribute('id', fieldsetId);
        return fieldsetName;
    }

    function addInput(type, name, id, className){
        //create input element
        const input = document.createElement('input');
        //set attributes
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('id', id);
        input.setAttribute('class', className);
        return input;
    }   

    function addLabel(displayText, forAttribute){
        //create a new label element
        const label = document.createElement('label');
        //create a new text node
        const labelText = document.createTextNode(displayText);
        //append the text node to the label element
        label.appendChild(labelText);
        //set attributes
        label.setAttribute('for', forAttribute);
        return label;
    }

    function addLegend(displayText){
        //create legend element
        const legend = document.createElement('legend');
        //create text node
        const legendText = document.createTextNode(displayText);
        //append text node to legend element
        legend.appendChild(legendText);
        return legend;
    }

    function addSelect(selectName, selectId, selectClass){
        //create select element
        const costSelect = document.createElement('select');
        //set attributes
        costSelect.setAttribute('name', selectName);
        costSelect.setAttribute('id', selectId); 
        costSelect.setAttribute('class', selectClass);
        return costSelect;       
    }
    function addOption(name){
        //create option element
        const costOption = document.createElement('option');
        //create text node
        const costOptionText = document.createTextNode(name);
        //append text node to option element
        costOption.appendChild(costOptionText);
        //set attributes
        costOption.setAttribute('value', name);    
        //return the option element
        return costOption;    
    }

    // add event listener to add person button
    document.getElementById('add-person').addEventListener('click', function (e) 
    {
        e.preventDefault();
        personCounter++; //keeps track of how many people have been added
        const personText = "Person " + personCounter
        const personAttributeValue = personText.toLowerCase().replace(' ', '-');

        //create a new label element
        const personLabel = addLabel(personText, personAttributeValue);

        //create a new input element
        const personInput = addInput('text', personAttributeValue, personAttributeValue, 'contributor-name' + personCounter);

        //append the label and input to the person-form before the add person button
        document.querySelector('#contributors-inputs').appendChild(personLabel);
        document.querySelector('#contributors-inputs').appendChild(personInput);
    })

    // add event listener to the 'add-costs' button    
    document.getElementById('add-cost').addEventListener('click', function (e)
    {
        e.preventDefault();

        //hide the first form
        document.getElementById('contributors-form').style.display = 'none';
        document.getElementById('cost-form').style.display = 'flex';

        //add the first cost input
        addCostInput();


    })

    let costCounter = 1; //keeps track of how many costs have been added

    document.getElementById('add-another-cost').addEventListener('click', function (e)
    {
        e.preventDefault();
        
        costCounter++;
        
        addCostInput();
});

    function addCostInput() {
        //get the cost inputs container
        const costInputsContainer = document.querySelector('#cost-inputs');
        
        //get all the inputs
        const contributors = Array.from(document.querySelectorAll('#contributors-inputs input')).map(input => input.value); // Used in the loop below

        //add fieldset element
        const costFieldset = addFieldset('cost-' + costCounter);

        //add legend element
        const costLegend = addLegend('Cost ' + costCounter);

        //add label element
        const costLabel = addLabel('Description', 'cost-description-' + costCounter);

        //add input element
        const costInput = addInput('text', 'cost-description-' + costCounter, 'cost-description-' + costCounter, 'cost-description');

        //add label element
        const costLabel2 = addLabel('Amount', 'cost-' + costCounter + '-amount');
        
        //add input element
        const costInput2 = addInput('number', 'cost-' + costCounter + '-amount', 'cost-' + costCounter + '-amount', 'cost-amount');
        //add step attribute
        costInput2.setAttribute('step', '0.01');

        //add label element
        const costLabel3 = addLabel('Who payed', 'cost-' + costCounter + '-person');

        //add select element
        const costSelect = addSelect('cost-' + costCounter + '-person', 'cost-' + costCounter + '-person', 'cost-contributor');

        //create options
        // Iterate over the names array to create options for the select element
        for (let contributor of contributors)
        {
            //add option element
            const costOption = addOption(contributor);
            //append option to select element
            costSelect.appendChild(costOption);
        }
        //append the elements to the fieldset
        costFieldset.appendChild(costLegend);
        costFieldset.appendChild(costLabel);
        costFieldset.appendChild(costInput);
        costFieldset.appendChild(costLabel2);
        costFieldset.appendChild(costInput2);
        costFieldset.appendChild(costLabel3);
        costFieldset.appendChild(costSelect);
    
        //append the fieldset to the cost-form div
        costInputsContainer.appendChild(costFieldset);
    }

    // form validation
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('cost-amount')) {
            let value = e.target.value;
    
            // Allow only numbers with up to two decimal places
            if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                e.target.value = value.slice(0, -1); // Remove last invalid character
            }
        }
    });
    


}) // end DOM Content Loaded