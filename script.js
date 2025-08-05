 const startBtn = document.getElementById("startBtn");
    const plannerBox = document.getElementById("plannerBox");
    const spendingsBtn = document.getElementById("spendingsBtn");
    const spendingsPage = document.getElementById("spendingsPage");
    const cardsContainer = document.getElementById("cardsContainer");
    const downloadBtn = document.getElementById("downloadBtn");

    startBtn.addEventListener('click', function() {
      plannerBox.style.display = "block";
      startBtn.style.display = "none";
      spendingsBtn.style.display = "inline-block";     });

    spendingsBtn.onclick = () => {
      if (spendingsPage.style.display === "block") {
        spendingsPage.style.display = "none";
        plannerBox.style.display = "block";       } else {
        plannerBox.style.display = "none";
        spendingsPage.style.display = "block";
        loadSpendings();
      }
    };

    function addItem() {
      const container = document.getElementById("itemsContainer");
      const div = document.createElement("div");
      div.className = "expenditure-item";
      div.innerHTML = `
        <input type="text" placeholder="Item name">
        <input type="number" placeholder="₹ Price">
      `;
      container.appendChild(div);
    }

    function validateAndCalculate() {
      const balance = parseFloat(document.getElementById("balance").value) || 0;
      const savings = parseFloat(document.getElementById("savings").value) || 0;
      const expenditure = parseFloat(document.getElementById("expenditure").value) || 0;
      const monthYear = document.getElementById("monthYear").value;

      // Check for existing entry
      const spendings = JSON.parse(localStorage.getItem("spendings")) || [];
      const existingEntry = spendings.find(spending => spending.sortDate === new Date(monthYear).toISOString());
      
      if (existingEntry) {
        if (confirm(`This month/year already exists!\nCancel: Clear form\nOK: Merge with existing`)) {
          mergeWithExisting(existingEntry, savings, expenditure, monthYear);
          return;
        } else {
          // Clear form if canceled
          document.getElementById("monthYear").value = "";
          document.getElementById("balance").value = "";
          document.getElementById("savings").value = "";
          document.getElementById("expenditure").value = "";
          return;
        }
      }

      // Validation Step 1: Check savings + expenditure = balance
      if (savings + expenditure !== balance) {
        alert("⚠️ Savings + Expenditure (" + (savings + expenditure) + ") does NOT match Current Balance (" + balance + ")");
        document.getElementById("summaryOutput").innerHTML = `
          <div class="warning">
            ❌ Cannot show summary - Savings (${savings}) + Expenditure (${expenditure}) = ${savings + expenditure} 
            but Current Balance is ${balance}
            <br><br>
            Please correct the amounts before viewing summary
          </div>
        `;
        return; // Stop execution
      }

      //  Step 2: Calculate total of all items
      const items = document.querySelectorAll(".expenditure-item");
      let itemTotal = 0;
      let itemList = [];

      items.forEach(item => {
        const name = item.children[0].value;
        const price = parseFloat(item.children[1].value) || 0;
        itemTotal += price;
        if (name && price) {
          itemList.push({ name, price });
        }
      });

      // Validation Step 3: Check if itemTotal matches expenditure
      if (itemTotal !== expenditure) {
        alert("❗ Total of items (" + itemTotal + ") does NOT match Expenditure (" + expenditure + ")");
        document.getElementById("summaryOutput").innerHTML = `
          <div class="warning">
            ❌ Cannot show summary - Total items (${itemTotal}) does not match declared Expenditure (${expenditure})
            <br><br>
            Please adjust your items or expenditure amount before viewing summary
          </div>
        `;
        return; // Stop execution
      }

      // If both validations pass, show summary
      calculateSummary(savings, expenditure, itemList);

      // Clear inputs after successful validation
      document.getElementById("monthYear").value = "";
      document.getElementById("balance").value = "";
      document.getElementById("savings").value = "";
      document.getElementById("expenditure").value = "";

      const container = document.getElementById("itemsContainer");
      container.innerHTML = "";
      addItem();
    }

