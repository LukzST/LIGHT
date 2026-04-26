
const CRT_STORAGE_KEY = 'crtEnabled';
let crtEnabled = false;
let crtToggleBtn = null;

function applyCRTEffect(enabled) {
    if (enabled) {
        document.body.classList.add('crt');
    } else {
        document.body.classList.remove('crt');
    }
}

function updateButtonState(enabled) {
    if (!crtToggleBtn) return;
    
    if (enabled) {
        crtToggleBtn.innerHTML = '<i class="fa-solid fa-tv"></i> CRT ON';
        crtToggleBtn.style.background = '#2f498c';
        crtToggleBtn.style.color = 'white';
    } else {
        crtToggleBtn.innerHTML = '<i class="fa-solid fa-tv"></i> CRT OFF';
        crtToggleBtn.style.background = 'silver';
        crtToggleBtn.style.color = '#222';
    }
}

function setCRTEnabled(enabled, playSound = true) {
    crtEnabled = enabled;
    
    localStorage.setItem(CRT_STORAGE_KEY, enabled);
    
    applyCRTEffect(enabled);
    
    updateButtonState(enabled);
    
    window.dispatchEvent(new StorageEvent('storage', {
        key: CRT_STORAGE_KEY,
        newValue: enabled.toString(),
        oldValue: (!enabled).toString()
    }));
    
    if (playSound) {
        playCRTBeep(enabled);
    }
}

function toggleCRT() {
    setCRTEnabled(!crtEnabled, true);
}

function playCRTBeep(enabled) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = enabled ? 880 : 440;
        
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
        oscillator.stop(audioCtx.currentTime + 0.1);
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    } catch(e) {}
}

function initCRTManager(buttonId = 'crtToggleBtn') {
    crtToggleBtn = document.getElementById(buttonId);
    
    const savedState = localStorage.getItem(CRT_STORAGE_KEY);
    crtEnabled = savedState === 'true';
    
    applyCRTEffect(crtEnabled);
    updateButtonState(crtEnabled);
    
    if (crtToggleBtn) {
        crtToggleBtn.addEventListener('click', toggleCRT);
    }
    
    window.addEventListener('storage', (e) => {
        if (e.key === CRT_STORAGE_KEY) {
            const newState = e.newValue === 'true';
            if (newState !== crtEnabled) {
                crtEnabled = newState;
                applyCRTEffect(crtEnabled);
                updateButtonState(crtEnabled);
            }
        }
    });
    
    console.log('CRT Manager initialized. Enabled:', crtEnabled);
}

window.CRTManager = {
    init: initCRTManager,
    toggle: toggleCRT,
    set: setCRTEnabled,
    get: () => crtEnabled
};