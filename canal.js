$(document).ready(function() {
    
    // Variables globales
    let currentUrl = "https://la12hd.com/vivo/canal.php?stream=dsports";
    let currentCanal = "dsports";
    
    // DETECCIÓN DE DISPOSITIVO MÓVIL
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    console.log('📱 Dispositivo detectado:', {
        isMobile: isMobile,
        isIOS: isIOS,
        isAndroid: isAndroid,
        userAgent: navigator.userAgent
    });
    
    // FUNCIÓN DE OPTIMIZACIÓN PARA MÓVILES
    function optimizeForMobile() {
        console.log('📱 Aplicando optimizaciones para móviles...');
        
        // 1. Ajustar configuración del iframe para móviles
        const iframe = $('#embedIframe');
        
        if (isIOS) {
            // Configuraciones específicas para iOS
            iframe.attr('allow', 'autoplay; encrypted-media; fullscreen');
            iframe.attr('allowfullscreen', 'true');
            iframe.attr('webkitallowfullscreen', 'true');
            iframe.attr('mozallowfullscreen', 'true');
        }
        
        if (isAndroid) {
            // Configuraciones específicas para Android
            iframe.attr('allow', 'autoplay; encrypted-media; fullscreen');
            iframe.removeAttr('sandbox'); // Remover sandbox en Android
        }
        
        // 2. Ajustar el viewport dinámicamente
        updateViewportForMobile();
        
        // 3. Configurar touch events para mejor interacción
        setupTouchEvents();
        
        // 4. Reducir frecuencia de limpieza de anuncios en móviles
        if (window.adBlockerCleanupInterval) {
            clearInterval(window.adBlockerCleanupInterval);
        }
        
        // Limpieza menos frecuente en móviles para mejor rendimiento
        window.adBlockerCleanupInterval = setInterval(function() {
            if (adBlockerActive) {
                cleanIframeAds();
            }
        }, 5000); // 5 segundos en lugar de 2
        
        console.log('✅ Optimizaciones móviles aplicadas');
    }
    
    // Función para actualizar viewport en móviles
    function updateViewportForMobile() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
        }
    }
    
    // Función para configurar eventos táctiles
    function setupTouchEvents() {
        // Mejorar respuesta táctil en botones
        $('.canal-btn, #btnIframe, .ad-blocker-btn').on('touchstart', function() {
            $(this).addClass('touch-active');
        }).on('touchend touchcancel', function() {
            $(this).removeClass('touch-active');
        });
        
        // Prevenir zoom accidental en doble tap
        $('body').on('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
        
        let lastTouchEnd = 0;
        $('body').on('touchend', function(e) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        });
    }
    
    // OPTIMIZACIONES PARA MÓVILES
    if (isMobile) {
        // Aplicar configuraciones específicas para móviles
        optimizeForMobile();
    }
    
    // BLOQUEADOR DE ANUNCIOS - Función principal
    function initAdBlocker() {
        console.log('🛡️ Bloqueador de anuncios inicializado');
        
        // Bloquear scripts de anuncios conocidos
        blockAdScripts();
        
        // Observar y eliminar elementos de anuncios
        observeAndRemoveAds();
        
        // Bloquear popups
        blockPopups();
        
        // Limpiar iframe de anuncios cada 2 segundos
        setInterval(function() {
            if (adBlockerActive) {
                cleanIframeAds();
            }
        }, 2000);
    }
    
    // Función para bloquear scripts de anuncios
    function blockAdScripts() {
        const adDomains = [
            'doubleclick.net',
            'googleadservices.com',
            'googlesyndication.com',
            'amazon-adsystem.com',
            'adsystem.com',
            'ads.yahoo.com',
            'advertising.com',
            'adsense.com',
            'adnxs.com',
            'adsystem',
            'ads',
            'publicidad'
        ];
        
        // Interceptar requests de anuncios
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string') {
                for (let domain of adDomains) {
                    if (url.includes(domain)) {
                        console.log('🚫 Bloqueado:', url);
                        return Promise.reject(new Error('Ad blocked'));
                    }
                }
            }
            return originalFetch.apply(this, args);
        };
    }
    
    // Función para observar y eliminar anuncios del DOM
    function observeAndRemoveAds() {
        const adSelectors = [
            'iframe[src*="ads"]',
            'iframe[src*="advertisement"]',
            'iframe[src*="publicidad"]',
            'iframe[src*="banner"]',
            'div[class*="ads"]',
            'div[class*="ad-"]',
            'div[id*="ads"]',
            'div[id*="ad-"]',
            '.popup',
            '.overlay',
            '.modal',
            '[class*="popup"]',
            '[class*="overlay"]',
            '[class*="banner"]',
            'ins.adsbygoogle'
        ];
        
        // Eliminar anuncios existentes
        function removeAds() {
            adSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.display = 'none !important';
                    el.remove();
                });
            });
            
            // También dentro del iframe si es posible
            try {
                const iframe = document.getElementById('embedIframe');
                if (iframe && iframe.contentDocument) {
                    adSelectors.forEach(selector => {
                        const iframeElements = iframe.contentDocument.querySelectorAll(selector);
                        iframeElements.forEach(el => {
                            el.style.display = 'none';
                            el.remove();
                        });
                    });
                }
            } catch (e) {
                // Cross-origin restriction, ignorar
            }
        }
        
        // Ejecutar limpieza cada 1 segundo
        setInterval(function() {
            if (adBlockerActive) {
                removeAds();
            }
        }, 1000);
        
        // Observer para nuevos elementos
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    removeAds();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Función para bloquear popups
    function blockPopups() {
        // Sobrescribir window.open
        window.open = function() {
            console.log('🚫 Popup bloqueado');
            return null;
        };
        
        // Bloquear eventos de click en anuncios
        document.addEventListener('click', function(e) {
            const target = e.target;
            if (target.tagName === 'A' || target.closest('a')) {
                const link = target.tagName === 'A' ? target : target.closest('a');
                const href = link.href;
                
                if (href && (
                    href.includes('ads') || 
                    href.includes('advertisement') || 
                    href.includes('publicidad') ||
                    href.includes('banner') ||
                    href.includes('popup')
                )) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🚫 Click en anuncio bloqueado:', href);
                    return false;
                }
            }
        }, true);
    }
    
    // Función para limpiar anuncios del iframe
    function cleanIframeAds() {
        if (!adBlockerActive) return;
        
        const iframe = document.getElementById('embedIframe');
        if (iframe) {
            try {
                // Intentar acceder al contenido del iframe
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    // Eliminar elementos de anuncios dentro del iframe
                    const adElements = iframeDoc.querySelectorAll([
                        'div[class*="ads"]',
                        'div[class*="ad-"]',
                        'iframe[src*="ads"]',
                        '.popup',
                        '.overlay'
                    ].join(','));
                    
                    adElements.forEach(el => el.remove());
                }
            } catch (e) {
                // Cross-origin, no podemos acceder
                console.log('ℹ️ Cross-origin iframe, no se puede limpiar directamente');
            }
        }
    }
    
    // Función para cambiar de canal con mejoras visuales
    function changeChannel(url, canal) {
        const iframe = $("#embedIframe");
        const loadingOverlay = $('<div class="loading-overlay"><div class="loading-spinner"></div></div>');
        
        // Mostrar overlay de carga con spinner
        iframe.parent().append(loadingOverlay);
        
        // Agregar efecto de fade out al iframe actual
        iframe.css('opacity', '0.3');
        
        // OPTIMIZACIÓN MÓVIL: URLs alternativas para móviles
        let optimizedUrl = url;
        
        if (isMobile) {
            console.log('📱 Optimizando URL para móvil:', url);
            
            // Agregar parámetros específicos para móviles
            const separator = url.includes('?') ? '&' : '?';
            optimizedUrl = url + separator + 'mobile=1&autoplay=1&muted=0';
            
            // Para iOS, intentar URLs alternativas si es necesario
            if (isIOS && url.includes('la14hd.com')) {
                // Algunas URLs funcionan mejor en iOS con diferentes parámetros
                optimizedUrl = url.replace('canales.php', 'canal.php');
            }
        }
        
        // Actualizar reproductor
        iframe.attr('src', optimizedUrl);
        
        currentUrl = optimizedUrl;
        currentCanal = canal;
        
        // Timeout más largo para móviles
        const cleanupTimeout = isMobile ? 5000 : 3000;
        const additionalTimeout = isMobile ? 8000 : 5000;
        
        // Limpiar anuncios después de cargar
        setTimeout(function() {
            cleanIframeAds();
            loadingOverlay.remove();
            iframe.css('opacity', '1');
        }, cleanupTimeout);
        
        // Limpieza adicional
        setTimeout(function() {
            cleanIframeAds();
        }, additionalTimeout);
        
        // Actualizar título del documento
        updateTitle(canal);
        
        console.log(`Canal cambiado a: ${canal} - URL optimizada: ${optimizedUrl}`);
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
    
    // Event listener para botón del bloqueador
    let adBlockerActive = true;
    $('#btnAdBlocker').on('click', function() {
        const button = $(this);
        
        if (adBlockerActive) {
            adBlockerActive = false;
            button.removeClass('active').text('🚫 Bloqueador OFF');
            console.log('🔓 Bloqueador de anuncios desactivado');
        } else {
            adBlockerActive = true;
            button.addClass('active').text('🛡️ Bloqueador ON');
            console.log('🛡️ Bloqueador de anuncios activado');
            // Ejecutar limpieza inmediata
            cleanIframeAds();
        }
    });
    
    // FUNCIONALIDAD DE BOTONES PRINCIPALES
    
    // Botón de pantalla completa para reproductor principal
    $('#btnFullscreen, button[title="Pantalla completa"]').on('click', function() {
        const iframe = document.getElementById('embedIframe');
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
        }
        
        console.log('🔍 Solicitando pantalla completa');
    });
    
    // EVENTOS DE BOTONES PRINCIPALES
    
    // Botón Picture-in-Picture (Overlay hover)
    $('#pipButton').on('click', function() {
        activatePictureInPicture();
    });
    
    // Función para activar Picture-in-Picture
    async function activatePictureInPicture() {
        try {
            const iframe = document.getElementById('embedIframe');
            const button = $('#pipButton');
            const pipText = button.find('.pip-text');
            
            // Cambiar texto del botón mientras se procesa
            const originalText = pipText.text();
            pipText.text('Activando...');
            
            // Método 1: Intentar acceder al video dentro del iframe (limitado por CORS)
            try {
                if (iframe.contentDocument) {
                    const video = iframe.contentDocument.querySelector('video');
                    if (video && video.requestPictureInPicture) {
                        await video.requestPictureInPicture();
                        console.log('✅ Picture-in-Picture activado desde iframe');
                        pipText.text('Video Separado');
                        setTimeout(() => pipText.text(originalText), 3000);
                        return;
                    }
                }
            } catch (e) {
                console.log('⚠️ No se puede acceder al contenido del iframe (CORS)');
            }
            
            // Método 2: Simular clic derecho en el iframe para mostrar menú contextual
            try {
                const event = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 2
                });
                iframe.dispatchEvent(event);
                
                // Mostrar mensaje temporal
                showPiPQuickTip();
                pipText.text(originalText);
                return;
                
            } catch (e) {
                console.log('⚠️ No se pudo simular clic derecho');
            }
            
            // Método 3: Crear un mensaje visual para el usuario
            showPiPInstructions();
            pipText.text(originalText);
            
        } catch (error) {
            console.error('❌ Error al activar Picture-in-Picture:', error);
            $('#pipButton .pip-text').text('Separar este video');
            showPiPInstructions();
        }
    }
    
    // Función para mostrar tip rápido
    function showPiPQuickTip() {
        const quickTip = $('<div class="pip-quick-tip">💡 Busca "Picture-in-Picture" en el menú contextual</div>');
        $('body').append(quickTip);
        quickTip.css({
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(22, 163, 74, 0.95)',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            zIndex: '9999',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            maxWidth: '280px',
            textAlign: 'center'
        });
        
        setTimeout(() => quickTip.fadeOut(300, () => quickTip.remove()), 4000);
    }
    
    // Función para mostrar instrucciones de PiP
    function showPiPInstructions() {
        const instructions = $(`
            <div class="pip-instructions">
                <div class="pip-content">
                    <h3>🎯 Activar "Separar Video"</h3>
                    <p><strong>Opción 1:</strong> Haz clic derecho sobre el video → "Picture-in-Picture"</p>
                    <p><strong>Opción 2:</strong> Busca el botón <span class="pip-button-example">📱 Flotante</span> en el video</p>
                    <p><strong>Opción 3:</strong> En navegadores compatibles, usa Ctrl+Alt+P</p>
                    <button class="pip-close">Entendido</button>
                </div>
            </div>
        `);
        
        $('body').append(instructions);
        
        // Estilos inline para las instrucciones
        instructions.css({
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000',
            backdropFilter: 'blur(5px)'
        });
        
        $('.pip-content').css({
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        });
        
        $('.pip-content h3').css({
            marginBottom: '1rem',
            fontSize: '1.5rem'
        });
        
        $('.pip-content p').css({
            marginBottom: '0.75rem',
            lineHeight: '1.5'
        });
        
        $('.pip-button-example').css({
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold'
        });
        
        $('.pip-close').css({
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#333',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '2rem',
            fontWeight: 'bold',
            marginTop: '1rem',
            cursor: 'pointer',
            fontSize: '1rem'
        });
        
        // Cerrar instrucciones
        $('.pip-close').on('click', function() {
            instructions.remove();
        });
        
        // Cerrar al hacer clic fuera
        instructions.on('click', function(e) {
            if (e.target === this) {
                instructions.remove();
            }
        });
        
        // Auto-cerrar después de 10 segundos
        setTimeout(() => {
            instructions.fadeOut(500, () => instructions.remove());
        }, 10000);
    }
    
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
    
    // INICIALIZAR BLOQUEADOR DE ANUNCIOS
    initAdBlocker();
    
    // Activar botón del bloqueador por defecto
    $('#btnAdBlocker').addClass('active');
    
    // DIAGNÓSTICO MÓVIL
    if (isMobile) {
        setTimeout(function() {
            runMobileDiagnostic();
        }, 3000);
    }
    
    console.log('🛡️ Sistema anti-anuncios activado');
    
    // Función de diagnóstico para móviles
    function runMobileDiagnostic() {
        console.log('📱 === DIAGNÓSTICO MÓVIL ===');
        console.log('Screen size:', window.innerWidth + 'x' + window.innerHeight);
        console.log('Device pixel ratio:', window.devicePixelRatio);
        console.log('Platform:', navigator.platform);
        console.log('Network:', navigator.connection ? navigator.connection.effectiveType : 'Unknown');
        
        // Verificar si el iframe está cargando
        const iframe = document.getElementById('embedIframe');
        if (iframe) {
            console.log('Iframe src:', iframe.src);
            console.log('Iframe dimensions:', iframe.offsetWidth + 'x' + iframe.offsetHeight);
            
            // Intentar detectar si hay contenido en el iframe
            try {
                if (iframe.contentDocument) {
                    console.log('✅ Iframe accessible');
                } else {
                    console.log('⚠️ Iframe cross-origin (normal)');
                }
            } catch (e) {
                console.log('⚠️ Iframe access blocked (normal for cross-origin)');
            }
        }
        
        // Sugerir URLs alternativas si hay problemas
        console.log('💡 Si no carga, prueba:');
        console.log('- Desactivar el bloqueador temporalmente');
        console.log('- Cambiar entre canales');
        console.log('- Usar modo escritorio en el navegador');
        console.log('=== FIN DIAGNÓSTICO ===');
    }
    
});
