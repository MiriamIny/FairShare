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
    // document event listeners

    // Event listener for calculating the bill
    document.getElementById("calculate").addEventListener("click", calculateBill);

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
        const personInput = addInput('text', personAttributeValue, personAttributeValue, 'contributor-name');

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
    // Function to calculate the final bill and split the costs
    function calculateBill(e) {
        e.preventDefault(); // Prevent form from submitting
        let shares = new Map(); // Each person's share
        let payments = new Map(); // How much each person paid
        let people = [...document.querySelectorAll('#contributors-inputs input')].map(input => input.value); // List of people

        // Initialize shares and payments for each person
        people.forEach(person => {
            shares.set(person, 0);
            payments.set(person, 0);
        });

        // Calculate payments and shares based on cost inputs
        let costItems = document.querySelectorAll('#cost-inputs fieldset');
        costItems.forEach(costItem => {
            let cost = parseFloat(costItem.querySelector('.cost-amount').value);
            let contributor = costItem.querySelector('.cost-contributor').value;
            payments.set(contributor, (payments.get(contributor)) + cost); // Update payment for the contributor
            let share = cost / people.length; // Split cost evenly among all participants
            /* Developer Note: The share is calculated per cost as opposed to total/people since we want to add 
            the ability to split costs between specified users instead of automtically split between everyone. */
                people.forEach(person => {
                shares.set(person, (shares.get(person)) + share); // Add each person's share
            });
        });

        // Calculate balances (how much each person owes or is owed)
        let balances = [];
        for (let person of people) {
            let difference = payments.get(person) - shares.get(person); // Positive means they overpaid, negative means they owe
            balances.push({ person: person, balance: difference });
        }

        // Separate debtors and lenders based on balance
        let debtors= balance.filter(balance => balance<0);
        let lenders = balance.filter(balance => balance>0); 
        let neutrals = balance.filter(balance => balance===0); // Optional: handle neutral balances if needed
        
        // Sort debtors and lenders by the amount owed
        lenders.sort((a, b) => b.balance - a.balance); // Largest creditors first
        debtors.sort((a, b) => a.balance - b.balance); // Largest debtors first

        // Minimize the number of transactions required to settle debts
        let transactions = minimizeTransactions(debtors, lenders); //returns array of transaction strings

        // Display the results
        let resultDiv = document.getElementById('results');
        resultDiv.textContent = ''; // Clear previous results
        if (transactions.length === 0) {
            resultDiv.textContent = 'No transactions needed. Everyone has paid their fair share.';
        } else {
            transactions.forEach(transaction => {
                let transactionElement = document.createElement('p');
                transactionElement.textContent = transaction;
                resultDiv.appendChild(transactionElement);
            });
        }
    }

    // Function to minimize transactions between debtors and lenders
    function minimizeTransactions(debtors, lenders) {
        const transactions = [];

        // Try to match each debtor with a lender
        for (let d = 0; d < debtors.length;) {
            let debtor = debtors[d];
            let matched = false;
            for (let l = 0; l < lenders.length; l++) {
                let lender = lenders[l];
                if (Math.abs(debtor.balance) === lender.balance) {
                    transactions.push(`${debtor.person} pays ${lender.person} $${Math.abs(debtor.balance).toFixed(2)}`);
                    lenders.splice(l, 1); // Remove lender
                    debtors.splice(d, 1); // Remove debtor
                    matched = true;
                    break; // l was removed from lenders so we do not increment l, we want it to remain in the same position for the next iteration
                }
            }
            if (!matched) {
                d++; // Move to the next debtor if no match found
            }
        }

        // Check for combined debtors who can pay one lender
        let combinationsChecked = false;
        for (let i = 0; i < debtors.length; i++) {
            for (let j = i + 1; j < debtors.length; j++) {
                let combinedDebt = debtors[i].balance + debtors[j].balance;
                for (let lender of lenders) {
                    if (Math.abs(combinedDebt) === lender.balance) {
                        // Push two transactions for each debtor paying the lender
                        transactions.push(`${debtors[i].person} pays ${lender.person} $${Math.abs(debtors[i].balance).toFixed(2)}`);
                        transactions.push(`${debtors[j].person} pays ${lender.person} $${Math.abs(debtors[j].balance).toFixed(2)}`);
        
                        debtors.splice(i, 1); // Remove first debtor
                        debtors.splice(j - 1, 1); // Adjust index after removal
                        lenders.splice(lenders.indexOf(lender), 1); // Remove lender
                        combinationsChecked = true;
                        break;
                    }
                }
                if (combinationsChecked) break;
            }
            if (combinationsChecked) break;
        }

        // Process remaining debtors and lenders
        let d = 0, l = 0;
        while (d < debtors.length && l < lenders.length) {
            let debtor = debtors[d];
            let lender = lenders[l];
            // Calculate transfer amount based on the smaller of the two balances
            // This ensures that we do not transfer more than either needs to settle
            let transferAmount = Math.min(-debtor.balance, lender.balance); 

            transactions.push(`${debtor.person} pays ${lender.person} $${transferAmount.toFixed(2)}`); // Record transaction
            
            debtor.balance += transferAmount; // Update debtor's balance
            lender.balance -= transferAmount; // Update lender's balance

            // Move to the next debtor or lender if their balance is settled
            if (debtor.balance === 0) d++;
            if (lender.balance === 0) l++;
        }

        return transactions; // Return the list of transactions
    }// end minimizeTransactions
});// end DOM Content Loaded