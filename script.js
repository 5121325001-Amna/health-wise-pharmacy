let sales = JSON.parse(localStorage.getItem('sales')) || [];
let editIndex = -1;

function addSale() {
  const customer = document.getElementById('customerName').value;
  const medicine = document.getElementById('medicine').value;
  const total = parseFloat(document.getElementById('totalBill').value) || 0;
  const paid = parseFloat(document.getElementById('paidAmount').value) || 0;
  const due = total - paid;

  if (!customer ||!medicine) {
    alert("Please enter Customer Name and Medicine");
    return;
  }

  const sale = { customer, medicine, total, paid, due, date: new Date().toLocaleDateString() };

  if (editIndex === -1) {
    sales.push(sale); // Add new
  } else {
    sales[editIndex] = sale; // Update existing
    editIndex = -1;
    document.querySelector('button[onclick="addSale()"]').innerText = "+ Add Sale";
  }
  
  localStorage.setItem('sales', JSON.stringify(sales));
  clearForm();
  displaySales();
}

function clearForm() {
  document.getElementById('customerName').value = '';
  document.getElementById('medicine').value = '';
  document.getElementById('totalBill').value = '';
  document.getElementById('paidAmount').value = '';
}

function editSale(index) {
  const s = sales[index];
  document.getElementById('customerName').value = s.customer;
  document.getElementById('medicine').value = s.medicine;
  document.getElementById('totalBill').value = s.total;
  document.getElementById('paidAmount').value = s.paid;
  editIndex = index;
  document.querySelector('button[onclick="addSale()"]').innerText = "Update Sale ✏️";
  window.scrollTo(0,0); // Go to top
}

function deleteSale(index) {
  if (confirm("Are you sure you want to delete this sale?")) {
    sales.splice(index, 1);
    localStorage.setItem('sales', JSON.stringify(sales));
    displaySales();
  }
}

function markAsPaid(customerName) {
  sales = sales.map(s => {
    if (s.customer === customerName && s.due > 0) {
      s.paid = s.paid + s.due;
      s.due = 0;
    }
    return s;
  });
  localStorage.setItem('sales', JSON.stringify(sales));
  displaySales();
  alert(customerName + " ka saara Due clear ho gaya! ✅");
}

function displaySales() {
  let totalSales = 0;
  let totalCollected = 0;
  let totalDue = 0;
  let html = '';

  sales.forEach((s, index) => {
    totalSales += s.total;
    totalCollected += s.paid;
    totalDue += s.due;
    html += `
      <div>
        <b>${s.customer}</b> - ${s.medicine}<br>
        Bill: Rs${s.total} | Paid: Rs${s.paid} | Due: Rs${s.due}<br>
        <small>${s.date}</small><br>
        <button onclick="editSale(${index})" style="width:48%; background:#FFA000; margin-right:4%;">Edit ✏️</button>
        <button onclick="deleteSale(${index})" style="width:48%; background:#D32F2F;">Delete 🗑️</button>
      </div>
    `;
  });

  let customerDue = {};
  sales.forEach(s => {
    if (!customerDue[s.customer]) customerDue[s.customer] = 0;
    customerDue[s.customer] += s.due;
  });

  let customerHtml = '<h3>Customer Total Due</h3>';
  for (let name in customerDue) {
    if (customerDue[name] > 0) {
      customerHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin:8px 0;">
          <span><b>${name}:</b> Rs${customerDue[name]} Due</span>
          <button onclick="markAsPaid('${name}')" style="width:auto; padding:8px 16px; font-size:14px; background:#2E7D32;">Paid ✅</button>
        </div>
      `;
    } else {
      customerHtml += `<div><b>${name}:</b> No Due ✅</div>`;
    }
  }

  document.getElementById('salesList').innerHTML = html + '<hr>' + customerHtml || '<p>No sales yet</p>';
  document.getElementById('totalSales').innerText = totalSales;
  document.getElementById('totalCollected').innerText = totalCollected;
  document.getElementById('totalDue').innerText = totalDue;
}

function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sales));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = "health_wise_backup.json";
  a.click();
}

window.onload = displaySales;