const form = document.querySelector('#formulario')
function connectDB() {
    const openConnection = window.indexedDB.open('crm', 1);

    openConnection.onerror = function () {
        console.log('Hubo un error');
    };

    openConnection.onsuccess = function () {
        DB = openConnection.result;
    }
}

//Imprimimos alerta
function printAlert(message, type) {
    const alert = document.querySelector('.alerta');
    if (!alert) {
        //Crear alerta
        const divMessage = document.createElement('div');
        divMessage.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

        type === 'error' ? divMessage.classList.add('bg-red-100', 'border-red-400', 'text-red-700') : divMessage.classList.add('bg-green-100', 'border-green-400', 'text-green-700')

        divMessage.textContent = message;

        form.appendChild(divMessage);

        setTimeout(() => {
            divMessage.remove();
        }, 2000);
    }

}