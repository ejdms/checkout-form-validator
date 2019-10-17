// vat checbox
const handleVat = () => {
  const checked = document.querySelector('.vat-switch').checked;
  const vatYes = document.querySelector('.vat-yes');
  const vatNo = document.querySelector('.vat-no');

  if (checked) {
    vatYes.classList.remove('hidden');
    vatNo.classList.add('hidden');
  } else {
    vatYes.classList.add('hidden');
    vatNo.classList.remove('hidden');
  }
}
const vatSwitch = document.querySelector('.vat-switch');
vatSwitch.addEventListener('change', () => {
  handleVat();
});
handleVat();

// address checkbox
const handleAddress = () => {
  const checked = document.querySelector('.address-switch').checked;
  const section = document.querySelector('.another-address');
  const inputs = section.querySelectorAll('input');

  if (checked) {
    section.classList.remove('hidden');
    inputs.forEach(input => {
      input.disabled = false;
    })
  } else {
    section.classList.add('hidden');
    inputs.forEach(input => {
      input.disabled = true;
    })
  }
}
const addressSwitch = document.querySelector('.address-switch');
addressSwitch.addEventListener('change', () => {
  handleAddress();
});
handleAddress();