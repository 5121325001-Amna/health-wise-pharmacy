let sales = JSON.parse(localStorage.getItem('healthwise_sales')) || [];

function addSale() {
  const name = document.getElementById('pharmacyName').value.trim();
  const city = document.getElementById('city').value.trim();
  const total = parseFloat(document.getElementById('totalAmount').value) || 0;
  const paid = parseFloat(document.getElementById('paidAmount').value) || 0;
  if(!name || !city) { alert('Please fill Pharmacy Name and City'); return; }
  const due = total - paid;
  sales.push({name, city, total, paid, due});
  localStorage.setItem('healthwise_sales', JSON.stringify(sales));
  document.querySelectorAll('input').forEach(i => i.value = '');
  render();
}

function render() {
  const tbody = document.querySelector('#recordsTable tbody');
  tbody.innerHTML = '';
  let ts=0, tc=0, td=0;
  sales.forEach((s, i) => {
    ts+=s.total; tc+=s.paid; td+=s.due;
    tbody.innerHTML += `<tr>
      <td>${s.name}</td><td>${s.city}</td><td>${s.total}</td>
      <td>${s.paid}</td><td style="color:red;font-weight:bold">${s.due}</td>
      <td><button onclick="deleteSale(${i})">X</button></td>
    </tr>`;
  });
  document.getElementById('totalSales').innerText = ts;
  document.getElementById('totalCollected').innerText = tc;
  document.getElementById('totalDue').innerText = td;
}
function deleteSale(i) {
  if(confirm('Delete this record?')) {
    sales.splice(i,1);
    localStorage.setItem('healthwise_sales', JSON.stringify(sales));
    render();
  }
}
function exportData() {
  const blob = new Blob([JSON.stringify(sales, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'HealthWise_Backup.json'; a.click();
}
render();
