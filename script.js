const STORAGE_KEY = "dataEstimasiProduksi";
const SUPPLIER_KEY = "dataSupplierProduksi";
const HISTORY_KEY = "dataHistoriHargaProduksi";
const INVENTORY_KEY = "dataInventoryProduksi";

let supplierList = [];
let historiHargaList = [];
let inventoryList = [];

const templateItems = {
  booth: {
    kategori: "Konstruksi",
    item: "Booth / Konstruksi",
    satuan: "paket",
    supplier: "",
    hppSatuan: 25000000,
    supplierPembanding1: "",
    hargaPembanding1: 0,
    supplierPembanding2: "",
    hargaPembanding2: 0,
    qty: 1,
    marginPersen: 20,
    catatan: "Estimasi booth standard."
  },
  backdrop: {
    kategori: "Konstruksi",
    item: "Backdrop Event",
    satuan: "meter",
    supplier: "",
    hppSatuan: 2500000,
    supplierPembanding1: "",
    hargaPembanding1: 0,
    supplierPembanding2: "",
    hargaPembanding2: 0,
    qty: 1,
    marginPersen: 20,
    catatan: "Backdrop rangka dan finishing menyesuaikan desain."
  },
  led: {
    kategori: "Multimedia",
    item: "LED Screen",
    satuan: "m²",
    supplier: "",
    hppSatuan: 850000,
    supplierPembanding1: "",
    hargaPembanding1: 0,
    supplierPembanding2: "",
    hargaPembanding2: 0,
    qty: 1,
    marginPersen: 15,
    catatan: "Harga estimasi LED per m²."
  },
  sound: {
    kategori: "Sound",
    item: "Sound System",
    satuan: "paket",
    supplier: "",
    hppSatuan: 7500000,
    supplierPembanding1: "",
    hargaPembanding1: 0,
    supplierPembanding2: "",
    hargaPembanding2: 0,
    qty: 1,
    marginPersen: 15,
    catatan: "Paket sound standard event indoor."
  },
  lighting: {
    kategori: "Lighting",
    item: "Lighting System",
    satuan: "paket",
    supplier: "",
    hppSatuan: 6500000,
    supplierPembanding1: "",
    hargaPembanding1: 0,
    supplierPembanding2: "",
    hargaPembanding2: 0,
    qty: 1,
    marginPersen: 15,
    catatan: "Paket lighting standard."
  },
  crew: {
    kategori: "Manpower",
    item: "Crew Produksi",
    satuan: "orang",
    supplier: "",
    hppSatuan: 350000,
    supplierPembanding1: "",
    hargaPembanding1: 0,
    supplierPembanding2: "",
    hargaPembanding2: 0,
    qty: 5,
    marginPersen: 20,
    catatan: "Crew loading, setup, standby, dan dismantle."
  },
  transport: {
    kategori: "Transport",
    item: "Transport / Loading",
    satuan: "paket",
    supplier: "",
    hppSatuan: 3000000,
    supplierPembanding1: "",
    hargaPembanding1: 0,
    supplierPembanding2: "",
    hargaPembanding2: 0,
    qty: 1,
    marginPersen: 15,
    catatan: "Estimasi transport barang produksi."
  }
};

function formatRupiah(angka) {
  return "Rp " + Math.round(angka || 0).toLocaleString("id-ID");
}

function kategoriOptions(selected) {
  const daftar = ["Konstruksi", "Multimedia", "Sound", "Lighting", "Manpower", "Transport", "Creative", "Production House", "Lain-lain"];
  return daftar.map(item => `<option ${item === selected ? "selected" : ""}>${item}</option>`).join("");
}

function satuanOptions(selected) {
  const daftar = ["paket", "unit", "m²", "meter", "hari", "orang", "lembar"];
  return daftar.map(item => `<option ${item === selected ? "selected" : ""}>${item}</option>`).join("");
}

function supplierOptions(selected) {
  let html = `<option value="">Pilih Supplier</option>`;
  supplierList.forEach(supplier => {
    html += `<option value="${supplier.nama}" ${supplier.nama === selected ? "selected" : ""}>${supplier.nama}</option>`;
  });
  return html;
}

