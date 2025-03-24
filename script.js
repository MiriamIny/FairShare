document.addEventListener('DOMContentLoaded', function () 
{
    let personCounter = 2; // Keeps track of how many people have been added
    let costCounter = 1; // Keeps track of how many costs have been added

    // Function to create and return a fieldset element
    function addFieldset(fieldsetId){
        const fieldsetName = document.createElement('fieldset');
        fieldsetName.setAttribute('id', fieldsetId);
        return fieldsetName;
    }

    // Function to create and return an input element with specific attributes
    function addInput(type, name, id, className){
        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('id', id);
        input.setAttribute('class', className);
        return input;
    }   

    // Function to create and return a label element with the provided text
    function addLabel(displayText, forAttribute){
        const label = document.createElement('label');
        const labelText = document.createTextNode(displayText);
        label.appendChild(labelText);
        label.setAttribute('for', forAttribute);
        return label;
    }

    // Function to create and return a legend element
    function addLegend(displayText){
        const legend = document.createElement('legend');
        const legendText = document.createTextNode(displayText);
        legend.appendChild(legendText);
        return legend;
    }

    // Function to create and return a select element
    function addSelect(selectName, selectId, selectClass){
        const costSelect = document.createElement('select');
        costSelect.setAttribute('name', selectName);
        costSelect.setAttribute('id', selectId); 
        costSelect.setAttribute('class', selectClass);
        return costSelect;       
    }

    // Function to create and return an option element
    function addOption(name){
        const costOption = document.createElement('option');
        const costOptionText = document.createTextNode(name);
        costOption.appendChild(costOptionText);
        costOption.setAttribute('value', name);    
        return costOption;    
    }

    // Event listener for adding a person
    document.getElementById('add-person').addEventListener('click', addPerson);
    // Event listener for adding a cost input
    document.getElementById('add-cost').addEventListener('click', initiateCosts);
    // Event listener for adding another cost input
    document.getElementById('add-another-cost').addEventListener('click', addCost);
    // Event listener for calculating the bill
    document.getElementById("calculate").addEventListener("click", calculateBill);

    // Function to add a person to the list
    function addPerson (e) {
        e.preventDefault();
        personCounter++; // Increment person counter
        const personText = "Person " + personCounter
        const personAttributeValue = personText.toLowerCase().replace(' ', '-');

        // Create and append label and input for the new person
        const personLabel = addLabel(personText, personAttributeValue);
        const personInput = addInput('text', personAttributeValue, personAttributeValue, 'contributor-name');
        document.querySelector('#contributors-inputs').appendChild(personLabel);
        document.querySelector('#contributors-inputs').appendChild(personInput);
    }

    // Function to show the cost input form after contributors are added
    function initiateCosts (e) {
        e.preventDefault();
        document.getElementById('contributors-form').style.display = 'none'; // Hide contributors form
        document.getElementById('cost-form').style.display = 'flex'; // Show cost form
        addCostInput(); // Add the first cost input
    }

    // Function to add another cost input
    function addCost(e) {
        e.preventDefault();
        costCounter++; // Increment cost counter
        addCostInput(); // Add a new cost input
    }

    // Function to add a single cost input form
    function addCostInput() {
        const costInputsContainer = document.querySelector('#cost-inputs');
        const contributors = Array.from(document.querySelectorAll('#contributors-inputs input')).map(input => input.value); // Get contributors names

        // Create the necessary form elements for cost input
        const costFieldset = addFieldset('cost-' + costCounter);
        const costLegend = addLegend('Cost ' + costCounter);
        const costLabel = addLabel('Description', 'cost-description-' + costCounter);
        const costInput = addInput('text', 'cost-description-' + costCounter, 'cost-description-' + costCounter, 'cost-description');
        const costLabel2 = addLabel('Amount', 'cost-' + costCounter + '-amount');
        const costInput2 = addInput('number', 'cost-' + costCounter + '-amount', 'cost-' + costCounter + '-amount', 'cost-amount');
        const costLabel3 = addLabel('Who payed', 'cost-' + costCounter + '-person');
        const costSelect = addSelect('cost-' + costCounter + '-person', 'cost-' + costCounter + '-person', 'cost-contributor');

        // Add options for each contributor to the select element
        contributors.forEach(contributor => {
            const costOption = addOption(contributor);
            costSelect.appendChild(costOption);
        });

        // Append all elements to the cost fieldset
        costFieldset.appendChild(costLegend);
        costFieldset.appendChild(costLabel);
        costFieldset.appendChild(costInput);
        costFieldset.appendChild(costLabel2);
        costFieldset.appendChild(costInput2);
        costFieldset.appendChild(costLabel3);
        costFieldset.appendChild(costSelect);
        
        // Append the fieldset to the cost form container
        costInputsContainer.appendChild(costFieldset);
    }

    // Function to calculate the final bill and split the costs
    function calculateBill(e) {
        e.preventDefault(); // Prevent form from submitting
        console.log('Calculate button clicked');
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