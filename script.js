function muatInventory() {
  const dataInventory = localStorage.getItem(INVENTORY_KEY);

  if (dataInventory) {
    inventoryList = JSON.parse(dataInventory);
  } else {
    inventoryList = [];
  }

  tampilkanInventory();
}

function simpanInventory() {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventoryList));
}

function tambahInventory() {
  const nama = document.getElementById("namaMaterialBaru").value.trim();
  const kategori = document.getElementById("kategoriMaterialBaru").value.trim();
  const qty = Number(document.getElementById("qtyMaterialBaru").value) || 0;
  const satuan = document.getElementById("satuanMaterialBaru").value.trim();
  const lokasi = document.getElementById("lokasiMaterialBaru").value.trim();

  if (!nama) {
    alert("Nama material wajib diisi.");
    return;
  }

  inventoryList.push({
    nama: nama,
    kategori: kategori || "-",
    qty: qty,
    satuan: satuan || "-",
    lokasi: lokasi || "-",
    tanggalMasuk: new Date().toISOString().slice(0, 10)
  });

  document.getElementById("namaMaterialBaru").value = "";
  document.getElementById("kategoriMaterialBaru").value = "";
  document.getElementById("qtyMaterialBaru").value = "";
  document.getElementById("satuanMaterialBaru").value = "";
  document.getElementById("lokasiMaterialBaru").value = "";

  simpanInventory();
  tampilkanInventory();
}