function mergeWithExisting(existingEntry, newSavings, newExpenditure, monthYear) {
  const newItems = getCurrentItems();

  const mergedSavings = existingEntry.savings + newSavings;
  const mergedExpenditure = existingEntry.expenditure + newExpenditure;
  const mergedItems = [...existingEntry.items, ...newItems];
  const mergedSavingPercent = ((mergedSavings / (mergedSavings + mergedExpenditure)) * 100).toFixed(2);
  const sortDate = new Date(monthYear).toISOString();
  const formattedMonthYear = new Date(monthYear).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Show a detailed summary
  let breakdownHTML = `
    <div style="color: green; font-weight: bold; margin-bottom: 10px;">
      ✅ Merged entry successfully!
    </div>
    <h3>🗓️ ${formattedMonthYear}</h3>
    <h4>📌 Previous Entry:</h4>
    <p>Savings: ₹${existingEntry.savings}</p>
    <p>Expenditure: ₹${existingEntry.expenditure}</p>
    <h5>Items:</h5>
    <ul>
      ${existingEntry.items.map(item => `<li>${item.name}: ₹${item.price}</li>`).join('')}
    </ul>
    <h4>📌 New Entry:</h4>
    <p>Savings: ₹${newSavings}</p>
    <p>Expenditure: ₹${newExpenditure}</p>
    <h5>Items:</h5>
    <ul>
      ${newItems.map(item => `<li>${item.name}: ₹${item.price}</li>`).join('')}
    </ul>
    <h4>🔁 Merged Result:</h4>
    <p>💰 Savings: ₹${mergedSavings}</p>
    <p>🧾 Expenditure: ₹${mergedExpenditure}</p>
    <p>📊 Savings %: ${mergedSavingPercent}%</p>
    <h5>All Items:</h5>
    <ul>
      ${mergedItems.map(item => `<li>${item.name}: ₹${item.price}</li>`).join('')}
    </ul>
  `;

  document.getElementById("summaryOutput").innerHTML = breakdownHTML;

  
  const spendings = JSON.parse(localStorage.getItem("spendings")) || [];
  const updatedSpendings = spendings.map(item => {
    if (item.sortDate === sortDate) {
      return {
        ...item,
        savings: mergedSavings,
        expenditure: mergedExpenditure,
        items: mergedItems,
        savingPercent: mergedSavingPercent,
      };
    }
    return item;
  });

  localStorage.setItem("spendings", JSON.stringify(updatedSpendings));
  loadSpendings();

 
  document.getElementById("monthYear").value = "";
  document.getElementById("balance").value = "";
  document.getElementById("savings").value = "";
  document.getElementById("expenditure").value = "";

  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";
  addItem();
}

    function getCurrentItems() {
      return Array.from(document.querySelectorAll(".expenditure-item")).map(item => {
        return {
          name: item.children[0].value,
          price: parseFloat(item.children[1].value) || 0
        };
      }).filter(item => item.name && item.price);
    }

    function calculateSummary(savings, expenditure, itemList) {
      const balance = parseFloat(document.getElementById("balance").value) || 0;
      const monthYear = document.getElementById("monthYear").value;
      const monthYearObj = new Date(monthYear);
      const monthYearFormatted = monthYearObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      const savingPercent = balance ? ((savings / balance) * 100).toFixed(2) : 0;
      const originalDateStr = monthYearObj.toISOString();
      const spendPercent = balance ? ((expenditure / balance) * 100).toFixed(2) : 0;

      let breakdownHTML = "<ul>";
      itemList.forEach(item => {
        breakdownHTML += `<li>${item.name}: ₹${item.price}</li>`;
      });
      breakdownHTML += "</ul>";

      document.getElementById("summaryOutput").innerHTML = `
        <div style="color: green; font-weight: bold; margin-bottom: 15px;">
          ✅ All amounts match correctly! Summary unlocked:
        </div>
        <p>💰 Total Balance: ₹${balance}</p>
        <p>📦 Savings: ₹${savings} (${savingPercent}%)</p>
        <p>🧾 Expenditure: ₹${expenditure} (${spendPercent}%)</p>
        <h4>Expenditure Breakdown (${itemList.length} items):</h4>
        ${breakdownHTML}
        <div style="margin-top: 15px; color: green;">
          ✔ Validated: Savings + Expenditure = Balance<br>
          ✔ Validated: Item totals = Expenditure
        </div>
      `;

      
      saveToLocalStorage(monthYearFormatted, savings, expenditure, savingPercent, originalDateStr, itemList);
    }

    function saveToLocalStorage(monthYear, savings, expenditure, savingPercent, sortDate, items) {
      const spendings = JSON.parse(localStorage.getItem("spendings")) || [];
      spendings.push({ 
        monthYear, 
        savings, 
        expenditure, 
        savingPercent,
        sortDate,
        items
      });
      localStorage.setItem("spendings", JSON.stringify(spendings));
    }

    function loadSpendings() {
      const spendings = JSON.parse(localStorage.getItem("spendings")) || [];
      cardsContainer.innerHTML = "";

     
      spendings.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));

      spendings.forEach((spending, index) => {
        const card = document.createElement("div");
        card.className = "card";

        let colorClass = "";
        const percent = parseFloat(spending.savingPercent);
        if (percent <= 15) {
          colorClass = "red";
        } else if (percent <= 30) {
          colorClass = "yellow";
        } else {
          colorClass = "green";
        }

        card.classList.add(colorClass);

        
        let itemsHTML = '<div class="card-items">';
        spending.items.forEach(item => {
          itemsHTML += `
            <div class="card-item">
              <span class="card-item-name">${item.name}</span>
              <span class="card-item-price">₹${item.price}</span>
            </div>
          `;
        });
        itemsHTML += '</div>';

        card.innerHTML = `
          <h4>${spending.monthYear}</h4>
          <p>💰 Savings: ₹${spending.savings}</p>
          <p>🧾 Expenditure: ₹${spending.expenditure}</p>
          <p>📊 Savings Percentage: ${spending.savingPercent}%</p>
          <h5>Expenditure Items:</h5>
          ${itemsHTML}
          <button class="delete-btn" onclick="deleteSpending(${index})">✖</button>
        `;
        cardsContainer.appendChild(card);
      });

     
      downloadBtn.style.display = spendings.length > 0 ? "block" : "none";
    }

    function deleteSpending(index) {
      const spendings = JSON.parse(localStorage.getItem("spendings")) || [];
      spendings.splice(index, 1);
      localStorage.setItem("spendings", JSON.stringify(spendings));
      loadSpendings();
    }

    function downloadPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const spendings = JSON.parse(localStorage.getItem("spendings")) || [];
      let content = "Budget History\n\n";

      spendings.forEach(spending => {
        content += `Month: ${spending.monthYear}\n`;
        content += `Savings: ₹${spending.savings}\n`;
        content += `Expenditure: ₹${spending.expenditure}\n`;
        content += `Savings Percentage: ${spending.savingPercent}%\n`;
        content += "Expenditure Items:\n";
        spending.items.forEach(item => {
          content += `- ${item.name}: ₹${item.price}\n`;
        });
        content += "\n";
      });

      doc.text(content, 10, 10);
      doc.save("budget_history.pdf");
    }
