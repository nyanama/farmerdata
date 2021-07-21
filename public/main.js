/* eslint-env browser */
// main.js
const messageDiv = document.querySelector('#message')

function deleteRecord(phonev){
	 fetch('/farmers', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: phonev
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      if (response === 'No quote to delete') {
        messageDiv.textContent = 'No Darth Vadar quote to delete'
      } else {
        window.location.reload(true)
      }
    })
    .catch(console.error)
}

function editRecord(index){
		document.getElementsByName('uname')[index].readOnly = false;
		document.getElementsByName('uphone')[index].readOnly = false;
		document.getElementsByName('uaddress')[index].readOnly = false;
		document.getElementsByName('ulandowner')[index].readOnly = false;
}

function updateRecord(index){
		  fetch('/farmers', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
			  name: document.getElementsByName('uname')[index].value,
			  phone: document.getElementsByName('uphone')[index].value,
			  address: document.getElementsByName('uaddress')[index].value,
			  landowner: document.getElementsByName('ulandowner')[index].value,
			})
		  })
			.then(res => {
			  if (res.ok) return res.json()
			})
			.then(response => {
			  window.location.reload(true)
			})

	}