function buatBaris(data = {}) {
  const baris = document.createElement("tr");

  baris.dataset.kategori = data.kategori || "Konstruksi";
  baris.dataset.item = data.item || "";
  baris.dataset.satuan = data.satuan || "paket";

  baris.dataset.supplier = data.supplier || "";
  baris.dataset.hppSatuan = data.hppSatuan || 0;

  baris.dataset.supplierPembanding1 = data.supplierPembanding1 || "";
  baris.dataset.hargaPembanding1 = data.hargaPembanding1 || 0;

  baris.dataset.supplierPembanding2 = data.supplierPembanding2 || "";
  baris.dataset.hargaPembanding2 = data.hargaPembanding2 || 0;

  baris.dataset.qty = data.qty || 1;
  baris.dataset.marginPersen = data.marginPersen || 20;
  baris.dataset.catatan = data.catatan || "";

  baris.innerHTML = `
    <td class="viewKategori"></td>
    <td class="viewItem"></td>
    <td class="viewSatuan"></td>
    <td class="rekomendasiSupplier"></td>
    <td class="viewQty"></td>
    <td class="viewMargin"></td>
    <td class="totalHpp"></td>
    <td class="totalJual"></td>
    <td class="profitItem"></td>
    <td class="viewCatatan"></td>
    <td>
      <button class="print kecil" onclick="editItem(this)">Edit</button>
      <button class="hapus kecil" onclick="hapusItem(this)">Hapus</button>
    </td>
  `;

  document.getElementById("daftarItem").appendChild(baris);
}

function tambahItem() {
  buatBaris({});
  hitungEstimasi();
  simpanData();
}

