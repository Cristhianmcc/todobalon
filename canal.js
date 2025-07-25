$(document).ready(function() {
    
            // 4. Configurar touch events para mejor interacción
        setupTouchEvents();
        
        // 5. Reducir frecuencia de limpieza de anuncios en móvilesariables globales
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
        $('.channel-card, #btnIframe, .ad-blocker-btn').on('touchstart', function() {
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
    
    // Función para bloqueo agresivo de anuncios
    function blockAdsAggressively() {
        // Bloquear scripts conocidos de anuncios
        const adScripts = document.querySelectorAll('script[src*="ads"], script[src*="doubleclick"], script[src*="googlesyndication"]');
        adScripts.forEach(script => script.remove());
        
        // Bloquear elementos de anuncios en toda la página
        const adSelectors = [
            '[class*="ad-"]', '[id*="ad-"]',
            '[class*="ads"]', '[id*="ads"]',
            '.advertisement', '.banner', '.popup',
            'iframe[src*="doubleclick"]',
            'iframe[src*="googlesyndication"]',
            'div[class*="adsense"]'
        ];
        
        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.id !== 'embedIframe' && !el.classList.contains('preframe')) {
                    el.style.display = 'none !important';
                    el.remove();
                }
            });
        });
        
        // Inyectar CSS anti-anuncios dinámicamente
        if (!document.getElementById('anti-ads-css')) {
            const antiAdsCss = document.createElement('style');
            antiAdsCss.id = 'anti-ads-css';
            antiAdsCss.innerHTML = `
                iframe[src*="doubleclick"],
                iframe[src*="googlesyndication"],
                iframe[src*="googleadservices"],
                [class*="ad-"]:not(#embedIframe):not(.preframe),
                [id*="ad-"]:not(#embedIframe):not(.preframe) {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    height: 0 !important;
                    width: 0 !important;
                }
            `;
            document.head.appendChild(antiAdsCss);
        }
        
        console.log('🛡️ Bloqueo agresivo de anuncios aplicado');
    }
    
    // Función para cambiar de canal
    function changeChannel(url, canal) {
        const iframe = $("#embedIframe");
        const loadingMessage = $('<div class="loading-message">🛡️ Cargando canal sin anuncios...</div>');
        
        // Mostrar mensaje de carga
        iframe.parent().append(loadingMessage);
        
        // OPTIMIZACIÓN MÓVIL: URLs alternativas para móviles
        let optimizedUrl = url;
        
        if (isMobile) {
            console.log('📱 Optimizando URL para móvil:', url);
            
            // Agregar parámetros específicos para móviles y autoplay
            const separator = url.includes('?') ? '&' : '?';
            optimizedUrl = url + separator + 'mobile=1&autoplay=1&muted=0&preload=auto&controls=1';
            
            // Para iOS, intentar URLs alternativas si es necesario
            if (isIOS && url.includes('la14hd.com')) {
                // Algunas URLs funcionan mejor en iOS con diferentes parámetros
                optimizedUrl = url.replace('canales.php', 'canal.php');
                optimizedUrl += (optimizedUrl.includes('?') ? '&' : '?') + 'playsInline=1&webkit-playsinline=1';
            }
        } else {
            // Para desktop también agregar autoplay
            const separator = url.includes('?') ? '&' : '?';
            optimizedUrl = url + separator + 'autoplay=1&muted=0&preload=auto';
        }
        
        // CLAVE: Configurar iframe para autoplay antes de cambiar URL
        iframe.attr({
            'allow': 'autoplay; encrypted-media; fullscreen; picture-in-picture',
            'allowfullscreen': 'true',
            'autoplay': 'true'
        });
        
        // Cambiar URL del iframe con timestamp para evitar cache
        const finalUrl = optimizedUrl + (optimizedUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
        
        // ESTRATEGIA MEJORADA: Simular interacción antes del cambio de URL
        setTimeout(function() {
            // Crear evento de mouse para activar autoplay
            const iframe = document.getElementById('embedIframe');
            if (iframe) {
                const mouseEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                iframe.dispatchEvent(mouseEvent);
                
                // También simular touch para móviles
                if (isMobile) {
                    const touchEvent = new TouchEvent('touchstart', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    iframe.dispatchEvent(touchEvent);
                }
            }
        }, 100);
        
        // Cambiar URL después de la interacción simulada
        setTimeout(function() {
            iframe.attr('src', finalUrl);
            currentUrl = finalUrl;
            currentCanal = canal;
            console.log(`🎬 URL cargada con autoplay: ${finalUrl}`);
        }, 200);
        
        // NUEVA ESTRATEGIA: Forzar autoplay mediante JavaScript injection
        setTimeout(function() {
            try {
                const iframeDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
                if (iframeDoc) {
                    // Inyectar script para forzar autoplay
                    const autoplayScript = iframeDoc.createElement('script');
                    autoplayScript.innerHTML = `
                        (function() {
                            setTimeout(function() {
                                const videos = document.querySelectorAll('video');
                                videos.forEach(video => {
                                    video.muted = false;
                                    video.autoplay = true;
                                    video.play().catch(e => console.log('Autoplay prevented:', e));
                                });
                                
                                // También buscar iframes internos
                                const iframes = document.querySelectorAll('iframe');
                                iframes.forEach(frame => {
                                    try {
                                        frame.click();
                                    } catch(e) {}
                                });
                            }, 1000);
                        })();
                    `;
                    iframeDoc.head.appendChild(autoplayScript);
                }
            } catch (e) {
                console.log('ℹ️ No se pudo inyectar autoplay script (normal en cross-origin)');
            }
        }, 2000);
        
        // Timeout más largo para móviles
        const cleanupTimeout = isMobile ? 5000 : 3000;
        const additionalTimeout = isMobile ? 8000 : 5000;
        
        // Limpiar anuncios después de cargar
        setTimeout(function() {
            cleanIframeAds();
            loadingMessage.fadeOut();
            // Mostrar mensaje de éxito
            const successMessage = $('<div class="success-message">✅ Reproduciendo sin anuncios</div>');
            iframe.parent().append(successMessage);
            setTimeout(() => successMessage.fadeOut(), 3000);
        }, cleanupTimeout);
        
        // Limpieza adicional y más agresiva
        setTimeout(function() {
            cleanIframeAds();
            // Bloqueo adicional de anuncios
            blockAdsAggressively();
            // NUEVO: Forzar autoplay con clics periódicos
            forceAutoplayWithClicks();
        }, additionalTimeout);
        
        console.log(`Canal cambiado a: ${canal} - URL optimizada con autoplay: ${finalUrl}`);
    }
    
    // Función para forzar autoplay mediante clics automáticos periódicos
    function forceAutoplayWithClicks() {
        let clickAttempts = 0;
        const maxAttempts = 10;
        
        const autoClickInterval = setInterval(function() {
            const iframe = document.getElementById('embedIframe');
            
            if (iframe && clickAttempts < maxAttempts) {
                // Simular click en diferentes posiciones del iframe
                const rect = iframe.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: centerX,
                    clientY: centerY
                });
                
                iframe.dispatchEvent(clickEvent);
                
                // También intentar con el elemento padre
                const container = iframe.parentElement;
                if (container) {
                    container.click();
                }
                
                clickAttempts++;
                console.log(`🔄 Intento de autoplay ${clickAttempts}/${maxAttempts}`);
                
                // Si llegamos al máximo, mostrar mensaje
                if (clickAttempts >= maxAttempts) {
                    clearInterval(autoClickInterval);
                    console.log('ℹ️ Si el video no reproduce automáticamente, haz click en él');
                }
            } else {
                clearInterval(autoClickInterval);
            }
        }, 2000); // Cada 2 segundos
        
        // Limpiar interval después de 30 segundos
        setTimeout(() => clearInterval(autoClickInterval), 30000);
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
    
    // Event listener para tarjetas de canal
    $('.channel-card').on('click', function() {
        const button = $(this);
        const url = button.data('url');
        const canal = button.data('canal');
        
        // Remover clase active de todas las tarjetas
        $('.channel-card').removeClass('active');
        
        // Agregar clase active a la tarjeta clickeada
        button.addClass('active');
        
        // Agregar indicador de carga
        button.addClass('loading');
        
        // Actualizar nombre del canal actual
        const channelName = button.find('.channel-name').text();
        const channelCategory = button.find('.channel-category').text();
        $('#currentChannelName').text(`${channelCategory} ${channelName}`);
        
        // IMPORTANTE: Simular múltiples clics para asegurar autoplay
        simulateUserInteraction();
        
        // Cambiar canal después de la interacción
        setTimeout(function() {
            changeChannel(url, canal);
            // Remover indicador de carga
            button.removeClass('loading');
        }, 100);
        
        // Actualizar título según el canal
        updateTitle(canal);
    });
    
    // Funcionalidad de búsqueda de canales
    $('#channelSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.channel-card').each(function() {
            const channelName = $(this).find('.channel-name').text().toLowerCase();
            const channelCategory = $(this).find('.channel-category').text().toLowerCase();
            
            if (channelName.includes(searchTerm) || channelCategory.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Limpiar búsqueda al hacer clic en el campo
    $('#channelSearch').on('focus', function() {
        $(this).select();
    });
    
    // Función para simular interacción del usuario
    function simulateUserInteraction() {
        const iframe = document.getElementById('embedIframe');
        
        if (iframe) {
            // Múltiples eventos para máxima compatibilidad
            const events = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
            
            events.forEach(eventType => {
                const event = new Event(eventType, {
                    bubbles: true,
                    cancelable: true
                });
                iframe.dispatchEvent(event);
            });
            
            // También para móviles
            if (isMobile) {
                const touch = new Touch({
                    identifier: Date.now(),
                    target: iframe,
                    clientX: 100,
                    clientY: 100
                });
                
                const touchEvent = new TouchEvent('touchstart', {
                    touches: [touch],
                    targetTouches: [touch],
                    changedTouches: [touch],
                    bubbles: true
                });
                
                iframe.dispatchEvent(touchEvent);
            }
            
            console.log('🖱️ Interacciones simuladas para activar autoplay');
        }
    }    // Event listener para botón de recarga
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
            $(`.channel-card[data-canal="${keyMappings[e.key]}"]`).click();
        } else if (additionalMappings[e.key.toLowerCase()]) {
            $(`.channel-card[data-canal="${additionalMappings[e.key.toLowerCase()]}"]`).click();
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
        
        $(`.channel-card[data-canal="${channels[newIndex]}"]`).click();
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
    
    // INICIALIZACIÓN AUTOMÁTICA CON AUTOPLAY
    console.log('🚀 Iniciando reproducción automática...');
    
    // Esperar un momento para que todo se cargue
    setTimeout(function() {
        // Aplicar bloqueo agresivo desde el inicio
        blockAdsAggressively();
        
        // Simular click en el canal activo para activar autoplay
        const activeChannel = $('.channel-card.active');
        if (activeChannel.length > 0) {
            const url = activeChannel.data('url');
            const canal = activeChannel.data('canal');
            
            console.log('🎬 Activando autoplay para canal inicial:', canal);
            changeChannel(url, canal);
        }
    }, 2000);
    
    console.log('✅ TodoBalon inicializado con sistema anti-anuncios y autoplay');

});
