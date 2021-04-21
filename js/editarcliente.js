(function() {
    //Variables
    let DB;
    let clientId;
    const imputName = document.querySelector('#nombre');
    const imputEmail = document.querySelector('#email');
    const imputPhone = document.querySelector('#telefono');
    const imputBusiness = document.querySelector('#empresa');
    const form = document.querySelector('#formulario')

    window.onload = () => {
        //Actualiza el registro
        form.addEventListener('submit', updateClient);
        connectDB();
        //Verificar el ID de la URL
        const urlParams = new URLSearchParams(window.location.search);
        clientId = urlParams.get('id');

        if (clientId) {
            setTimeout(() => {      //Pequeño retraso para buscar al cliente
                getClient(clientId);
            }, 100);
        }
    }

    //Actualiza el cliente
    function updateClient(e) {
        e.preventDefault();

        if (!imputName.value || !imputEmail.value || !imputPhone.value || !imputBusiness.value) {
            printAlert('Todos los campos son obligatorios','error');
            return;
        }

        //Actualizar el cliente
        const updatedClient = {
            name:imputName.value,
            email:imputEmail.value,
            phone:imputPhone.value,
            business:imputBusiness.value,
            id: Number(clientId)
        }

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(updatedClient);

        transaction.oncomplete = () => {
            printAlert('Cliente editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        };

        transaction.onerror = () => printAlert('Hubo un error','error');
    }

    //Obtenemos cliente
    function getClient(id) {
        const transaction = DB.transaction(['crm'],'readonly');
        const objectStore = transaction.objectStore('crm');

        const client = objectStore.openCursor();
        client.onsuccess = e => {
            const cursor = e.target.result;

            if (cursor) {
                if (cursor.value.id === Number(id)) {
                    fillForm(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    //Llenar formulario
    function fillForm(clientData){
        const {name, email, phone, business} = clientData;
        imputName.value = name;
        imputEmail.value = email;
        imputPhone.value = phone;
        imputBusiness.value = business;
    }

    //Conectamos el cliente
    function connectDB() {
        const openConnection = window.indexedDB.open('crm', 1);

        openConnection.onerror = function () {
            console.log('Hubo un error');
        };

        openConnection.onsuccess = function () {
            DB = openConnection.result;
        }
    }

})();