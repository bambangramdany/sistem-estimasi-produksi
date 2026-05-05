const STORAGE_KEY = "dataEstimasiProduksi";

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
    <td><input type="text" value="${data.supplier || ""}" placeholder="Nama supplier" oninput="simpanData()"></td>
    <td><input type="number" value="${data.qty || 1}" oninput="hitungEstimasi(); simpanData();"></td>
    <td><input type="number" value="${data.hppSatuan || 0}" oninput="hitungEstimasi(); simpanData();"></td>
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

  semuaBaris.forEach(function(baris) {
    const selects = baris.querySelectorAll("select");
    const inputs = baris.querySelectorAll("input");
    const textarea = baris.querySelector("textarea");

    items.push({
      kategori: selects[0].value,
      item: inputs[0].value,
      satuan: selects[1].value,
      supplier: inputs[1].value,
      qty: Number(inputs[2].value) || 0,
      hppSatuan: Number(inputs[3].value) || 0,
      marginPersen: Number(inputs[4].value) || 0,
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

    const qty = Number(inputs[2].value) || 0;
    const hppSatuan = Number(inputs[3].value) || 0;
    const marginPersen = Number(inputs[4].value) || 0;

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

muatData();
