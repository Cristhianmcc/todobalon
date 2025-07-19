$(document).ready(function() {
    
    // Variables globales
    let currentUrl = "https://la12hd.com/vivo/canal.php?stream=dsports";
    let currentCanal = "dsports";
    
    // Función para cambiar de canal
    function changeChannel(url, canal) {
        const iframe = $("#embedIframe");
        const loadingMessage = $('<div class="loading-message">Cargando canal...</div>');
        
        // Mostrar mensaje de carga
        iframe.parent().append(loadingMessage);
        
        // Cambiar URL del iframe
        iframe.attr('src', url);
        currentUrl = url;
        currentCanal = canal;
        
        // Remover mensaje de carga después de 2 segundos
        setTimeout(function() {
            loadingMessage.remove();
        }, 2000);
        
        console.log(`Canal cambiado a: ${canal} - URL: ${url}`);
    }
    
    // Función para recargar el canal actual
    function reloadChannel() {
        const iframe = $("#embedIframe");
        const currentSrc = iframe.attr('src');
        
        // Agregar timestamp para forzar recarga
        const separator = currentSrc.includes('?') ? '&' : '?';
        const newUrl = currentSrc + separator + '_t=' + new Date().getTime();
        
        iframe.attr('src', newUrl);
        console.log('Canal recargado:', newUrl);
    }
    
    // Event listener para botones de canal
    $('.canal-btn').on('click', function() {
        const button = $(this);
        const url = button.data('url');
        const canal = button.data('canal');
        
        // Remover clase active de todos los botones
        $('.canal-btn').removeClass('active');
        
        // Agregar clase active al botón clickeado
        button.addClass('active');
        
        // Cambiar canal
        changeChannel(url, canal);
        
        // Actualizar título según el canal
        updateTitle(canal);
    });
    
    // Event listener para botón de recarga
    $('#btnIframe').on('click', function() {
        reloadChannel();
        
        // Efecto visual en el botón
        const button = $(this);
        button.text('Recargando...');
        
        setTimeout(function() {
            button.text('Recargar canal');
        }, 1500);
    });
    
    // Función para actualizar el título según el canal
    function updateTitle(canal) {
        const titles = {
            'dsports': 'DirecTV Sports En Vivo',
            'dsports2': 'DirecTV Sports 2 En Vivo',
            'dsportsplus': 'DirecTV Sports+ En Vivo',
            'liga1max': 'Liga1 Max En Vivo',
            'espn': 'ESPN En Vivo',
            'espn2': 'ESPN 2 En Vivo',
            'espn3': 'ESPN 3 En Vivo',
            'espn4': 'ESPN 4 En Vivo',
            'espn5': 'ESPN 5 En Vivo',
            'espn6': 'ESPN 6 En Vivo',
            'espn7': 'ESPN 7 En Vivo',
            'tycsports': 'TyC Sports En Vivo',
            'espnpremium': 'ESPN Premium En Vivo',
            'tntsports': 'TNT Sports En Vivo'
        };
        
        const newTitle = titles[canal] || 'Canal En Vivo';
        $('h1.title').text(newTitle + ' Disponible');
        
        // También actualizar el título de la página
        document.title = newTitle + ' - Equide';
        
        // Actualizar contador de canal
        updateChannelCounter(canal);
    }
    
    // Función para actualizar el contador de canal
    function updateChannelCounter(canal) {
        const channels = ['dsports', 'dsports2', 'dsportsplus', 'liga1max', 'espn', 'espn2', 'espn3', 'espn4', 'espn5', 'espn6', 'espn7', 'tycsports', 'espnpremium', 'tntsports'];
        const currentIndex = channels.indexOf(canal) + 1;
        $('#canalCounter').text(`Canal ${currentIndex} de ${channels.length}`);
    }
    
    // Función para detectar errores de carga del iframe
    $('#embedIframe').on('error', function() {
        console.error('Error al cargar el canal');
        const errorMessage = $('<div class="error-message">Error al cargar el canal. <button onclick="location.reload()">Recargar página</button></div>');
        $(this).parent().append(errorMessage);
    });
    
    // Función para mostrar información del canal actual
    function showChannelInfo() {
        const info = {
            'dsports': {
                name: 'DirecTV Sports',
                description: 'Canal deportivo premium con fútbol en vivo',
                country: 'Latinoamérica'
            },
            'dsports2': {
                name: 'DirecTV Sports 2',
                description: 'Segunda señal de DirecTV Sports',
                country: 'Latinoamérica'
            },
            'dsportsplus': {
                name: 'DirecTV Sports+',
                description: 'Señal premium de DirecTV Sports',
                country: 'Latinoamérica'
            },
            'liga1max': {
                name: 'Liga1 Max',
                description: 'Transmisiones de la Liga 1 peruana',
                country: 'Perú'
            },
            'espn': {
                name: 'ESPN',
                description: 'Canal deportivo líder mundial',
                country: 'Internacional'
            },
            'espn2': {
                name: 'ESPN 2',
                description: 'Segunda señal de ESPN con deportes variados',
                country: 'Internacional'
            },
            'espn3': {
                name: 'ESPN 3',
                description: 'Tercera señal ESPN con deportes complementarios',
                country: 'Internacional'
            },
            'espn4': {
                name: 'ESPN 4',
                description: 'Cuarta señal ESPN con contenido especializado',
                country: 'Internacional'
            },
            'espn5': {
                name: 'ESPN 5',
                description: 'Quinta señal ESPN con deportes alternativos',
                country: 'Internacional'
            },
            'espn6': {
                name: 'ESPN 6',
                description: 'Sexta señal ESPN con cobertura extendida',
                country: 'Internacional'
            },
            'espn7': {
                name: 'ESPN 7',
                description: 'Séptima señal ESPN con eventos especiales',
                country: 'Internacional'
            },
            'tycsports': {
                name: 'TyC Sports',
                description: 'Canal deportivo argentino líder en fútbol',
                country: 'Argentina'
            },
            'espnpremium': {
                name: 'ESPN Premium',
                description: 'Señal premium de ESPN con contenido exclusivo',
                country: 'Internacional'
            },
            'tntsports': {
                name: 'TNT Sports',
                description: 'Canal deportivo con transmisiones premium',
                country: 'Internacional'
            }
        };
        
        return info[currentCanal] || { name: 'Canal Desconocido', description: 'Sin información', country: 'N/A' };
    }
    
    // Agregar funcionalidad de teclado
    $(document).on('keydown', function(e) {
        // Tecla R para recargar
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey) {
            e.preventDefault();
            reloadChannel();
        }
        
        // Atajos numéricos para cambiar canales
        const keyMappings = {
            '1': 'dsports',
            '2': 'dsports2',
            '3': 'dsportsplus',
            '4': 'liga1max',
            '5': 'espn',
            '6': 'espn2',
            '7': 'espn3',
            '8': 'espn4',
            '9': 'espn5'
        };
        
        // Atajos adicionales con teclas 0 y letras para los canales restantes
        const additionalMappings = {
            '0': 'espn6',
            'q': 'espn7',
            'w': 'tycsports',
            'e': 'espnpremium',
            't': 'tntsports'
        };
        
        if (keyMappings[e.key]) {
            $(`.canal-btn[data-canal="${keyMappings[e.key]}"]`).click();
        } else if (additionalMappings[e.key.toLowerCase()]) {
            $(`.canal-btn[data-canal="${additionalMappings[e.key.toLowerCase()]}"]`).click();
        }
        
        // Navegación con flechas
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            navigateChannels(e.key === 'ArrowLeft' ? -1 : 1);
        }
    });
    
    // Función para navegar entre canales con flechas
    function navigateChannels(direction) {
        const channels = ['dsports', 'dsports2', 'dsportsplus', 'liga1max', 'espn', 'espn2', 'espn3', 'espn4', 'espn5', 'espn6', 'espn7', 'tycsports', 'espnpremium', 'tntsports'];
        const currentIndex = channels.indexOf(currentCanal);
        let newIndex = currentIndex + direction;
        
        // Ciclo circular
        if (newIndex < 0) newIndex = channels.length - 1;
        if (newIndex >= channels.length) newIndex = 0;
        
        $(`.canal-btn[data-canal="${channels[newIndex]}"]`).click();
    }
    
    // Mostrar atajos de teclado al usuario (opcional)
    console.log('Atajos de teclado disponibles:');
    console.log('- Tecla R: Recargar canal');
    console.log('- Teclas numéricas y letras: Cambiar canales directamente');
    console.log('  • 1: DirecTV Sports');
    console.log('  • 2: DirecTV Sports 2');
    console.log('  • 3: DirecTV Sports+');
    console.log('  • 4: Liga1 Max');
    console.log('  • 5: ESPN');
    console.log('  • 6: ESPN 2');
    console.log('  • 7: ESPN 3');
    console.log('  • 8: ESPN 4');
    console.log('  • 9: ESPN 5');
    console.log('  • 0: ESPN 6');
    console.log('  • Q: ESPN 7');
    console.log('  • W: TyC Sports');
    console.log('  • E: ESPN Premium');
    console.log('  • T: TNT Sports');
    console.log('- Flechas ←/→: Navegar entre canales');
    
    // Inicialización
    console.log('Canal.js cargado correctamente');
    console.log('Canal inicial:', showChannelInfo());
    
    // Inicializar contador
    updateChannelCounter(currentCanal);
    
});
