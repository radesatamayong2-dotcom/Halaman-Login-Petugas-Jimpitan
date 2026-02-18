let dataNama = [];
let dataJumlah = [];

const ctx = document.getElementById('grafik').getContext('2d');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: dataNama,
    datasets: [{
      label: 'Jumlah Setoran',
      data: dataJumlah,
      backgroundColor: '#3498db'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

function tambahData() {
  const nama = document.getElementById('nama').value;
  const jumlah = document.getElementById('jumlah').value;

  if (nama === "" || jumlah === "") {
    alert("Isi semua data!");
    return;
  }

  dataNama.push(nama);
  dataJumlah.push(jumlah);

  updateTabel();
  chart.update();

  document.getElementById('nama').value = "";
  document.getElementById('jumlah').value = "";
}

function updateTabel() {
  const tbody = document.getElementById('tabelData');
  tbody.innerHTML = "";

  for (let i = 0; i < dataNama.length; i++) {
    tbody.innerHTML += `
      <tr>
        <td>${dataNama[i]}</td>
        <td>${dataJumlah[i]}</td>
      </tr>
    `;
  }
}

async function exportPDF() {
  const { jsPDF } = window.jspdf;

  const element = document.getElementById('areaCetak');

  const canvas = await html2canvas(element, {
    scale: 2
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');

  const imgWidth = 190;
  const pageHeight = 295;
  const imgHeight = canvas.height * imgWidth / canvas.width;

  let position = 10;

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  pdf.save('laporan-jimpitan.pdf');
}
