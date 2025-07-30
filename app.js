const fromSelect   = document.querySelector('#from');
const toSelect     = document.querySelector('#to');
const swapButton   = document.getElementById('swap');
const convertButton= document.getElementById('convert');
const getAmount    = document.getElementById('amount');
const output       = document.getElementById('output');

let amountByCodeCache = null;
let selectsInitialized = false;

async function loadCurrenciesOnce() {
  if (amountByCodeCache && selectsInitialized) return amountByCodeCache;

  const res = await fetch("http://localhost:4000/get_currency");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const payload = await res.json();
  const list = payload?.currencies;
  if (!Array.isArray(list)) throw new Error("Invalid payload: 'currencies' is not an array");

  if (!selectsInitialized) {
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    for (const { code, name } of list) {
      const optFrom = document.createElement("option");
      optFrom.value = code;
      optFrom.textContent = `${name} - ${code}`;
      fromSelect.appendChild(optFrom);

      const optTo = document.createElement("option");
      optTo.value = code;
      optTo.textContent = `${name} - ${code}`;
      toSelect.appendChild(optTo);
    }

    // set defaults
    fromSelect.value = list.some(c => c.code === "USD") ? "USD" : fromSelect.options[0]?.value;
    toSelect.value   = list.some(c => c.code === "CAD") ? "CAD" : toSelect.options[0]?.value;

    selectsInitialized = true;
  }

  amountByCodeCache = new Map(list.map(({ code, amount }) => [code.toUpperCase(), Number(amount)]));
  return amountByCodeCache;
}

async function get_currency(toSelectedCurrency, fromSelectedCurrency, currencyAmount) {

    const amountByCode = await loadCurrenciesOnce();

  const toCode = (toSelectedCurrency || toSelect.value || "").trim().toUpperCase();
  const fromCode = (fromSelectedCurrency || fromSelect.value || "").trim().toUpperCase();

  const toRate = amountByCode.get(toCode);
  const fromRate = amountByCode.get(fromCode);

  if (toRate == null) throw new Error(`Unknown TO currency: ${toCode}`);
  if (fromRate == null) throw new Error(`Unknown FROM currency: ${fromCode}`);

  const amt = Number(currencyAmount);
  if (!Number.isFinite(amt)) throw new Error(`Invalid amount: ${currencyAmount}`);

  return (amt * toRate) / fromRate;
}

function swapCurrencies() {
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];

  fromSelect.dispatchEvent(new Event("change", { bubbles: true }));
  toSelect.dispatchEvent(new Event("change", { bubbles: true }));
}

async function convertCurrency() {
  try {
    await loadCurrenciesOnce();
    const amountValue = getAmount.value;
    const result = await get_currency(toSelect.value, fromSelect.value, amountValue);

    output.textContent = Number.isFinite(result) ? result.toFixed(4) : "";
  } catch (err) {
    console.error(err);
    output.textContent = "Conversion failed";
  }
}

// Events
swapButton.addEventListener("click", async () => {
  swapCurrencies();
  await convertCurrency();
});

convertButton.addEventListener("click", convertCurrency);
fromSelect.addEventListener("change", convertCurrency);
toSelect.addEventListener("change", convertCurrency);
getAmount.addEventListener("input", () => {
  if (getAmount.value.trim() !== "") convertCurrency();
});

// initial load
loadCurrenciesOnce().catch(console.error);
