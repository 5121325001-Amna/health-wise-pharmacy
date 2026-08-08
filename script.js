let sales = JSON.parse(localStorage.getItem('sales')) || [];

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
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));
  
  document.getElementById('customerName').value = '';
  document.getElementById('medicine').value = '';
  document.getElementById('totalBill').value = '';
  document.getElementById('paidAmount').value = '';
  
  displaySales();
}

function displaySales() {
  let totalSales = 0;
  let totalCollected = 0;
  let totalDue = 0;
  let html = '';

  // 1. Show each sale
  sales.forEach(s => {
    totalSales += s.total;
    totalCollected += s.paid;
    totalDue += s.due;
    html += `<div><b>${s.customer}</b> - ${s.medicine}<br>Bill: Rs${s.total} | Paid: Rs${s.paid} | Due: Rs${s.due}<br><small>${s.date}</small></div>`;
  });

  // 2. NEW: Calculate Total Due per Customer
  let customerDue = {};
  sales.forEach(s => {
    if (!customerDue[s.customer]) customerDue[s.customer] = 0;
    customerDue[s.customer] += s.due;
  });

  let customerHtml = '<h3>Customer Total Due</h3>';
  for (let name in customerDue) {
    if (customerDue[name] > 0) {
      customerHtml += `<div><b>${name}:</b> Rs${customerDue[name]} Due</div>`;
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