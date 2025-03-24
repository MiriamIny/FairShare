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

    // Function to create and return a legend element
    function addLegend(displayText){
        //create legend element
        const legend = document.createElement('legend');
        //create text node
        const legendText = document.createTextNode(displayText);
        //append text node to legend element
        legend.appendChild(legendText);
        return legend;
    }

    // Function to create and return a select element
    function addSelect(selectName, selectId, selectClass){
        //create select element
        const costSelect = document.createElement('select');
        //set attributes
        costSelect.setAttribute('name', selectName);
        costSelect.setAttribute('id', selectId); 
        costSelect.setAttribute('class', selectClass);
        return costSelect;       
    }

    // Function to create and return an option element
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

    // Event listener for adding a person
    document.getElementById('add-person').addEventListener('click', addPerson);
    // Event listener for adding a cost input
    document.getElementById('add-cost').addEventListener('click', initiateCosts);
    // Event listener for adding another cost input
    document.getElementById('add-another-cost').addEventListener('click', addCost);
    // Event listener for calculating the bill
    document.getElementById("calculate").addEventListener("click", calculateBill);

    document.getElementById('splitit').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('contributors-form').style.display = 'flex';
        Array.from(document.getElementsByClassName('description')).forEach(element => {
            element.style.display = 'none';
        });
        Array.from(document.getElementsByClassName('instructions')).forEach(element => {
            element.style.display = 'none';
        })
    });

    // Function to add a person to the list
    function addPerson (e) {
        e.preventDefault();
        personCounter++; // Increment person counter
        const personText = "Person " + personCounter;
        const personAttributeValue = personText.toLowerCase().replace(' ', '-');

        // Create and append label and input for the new person
        const personLabel = addLabel(personText, personAttributeValue);
        //create a new input element
        const personInput = addInput('text', personAttributeValue, personAttributeValue, 'contributor-name');
        //append the label and input to the person-form before the add person button
        document.querySelector('#contributors-inputs').appendChild(personLabel);
        document.querySelector('#contributors-inputs').appendChild(personInput);
    }

    // Function to show the cost input form after contributors are added
    function initiateCosts (e) {
        e.preventDefault();
        if (!validateContributors()) {
            alert('Please make sure that contributors are all filled out before adding costs.');
            return;
        }
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
        //get the cost inputs container
        const costInputsContainer = document.querySelector('#cost-inputs');
        //get all the inputs
        const contributors = Array.from(document.querySelectorAll('#contributors-inputs input')).map(input => input.value); // Get contributors names

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

    // Function to validate that contributors have been added
    function validateContributors() {
        const contributors = document.querySelectorAll('#contributors-inputs input');
        for (let contributor of contributors) {
            if (contributor.value.trim() === '') {
                return false;
            }
        }
        return true;
    }

    // Function to validate cost inputs
    function validateCosts() {
        const costs = document.querySelectorAll('#cost-inputs fieldset');
        for (let cost of costs) {
            const amount = parseFloat(cost.querySelector('.cost-amount').value);
            if (isNaN(amount) || amount <= 0) {
                return false;
            }
        }
        return true;
    }

    // Function to calculate the final bill and split the costs
    function calculateBill(e) {
        e.preventDefault(); // Prevent form from submitting

        if (!validateCosts()) {
            alert('Please enter a valid amount for each cost.');
            return;
        }
        
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
        const debtors = balances.filter(balanceObj => balanceObj.balance < 0);
        const lenders = balances.filter(balanceObj => balanceObj.balance>0); 
        const neutrals = balances.filter(balanceObj => balanceObj.balance===0); // Optional: handle neutral balances if needed
        
        // Sort debtors and lenders by the amount owed
        lenders.sort((a, b) => b.balance - a.balance); // Largest creditors first
        debtors.sort((a, b) => a.balance - b.balance); // Largest debtors first

        // Minimize the number of transactions required to settle debts
        let transactions = minimizeTransactions(debtors, lenders); //returns array of transaction strings

        // Display the results
        displayResults(transactions, lenders, debtors, neutrals);
    } // end calculateBill

    // Function to minimize transactions between debtors and lenders
    function minimizeTransactions(debtors, lenders) {

        const debtorsList= [...debtors]; // Copy debtors list to avoid modifying the original
        const lendersList = [...lenders]; // Copy lenders list to avoid modifying the original
        const transactions = [];

        // Try to match each debtor with a lender
        for (let d = 0; d < debtorsList.length;) {
            let debtor = debtorsList[d];
            let matched = false;
            for (let l = 0; l < lendersList.length; l++) {
                let lender = lendersList[l];
                if (Math.abs(debtor.balance) === lender.balance) {
                    transactions.push(`${debtor.person} pays ${lender.person} $${Math.abs(debtor.balance).toFixed(2)}`);
                    lendersList.splice(l, 1); // Remove lender
                    debtorsList.splice(d, 1); // Remove debtor
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
        for (let i = 0; i < debtorsList.length; i++) {
            for (let j = i + 1; j < debtorsList.length; j++) {
                let combinedDebt = debtorsList[i].balance + debtorsList[j].balance;
                for (let lender of lendersList) {
                    if (Math.abs(combinedDebt) === lender.balance) {
                        // Push two transactions for each debtor paying the lender
                        transactions.push(`${debtorsList[i].person} pays ${lender.person} $${Math.abs(debtorsList[i].balance).toFixed(2)}`);
                        transactions.push(`${debtorsList[j].person} pays ${lender.person} $${Math.abs(debtorsList[j].balance).toFixed(2)}`);
        
                        debtorsList.splice(i, 1); // Remove first debtor
                        debtorsList.splice(j - 1, 1); // Adjust index after removal
                        lendersList.splice(lendersList.indexOf(lender), 1); // Remove lender
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
        while (d < debtorsList.length && l < lendersList.length) {
            let debtor = debtorsList[d];
            let lender = lendersList[l];
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

    function displayResults(transactions, lenders, debtors, neutrals) {

        document.getElementById('results').style.display = 'block'; // Show results section
        Array.from(document.getElementsByClassName('instructions')).forEach(element => {
            element.style.display = 'none';
        });


        let resultDiv = document.getElementById('results');
        resultDiv.textContent = ''; // Clear previous results

        resultDiv.innerHTML = `<h2>Bill Summary</h2>`;

        // If no transactions exist, inform the user that everyone has paid their fair share
        if (transactions.length === 0) {
            const fairShareMsg = document.createElement('p');
            fairShareMsg.textContent = 'No transactions needed. Everyone has paid their fair share.';
            resultDiv.appendChild(fairShareMsg);
        } 
        else {
        
            // Create lenders section
            const lendersDiv = document.createElement('div');
            lendersDiv.className = 'lenders';
            lenders.forEach(lender => {
                // For each lender, create a clickable link showing their name and balance
                const lenderLink = document.createElement('a');
                lenderLink.href = 'javascript:void(0);';
                lenderLink.textContent = `${lender.person} (+$${lender.balance.toFixed(2)})`;
                // Add an event listener to show the transactions for this lender when clicked
                lenderLink.addEventListener('click', () => {
                    showTransactionsForPerson(lender.person, transactions, lenderLink);
                });                
                lendersDiv.appendChild(lenderLink);
            });
        
            // Create neutrals section
            const neutralsDiv = document.createElement('div');
            neutralsDiv.className = 'neutrals';
            neutrals.forEach(neutral => {
                // Display a message for each neutral person showing $0 balance
                const neutralDiv = document.createElement('p');
                neutralDiv.textContent = `${neutral.person} $0.00`;
                neutralsDiv.appendChild(neutralDiv);
            });
        
            // Create debtors section
            const debtorsDiv = document.createElement('div');
            debtorsDiv.className = 'debtors';
            debtors.forEach(debtor => {
                // For each debtor, create a clickable link showing their name and negative balance
                const debtorLink = document.createElement('a');
                debtorLink.href = 'javascript:void(0);';
                debtorLink.textContent = `${debtor.person} (-$${Math.abs(debtor.balance).toFixed(2)})`;
                // Add an event listener to show the transactions for this debtor when clicked
                debtorLink.addEventListener('click', () => {
                    showTransactionsForPerson(debtor.person, transactions, debtorLink);
                });
                debtorsDiv.appendChild(debtorLink);
            });
        
            // Append lenders, neutrals, and debtors sections to the summary div
            resultDiv.appendChild(lendersDiv);
            resultDiv.appendChild(neutralsDiv);
            resultDiv.appendChild(debtorsDiv);        
        }
    } // end display results
    
    // Function to display specific transactions for a person
    function showTransactionsForPerson(person, transactions, link) {

        // Filter the transactions to include only those that involve the specified person
        const filteredTransactions = transactions.filter(transaction => transaction.includes(person));

        // For each filtered transaction, create a new paragraph element and display the transaction
        filteredTransactions.forEach(transaction => {
            const transactionElement = document.createElement('p');
            transactionElement.textContent = transaction;
            // Append each transaction as a new paragraph under the transaction details section
            link.parentNode.insertBefore(transactionElement, link.nextSibling); // Insert before the next sibling of the link
        });
    } // end showTransactionsForPerson

});// end DOM Content Loaded