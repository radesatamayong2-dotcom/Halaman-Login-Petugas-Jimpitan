import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function logout(){
  signOut(auth);
  window.location.href = "index.html";
}

window.logout = logout;

onAuthStateChanged(auth, user=>{
  if(!user){
    window.location.href = "index.html";
  }
});

const wargaRef = ref(db, "warga");
const transaksiRef = ref(db, "transaksi");

let dataWarga={}, dataTransaksi={};

onValue(wargaRef, snap => {
  dataWarga = snap.val() || {};
  renderWarga();
});
onValue(transaksiRef, snap => {
  dataTransaksi = snap.val() || {};
  renderTabel();
});

function renderWarga(){
  const sel = document.getElementById("wargaSelect");
  sel.innerHTML = "";
  Object.keys(dataWarga).forEach(id=>{
    sel.innerHTML += `<option value="${id}">${dataWarga[id].nama}</option>`;
  });
}

function hitungTotalBayar(id){
  let t=0;
  Object.keys(dataTransaksi).forEach(key=>{
    if(dataTransaksi[key].wargaId === id){
      t += dataTransaksi[key].jumlah;
    }
  });
  return t;
}

function renderTabel(){
  const tb = document.getElementById("tabelWarga");
  tb.innerHTML="";
  const mingguSekarang = Math.floor((Date.now() - new Date("2026-02-01"))/(1000*60*60*24*7));

  Object.keys(dataWarga).forEach(id=>{
    const total = hitungTotalBayar(id);
    const mingguBayar = Math.floor(total/5000);
    const selisih = mingguBayar - mingguSekarang;

    let status="", cls="";
    if(selisih===0){status="Lunas"; cls="";}
    else if(selisih>0){status="Lebih "+selisih+" minggu"; cls="";}
    else {status="Kurang "+Math.abs(selisih)+" minggu"; cls="";}

    tb.innerHTML += `
      <tr>
        <td>${dataWarga[id].nama}</td>
        <td>Rp ${total}</td>
        <td>${status}</td>
      </tr>
    `;
  });
}

document.getElementById("simpanBtn").addEventListener("click", ()=>{
  const wargaId = document.getElementById("wargaSelect").value;
  const jumlah = parseInt(document.getElementById("jumlahInput").value);
  if(!jumlah) return;

  push(transaksiRef, {
    wargaId, jumlah,
    tanggal: new Date().toISOString()
  });
});
