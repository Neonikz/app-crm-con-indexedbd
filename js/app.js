(function(){
    //Variables
    let DB;
    const clientList = document.querySelector('#listado-clientes');

    window.onload = () =>{
        createDb();
        if (window.indexedDB.open('crm',1)) {
            getClients();
        }

        clientList.addEventListener('click', deleteRecord);

    };
    
    //Eliminar registro
    function deleteRecord(e){
        if(e.target.classList.contains('eliminar')){
            const idDelete = Number(e.target.dataset.cliente);

            const confirmDelete = confirm('Deseas eliminar este cliente?');

            if (confirmDelete) {
                const transaction = DB.transaction(['crm'],'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idDelete);

                transaction.oncomplete = () => e.target.parentElement.parentElement.remove();

                transaction.onerror = () => console.log('Hubo un error');
            }

        }
    }

    
    // Crea la base de datos de indexedDB
    function createDb(){
        const createDb = window.indexedDB.open('crm',1);

        createDb.onerror = () => console.log('Hubo un error');

        createDb.onsuccess = () => DB = createDb.result;

        createDb.onupgradeneeded = e => {
            const db = e.target.result;
            
            const objectStore = db.createObjectStore('crm',{ keyPath:'id', autoIncrement:true });

            objectStore.createIndex('nombre','nombre', {unique:false});
            objectStore.createIndex('email','email', {unique:true});
            objectStore.createIndex('telefono','telefono', {unique:false});
            objectStore.createIndex('empresa','empresa', {unique:false});
            objectStore.createIndex('id','id', {unique:true});

            console.log('Lista');
        }
    }

    //Obtener clientes
    function getClients(){
        const openConnection = window.indexedDB.open('crm',1);

        openConnection.onerror = () => console.log('hubo un error');
        openConnection.onsuccess = () => {
            DB = openConnection.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = e => {
                const cursor = e.target.result;

                if (cursor) {
                    const {name, business, email, phone, id} = cursor.value;

                    clientList.innerHTML +=`
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${phone}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${business}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                `

                    cursor.continue();
                }else {
                    console.log('No hay mas registros');
                }
            }
        }
    }

})();