function tambahTemplate(namaTemplate) {
  if (!templateItems[namaTemplate]) return;
  buatBaris(templateItems[namaTemplate]);
  hitungEstimasi();
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

  semuaBaris.forEach(baris => {
    items.push({
      kategori: baris.dataset.kategori,
      item: baris.dataset.item,
      satuan: baris.dataset.satuan,

      supplier: baris.dataset.supplier,
      hppSatuan: Number(baris.dataset.hppSatuan) || 0,

      supplierPembanding1: baris.dataset.supplierPembanding1,
      hargaPembanding1: Number(baris.dataset.hargaPembanding1) || 0,

      supplierPembanding2: baris.dataset.supplierPembanding2,
      hargaPembanding2: Number(baris.dataset.hargaPembanding2) || 0,

      qty: Number(baris.dataset.qty) || 0,
      marginPersen: Number(baris.dataset.marginPersen) || 0,
      catatan: baris.dataset.catatan
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
      tambahTemplate("booth");
    }
  } else {
    tambahTemplate("booth");
  }

  hitungEstimasi();
}

function resetData() {
  if (!confirm("Yakin reset estimasi?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function cariRekomendasiSupplier(pilihanHarga) {
  const valid = pilihanHarga.filter(item => item.supplier && item.harga > 0);
  if (valid.length === 0) return { supplier: "-", harga: 0 };

  valid.sort((a, b) => a.harga - b.harga);
  return valid[0];
}

function hitungEstimasi() {
  const semuaBaris = document.querySelectorAll("#daftarItem tr");

  let grandHpp = 0;
  let grandJual = 0;
  let grandProfit = 0;
  let kategoriSummary = {};

  semuaBaris.forEach(baris => {
    const kategori = baris.dataset.kategori;
    const item = baris.dataset.item;
    const satuan = baris.dataset.satuan;
    const qty = Number(baris.dataset.qty) || 0;
    const marginPersen = Number(baris.dataset.marginPersen) || 0;
    const catatan = baris.dataset.catatan || "";

    const rekomendasi = cariRekomendasiSupplier([
      {
        supplier: baris.dataset.supplier,
        harga: Number(baris.dataset.hppSatuan) || 0
      },
      {
        supplier: baris.dataset.supplierPembanding1,
        harga: Number(baris.dataset.hargaPembanding1) || 0
      },
      {
        supplier: baris.dataset.supplierPembanding2,
        harga: Number(baris.dataset.hargaPembanding2) || 0
      }
    ]);

    const hppSatuan = rekomendasi.harga;
    const hargaJualSatuan = hppSatuan + (hppSatuan * marginPersen / 100);
    const totalHpp = qty * hppSatuan;
    const totalJual = qty * hargaJualSatuan;
    const profitItem = totalJual - totalHpp;

    baris.querySelector(".viewKategori").innerText = kategori;
    baris.querySelector(".viewItem").innerText = item;
    baris.querySelector(".viewSatuan").innerText = satuan;

    baris.querySelector(".rekomendasiSupplier").innerText =
      rekomendasi.supplier === "-"
        ? "-"
        : rekomendasi.supplier + " / " + formatRupiah(rekomendasi.harga);

    baris.querySelector(".viewQty").innerText = qty;
    baris.querySelector(".viewMargin").innerText = marginPersen + "%";
    baris.querySelector(".totalHpp").innerText = formatRupiah(totalHpp);
    baris.querySelector(".totalJual").innerText = formatRupiah(totalJual);
    baris.querySelector(".profitItem").innerText = formatRupiah(profitItem);
    baris.querySelector(".viewCatatan").innerText = catatan;

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

  const marginProject = grandJual > 0 ? (grandProfit / grandJual) * 100 : 0;

  document.getElementById("dashboardHpp").innerText = formatRupiah(grandHpp);
  document.getElementById("dashboardJual").innerText = formatRupiah(grandJual);
  document.getElementById("dashboardProfit").innerText = formatRupiah(grandProfit);
  document.getElementById("dashboardMargin").innerText = marginProject.toFixed(1) + "%";

  tampilkanRingkasanKategori(kategoriSummary);
}

function tampilkanRingkasanKategori(data) {
  const container = document.getElementById("ringkasanKategori");
  container.innerHTML = "";

  for (let kategori in data) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${kategori}</strong><br>HPP: ${formatRupiah(data[kategori].hpp)} | Jual: ${formatRupiah(data[kategori].jual)} | Profit: ${formatRupiah(data[kategori].profit)}`;
    container.appendChild(p);
  }
}

/* SUPPLIER */
function muatSupplier() {
  const data = localStorage.getItem(SUPPLIER_KEY);

  supplierList = data ? JSON.parse(data) : [
    { nama: "Vendor Booth A", kategori: "Konstruksi", kontak: "-" },
    { nama: "Vendor LED A", kategori: "Multimedia", kontak: "-" },
    { nama: "Vendor Sound A", kategori: "Sound", kontak: "-" }
  ];

  simpanSupplier();
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

  supplierList.push({ nama, kategori: kategori || "-", kontak: kontak || "-" });

  document.getElementById("namaSupplierBaru").value = "";
  document.getElementById("kategoriSupplierBaru").value = "";
  document.getElementById("kontakSupplierBaru").value = "";

  simpanSupplier();
  tampilkanSupplier();
  refreshSupplierDropdown();
}

function tampilkanSupplier() {
  const container = document.getElementById("daftarSupplierView");

  if (supplierList.length === 0) {
    container.innerHTML = "<p>Belum ada supplier.</p>";
    return;
  }

  let html = "<ul>";
  supplierList.forEach((supplier, index) => {
    html += `<li><strong>${supplier.nama}</strong> — ${supplier.kategori} — ${supplier.kontak} <button class="hapus kecil" onclick="hapusSupplier(${index})">Hapus</button></li>`;
  });
  html += "</ul>";

  container.innerHTML = html;
}

function hapusSupplier(index) {
  if (!confirm("Hapus supplier ini?")) return;

  supplierList.splice(index, 1);
  simpanSupplier();
  tampilkanSupplier();
  refreshSupplierDropdown();
}

function resetSupplier() {
  if (!confirm("Reset semua supplier?")) return;

  localStorage.removeItem(SUPPLIER_KEY);
  muatSupplier();
  refreshSupplierDropdown();
}

function refreshSupplierDropdown() {
  document.querySelectorAll(".supplierSelect").forEach(select => {
    const selected = select.value;
    select.innerHTML = supplierOptions(selected);
  });

  refreshFormSupplierOptions();
  simpanData();
}

/* HISTORI */
function muatHistoriHarga() {
  const data = localStorage.getItem(HISTORY_KEY);
  historiHargaList = data ? JSON.parse(data) : [];
  tampilkanHistoriHarga();
}

function simpanHistoriHarga() {
  const namaProject = document.getElementById("namaProject").value || "-";
  const namaClient = document.getElementById("namaClient").value || "-";
  const tanggal = document.getElementById("tanggalEstimasi").value || new Date().toISOString().slice(0, 10);

  const items = ambilDataDariTabel();

  items.forEach(item => {
    [
      { supplier: item.supplier, harga: item.hppSatuan },
      { supplier: item.supplierPembanding1, harga: item.hargaPembanding1 },
      { supplier: item.supplierPembanding2, harga: item.hargaPembanding2 }
    ].forEach(pilihan => {
      if (pilihan.supplier && pilihan.harga > 0) {
        historiHargaList.push({
          tanggal,
          project: namaProject,
          client: namaClient,
          kategori: item.kategori,
          item: item.item,
          satuan: item.satuan,
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

  if (historiHargaList.length === 0) {
    container.innerHTML = "<p>Belum ada histori harga.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Tanggal</th><th>Project</th><th>Item</th><th>Supplier</th><th>Harga</th></tr></thead><tbody>";

  historiHargaList.slice().reverse().forEach(data => {
    html += `<tr><td>${data.tanggal}</td><td>${data.project}</td><td>${data.item}</td><td>${data.supplier}</td><td>${formatRupiah(data.harga)}</td></tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function resetHistoriHarga() {
  if (!confirm("Reset semua histori harga?")) return;

  localStorage.removeItem(HISTORY_KEY);
  historiHargaList = [];
  tampilkanHistoriHarga();
}

/* INVENTORY */
function muatInventory() {
  const data = localStorage.getItem(INVENTORY_KEY);
  inventoryList = data ? JSON.parse(data) : [];
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
    nama,
    kategori: kategori || "-",
    qty,
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

  if (inventoryList.length === 0) {
    container.innerHTML = "<p>Belum ada data inventory.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Tanggal</th><th>Material</th><th>Kategori</th><th>Qty</th><th>Satuan</th><th>Lokasi</th><th>Aksi</th></tr></thead><tbody>";

  inventoryList.forEach((item, index) => {
    html += `<tr><td>${item.tanggalMasuk}</td><td>${item.nama}</td><td>${item.kategori}</td><td>${item.qty}</td><td>${item.satuan}</td><td>${item.lokasi}</td><td><button class="hapus kecil" onclick="hapusInventory(${index})">Hapus</button></td></tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function hapusInventory(index) {
  if (!confirm("Hapus material ini?")) return;

  inventoryList.splice(index, 1);
  simpanInventory();
  tampilkanInventory();
}

function resetInventory() {
  if (!confirm("Reset semua inventory?")) return;

  localStorage.removeItem(INVENTORY_KEY);
  inventoryList = [];
  tampilkanInventory();
}

function refreshFormSupplierOptions() {
  const ids = ["formSupplierUtama", "formSupplier1", "formSupplier2"];

  ids.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    const selected = select.value;
    select.innerHTML = supplierOptions(selected);
  });
}

function editItem(tombol) {
  const baris = tombol.closest("tr");
  const semuaBaris = Array.from(document.querySelectorAll("#daftarItem tr"));
  const index = semuaBaris.indexOf(baris);

  document.getElementById("editIndex").value = index;

  document.getElementById("formKategori").value = baris.dataset.kategori;
  document.getElementById("formItem").value = baris.dataset.item;
  document.getElementById("formSatuan").value = baris.dataset.satuan;

  document.getElementById("formSupplierUtama").value = baris.dataset.supplier;
  document.getElementById("formHargaUtama").value = baris.dataset.hppSatuan;

  document.getElementById("formSupplier1").value = baris.dataset.supplierPembanding1;
  document.getElementById("formHarga1").value = baris.dataset.hargaPembanding1;

  document.getElementById("formSupplier2").value = baris.dataset.supplierPembanding2;
  document.getElementById("formHarga2").value = baris.dataset.hargaPembanding2;

  document.getElementById("formQty").value = baris.dataset.qty;
  document.getElementById("formMargin").value = baris.dataset.marginPersen;
  document.getElementById("formCatatan").value = baris.dataset.catatan;

  document.getElementById("btnTambahItem").style.display = "none";
  document.getElementById("btnUpdateItem").style.display = "inline-block";

  window.scrollTo({
    top: document.getElementById("formItem").offsetTop - 120,
    behavior: "smooth"
  });
}

function tambahItemDariForm() {
  const data = {
    kategori: document.getElementById("formKategori").value,
    item: document.getElementById("formItem").value,
    satuan: document.getElementById("formSatuan").value,

    supplier: document.getElementById("formSupplierUtama").value,
    hppSatuan: Number(document.getElementById("formHargaUtama").value) || 0,

    supplierPembanding1: document.getElementById("formSupplier1").value,
    hargaPembanding1: Number(document.getElementById("formHarga1").value) || 0,

    supplierPembanding2: document.getElementById("formSupplier2").value,
    hargaPembanding2: Number(document.getElementById("formHarga2").value) || 0,

    qty: Number(document.getElementById("formQty").value) || 1,
    marginPersen: Number(document.getElementById("formMargin").value) || 20,
    catatan: document.getElementById("formCatatan").value
  };

  if (!data.item) {
    alert("Nama item wajib diisi.");
    return;
  }

  buatBaris(data);
  hitungEstimasi();
  simpanData();
  resetFormItem();
}

function updateItemDariForm() {
  const index = Number(document.getElementById("editIndex").value);

  if (isNaN(index)) {
    alert("Tidak ada item yang sedang diedit.");
    return;
  }

  const semuaBaris = document.querySelectorAll("#daftarItem tr");
  const baris = semuaBaris[index];

  if (!baris) {
    alert("Item tidak ditemukan.");
    resetFormItem();
    return;
  }

  const namaItem = document.getElementById("formItem").value;

  if (!namaItem) {
    alert("Nama item wajib diisi.");
    return;
  }

  baris.dataset.kategori = document.getElementById("formKategori").value;
  baris.dataset.item = namaItem;
  baris.dataset.satuan = document.getElementById("formSatuan").value;

  baris.dataset.supplier = document.getElementById("formSupplierUtama").value;
  baris.dataset.hppSatuan = Number(document.getElementById("formHargaUtama").value) || 0;

  baris.dataset.supplierPembanding1 = document.getElementById("formSupplier1").value;
  baris.dataset.hargaPembanding1 = Number(document.getElementById("formHarga1").value) || 0;

  baris.dataset.supplierPembanding2 = document.getElementById("formSupplier2").value;
  baris.dataset.hargaPembanding2 = Number(document.getElementById("formHarga2").value) || 0;

  baris.dataset.qty = Number(document.getElementById("formQty").value) || 1;
  baris.dataset.marginPersen = Number(document.getElementById("formMargin").value) || 20;
  baris.dataset.catatan = document.getElementById("formCatatan").value;

  hitungEstimasi();
  simpanData();
  resetFormItem();
}

function resetFormItem() {
  document.getElementById("formKategori").value = "Konstruksi";
  document.getElementById("formItem").value = "";
  document.getElementById("formSatuan").value = "paket";

  document.getElementById("formSupplierUtama").value = "";
  document.getElementById("formHargaUtama").value = "";

  document.getElementById("formSupplier1").value = "";
  document.getElementById("formHarga1").value = "";

  document.getElementById("formSupplier2").value = "";
  document.getElementById("formHarga2").value = "";

  document.getElementById("formQty").value = 1;
  document.getElementById("formMargin").value = 20;
  document.getElementById("formCatatan").value = "";

  document.getElementById("editIndex").value = "";
  document.getElementById("btnTambahItem").style.display = "inline-block";
  document.getElementById("btnUpdateItem").style.display = "none";
}

/* START APP */
muatSupplier();
muatHistoriHarga();
muatInventory();
refreshFormSupplierOptions();
muatData();