function tampilkanInventory() {
  const container = document.getElementById("inventoryView");
  if (!container) return;

  if (inventoryList.length === 0) {
    container.innerHTML = "<p>Belum ada data inventory.</p>";
    return;
  }

  let html = `
    <table class="inventory-table">
      <thead>
        <tr>
          <th>Tanggal Masuk</th>
          <th>Material</th>
          <th>Kategori</th>
          <th>Qty</th>
          <th>Satuan</th>
          <th>Lokasi</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
  `;

  inventoryList.forEach(function(item, index) {
    html += `
      <tr>
        <td>${item.tanggalMasuk}</td>
        <td>${item.nama}</td>
        <td>${item.kategori}</td>
        <td>${item.qty}</td>
        <td>${item.satuan}</td>
        <td>${item.lokasi}</td>
        <td>
          <button class="hapus kecil" onclick="hapusInventory(${index})">Hapus</button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

function hapusInventory(index) {
  const yakin = confirm("Yakin mau hapus material ini?");
  if (!yakin) return;

  inventoryList.splice(index, 1);
  simpanInventory();
  tampilkanInventory();
}

function resetInventory() {
  const yakin = confirm("Yakin mau reset semua inventory?");
  if (!yakin) return;

  localStorage.removeItem(INVENTORY_KEY);
  inventoryList = [];
  tampilkanInventory();
}

const STORAGE_KEY = "dataEstimasiProduksi";
function muatSupplier() {
  const dataSupplier = localStorage.getItem(SUPPLIER_KEY);
const HISTORY_KEY = "dataHistoriHargaProduksi";

let historiHargaList = [];
  if (dataSupplier) {
    supplierList = JSON.parse(dataSupplier);
  } else {
    supplierList = [
      {
        nama: "Vendor Booth A",
        kategori: "Konstruksi",
        kontak: "Belum diisi"
      },
      {
        nama: "Vendor LED A",
        kategori: "Multimedia",
        kontak: "Belum diisi"
      },
      {
        nama: "Vendor Sound A",
        kategori: "Sound",
        kontak: "Belum diisi"
      }
    ];

    simpanSupplier();
  }

  tampilkanSupplier();
}

function simpanSupplier() {
  localStorage.setItem(SUPPLIER_KEY, JSON.stringify(supplierList));
}

function tambahSupplier() {
  const nama = document.getElementById("namaSupplierBaru").value.trim();
  const kategori = document.getElementById("kategoriSupplierBaru").value.trim();
  const kontak = document.getElementById("kontakSupplierBaru").value.trim();

  if (!nama) {
    alert("Nama supplier wajib diisi.");
    return;
  }

  supplierList.push({
    nama: nama,
    kategori: kategori || "-",
    kontak: kontak || "-"
  });

  document.getElementById("namaSupplierBaru").value = "";
  document.getElementById("kategoriSupplierBaru").value = "";
  document.getElementById("kontakSupplierBaru").value = "";

  simpanSupplier();
  tampilkanSupplier();
  refreshSupplierDropdown();
}

function tampilkanSupplier() {
  const container = document.getElementById("daftarSupplierView");
  if (!container) return;

  if (supplierList.length === 0) {
    container.innerHTML = "<p>Belum ada supplier.</p>";
    return;
  }

  let html = "<ul>";

  supplierList.forEach(function(supplier, index) {
    html += `
      <li>
        <strong>${supplier.nama}</strong> —
        ${supplier.kategori} —
        ${supplier.kontak}
        <button class="hapus kecil" onclick="hapusSupplier(${index})">Hapus</button>
      </li>
    `;
  });

  html += "</ul>";
  container.innerHTML = html;
}

function hapusSupplier(index) {
  const yakin = confirm("Yakin mau hapus supplier ini?");
  if (!yakin) return;

  supplierList.splice(index, 1);
  simpanSupplier();
  tampilkanSupplier();
  refreshSupplierDropdown();
}

function resetSupplier() {
  const yakin = confirm("Yakin mau reset semua data supplier?");
  if (!yakin) return;

  localStorage.removeItem(SUPPLIER_KEY);
  supplierList = [];
  muatSupplier();
  refreshSupplierDropdown();
}

function supplierOptions(selected) {
  let html = `<option value="">Pilih Supplier</option>`;

  supplierList.forEach(function(supplier) {
    html += `
      <option value="${supplier.nama}" ${supplier.nama === selected ? "selected" : ""}>
        ${supplier.nama}
      </option>
    `;
  });

  return html;
}

function refreshSupplierDropdown() {
  const semuaBaris = document.querySelectorAll("#daftarItem tr");

  semuaBaris.forEach(function(baris) {
    const supplierSelect = baris.querySelector(".supplierSelect");
    if (!supplierSelect) return;

    const selected = supplierSelect.value;
    supplierSelect.innerHTML = supplierOptions(selected);
  });

  simpanData();
}
function formatRupiah(angka) {
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function kategoriOptions(selected) {
  const daftar = ["Konstruksi", "Multimedia", "Sound", "Lighting", "Manpower", "Transport", "Lain-lain"];

  return daftar.map(item => {
    return `<option ${item === selected ? "selected" : ""}>${item}</option>`;
  }).join("");
}

function satuanOptions(selected) {
  const daftar = ["paket", "unit", "m²", "meter", "hari", "orang"];

  return daftar.map(item => {
    return `<option ${item === selected ? "selected" : ""}>${item}</option>`;
  }).join("");
}

function buatBaris(data = {}) {
  const baris = document.createElement("tr");

  function buatBaris(data = {}) {
  const baris = document.createElement("tr");

  baris.innerHTML = `
    <td>
      <select onchange="hitungEstimasi(); simpanData();">
        ${kategoriOptions(data.kategori || "Konstruksi")}
      </select>
    </td>

    <td><input type="text" value="${data.item || ""}" placeholder="Nama item" oninput="simpanData()"></td>

    <td>
      <select onchange="simpanData()">
        ${satuanOptions(data.satuan || "paket")}
      </select>
    </td>

    <td>
      <select class="supplierSelect" onchange="hitungEstimasi(); simpanData();">
        ${supplierOptions(data.supplier || "")}
      </select>
    </td>

    <td><input type="number" value="${data.hppSatuan || 0}" oninput="hitungEstimasi(); simpanData();"></td>

    <td>
      <select class="supplierSelect" onchange="hitungEstimasi(); simpanData();">
        ${supplierOptions(data.supplierPembanding1 || "")}
      </select>
    </td>

    <td><input type="number" value="${data.hargaPembanding1 || 0}" oninput="hitungEstimasi(); simpanData();"></td>

    <td>
      <select class="supplierSelect" onchange="hitungEstimasi(); simpanData();">
        ${supplierOptions(data.supplierPembanding2 || "")}
      </select>
    </td>

    <td><input type="number" value="${data.hargaPembanding2 || 0}" oninput="hitungEstimasi(); simpanData();"></td>

    <td class="rekomendasiSupplier">-</td>

    <td><input type="number" value="${data.qty || 1}" oninput="hitungEstimasi(); simpanData();"></td>

    <td><input type="number" value="${data.marginPersen || 20}" oninput="hitungEstimasi(); simpanData();"></td>

    <td class="hargaJualSatuan">Rp 0</td>
    <td class="totalHpp">Rp 0</td>
    <td class="totalJual">Rp 0</td>
    <td class="profitItem">Rp 0</td>

    <td><textarea placeholder="Catatan teknis" oninput="simpanData()">${data.catatan || ""}</textarea></td>

    <td class="no-print"><button class="hapus" onclick="hapusItem(this)">Hapus</button></td>
  `;

  document.getElementById("daftarItem").appendChild(baris);
}
const templateItems = {
  booth: {
    kategori: "Konstruksi",
    item: "Booth / Konstruksi",
    satuan: "paket",
    supplier: "",
    qty: 1,
    hppSatuan: 25000000,
    marginPersen: 20,
    catatan: "Estimasi booth standard. Detail ukuran, material, dan finishing perlu dikonfirmasi."
  },
  backdrop: {
    kategori: "Konstruksi",
    item: "Backdrop Event",
    satuan: "meter",
    supplier: "",
    qty: 1,
    hppSatuan: 2500000,
    marginPersen: 20,
    catatan: "Backdrop rangka hollow/multipleks. Ukuran dan finishing menyesuaikan desain."
  },
  led: {
    kategori: "Multimedia",
    item: "LED Screen",
    satuan: "m²",
    supplier: "",
    qty: 1,
    hppSatuan: 850000,
    marginPersen: 15,
    catatan: "Harga estimasi per m². Belum termasuk rigging tambahan jika dibutuhkan."
  },
  sound: {
    kategori: "Sound",
    item: "Sound System",
    satuan: "paket",
    supplier: "",
    qty: 1,
    hppSatuan: 7500000,
    marginPersen: 15,
    catatan: "Paket sound standard event indoor. Perlu disesuaikan dengan venue dan jumlah audience."
  },
  lighting: {
    kategori: "Lighting",
    item: "Lighting System",
    satuan: "paket",
    supplier: "",
    qty: 1,
    hppSatuan: 6500000,
    marginPersen: 15,
    catatan: "Paket lighting standard. Detail titik lampu mengikuti konsep panggung."
  },
  crew: {
    kategori: "Manpower",
    item: "Crew Produksi",
    satuan: "orang",
    supplier: "",
    qty: 5,
    hppSatuan: 350000,
    marginPersen: 20,
    catatan: "Crew loading, setup, standby, dan dismantle."
  },
  transport: {
    kategori: "Transport",
    item: "Transport / Loading",
    satuan: "paket",
    supplier: "",
    qty: 1,
    hppSatuan: 3000000,
    marginPersen: 15,
    catatan: "Estimasi transport barang produksi. Menyesuaikan lokasi dan jumlah armada."
  }
};

function tambahTemplate(namaTemplate) {
  const dataTemplate = templateItems[namaTemplate];

  if (!dataTemplate) {
    alert("Template tidak ditemukan.");
    return;
  }

  buatBaris(dataTemplate);
  hitungEstimasi();
  simpanData();
}
function tambahItem() {
  buatBaris({
    kategori: "Konstruksi",
    item: "",
    satuan: "paket",
    supplier: "",
    qty: 1,
    hppSatuan: 0,
    marginPersen: 20,
    catatan: ""
  });
function cariRekomendasiSupplier(dataHarga) {
  const pilihanValid = dataHarga.filter(item => item.harga > 0 && item.supplier !== "");

  if (pilihanValid.length === 0) {
    return {
      supplier: "-",
      harga: 0
    };
  }

  pilihanValid.sort((a, b) => a.harga - b.harga);

  return pilihanValid[0];
}
 function hitungEstimasi() {
  const semuaBaris = document.querySelectorAll("#daftarItem tr");

  let grandHpp = 0;
  let grandJual = 0;
  let grandProfit = 0;
  let kategoriSummary = {};

  semuaBaris.forEach(function(baris) {
    const selects = baris.querySelectorAll("select");
    const inputs = baris.querySelectorAll("input");

    const kategori = selects[0].value;

    const supplierUtama = selects[2].value;
    const hargaUtama = Number(inputs[1].value) || 0;

    const supplierPembanding1 = selects[3].value;
    const hargaPembanding1 = Number(inputs[2].value) || 0;

    const supplierPembanding2 = selects[4].value;
    const hargaPembanding2 = Number(inputs[3].value) || 0;

    const qty = Number(inputs[4].value) || 0;
    const marginPersen = Number(inputs[5].value) || 0;

    const rekomendasi = cariRekomendasiSupplier([
      {
        supplier: supplierUtama,
        harga: hargaUtama
      },
      {
        supplier: supplierPembanding1,
        harga: hargaPembanding1
      },
      {
        supplier: supplierPembanding2,
        harga: hargaPembanding2
      }
    ]);

    const hppSatuan = rekomendasi.harga;
    const hargaJualSatuan = hppSatuan + (hppSatuan * marginPersen / 100);
    const totalHpp = qty * hppSatuan;
    const totalJual = qty * hargaJualSatuan;
    const profitItem = totalJual - totalHpp;

    baris.querySelector(".rekomendasiSupplier").innerText =
      rekomendasi.supplier === "-"
        ? "-"
        : rekomendasi.supplier + " / " + formatRupiah(rekomendasi.harga);

    baris.querySelector(".hargaJualSatuan").innerText = formatRupiah(hargaJualSatuan);
    baris.querySelector(".totalHpp").innerText = formatRupiah(totalHpp);
    baris.querySelector(".totalJual").innerText = formatRupiah(totalJual);
    baris.querySelector(".profitItem").innerText = formatRupiah(profitItem);

    grandHpp += totalHpp;
    grandJual += totalJual;
    grandProfit += profitItem;

    if (!kategoriSummary[kategori]) {
      kategoriSummary[kategori] = { hpp: 0, jual: 0, profit: 0 };
    }

    kategoriSummary[kategori].hpp += totalHpp;
    kategoriSummary[kategori].jual += totalJual;
    kategoriSummary[kategori].profit += profitItem;
  });

  document.getElementById("grandHpp").innerText = formatRupiah(grandHpp);
  document.getElementById("grandProfit").innerText = formatRupiah(grandProfit);
  document.getElementById("grandJual").innerText = formatRupiah(grandJual);

  tampilkanRingkasanKategori(kategoriSummary);
}
  simpanData();
}

function hapusItem(tombol) {
  tombol.closest("tr").remove();
  hitungEstimasi();
  simpanData();
}

function ambilDataDariTabel() {
  const semuaBaris = document.querySelectorAll("#daftarItem tr");
  const items = [];

  semuaBaris.forEach(function(baris) {
    const selects = baris.querySelectorAll("select");
    const inputs = baris.querySelectorAll("input");
    const textarea = baris.querySelector("textarea");

    items.push({
      kategori: selects[0].value,
      item: inputs[0].value,
      satuan: selects[1].value,

      supplier: selects[2].value,
      hppSatuan: Number(inputs[1].value) || 0,

      supplierPembanding1: selects[3].value,
      hargaPembanding1: Number(inputs[2].value) || 0,

      supplierPembanding2: selects[4].value,
      hargaPembanding2: Number(inputs[3].value) || 0,

      qty: Number(inputs[4].value) || 0,
      marginPersen: Number(inputs[5].value) || 0,
      catatan: textarea.value
    });
  });

  return items;
}

function simpanData() {
  const data = {
    namaProject: document.getElementById("namaProject").value,
    namaClient: document.getElementById("namaClient").value,
    tanggalEstimasi: document.getElementById("tanggalEstimasi").value,
    items: ambilDataDariTabel()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function muatData() {
  const dataTersimpan = localStorage.getItem(STORAGE_KEY);

  if (dataTersimpan) {
    const data = JSON.parse(dataTersimpan);

    document.getElementById("namaProject").value = data.namaProject || "";
    document.getElementById("namaClient").value = data.namaClient || "";
    document.getElementById("tanggalEstimasi").value = data.tanggalEstimasi || "";

    document.getElementById("daftarItem").innerHTML = "";

    if (data.items && data.items.length > 0) {
      data.items.forEach(item => buatBaris(item));
    } else {
      tambahItem();
    }
  } else {
    buatBaris({
      kategori: "Konstruksi",
      item: "Booth / Konstruksi",
      satuan: "paket",
      supplier: "Vendor Booth A",
      qty: 1,
      hppSatuan: 25000000,
      marginPersen: 20,
      catatan: ""
    });
  }

  hitungEstimasi();
}

function resetData() {
  const yakin = confirm("Yakin mau reset semua data estimasi?");
  if (!yakin) return;

  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function hitungEstimasi() {
  const semuaBaris = document.querySelectorAll("#daftarItem tr");

  let grandHpp = 0;
  let grandJual = 0;
  let grandProfit = 0;
  let kategoriSummary = {};

  semuaBaris.forEach(function(baris) {
    const kategori = baris.querySelector("select").value;
    const inputs = baris.querySelectorAll("input");

    const qty = Number(inputs[1].value) || 0;
const hppSatuan = Number(inputs[2].value) || 0;
const marginPersen = Number(inputs[3].value) || 0;

    const hargaJualSatuan = hppSatuan + (hppSatuan * marginPersen / 100);
    const totalHpp = qty * hppSatuan;
    const totalJual = qty * hargaJualSatuan;
    const profitItem = totalJual - totalHpp;

    baris.querySelector(".hargaJualSatuan").innerText = formatRupiah(hargaJualSatuan);
    baris.querySelector(".totalHpp").innerText = formatRupiah(totalHpp);
    baris.querySelector(".totalJual").innerText = formatRupiah(totalJual);
    baris.querySelector(".profitItem").innerText = formatRupiah(profitItem);

    grandHpp += totalHpp;
    grandJual += totalJual;
    grandProfit += profitItem;

    if (!kategoriSummary[kategori]) {
      kategoriSummary[kategori] = { hpp: 0, jual: 0, profit: 0 };
    }

    kategoriSummary[kategori].hpp += totalHpp;
    kategoriSummary[kategori].jual += totalJual;
    kategoriSummary[kategori].profit += profitItem;
  });

  document.getElementById("grandHpp").innerText = formatRupiah(grandHpp);
  document.getElementById("grandProfit").innerText = formatRupiah(grandProfit);
  document.getElementById("grandJual").innerText = formatRupiah(grandJual);

  tampilkanRingkasanKategori(kategoriSummary);
}

function tampilkanRingkasanKategori(data) {
  const container = document.getElementById("ringkasanKategori");
  container.innerHTML = "";

  for (let kategori in data) {
    const p = document.createElement("p");

    p.innerHTML = `
      <strong>${kategori}</strong><br>
      HPP: ${formatRupiah(data[kategori].hpp)} |
      Jual: ${formatRupiah(data[kategori].jual)} |
      Profit: ${formatRupiah(data[kategori].profit)}
    `;

    container.appendChild(p);
  }
}
function muatHistoriHarga() {
  const dataHistori = localStorage.getItem(HISTORY_KEY);

  if (dataHistori) {
    historiHargaList = JSON.parse(dataHistori);
  } else {
    historiHargaList = [];
  }

  tampilkanHistoriHarga();
}

function simpanHistoriHarga() {
  const namaProject = document.getElementById("namaProject").value || "-";
  const namaClient = document.getElementById("namaClient").value || "-";
  const tanggalEstimasi = document.getElementById("tanggalEstimasi").value || new Date().toISOString().slice(0, 10);

  const semuaBaris = document.querySelectorAll("#daftarItem tr");

  semuaBaris.forEach(function(baris) {
    const selects = baris.querySelectorAll("select");
    const inputs = baris.querySelectorAll("input");

    const kategori = selects[0].value;
    const item = inputs[0].value || "-";
    const satuan = selects[1].value;

    const supplierUtama = selects[2].value || "-";
    const hargaUtama = Number(inputs[1].value) || 0;

    const supplierPembanding1 = selects[3].value || "-";
    const hargaPembanding1 = Number(inputs[2].value) || 0;

    const supplierPembanding2 = selects[4].value || "-";
    const hargaPembanding2 = Number(inputs[3].value) || 0;

    const pilihanHarga = [
      { supplier: supplierUtama, harga: hargaUtama },
      { supplier: supplierPembanding1, harga: hargaPembanding1 },
      { supplier: supplierPembanding2, harga: hargaPembanding2 }
    ];

    pilihanHarga.forEach(function(pilihan) {
      if (pilihan.supplier !== "-" && pilihan.harga > 0) {
        historiHargaList.push({
          tanggal: tanggalEstimasi,
          project: namaProject,
          client: namaClient,
          kategori: kategori,
          item: item,
          satuan: satuan,
          supplier: pilihan.supplier,
          harga: pilihan.harga
        });
      }
    });
  });

  localStorage.setItem(HISTORY_KEY, JSON.stringify(historiHargaList));
  tampilkanHistoriHarga();

  alert("Histori harga berhasil disimpan.");
}

function tampilkanHistoriHarga() {
  const container = document.getElementById("historiHargaView");
  if (!container) return;

  if (historiHargaList.length === 0) {
    container.innerHTML = "<p>Belum ada histori harga.</p>";
    return;
  }

  let html = `
    <table class="history-table">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Project</th>
          <th>Client</th>
          <th>Kategori</th>
          <th>Item</th>
          <th>Supplier</th>
          <th>Satuan</th>
          <th>Harga</th>
        </tr>
      </thead>
      <tbody>
  `;

  historiHargaList.slice().reverse().forEach(function(data) {
    html += `
      <tr>
        <td>${data.tanggal}</td>
        <td>${data.project}</td>
        <td>${data.client}</td>
        <td>${data.kategori}</td>
        <td>${data.item}</td>
        <td>${data.supplier}</td>
        <td>${data.satuan}</td>
        <td>${formatRupiah(data.harga)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

function resetHistoriHarga() {
  const yakin = confirm("Yakin mau reset semua histori harga?");
  if (!yakin) return;

  localStorage.removeItem(HISTORY_KEY);
  historiHargaList = [];
  tampilkanHistoriHarga();
}
  
muatSupplier();
muatHistoriHarga();
muatData();
