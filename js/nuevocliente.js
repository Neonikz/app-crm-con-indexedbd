(function () {
    //Variables
    let DB;
    const form = document.querySelector('#formulario');

    window.onload = () => {
        connectDB();

        form.addEventListener('submit', clientValidate);
    }

    //Validamos clientes
    function clientValidate(e) {
        e.preventDefault();

        //Leer los inputs
        const name = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#telefono').value;
        const business = document.querySelector('#empresa').value;

        if (!name || !email || !phone || !business) {
            printAlert('Todos los campos son obligatorios', 'error');
            return;
        }

        //Crear un objeto con la informacion
        const client = {
            name,
            email,
            phone,
            business,
            id: Date.now()
        }
        
        createNewClient(client);
    }
    //Crear el cliente
    function createNewClient(client){
        const transaction = DB.transaction(['crm'],'readwrite');

        const objectStore = transaction.objectStore('crm');
        objectStore.add(client);

        transaction.onerror = () => printAlert('Hubo un error,revise datos','error');
        transaction.oncomplete = () =>{
            printAlert('El cliente se agrego correctamente'); 
            form.reset(); //Resetea el form
            
            setTimeout(() =>{
                window.location.href = 'index.html';
            },2000);

        } 
    }




})();